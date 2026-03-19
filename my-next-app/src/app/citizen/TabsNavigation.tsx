'use client';
export default function TabsNavigation({ activeTab, setActiveTab }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void 
}) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap border-b border-[#e5e7eb] mb-6">
      <button
        className={`px-4 py-2 font-medium  cusror-pointer text-sm sm:text-base transition-colors ${
          activeTab === 'dashboard' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </button>
      <button
        className={`px-4 py-2 font-medium  cusror-pointer text-sm sm:text-base transition-colors ${
          activeTab === 'schemes' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('schemes')}
      >
        Available Schemes
      </button>
      <button
        className={`px-4 py-2 font-medium cusror-pointer text-sm sm:text-base transition-colors ${
          activeTab === 'documents' 
            ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
            : 'text-[#6b7280] hover:text-[#102542ff]'
        }`}
        onClick={() => setActiveTab('documents')}
      >
        My Documents
      </button>
    </div>
  );
}