'use client';
interface Scheme {
  id: string;
  title: string;
  category: string;
  benefit_amount: number;
  official_website: string;
}

export default function SchemesTab({ schemes }: { schemes: Scheme[] }) {
  const visitSchemeWebsite = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#102542ff]">
        Available Government Schemes
      </h2>
      <p className="mb-6 text-[#6b7280]">
        Browse through available government schemes. Click on "Visit Official Website" to apply for any scheme.
      </p>
      
      <div className="overflow-x-auto rounded-xl shadow-lg border border-[#e5e7eb]">
        <table className="min-w-full divide-y divide-[#e5e7eb]">
          <thead className="bg-[rgba(16,37,66,0.1)]">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">
                Scheme Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">
                Benefit Amount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e5e7eb]">
            {schemes.map((scheme) => (
              <tr key={scheme.id} className="hover:bg-[rgba(16,37,66,0.05)] transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm sm:text-base font-medium text-[#102542ff]">{scheme.title}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm sm:text-base text-[#6b7280]">{scheme.category}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm sm:text-base text-[#6b7280]">₹{scheme.benefit_amount}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => visitSchemeWebsite(scheme.official_website)}
                    className="px-3 sm:px-4 py-2 cusror-pointer bg-[#f87060ff] hover:bg-[#e55a4aff] text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Visit Official Website
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {schemes.length === 0 && (
        <div className="mt-8 text-center py-12 rounded-xl bg-[rgba(16,37,66,0.1)]">
          <p className="text-[#6b7280]">No schemes available at the moment.</p>
        </div>
      )}
    </div>
  );
}