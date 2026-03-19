'use client';
import { FileText, Folder, CheckCircle, Upload } from 'lucide-react';

export default function StatsCards({ stats }: { stats: { totalSchemes: number; totalDocuments: number } }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#e5e7eb] hover:shadow-xl transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-xl mr-4 bg-[rgba(16,37,66,0.1)]">
            <FileText className="h-6 w-6 text-[#102542ff]" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Available Schemes</p>
            <p className="text-2xl font-bold text-[#102542ff]">{stats.totalSchemes}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#e5e7eb] hover:shadow-xl transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-xl mr-4 bg-[rgba(16,37,66,0.1)]">
            <Folder className="h-6 w-6 text-[#102542ff]" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">My Documents</p>
            <p className="text-2xl font-bold text-[#102542ff]">{stats.totalDocuments}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#e5e7eb] hover:shadow-xl transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-xl mr-4 bg-[rgba(248,112,96,0.1)]">
            <CheckCircle className="h-6 w-6 text-[#f87060ff]" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Verified</p>
            <p className="text-2xl font-bold text-[#102542ff]">Account</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#e5e7eb] hover:shadow-xl transition-shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-xl mr-4 bg-[rgba(248,112,96,0.1)]">
            <Upload className="h-6 w-6 text-[#f87060ff]" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Upload</p>
            <p className="text-2xl font-bold text-[#102542ff]">Documents</p>
          </div>
        </div>
      </div>
    </div>
  );
}