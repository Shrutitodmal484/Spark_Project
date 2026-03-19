'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AddSchemeForm from '@/app/admin/AddSchemeForm';
import DashboardStats from './DashboardStats';
import UserList from './UserList';
import SchemeList from './SchemeList';
import DashboardTabs from './DashboardTabs';
import DashboardOverview from './DashboardOverview';
import ExtractedSchemes from './ExtractedSchemes';

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  benefit_amount: number;
  status: 'active' | 'inactive' | string;
  state: string; 
  eligibility?: string;
  benefits?: string;
  application_process?: string;
  required_documents?: string;
  official_website?: string;
  contact_info?: string;
  last_date_to_apply?: string;
}

interface User {
  id: string;
  email?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalGramsevaks: 0,
    pendingApprovals: 0,
    totalSchemes: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login/admin');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }
      
      setUser(user);
      fetchStats();
      fetchSchemes();
    };
    
    checkUser();
  }, [router]);
  
 const fetchStats = async () => {
  const { count: citizensCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'citizen');
  
  const { count: gramsevaksCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'gramsevak');
  
  // FIX: Only count records with status 'pending'
  const { count: pendingCount } = await supabase
    .from('pending_approvals')
    .select('*', { count: 'exact' })
    .eq('status', 'pending');
  
  const { count: schemesCount } = await supabase
    .from('schemes')
    .select('*', { count: 'exact' });
  
  setStats({
    totalCitizens: citizensCount || 0,
    totalGramsevaks: gramsevaksCount || 0,
    pendingApprovals: pendingCount || 0,
    totalSchemes: schemesCount || 0
  });
};
  
  const fetchSchemes = async () => {
    const { data } = await supabase
      .from('schemes')
      .select('*')
      .order('created_at', { ascending: false });
    
    setSchemes(data || []);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  
  const handleSchemeAdded = () => {
    fetchSchemes();
    fetchStats();
    setActiveTab('schemes');
    setEditingScheme(null); 
  };
  
  const handleApprovalProcessed = () => {
    fetchStats();
  };
  
  const handleEditScheme = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setActiveTab('add-scheme');
  };
  
  const handleAddScheme = () => {
    setEditingScheme(null);
    setActiveTab('add-scheme');
  };
  
  const handleApprovalsClick = () => {
    setActiveTab('approvals');
  };
  
  if (!user) {
    return <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f87060ff]"></div>
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#102542ff]">Admin Dashboard</h1>
            <p className="text-[#6b7280]">Manage schemes and user approvals</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center cusror-pointer px-4 py-2 rounded-2xl transition-colors w-full sm:w-auto justify-center bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
        
        <DashboardStats stats={stats} />
        
        <DashboardTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAddScheme={handleAddScheme}
        />
        
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-[#e5e7eb]">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              schemes={schemes}
              onAddScheme={handleAddScheme}
              onApprovalsClick={handleApprovalsClick}
            />
          )}
          
          {activeTab === 'citizens' && (
            <UserList 
              userType="citizen"
              refreshStats={fetchStats}
            />
          )}
          
          {activeTab === 'gramsevaks' && (
            <UserList 
              userType="gramsevak"
              refreshStats={fetchStats}
            />
          )}
          {activeTab === 'admin' && (
            <UserList 
              userType="admin"
              refreshStats={fetchStats}
            />
          )}
          
          {activeTab === 'schemes' && (
            <SchemeList 
              onEditScheme={handleEditScheme}
              refreshSchemes={fetchSchemes}
              refreshStats={fetchStats}
            />
          )}
          
          {activeTab === 'add-scheme' && (
            <AddSchemeForm 
              onSchemeAdded={handleSchemeAdded} 
              scheme={editingScheme}
              isEditing={!!editingScheme}
            />
          )}

{activeTab === 'extracted-schemes' && <ExtractedSchemes />}
        
        </div>
      </div>
      
      <Footer /> 
    </div>
  );
}