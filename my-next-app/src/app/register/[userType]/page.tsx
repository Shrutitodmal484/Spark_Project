'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface RegisterPageProps {
  params: Promise<{
    userType: string;
  }>;
}

interface StateData {
  "State / UT": string;
  Districts: string;
}

interface ReligionCasteData {
  "State/UT": string;
  "Hindu Communities": string;
  "Muslim Communities": string;
  "Christian Communities": string;
  "Sikh Communities": string;
  "Buddhist Communities": string;
  "Jain Communities": string;
  "Other Religions & Tribal Faiths": string;
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const { userType } = React.use(params);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    religion: '',
    caste: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [religionCasteData, setReligionCasteData] = useState<ReligionCasteData[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [religions, setReligions] = useState<string[]>([]);
  const [castes, setCastes] = useState<string[]>([]);
  
  const isCitizen = userType === 'citizen';
  
  useEffect(() => {
    loadCsvData();
  }, []);
  
  const loadCsvData = async () => {
    try {
      setDataLoading(true);
      
      const stateResponse = await fetch('/DATA%20-%20StateData.csv');
      if (!stateResponse.ok) throw new Error('Failed to load state data');
      const stateText = await stateResponse.text();
      
      if (!stateText || stateText.trim().length === 0) {
        throw new Error('State data is empty');
      }
      
      let religionText = '';
      if (isCitizen) {
        const religionResponse = await fetch('/DATA%20-%20ReligionCasteData.csv');
        if (!religionResponse.ok) throw new Error('Failed to load religion data');
        religionText = await religionResponse.text();
      }
      
      const parseCsv = (csvText: string) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].trim();
          if (currentLine) {
            const values: string[] = [];
            let currentValue = '';
            let inQuotes = false;
            
            for (let j = 0; j < currentLine.length; j++) {
              const char = currentLine[j];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
              } else {
                currentValue += char;
              }
            }
            values.push(currentValue.trim());
            
            const obj: any = {};
            for (let j = 0; j < headers.length; j++) {
              obj[headers[j]] = values[j] || '';
            }
            
            result.push(obj);
          }
        }
        
