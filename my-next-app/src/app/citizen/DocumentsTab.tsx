'use client';
import { useState } from 'react';
import { Plus, Search, File, Trash2, Download, AlertCircle } from 'lucide-react';
import ExtractedDataDisplay from '@/app/components/ExtractedDataDisplay';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  category: string;
  description: string;
  created_at: string;
}

export default function DocumentsTab({ 
  documents, 
  setShowUploadModal, 
  userId, 
  refreshExtractedData,
  downloadDocument,
  deleteDocument
}: { 
  documents: Document[]; 
  setShowUploadModal: (show: boolean) => void; 
  userId: string;
  refreshExtractedData: boolean;
  downloadDocument: (url: string, name: string) => void;
  deleteDocument: (id: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const documentCategories = [
    { id: 'all', name: 'All Documents' },
    { id: 'personal', name: 'Personal ID' },
    { id: 'aadhaar', name: 'Aadhaar Card' },
    { id: 'voter', name: 'Voter ID' },
    { id: 'passport', name: 'Passport' },
    { id: 'driving', name: 'Driving Licence' },
    { id: 'pan', name: 'PAN Card' },
    { id: 'ration', name: 'Ration Card' },
    { id: 'residence', name: 'Residence Proof' },
    { id: 'other', name: 'Other Documents' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#102542ff]">
          My Documents
        </h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl cusror-pointer transition-colors flex items-center w-full sm:w-auto justify-center bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Documents
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#6b7280]" />
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff] bg-white ring-2 ring-[#e5e7eb] text-[#102542ff]"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff] bg-white ring-2 ring-[#e5e7eb] text-[#102542ff]"
          >
            {documentCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="py-4  rounded-2xl">
        <h3 className="text-xl mb-4 font-semibold text-[#102542ff]">
          Extracted Information
        </h3>
        <ExtractedDataDisplay
          userId={userId}
          refreshTrigger={refreshExtractedData}
        />
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-[rgba(16,37,66,0.1)]">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[#f87060ff]" />
          <p className="mb-4 text-[#6b7280]">
            {documents.length === 0
              ? "You haven't uploaded any documents yet."
              : "No documents match your search criteria."
            }
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-lg cusror-pointer transition-colors bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
          >
            Upload Documents
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="rounded-2xl p-6 border border-[#e5e7eb] bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="p-3 rounded-xl mr-4 flex-shrink-0 bg-[rgba(16,37,66,0.1)]">
                    <File className="h-6 w-6 text-[#102542ff]" />
                  </div>
                  <h3 className="text-lg font-medium truncate text-[#102542ff]">
                    {document.name}
                  </h3>
                </div>
                <button
                  onClick={() => deleteDocument(document.id)}
                  className="p-2 rounded-lg cusror-pointer transition-colors flex-shrink-0 ml-2 text-[#f87060ff] hover:text-[#e55a4aff]"
                  title="Delete document"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[rgba(16,37,66,0.1)] text-[#102542ff]">
                  {documentCategories.find(c => c.id === document.category)?.name || document.category}
                </span>
              </div>
              
              {document.description && (
                <p className="mb-4 text-[#6b7280]">
                  {document.description}
                </p>
              )}
              
              <p className="mb-6 text-[#6b7280]">
                Type: {document.type.split('/')[1] || document.type} •
                Uploaded: {new Date(document.created_at).toLocaleDateString()}
              </p>
              
              <button
                onClick={() => downloadDocument(document.url, document.name)}
                className="w-full cusror-pointer flex items-center justify-center px-4 py-3 rounded-xl transition-colors bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}