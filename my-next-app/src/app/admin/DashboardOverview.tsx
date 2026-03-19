'use client';
import { BarChart3, Plus } from 'lucide-react';

interface DashboardOverviewProps {
  schemes: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  onAddScheme: () => void;
  onApprovalsClick: () => void;
}

export default function DashboardOverview({ 
  schemes, 
  onAddScheme, 
  onApprovalsClick 
}: DashboardOverviewProps) {
  return (
    <div className="bg-white">
        <div className="bg-white rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#102542ff] mb-4">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions Card */}
            <div className="bg-[rgba(16,37,66,0.05)] rounded-2xl p-6 border border-[#e5e7eb]">
              <h3 className="font-semibold text-[#102542ff] mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-between cursor-pointer p-3 bg-white rounded-xl border border-[#e5e7eb] hover:bg-[rgba(16,37,66,0.05)] transition-colors"
                  onClick={onAddScheme}
                >
                  <span className="text-[#102542ff]">Add New Scheme</span>
                  <Plus className="h-5 w-5 text-[#f87060ff]" />
                </button>
                <button
                  className="w-full flex items-center cursor-pointer justify-between p-3 bg-white rounded-xl border border-[#e5e7eb] hover:bg-[rgba(16,37,66,0.05)] transition-colors"
                  onClick={onApprovalsClick}
                >
                  <span className="text-[#102542ff]">Review Pending Approvals</span>
                  <BarChart3 className="h-5 w-5 text-[#f87060ff]" />
                </button>
              </div>
            </div>
            
            {/* Recent Schemes Card */}
            <div className="bg-[rgba(16,37,66,0.05)] rounded-2xl p-6 border border-[#e5e7eb]">
              <h3 className="font-semibold text-[#102542ff] mb-3">Recent Schemes</h3>
              <div className="space-y-3">
                {schemes.slice(0, 3).map((scheme) => (
                  <div key={scheme.id} className="p-3 bg-white rounded-xl border border-[#e5e7eb]">
                    <h4 className="font-medium text-[#102542ff]">{scheme.title}</h4>
                    <p className="text-sm text-[#6b7280] truncate">{scheme.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}