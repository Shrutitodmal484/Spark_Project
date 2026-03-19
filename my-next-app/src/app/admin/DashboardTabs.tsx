'use client';
interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddScheme: () => void;
}

export default function DashboardTabs({ activeTab, setActiveTab, onAddScheme }: DashboardTabsProps) {
  return (
    <div className="flex border-b border-[#e5e7eb] mb-6 overflow-x-auto">
      <button
        className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
          activeTab === 'dashboard' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </button>
      <button
        className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
          activeTab === 'admin' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('admin')}
      >
        Admins
      </button>
      <button
        className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
          activeTab === 'gramsevaks' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('gramsevaks')}
      >
        Gramsevaks
      </button>
      <button
        className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
          activeTab === 'citizens' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('citizens')}
      >
        Citizens
      </button>
      <button
        className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
          activeTab === 'schemes' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('schemes')}
      >
        Schemes
      </button>
      <button
        className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
          activeTab === 'add-scheme' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={onAddScheme}
      >
        Add Scheme
      </button>
<button
  className={`px-4 py-2 font-medium cursor-pointer text-sm sm:text-base transition-colors whitespace-nowrap ${
    activeTab === 'extracted-schemes' 
      ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
      : 'text-[#6b7280] hover:text-[#102542ff]'
  }`}
  onClick={() => setActiveTab('extracted-schemes')}
>
  Extracted Schemes
</button>
    </div>
  );
}