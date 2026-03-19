'use client';
import { Users, UserCheck, Clock, FileText } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalCitizens: number;
    totalGramsevaks: number;
    pendingApprovals: number;
    totalSchemes: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e5e7eb]">
        <div className="flex items-center">
          <div className="p-3 rounded-xl bg-[rgba(248,112,96,0.1)] text-[#f87060ff] mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Total Citizens</p>
            <p className="text-2xl font-bold text-[#102542ff]">{stats.totalCitizens}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e5e7eb]">
        <div className="flex items-center">
          <div className="p-3 rounded-xl bg-[rgba(248,112,96,0.1)] text-[#f87060ff] mr-4">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Total Gramsevaks</p>
            <p className="text-2xl font-bold text-[#102542ff]">{stats.totalGramsevaks}</p>
          </div>
        </div>
      </div>
  
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e5e7eb]">
        <div className="flex items-center">
          <div className="p-3 rounded-xl bg-[rgba(248,112,96,0.1)] text-[#f87060ff] mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Pending Approvals</p>
            <p className="text-2xl font-bold text-[#102542ff]">{stats.pendingApprovals}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e5e7eb]">
        <div className="flex items-center">
          <div className="p-3 rounded-xl bg-[rgba(248,112,96,0.1)] text-[#f87060ff] mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Total Schemes</p>
            <p className="text-2xl font-bold text-[#102542ff]">{stats.totalSchemes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}