        return result;
      };
      
      const parsedStateData = parseCsv(stateText) as StateData[];
      setStateData(parsedStateData);
      
      if (isCitizen && religionText) {
        const parsedReligionData = parseCsv(religionText) as ReligionCasteData[];
        setReligionCasteData(parsedReligionData);
        
        if (parsedReligionData.length > 0) {
          const firstRow = parsedReligionData[0];
          const availableReligions = [
            "Hindu Communities",
            "Muslim Communities", 
            "Christian Communities",
            "Sikh Communities",
            "Buddhist Communities",
            "Jain Communities",
            "Other Religions & Tribal Faiths"
          ].filter(religion => firstRow[religion as keyof ReligionCasteData] !== undefined);
          
          setReligions(availableReligions);
        }
      }
    } catch (error) {
      console.error('Error loading CSV data:', error);
      setError('Failed to load required data. Please try again later.');
    } finally {
      setDataLoading(false);
    }
  };
  
  const loadDistricts = (state: string) => {
    const stateInfo = stateData.find(item => item["State / UT"] === state);
    if (stateInfo) {
      const districtList = stateInfo.Districts
        .split(',')
        .map(district => district.trim())
        .filter(district => district.length > 0);
      
      setDistricts(districtList);
    } else {
      setDistricts([]);
    }
  };
  
  const loadCastes = (state: string, religion: string) => {
    const stateReligionInfo = religionCasteData.find(item => item["State/UT"] === state);
    if (stateReligionInfo && stateReligionInfo[religion as keyof ReligionCasteData]) {
      const casteString = stateReligionInfo[religion as keyof ReligionCasteData].toString();
      
      const casteList = casteString
        .split(',')
        .map(caste => caste.trim())
        .filter(caste => caste.length > 0);
      
      setCastes(casteList);
    } else {
      setCastes([]);
    }
  };
  
  const getUserTitle = () => {
    switch(userType) {
      case 'admin': return 'Admin';
      case 'gramsevak': return 'Gramsevak';
      case 'citizen': return 'Citizen';
      default: return 'User';
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'state') {
      setFormData(prev => ({ 
        ...prev, 
        state: value, 
        district: '', 
        religion: '', 
        caste: '' 
      }));
      
      if (value) {
        loadDistricts(value);
      } else {
        setDistricts([]);
      }
      setCastes([]);
    } 
    else if (name === 'religion') {
      setFormData(prev => ({ ...prev, religion: value, caste: '' }));
      
      if (formData.state && value) {
        loadCastes(formData.state, value);
      } else {
        setCastes([]);
      }
    }
    
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      setIsLoading(false);
      return;
    }
    
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      setIsLoading(false);
      return;
    }
    
    if (isCitizen && (!formData.religion || !formData.caste)) {
      setError("Please provide both religion and caste information");
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            village: formData.village,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            role: userType,
            ...(isCitizen && {
              religion: formData.religion,
              caste: formData.caste
            })
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: formData.full_name,
            phone: formData.phone,
            role: userType,
            village: formData.village,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            status: userType === 'citizen' ? 'approved' : 'pending',
            ...(isCitizen && {
              religion: formData.religion,
              caste: formData.caste
            })
          }, { onConflict: 'id' });
        
        if (profileError) throw profileError;
        
        if (userType !== 'citizen') {
          const { error: pendingError } = await supabase
            .from('pending_approvals')
            .upsert({
              user_id: data.user.id,
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              village: formData.village,
              district: formData.district,
              state: formData.state,
              pincode: formData.pincode,
              status: 'pending',
              role: userType,
              ...(isCitizen && {
                religion: formData.religion,
                caste: formData.caste
              })
            }, { onConflict: 'user_id' });
          
          if (pendingError) throw pendingError;
        }
        
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: "#f87060ff" }}></div>
          <p className="mt-4" style={{ color: "#102542ff" }}>Loading data...</p>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
        <Navbar />
        <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#F5F5F5] shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: "#102542ff" }}>Registration Successful!</h1>
            <p className="mb-6" style={{ color: "#102542ff" }}>
              {userType === 'admin' || userType === 'gramsevak'
                ? 'Your account request has been submitted for approval. You will receive an email once your account is approved.'
                : 'Your account has been created. Please check your email to verify your account.'}
            </p>
            <a
              href={`/login/${userType}`}
              className="inline-block px-6 py-3 rounded-xl transition-colors"
              style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
            >
              Go to Login
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />
      <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#F5F5F5] shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#102542ff" }}>{getUserTitle()} Registration</h1>
            <p style={{ color: "#102542ff" }}>Create a new {userType} account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="+91 9876543210"
                required
              />
            </div>
            
            <div>
              <label htmlFor="village" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Village
              </label>
              <input
                type="text"
                id="village"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="Your village"
                required
              />
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                required
              >
                <option value="">Select State</option>
                {stateData.map((state, index) => (
                  <option key={index} value={state["State / UT"]}>
                    {state["State / UT"]}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="district" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                District
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                required
                disabled={!formData.state}
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            
            {isCitizen && (
              <>
                <div>
                  <label htmlFor="religion" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                    Religion
                  </label>
                  <select
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">Select Religion</option>
                    {religions.map((religion, index) => (
                      <option key={index} value={religion}>
                        {religion}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="caste" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                    Caste
                  </label>
                  <select
                    id="caste"
                    name="caste"
                    value={formData.caste}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                    required
                    disabled={!formData.religion}
                  >
                    <option value="">Select Caste</option>
                    {castes.map((caste, index) => (
                      <option key={index} value={caste}>
                        {caste}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="123456"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 cusror-pointer  right-0 pr-3 flex items-center"
                  style={{ color: "#f87060ff" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 cusror-pointer  right-0 pr-3 flex items-center"
                  style={{ color: "#f87060ff" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex  cusror-pointer justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#f87060ff] hover:bg-[#e55a4aff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f87060ff] disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "#102542ff" }}>
              Already have an account?{' '}
              <a href={`/login/${userType}`} className="font-medium hover:opacity-80 transition-opacity" style={{ color: "#f87060ff" }}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main> 
      <Footer />
    </div>
  );
}