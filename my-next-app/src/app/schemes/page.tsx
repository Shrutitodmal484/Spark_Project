'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Tag,
  Clock,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string;
  benefits: string;
  application_process: string;
  required_documents: string;
  official_website: string;
  contact_info: string;
  status: 'active' | 'inactive' | 'upcoming';
  benefit_amount: string;
  created_at: string;
  updated_at: string;
  last_date_to_apply?: string;
}

export default function SchemesPage() {
  const router = useRouter();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 20;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [states, setStates] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch filter options (states and categories)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch unique states
        const { data: statesData, error: statesError } = await supabase
          .from('schemes')
          .select('state');
        if (statesError) {
          console.error('Error fetching states:', statesError);
          setStates([]);
          return;
        }

        const uniqueStates = [...new Set(statesData
          .map(item => item.state)
          .filter(state => state !== null && state !== undefined && state !== '')
        )];
        setStates(uniqueStates);

        // Fetch unique categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('schemes')
          .select('category');
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          setCategories([]);
          return;
        }

        const uniqueCategories = [...new Set(categoriesData
          .map(item => item.category)
          .filter(category => category !== null && category !== undefined && category !== '')
        )];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setStates([]);
        setCategories([]);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch schemes based on filters and pagination
  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('schemes')
          .select('*', { count: 'exact' });

        // Apply search filter
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Apply state filter
        if (selectedState !== 'all') {
          query = query.eq('state', selectedState);
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }

        // Apply status filter
        if (selectedStatus !== 'all') {
          query = query.eq('status', selectedStatus);
        }

        // Get total count
        const { count, error: countError } = await query;
        if (countError) {
          throw countError;
        }
        setTotalCount(count || 0);

        // Fetch paginated data
        const { data, error } = await query
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * schemesPerPage, currentPage * schemesPerPage - 1);

        if (error) {
          throw error;
        }
        setSchemes(data || []);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        // Fallback to empty array on error
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [currentPage, searchTerm, selectedState, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(totalCount / schemesPerPage);
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleViewDetails = (schemeId: string) => {
    router.push(`/schemes/${schemeId}`);
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlineApproaching = (lastDate?: string) => {
    if (!lastDate) return false;
    const today = new Date();
    const deadline = new Date(lastDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0; // Deadline is within 7 days
  };

  const isDeadlinePassed = (lastDate?: string) => {
    if (!lastDate) return false;
    const today = new Date();
    const deadline = new Date(lastDate);
    return deadline < today;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#102542ff" }}>Government Schemes</h1>
          <p style={{ color: "#102542ff" }}>Browse and apply for government schemes</p>
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl shadow-md p-6 mb-8" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: "#f87060ff" }} />
              </div>
              <input
                type="text"
                placeholder="Search schemes by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "#F5F5F5",
                  border: "1px solid #F5F5F5",
                  color: "#102542ff"
                }}
              />
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5" style={{ color: "#f87060ff" }} />
                </div>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#F5F5F5",
                    border: "1px solid #F5F5F5",
                    color: "#102542ff"
                  }}
                >
                  <option value="all">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5" style={{ color: "#f87060ff" }} />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#F5F5F5",
                    border: "1px solid #F5F5F5",
                    color: "#102542ff"
                  }}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5" style={{ color: "#f87060ff" }} />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#F5F5F5",
                    border: "1px solid #F5F5F5",
                    color: "#102542ff"
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="flex justify-between items-center mb-6">
          <p style={{ color: "#102542ff" }}>
            Showing <span className="font-medium">{(currentPage - 1) * schemesPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * schemesPerPage, totalCount)}
            </span>{' '}
            of <span className="font-medium">{totalCount}</span> schemes
          </p>
          <div className="flex items-center space-x-2 text-sm" style={{ color: "#102542ff" }}>
            <span>{schemesPerPage} per page</span>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#f87060ff" }}></div>
          </div>
        ) : schemes.length === 0 ? (
          <div className="rounded-2xl shadow-md p-12 text-center" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
            <FileText className="h-16 w-16 mx-auto mb-4" style={{ color: "#f87060ff" }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: "#102542ff" }}>No schemes found</h3>
            <p className="mb-6" style={{ color: "#102542ff" }}>
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 rounded-2xl cusror-pointer  transition-colors"
              style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${scheme.status === 'active' ? 'bg-blue-100' :
                          scheme.status === 'inactive' ? 'bg-red-100' :
                            'bg-yellow-100'
                        }`} style={{
                          color: scheme.status === 'active' ? '#102542ff' :
                            scheme.status === 'inactive' ? '#f87060ff' :
                              '#102542ff'
                        }}>
                        {scheme.status}
                      </span>
                      <h3 className="text-lg font-bold mb-2" style={{ color: "#102542ff" }}>{scheme.title}</h3>
                    </div>
                    <div className="px-2 py-1 rounded text-xs" style={{ backgroundColor: "#F5F5F5", color: "#102542ff" }}>
                      {scheme.category}
                    </div>
                  </div>
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: "#102542ff" }}>
                    {scheme.description}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm" style={{ color: "#102542ff" }}>
                      <MapPin className="h-4 w-4 mr-2" style={{ color: "#f87060ff" }} />
                      <span>{scheme.state}</span>
                    </div>
                    <div className="flex items-center text-sm" style={{ color: "#102542ff" }}>
                      <span className="font-medium">{formatCurrency(Number(scheme.benefit_amount))}</span>
                    </div>
                    <div className="flex items-center text-sm" style={{ color: "#102542ff" }}>
                      <Calendar className="h-4 w-4 mr-2" style={{ color: "#f87060ff" }} />
                      <span>Added: {formatDate(scheme.created_at)}</span>
                    </div>
                    {scheme.last_date_to_apply && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" style={{ color: "#f87060ff" }} />
                        <span className={`
                          ${isDeadlinePassed(scheme.last_date_to_apply) ? 'text-red-600 font-medium' : ''}
                          ${isDeadlineApproaching(scheme.last_date_to_apply) ? 'text-yellow-600 font-medium' : ''}
                        `} style={{ color: "#102542ff" }}>
                          Last date: {formatDate(scheme.last_date_to_apply)}
                          {isDeadlineApproaching(scheme.last_date_to_apply) && ' (Approaching!)'}
                          {isDeadlinePassed(scheme.last_date_to_apply) && ' (Closed)'}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewDetails(scheme.id)}
                    className="w-full flex items-center  cusror-pointer justify-center px-4 py-2 rounded-2xl transition-colors"
                    style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg  cusror-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "1px solid #F5F5F5",
                color: "#102542ff"
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={i}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg  cusror-pointer transition-colors ${currentPage === page
                      ? 'text-white'
                      : 'hover:bg-opacity-10'
                    }`}
                  style={{
                    backgroundColor: currentPage === page ? "#f87060ff" : "transparent",
                    border: "1px solid #F5F5F5",
                    color: currentPage === page ? "#ffffffff" : "#102542ff"
                  }}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg cusror-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "1px solid #F5F5F5",
                color: "#102542ff"
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}