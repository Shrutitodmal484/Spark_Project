"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, CheckCircle, Calendar, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const [activeScheme, setActiveScheme] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const getSchemeImage = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('agriculture') || categoryLower.includes('rural') || categoryLower.includes('farm')) {
      return "/images/schemes/farmer-scheme.png";
    } else if (categoryLower.includes('education') || categoryLower.includes('learning') || categoryLower.includes('scholarship')) {
      return "/images/schemes/student-scholarship.png";
    } else if (categoryLower.includes('entrepreneur') || categoryLower.includes('business') || categoryLower.includes('startup') || categoryLower.includes('mudra')) {
      return "/images/schemes/women-entrepreneur.png";
    } else if (categoryLower.includes('social welfare') || categoryLower.includes('pension') || categoryLower.includes('elderly') || categoryLower.includes('senior')) {
      return "/images/schemes/senior-pension.png";
    } else if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('hospital') || categoryLower.includes('ayushman')) {
      return "/images/schemes/health-scheme.png";
    } else if (categoryLower.includes('housing') || categoryLower.includes('home') || categoryLower.includes('shelter') || categoryLower.includes('pmay')) {
      return "/images/schemes/housing-scheme.png";
    } else if (categoryLower.includes('employment') || categoryLower.includes('job') || categoryLower.includes('skill') || categoryLower.includes('mgnrega')) {
      return "/images/schemes/employment-scheme.png";
    } else {
      return "/images/schemes/default-scheme.png";
    }
  };

  // Fetch schemes from database
  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('schemes')
          .select('*')
          .limit(4)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching schemes:', error);
          // Fallback to mock data if database fails
          setSchemes([
            {
              id: 1,
              title: "PM Kisan Samman Nidhi",
              category: "Agriculture",
              description: "Direct income support of ₹6,000 per year in three equal installments to small and marginal farmer families.",
              eligibility: "Small and marginal farmers cultivating up to 2 hectares of land",
              last_date_to_apply: "2024-12-31"
            },
            // Add more fallback schemes as needed
          ]);
        } else {
          setSchemes(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchemes();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      // Only update activeScheme if schemes array has items
      if (schemes.length > 0) {
        setActiveScheme((prev) => (prev + 1) % schemes.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [schemes.length]);

  // Handle navigation to scheme details
  const handleViewDetails = () => {
    if (schemes[activeScheme]) {
      router.push(`/schemes/${schemes[activeScheme].id}`);
    }
  };

  // Handle navigation to eligibility check
  const handleCheckEligibility = () => {
    if (schemes[activeScheme]) {
      router.push(`/schemes/${schemes[activeScheme].id}#eligibility`);
    }
  };

  // Handle navigation to all schemes
  const handleBrowseAllSchemes = () => {
    router.push('/schemes');
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ongoing';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#102542ff" }}>
              Explore Government Schemes
            </h2>
          </div>
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#f87060ff" }} />
          </div>
        </div>
      </section>
    );
  }

  // Handle case when no schemes are available
  if (schemes.length === 0) {
    return (
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#102542ff" }}>
              Explore Government Schemes
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: "#102542ff" }}>
              No schemes available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#102542ff" }}
          >
            Explore Government Schemes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: "#102542ff" }}
          >
            Discover benefits tailored for different sections of society
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Main scheme card */}
          {schemes.length > 0 && schemes[activeScheme] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 rounded-3xl overflow-hidden shadow-xl"
              style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}
            >
              <div className="relative h-64 md:h-80 lg:h-96 w-full">
                <Image
                  src={getSchemeImage(schemes[activeScheme].category || "")}
                  alt={schemes[activeScheme].title || "Scheme"}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Category badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(16, 37, 66, 0.8)" }}>
                    {schemes[activeScheme].category || "General"}
                  </span>
                  <span className="backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", color: "#102542ff" }}>
                    New
                  </span>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-0" style={{ color: "#102542ff" }}>
                    {schemes[activeScheme].title || "Scheme Title"}
                  </h3>
                  <span className="text-sm" style={{ color: "#102542ff" }}>
                    {isClient ? `Updated ${new Date().toLocaleDateString()}` : 'Loading...'}
                  </span>
                </div>
                
                <p className="mb-6 leading-relaxed line-clamp-2 md:line-clamp-3" style={{ color: "#102542ff" }}>
                  {schemes[activeScheme].description || "No description available."}
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="px-4 py-3 rounded-xl flex-1 min-w-[200px]" style={{ backgroundColor: "#F5F5F5", border: "1px solid #F5F5F5" }}>
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 mr-2" style={{ color: "#f87060ff" }} />
                      <p className="text-sm font-medium" style={{ color: "#102542ff" }}>Eligibility</p>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: "#102542ff" }}>
                      {schemes[activeScheme].eligibility || "No eligibility information available."}
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl flex-1 min-w-[200px]" style={{ backgroundColor: "#F5F5F5", border: "1px solid #F5F5F5" }}>
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2" style={{ color: "#f87060ff" }} />
                      <p className="text-sm font-medium" style={{ color: "#102542ff" }}>Deadline</p>
                    </div>
                    <p className="text-sm" style={{ color: "#102542ff" }}>
                      {formatDate(schemes[activeScheme].last_date_to_apply)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleViewDetails}
                    className="px-6 py-3 font-medium cursor-pointer rounded-2xl transition-colors duration-300 flex items-center justify-center" 
                    style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" style={{ color: "#ffffffff" }} />
                  </button>
                  <button 
                    onClick={handleCheckEligibility}
                    className="px-6 py-3 font-medium cursor-pointer rounded-2xl transition-colors duration-300 flex items-center justify-center" 
                    style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5", color: "#102542ff" }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" style={{ color: "#f87060ff" }} />
                    Check Eligibility
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Schemes list */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6">
            <div className="rounded-3xl p-6 shadow-lg" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#102542ff" }}>Available Schemes</h3>
              
              <div className="space-y-4">
                {schemes.map((scheme, index) => (
                  <div 
                    key={scheme.id}
                    onClick={() => setActiveScheme(index)}
                    className={`cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                      activeScheme === index ? '' : ''
                    }`}
                    style={{ 
                      backgroundColor: activeScheme === index ? "#fff4f2" : "#ffffffff",
                      border: activeScheme === index ? "1px solid #f87060ff" : "1px solid #F5F5F5",
                    }}
                  >
                    <div className="rounded-2xl h-24 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex h-full">
                        <div className="relative w-24 h-full flex-shrink-0">
                          <Image
                            src={getSchemeImage(scheme.category || "")}
                            alt={scheme.title || "Scheme"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col justify-center overflow-hidden">
                          <span className="text-xs mb-1" style={{ color: "#f87060ff" }}>
                            {scheme.category || "General"}
                          </span>
                          <h3 className="font-medium truncate" style={{ color: "#102542ff" }}>
                            {scheme.title || "Scheme Title"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-3xl p-6 shadow-lg"
              style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}
            >
              <h4 className="font-bold mb-3" style={{ color: "#102542ff" }}>Need more options?</h4>
              <p className="text-sm mb-4" style={{ color: "#102542ff" }}>We're constantly adding new government initiatives to our platform</p>
              <button 
                onClick={handleBrowseAllSchemes}
                className="w-full py-3 rounded-2xl cursor-pointer transition-colors duration-300 flex items-center justify-center" 
                style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
              >
                Browse All Schemes
                <ArrowRight className="ml-2 h-4 w-4" style={{ color: "#ffffffff" }} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;