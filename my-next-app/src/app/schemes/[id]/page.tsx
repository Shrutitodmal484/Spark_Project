'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  Phone,
  Mail,
  Shield,
  Award,
  FileCheck,
  Info,
  Building,
  Globe,
  Users,
  CreditCard,
  CalendarDays,
  Contact,
  ChevronRight,
  User,
  Search,
  Loader2
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  benefit_amount: string;
  official_website: string;
  status: 'active' | 'inactive' | 'upcoming';
  created_at: string;
  updated_at: string;
  last_date_to_apply?: string;
  eligibility?: string;
  benefits?: string;
  application_process?: string;
  required_documents?: string;
  contact_info?: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  role: string;
  caste?: string;
  religion?: string;
}

interface ExtractedData {
  field_type: string;
  field_value: string;
}

interface UserData {
  profile: {
    caste: string;
    religion: string;
    state: string;
    district: string;
    village: string;
  };
  extractedData: Record<string, string>;
}

const LANGUAGE_LABELS = {
  en: {
    applyNow: "Apply Now",
    checkEligibility: "Check Eligibility",
    applyOnOfficialWebsite: "Apply on Official Website",
    redirectMessage: "You'll be redirected to the official website to complete your application",
    thisSchemeInactive: "This scheme is currently inactive",
    thisSchemeUpcoming: "This scheme is upcoming",
    deadlinePassed: "Application deadline has passed",
    checking: "Checking...",
    eligibilityResult: "Eligibility Result"
  },
  mr: {
    applyNow: "अर्ज करा",
    checkEligibility: "पात्रता तपासा",
    applyOnOfficialWebsite: "अधिकृत संकेतस्थळावर अर्ज करा",
    redirectMessage: "अर्दा पूर्ण करण्यासाठी तुम्हाला अधिकृत संकेतस्थळावर पुनर्निर्देशित केले जाईल",
    thisSchemeInactive: "ही योजना सध्या निष्क्रिय आहे",
    thisSchemeUpcoming: "ही योजना येणारी आहे",
    deadlinePassed: "अर्ज करण्याची अंतिम तारीख संपली आहे",
    checking: "तपासत आहे...",
    eligibilityResult: "पात्रता परिणाम"
  }
};

