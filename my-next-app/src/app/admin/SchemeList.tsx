'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Edit, 
  Trash2 
} from 'lucide-react';

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

interface SchemeListProps {
  onEditScheme: (scheme: Scheme) => void;
  refreshSchemes: () => void;
  refreshStats?: () => void;
}

export default function SchemeList({ onEditScheme, refreshSchemes, refreshStats }: SchemeListProps) {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    fetchSchemes();
  }, []);
  
  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('schemes')
        .select('*')
        .order('created_at', { ascending: false });
      
      setSchemes(data || []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteScheme = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheme? This action cannot be undone.')) {
      setIsDeleting(true);
      
      try {
        const { error } = await supabase
          .from('schemes')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting scheme:', error);
          alert('Failed to delete scheme. Please try again.');
        } else {
          // Refresh the list
          fetchSchemes();
          
          // Refresh stats if callback provided
          if (refreshStats) refreshStats();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#102542ff]">All Schemes</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#6b7280]">Loading schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-[rgba(16,37,66,0.05)] rounded-xl p-8 text-center">
          <p className="text-[#6b7280]">No schemes found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
          <table className="min-w-full divide-y divide-[#e5e7eb]">
            <thead className="bg-[rgba(16,37,66,0.05)]">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Scheme Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">State</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Benefit Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {schemes.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-[rgba(16,37,66,0.05)] transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#102542ff]">{scheme.title}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280]">{scheme.category}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280]">{scheme.state}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280]">₹{scheme.benefit_amount}</div>
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
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                    <button 
                      className="text-[#102542ff] cursor-pointer hover:text-[#f87060ff] mr-3 flex items-center transition-colors"
                      onClick={() => onEditScheme(scheme)}
                      disabled={isDeleting}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      className="text-[#f87060ff] cursor-pointer hover:text-[#e55a4aff] flex items-center transition-colors"
                      onClick={() => handleDeleteScheme(scheme.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 