'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProfileInfo from './ProfileInfo';
import StatsCards from './StatsCards';
import TabsNavigation from './TabsNavigation';
import DashboardTab from './DashboardTab';
import SchemesTab from './SchemesTab';
import DocumentsTab from './DocumentsTab';
import UploadModal from './UploadModal';

// Define color scheme as constants for consistency
const COLORS = {
  primary: '#102542ff',      // Dark blue
  accent: '#f87060ff',       // Coral/salmon
  white: '#ffffffff',       // White
  lightGray: '#F5F5F5',     // Light gray
  textLight: '#6b7280',     // Light gray for secondary text
  border: '#e5e7eb',        // Border color
};

// Define breakpoints for responsive design
const BREAKPOINTS = {
  sm: '640px',   // Small screens
  md: '768px',   // Medium screens
  lg: '1024px',  // Large screens
  xl: '1280px',  // Extra large screens
};

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  benefit_amount: number;
  status: 'active' | 'inactive' | string;
  official_website: string;
}

interface User {
  id: string;
  email?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  role: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
  created_at: string;
}

export default function CitizenDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState({
    totalSchemes: 0,
    totalDocuments: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documentData, setDocumentData] = useState({
    category: 'personal',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [refreshExtractedData, setRefreshExtractedData] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login/citizen');
          return;
        }
        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email || '',
                role: 'citizen'
              });
            if (insertError) {
              console.error(insertError);
            }
            router.push('/citizen/complete-profile');
            return;
          } else {
            router.push('/citizen/complete-profile');
            return;
          }
        }

        if (profile.role !== 'citizen') {
          router.push('/login/citizen?error=unauthorized');
          return;
        }

        const isProfileComplete = profile.full_name &&
          profile.phone &&
          profile.village &&
          profile.district &&
          profile.state &&
          profile.pincode;

        if (!isProfileComplete) {
          router.push('/citizen/complete-profile');
          return;
        }

        setUserProfile(profile as UserProfile);

        await Promise.all([
          fetchStats(user.id),
          fetchSchemes(),
          fetchDocuments(user.id)
        ]);

        setAuthChecked(true);
      } catch (error) {
        console.error(error);
        router.push('/login/citizen?error=auth');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const fetchStats = async (userId: string) => {
    const { count: schemesCount } = await supabase
      .from('schemes')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    setStats({
      totalSchemes: schemesCount || 0,
      totalDocuments: documentsCount || 0
    });
  };

  const fetchSchemes = async () => {
    const { data } = await supabase
      .from('schemes')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    setSchemes(data || []);
  };

  const fetchDocuments = async (userId: string) => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setDocuments(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };


  const handleUpdateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update the local state
      setUserProfile(prev => ({ ...prev!, ...updatedProfile }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDocumentData(prev => ({ ...prev, [name]: value }));
  };

  const processDocumentLocally = async (file: File, userId: string, documentId: string, language: string = 'en') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('documentId', documentId);
    formData.append('language', language);

    const localServerUrl = 'http://localhost:3001/process-document';

    const response = await fetch(localServerUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.error || 'Failed to process document on local server');
    }

    return response.json();
  };

  const debugTextExtraction = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/extract-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to extract text');
    }

    return response.json();
  };

  const uploadDocuments = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    if (!user) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    setUploading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile not found. Please complete your profile first.');
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = fileName;

        try {
          console.log('Debugging text extraction for:', file.name);
          const debugResult = await debugTextExtraction(file);
          console.log('Debug extraction result:', debugResult);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

          if (uploadError) {
            throw new Error(`Failed to upload file: ${file.name}. ${uploadError.message}`);
          }

          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

          const docData = {
            user_id: user.id,
            name: file.name,
            type: file.type,
            url: urlData.publicUrl,
            category: documentData.category,
            description: documentData.description
          };

          const { data: insertData, error: insertError } = await supabase
            .from('documents')
            .insert([docData])
            .select();

          if (insertError) {
            throw new Error(`Failed to save document record: ${insertError.message}`);
          }

          if (!insertData || insertData.length === 0) {
            throw new Error('Failed to get document ID after insert');
          }

          const documentId = insertData[0].id;

          try {
            const language = documentData.category === 'marathi' ? 'mar' : 'en';

            const result = await processDocumentLocally(
              file,
              user.id,
              documentId,
              language
            );

            if (result.extractedFields && result.extractedFields.length > 0) {
              const summary = result.extractedFields
                .map((field: any) => `${field.field_type}: ${field.field_value}`)
                .join(', ');
              alert(`Document uploaded and processed successfully. Extracted: ${summary}`);
            } else {
              let message = 'Document uploaded successfully, but no information could be extracted.\n\n';
              message += `Debug information:\n`;
              message += `- File name: ${file.name}\n`;
              message += `- File type: ${file.type}\n`;
              message += `- File size: ${(file.size / 1024).toFixed(2)} KB\n`;

              if (debugResult.success) {
                message += `- Text detected: Yes (${debugResult.textLength} characters)\n`;
                message += `- Text preview: ${debugResult.extractedText}\n`;
              } else {
                message += `- Text detected: No\n`;
                message += `- Reason: ${debugResult.message}\n`;
              }

              message += '\nPossible reasons for extraction failure:\n';
              message += '1. The document format is not supported\n';
              message += '2. The text is in a format that our system cannot parse\n';
              message += '3. There was an issue with the extraction service\n\n';
              message += 'Please try with a different document or contact support.';

              alert(message);
            }
          } catch (extractionError) {
            console.error(extractionError);
            alert(`Document uploaded successfully, but there was an error extracting information from it`);
          }
        } catch (fileError) {
          console.error(fileError);
          alert(`Error processing file ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
        }
      }

      setRefreshExtractedData(prev => !prev);

      setSelectedFiles(null);
      setDocumentData({
        category: 'personal',
        description: ''
      });
      setShowUploadModal(false);
      fetchDocuments(user.id);
      fetchStats(user.id);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const { data: document } = await supabase
        .from('documents')
        .select('url')
        .eq('id', id)
        .single();

      if (document) {
        const urlParts = document.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = fileName;

        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([filePath]);

        if (storageError) throw storageError;

        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', id);

        if (dbError) throw dbError;

        fetchDocuments(user?.id || '');
        fetchStats(user?.id || '');
        alert('Document deleted successfully');
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.accent }}></div>
          <p className="text-[#102542ff]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authChecked || !user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />

      {/* Main container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Header section with responsive layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2" style={{ color: COLORS.primary }}>
              Citizen Dashboard
            </h1>
            <p className="text-sm sm:text-base" style={{ color: COLORS.primary }}>
              Manage your documents and discover government schemes
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center cusror-pointer px-4 py-2 rounded-2xl transition-colors w-full sm:w-auto justify-center"
            style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>

        {/* Profile info section */}
        <div className="mb-6 sm:mb-8">
          <ProfileInfo
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        </div>

        {/* Stats cards section */}
        <div className="mb-6 sm:mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Tabs navigation */}
        <div className="mb-4 sm:mb-6">
          <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content area with responsive card */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border" style={{ borderColor: COLORS.lightGray }}>
          {activeTab === 'dashboard' && (
            <DashboardTab
              schemes={schemes}
              setShowUploadModal={setShowUploadModal}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'schemes' && (
            <SchemesTab schemes={schemes} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab
              documents={documents}
              setShowUploadModal={setShowUploadModal}
              userId={user.id}
              refreshExtractedData={refreshExtractedData}
              downloadDocument={downloadDocument}
              deleteDocument={deleteDocument}
            />
          )}
        </div>
      </div>

      {/* Upload modal */}
      <UploadModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        uploading={uploading}
        selectedFiles={selectedFiles}
        documentData={documentData}
        handleFileChange={handleFileChange}
        handleInputChange={handleInputChange}
        uploadDocuments={uploadDocuments}
      />

      <Footer />
    </div>
  );
}