export default function SchemeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const schemeId = params?.id as string;
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');

  useEffect(() => {
    // Check language preference from cookies
    const checkLanguage = () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const savedLang = getCookie('preferred_language');
      if (savedLang && (savedLang === 'en' || savedLang === 'mr')) {
        setLanguage(savedLang);
      }
    };

    checkLanguage();
  }, []);

  useEffect(() => {
    if (!schemeId) {
      setError('Scheme ID is missing');
      setLoading(false);
      return;
    }

    const fetchSchemeDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('schemes')
          .select('*')
          .eq('id', schemeId)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setError('Scheme not found');
        } else {
          setScheme(data as Scheme);
        }
      } catch (err) {
        console.error('Error fetching scheme details:', err);
        setError('Failed to load scheme details');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeDetails();
  }, [schemeId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setUserProfile(profile as UserProfile);
          // Fetch extracted document data
          const { data: extracted } = await supabase
            .from('extracted_document_data')
            .select('*')
            .eq('user_id', user.id);
          setExtractedData(extracted || []);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const goBack = () => {
    router.back();
  };

  const visitOfficialWebsite = () => {
    if (scheme?.official_website) {
      window.open(scheme.official_website, '_blank');
    }
  };

  const checkEligibility = async () => {
    if (!scheme || !userProfile) return;

    setCheckingEligibility(true);
    setEligibilityResult(null);

    try {
      // Prepare user data for eligibility check
      const userData: UserData = {
        profile: {
          caste: userProfile.caste || '',
          religion: userProfile.religion || '',
          state: userProfile.state || '',
          district: userProfile.district || '',
          village: userProfile.village || '',
        },
        extractedData: extractedData.reduce<Record<string, string>>((acc, item) => {
          acc[item.field_type] = item.field_value;
          return acc;
        }, {})
      };

      // Call the Gemini API to check eligibility
      const response = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schemeEligibility: scheme.eligibility,
          userData: userData
        }),
      });

      const data = await response.json();
      console.log('Eligibility check response:', data);

      if (data.success) {
        setEligibilityResult(data.result);
      } else {
        setEligibilityResult('Error checking eligibility. Please try again later.');
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setEligibilityResult('Error checking eligibility. Please try again later.');
    } finally {
      setCheckingEligibility(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
    if (isNaN(numAmount)) return amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numAmount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if last date to apply is approaching
  const isDeadlineApproaching = (lastDate?: string) => {
    if (!lastDate) return false;
    const today = new Date();
    const deadline = new Date(lastDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0; // Within 7 days
  };

  // Check if last date has passed
  const isDeadlinePassed = (lastDate?: string) => {
    if (!lastDate) return false;
    const today = new Date();
    const deadline = new Date(lastDate);
    return deadline < today;
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor, textColor, icon;
    switch (status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'inactive':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <XCircle className="h-4 w-4 mr-1" />;
        break;
      case 'upcoming':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        icon = <Clock className="h-4 w-4 mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        icon = <Info className="h-4 w-4 mr-1" />;
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Feature card component
  const FeatureCard = ({ icon, title, content, highlight = false }: {
    icon: React.ReactNode;
    title: string;
    content: string;
    highlight?: boolean;
  }) => (
    <div className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${highlight
      ? 'bg-gradient-to-br from-[#f87060ff] to-[#e55a4aff] text-white shadow-lg'
      : 'bg-white border border-[#F5F5F5] shadow-sm'
      }`}>
      <div className={`p-3 rounded-xl inline-block mb-4 ${highlight ? 'bg-white bg-opacity-20' : 'bg-[#F5F5F5] text-[#f87060ff]'
        }`}>
        {icon}
      </div>
      <h3 className={`text-lg font-bold mb-2 ${highlight ? 'text-white' : 'text-[#102542ff]'}`}>{title}</h3>
      <p className={highlight ? 'text-[#F5F5F5]' : 'text-[#102542ff]'}>{content}</p>
    </div>
  );

  const labels = LANGUAGE_LABELS[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(to bottom right, #F5F5F5, #ffffffff)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#f87060ff" }}></div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(to bottom right, #F5F5F5, #ffffffff)" }}>
        <div className="rounded-2xl shadow-xl p-8 text-center max-w-md" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
          <AlertCircle className="h-16 w-16 mx-auto mb-4" style={{ color: "#f87060ff" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#102542ff" }}>Scheme Not Found</h2>
          <p className="mb-6" style={{ color: "#102542ff" }}>
            {error || 'The scheme you are looking for does not exist.'}
          </p>
          <button
            onClick={goBack}
            className="px-6 py-3 rounded-xl cursor-pointer transition-colors font-medium"
            style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if eligibility result indicates eligible or not
  const isEligible = eligibilityResult?.toLowerCase().includes('yes') || false;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom right, #F5F5F5, #ffffffff)" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center mb-8 transition-colors group"
          style={{ color: "#f87060ff" }}
        >
          <ArrowLeft className="h-5 w-5 mr-2 cursor-pointer group-hover:-translate-x-1 transition-transform" />
          Back to Schemes
        </button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to right, #f87060ff, #e55a4aff)" }}></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] z-0"></div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={scheme.status} />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20" style={{ color: "#102542ff" }}>
                  <Tag className="h-4 w-4 mr-1" />
                  {scheme.category}
                </span>
              </div>
              <button
                onClick={visitOfficialWebsite}
                className="px-4 py-2 rounded-xl font-medium cursor-pointer transition-all hover:scale-105 flex items-center shadow-md"
                style={{ backgroundColor: "#ffffffff", color: "#f87060ff" }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Website
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl">
              {scheme.title}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl" style={{ color: "#F5F5F5" }}>
              {scheme.description}
            </p>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<MapPin className="h-6 w-6" />}
            title="State"
            content={scheme.state}
          />
          <FeatureCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Benefit Amount"
            content={formatCurrency(scheme.benefit_amount)}
          />
          <FeatureCard
            icon={<CalendarDays className="h-6 w-6" />}
            title="Added On"
            content={formatDate(scheme.created_at)}
          />
          {scheme.last_date_to_apply && (
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Last Date"
              content={formatDate(scheme.last_date_to_apply)}
              highlight={isDeadlineApproaching(scheme.last_date_to_apply)}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Detailed Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scheme.eligibility && (
                <FeatureCard
                  icon={<UserCheck className="h-6 w-6" />}
                  title="Eligibility"
                  content={scheme.eligibility}
                />
              )}
              {scheme.benefits && (
                <FeatureCard
                  icon={<Award className="h-6 w-6" />}
                  title="Benefits"
                  content={scheme.benefits}
                />
              )}
              {scheme.application_process && (
                <FeatureCard
                  icon={<FileCheck className="h-6 w-6" />}
                  title="Application Process"
                  content={scheme.application_process}
                />
              )}
              {scheme.required_documents && (
                <FeatureCard
                  icon={<FileText className="h-6 w-6" />}
                  title="Required Documents"
                  content={scheme.required_documents}
                />
              )}
            </div>

            {/* Full Description */}
            <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: "#F5F5F5", color: "#f87060ff" }}>
                  <Info className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "#102542ff" }}>Detailed Description</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: "#102542ff" }}>
                  {scheme.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Apply Card */}
            <div className="notranslate rounded-2xl shadow-xl p-8 text-white sticky top-8" style={{ background: "linear-gradient(to bottom right, #f87060ff, #e55a4aff)" }}>
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-white bg-opacity-20 mr-4">
                  <Shield className="h-6 w-6" style={{ color: "#f87060ff" }} />
                </div>
                <h2 className="text-2xl font-bold">{labels.applyNow}</h2>
              </div>

              {scheme.status === 'inactive' && (
                <div className="flex items-center p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}>
                  <XCircle className="h-6 w-6 mr-3" style={{ color: "#F5F5F5" }} />
                  <p className="font-medium" style={{ color: "#F5F5F5" }}>{labels.thisSchemeInactive}</p>
                </div>
              )}

              {scheme.status === 'upcoming' && (
                <div className="flex items-center p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}>
                  <Clock className="h-6 w-6 mr-3" style={{ color: "#F5F5F5" }} />
                  <p className="font-medium" style={{ color: "#F5F5F5" }}>{labels.thisSchemeUpcoming}</p>
                </div>
              )}

              {scheme.status === 'active' && isDeadlinePassed(scheme.last_date_to_apply) && (
                <div className="flex items-center p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}>
                  <XCircle className="h-6 w-6 mr-3" style={{ color: "#F5F5F5" }} />
                  <p className="font-medium" style={{ color: "#F5F5F5" }}>{labels.deadlinePassed}</p>
                </div>
              )}

              {/* Check Eligibility Button */}
              <button
                onClick={checkEligibility}
                disabled={checkingEligibility || !scheme || !userProfile}
                className={`w-full flex items-center cursor-pointer justify-center px-6 py-4 rounded-2xl transition-all ${checkingEligibility || !scheme || !userProfile
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-[#f87060ff] hover:bg-[#F5F5F5] hover:scale-[1.02] font-bold shadow-lg'
                  } mb-4`}
              >
                {checkingEligibility ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {labels.checking}
                  </>
                ) : (
                  <>
                    <UserCheck className="h-5 w-5 mr-2" />
                    {labels.checkEligibility}
                  </>
                )}
              </button>

              {/* Eligibility Result */}
              {eligibilityResult && (
                <div className={`notranslate mt-4 mb-4 p-4 rounded-xl ${isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center mb-2">
                    {isEligible ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                    )}
                    <h3 className="font-bold">{labels.eligibilityResult}</h3>
                  </div>
                  <pre className="whitespace-pre-wrap">{eligibilityResult}</pre>
                </div>
              )}

              <button
                onClick={visitOfficialWebsite}
                disabled={scheme.status !== 'active' || isDeadlinePassed(scheme.last_date_to_apply)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl cursor-pointer transition-all ${scheme.status === 'active' && !isDeadlinePassed(scheme.last_date_to_apply)
                  ? 'bg-white text-[#f87060ff] hover:bg-[#F5F5F5] hover:scale-[1.02] font-bold shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <span>{labels.applyOnOfficialWebsite}</span>
                <ChevronRight className="h-5 w-5" />
              </button>

              {scheme.status === 'active' && !isDeadlinePassed(scheme.last_date_to_apply) && (
                <p className="text-sm mt-4 text-center" style={{ color: "#F5F5F5" }}>
                  {labels.redirectMessage}
                </p>
              )}
            </div>

            {/* Contact Information */}
            {scheme.contact_info && (
              <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: "#ffffffff", border: "1px solid #F5F5F5" }}>
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: "#F5F5F5", color: "#f87060ff" }}>
                    <Contact className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: "#102542ff" }}>Contact Info</h2>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: "#F5F5F5" }}>
                  <p className="whitespace-pre-line" style={{ color: "#102542ff" }}>{scheme.contact_info}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}