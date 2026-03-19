'use client';
import { Upload, FileText, Folder } from 'lucide-react';

const COLORS = {
  primary: '#102542ff',
  accent: '#f87060ff',
  white: '#ffffffff',
  lightGray: '#F5F5F5',
  textLight: '#6b7280',
  border: '#e5e7eb',
  lightPrimary: 'rgba(16, 37, 66, 0.1)',
};

interface Scheme {
  id: string;
  title: string;
  description: string;
}

export default function DashboardTab({ 
  schemes, 
  setShowUploadModal, 
  setActiveTab 
}: { 
  schemes: Scheme[]; 
  setShowUploadModal: (show: boolean) => void; 
  setActiveTab: (tab: string) => void 
}) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: COLORS.primary }}>
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-xl p-4 sm:p-6" style={{ backgroundColor: COLORS.lightPrimary }}>
          <h3 className="font-semibold mb-3 sm:mb-4" style={{ color: COLORS.primary }}>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              className="w-full flex items-center cusror-pointer justify-between p-3 rounded-xl border transition-colors"
              style={{ 
                backgroundColor: COLORS.white, 
                borderColor: COLORS.border,
              }}
              onClick={() => setShowUploadModal(true)}
            >
              <span style={{ color: COLORS.primary }}>Upload New Documents</span>
              <Upload className="h-5 w-5" style={{ color: COLORS.accent }} />
            </button>
            <button
              className="w-full flex items-center  cusror-pointer  justify-between p-3 rounded-xl border transition-colors"
              style={{ 
                backgroundColor: COLORS.white, 
                borderColor: COLORS.border,
              }}
              onClick={() => setActiveTab('schemes')}
            >
              <span style={{ color: COLORS.primary }}>Browse Available Schemes</span>
              <FileText className="h-5 w-5" style={{ color: COLORS.accent }} />
            </button>
            <button
              className="w-full flex items-center cusror-pointer justify-between p-3 rounded-xl border transition-colors"
              style={{ 
                backgroundColor: COLORS.white, 
                borderColor: COLORS.border,
              }}
              onClick={() => setActiveTab('documents')}
            >
              <span style={{ color: COLORS.primary }}>Manage My Documents</span>
              <Folder className="h-5 w-5" style={{ color: COLORS.accent }} />
            </button>
          </div>
        </div>
        <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: COLORS.lightPrimary }}>
          <h3 className="font-semibold mb-3 sm:mb-4" style={{ color: COLORS.primary }}>
            Recent Schemes
          </h3>
          <div className="space-y-3">
            {schemes.slice(0, 3).map((scheme) => (
              <div key={scheme.id} className="p-3 rounded-xl border" style={{ 
                backgroundColor: COLORS.white, 
                borderColor: COLORS.border,
              }}>
                <h4 className="font-medium truncate" style={{ color: COLORS.primary }}>
                  {scheme.title}
                </h4>
                <p className="text-sm truncate" style={{ color: COLORS.textLight }}>
                  {scheme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}