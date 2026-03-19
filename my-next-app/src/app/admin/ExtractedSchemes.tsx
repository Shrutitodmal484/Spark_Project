import { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  RefreshCw,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
interface ExtractedScheme {
  title: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  application_process: string;
  official_website: string;
  contact_info: string;
  status: string;
  benefits_amount: string;
  issuer_name: string;
  last_date_to_apply: string;
  timestamp: string;
}
export default function ExtractedSchemes() {
  const [schemes, setSchemes] = useState<ExtractedScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  useEffect(() => {
    fetchExtractedSchemes();
  }, []);
  
  // ExtractedSchemes.tsx - Updated error handling
const fetchExtractedSchemes = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/extracted-schemes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to fetch schemes: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Ensure data is always an array
    if (!Array.isArray(data)) {
      console.error('Invalid data format received:', data);
      setSchemes([]);
    } else {
      setSchemes(data);
    }
    
    setCurrentPage(1); // Reset to first page when refreshing
  } catch (err: any) {
    console.error('Error fetching extracted schemes:', err);
    setError(`Failed to load extracted schemes: ${err.message || 'Unknown error'}`);
  } finally {
    setLoading(false);
  }
};
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  const handleApproveScheme = async (scheme: ExtractedScheme) => {
    setApproving(scheme.title);
    
    try {
      // Format last_date_to_apply - use default if not present
      const lastDateToApply = scheme.last_date_to_apply 
        ? new Date(scheme.last_date_to_apply) 
        : new Date('2025-12-31');
      
      // Prepare scheme data for database
      const schemeData = {
        title: scheme.title,
        description: scheme.description,
        category: scheme.category,
        eligibility: scheme.eligibility,
        benefits: scheme.benefits,
        application_process: scheme.application_process,
        required_documents: '', // Not available in extracted data
        official_website: scheme.official_website,
        contact_info: scheme.contact_info,
        status: 'active', // Default to active when approved
        benefit_amount: scheme.benefits_amount,
        state: scheme.issuer_name, // Using issuer_name as state
        last_date_to_apply: lastDateToApply.toISOString().split('T')[0]
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('schemes')
        .insert([schemeData])
        .select();
      
      if (error) {
        console.error('Error saving scheme:', error);
        alert('Failed to approve scheme. Please try again.');
      } else {
        // Remove from extracted schemes list after successful approval
        setSchemes(prev => prev.filter(s => s.title !== scheme.title));
        alert('Scheme approved successfully!');
      }
    } catch (err) {
      console.error('Error approving scheme:', err);
      alert('An error occurred while approving the scheme.');
    } finally {
      setApproving(null);
    }
  };
  
  // Pagination calculations
  const totalPages = Math.ceil(schemes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = schemes.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#102542ff]">Extracted Schemes</h2>
        <button 
          onClick={fetchExtractedSchemes}
          className="px-4 py-2 bg-[#102542ff] cursor-pointer text-white rounded-lg hover:bg-[#0d1930] transition-colors flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#6b7280]">Loading extracted schemes...</p>
        </div>
      ) : error ? (
        <div className="bg-[rgba(248,112,96,0.1)] rounded-xl p-8 text-center">
          <p className="text-[#f87060ff]">{error}</p>
          <button 
            onClick={fetchExtractedSchemes}
            className="mt-4 px-4 py-2 bg-[#f87060ff] text-white rounded-lg hover:bg-[#e55a4a] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-[rgba(16,37,66,0.05)] rounded-xl p-8 text-center">
          <p className="text-[#6b7280]">No extracted schemes found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-[rgba(16,37,66,0.05)]">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Scheme Name</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Issuer</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Benefit Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Last Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Official Website</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#e5e7eb]">
                {currentItems.map((scheme, index) => (
                  <tr key={index} className="hover:bg-[rgba(16,37,66,0.05)] transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-[#102542ff]">{scheme.title}</div>
                      <div className="text-sm text-[#6b7280] max-w-xs truncate">{scheme.description}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6b7280]">{scheme.category}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6b7280]">{scheme.issuer_name}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6b7280]">{scheme.benefits_amount ? `₹${scheme.benefits_amount}` : 'N/A'}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        scheme.status === 'active' ? 'bg-[rgba(16,150,90,0.1)] text-[#10965a]' : 
                        scheme.status === 'inactive' ? 'bg-[rgba(248,112,96,0.1)] text-[#f87060ff]' :
                        'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]'
                      }`}>
                        {scheme.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6b7280]">{formatDate(scheme.last_date_to_apply)}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {scheme.official_website ? (
                        <a 
                          href={scheme.official_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#102542ff] hover:text-[#f87060ff] flex items-center transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                      ) : (
                        <span className="text-[#6b7280]">N/A</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                      <button 
                        onClick={() => handleApproveScheme(scheme)}
                        disabled={approving === scheme.title}
                        className="text-[#10965a] cursor-pointer hover:text-[#000] flex items-center transition-colors disabled:opacity-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {approving === scheme.title ? 'Approving...' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-[#6b7280]">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, schemes.length)} of {schemes.length} schemes
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md cursor-pointer bg-[#102542ff] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNum
                            ? 'bg-[#f87060ff] text-white'
                            : 'bg-[rgba(16,37,66,0.05)] cursor-pointer text-[#102542ff] hover:bg-[rgba(16,37,66,0.1)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md cursor-pointer bg-[#102542ff] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}