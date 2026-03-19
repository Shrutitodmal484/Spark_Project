'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '../src/app/components/Navbar';
import Footer from '../src/app/components/Footer';

interface RegisterPageProps {
  params: Promise<{
    userType: string;
  }>;
}

// Define types for our data
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
  
  // Data states
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [religionCasteData, setReligionCasteData] = useState<ReligionCasteData[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [religions, setReligions] = useState<string[]>([]);
  const [castes, setCastes] = useState<string[]>([]);

  // Load CSV data on component mount
  useEffect(() => {
    loadCsvData();
  }, []);

  // Function to load and parse CSV data
  const loadCsvData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch StateData CSV
      const stateResponse = await fetch('/DATA%20-%20StateData.csv');
      const stateText = await stateResponse.text();
      
      // Fetch ReligionCasteData CSV
      const religionResponse = await fetch('/DATA%20-%20ReligionCasteData.csv');
      const religionText = await religionResponse.text();
      
      // Parse CSV data
      const parseCsv = (csvText: string) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].trim();
          if (currentLine) {
            const values = currentLine.split(',').map(value => value.trim());
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
      const parsedReligionData = parseCsv(religionText) as ReligionCasteData[];
      
      setStateData(parsedStateData);
      setReligionCasteData(parsedReligionData);
      
      // Set available religions (these are the same for all states)
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
    } catch (error) {
      console.error('Error loading CSV data:', error);
      setError('Failed to load required data. Please try again later.');
    } finally {
      setDataLoading(false);
    }
  };

  // Load districts based on selected state
  const loadDistricts = (state: string) => {
    const stateInfo = stateData.find(item => item["State / UT"] === state);
    if (stateInfo) {
      const districtList = stateInfo.Districts.split(',').map(d => d.trim());
      setDistricts(districtList);
    } else {
      setDistricts([]);
    }
  };

  // Load castes based on selected state and religion
  const loadCastes = (state: string, religion: string) => {
    const stateReligionInfo = religionCasteData.find(item => item["State/UT"] === state);
    if (stateReligionInfo && stateReligionInfo[religion as keyof ReligionCasteData]) {
      const casteList = stateReligionInfo[religion as keyof ReligionCasteData]
        .toString()
        .split(',')
        .map(c => c.trim());
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
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle dependent dropdowns
    if (name === 'state') {
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        state: value, 
        district: '', 
        religion: '', 
        caste: '' 
      }));
      
      // Load districts for the selected state
      loadDistricts(value);
      setCastes([]); // Reset castes
    } 
    else if (name === 'religion') {
      // Reset caste
      setFormData(prev => ({ ...prev, religion: value, caste: '' }));
      
      // Load castes for the selected state and religion
      if (formData.state && value) {
        loadCastes(formData.state, value);
      }
    }
    
    if (error) setError(null);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords don't match");
    setIsLoading(false);
    return;
  }
  
  try {
    // Register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      // For admin and gramsevak users, create a pending approval
      if (userType === 'admin' || userType === 'gramsevak') {
        const { error: pendingError } = await supabase
          .from('pending_approvals')
          .insert({
            user_id: data.user.id,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            village: formData.village,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            religion: formData.religion,
            caste: formData.caste,
            status: 'pending',
            role: userType
          });
        
        if (pendingError) {
          throw pendingError;
        }
        
        setSuccess(true);
        return;
      }
      
      // For citizen users, use upsert to handle existing profiles
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
          religion: formData.religion,
          caste: formData.caste
        }, {
          onConflict: 'id' // Update if ID already exists
        });
      
      if (profileError) {
        throw profileError;
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700">Loading data...</p>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-100 shadow-lg text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Registration Successful!</h1>
            <p className="text-amber-700 mb-6">
              {userType === 'admin' || userType === 'gramsevak'
                ? 'Your account request has been submitted for approval. You will receive an email once your account is approved.'
                : 'Your account has been created. Please check your email to verify your account.'}
            </p>
            <a 
              href={`/login/${userType}`}
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-100 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">{getUserTitle()} Registration</h1>
            <p className="text-amber-700">Create a new {userType} account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-amber-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="+91 9876543210"
                required
              />
            </div>
            
            <div>
              <label htmlFor="village" className="block text-sm font-medium text-amber-800 mb-2">
                Village
              </label>
              <input
                type="text"
                id="village"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Your village"
                required
              />
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-amber-800 mb-2">
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              <label htmlFor="district" className="block text-sm font-medium text-amber-800 mb-2">
                District
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            
            <div>
              <label htmlFor="religion" className="block text-sm font-medium text-amber-800 mb-2">
                Religion
              </label>
              <select
                id="religion"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              <label htmlFor="caste" className="block text-sm font-medium text-amber-800 mb-2">
                Caste
              </label>
              <select
                id="caste"
                name="caste"
                value={formData.caste}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-amber-800 mb-2">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="123456"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 cusror-pointer flex items-center text-amber-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-800 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 cusror-pointer right-0 pr-3 flex items-center text-amber-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cusror-pointer  cusror-pointer  flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-700">
              Already have an account?{' '}
              <a href={`/login/${userType}`} className="font-medium text-amber-600 hover:text-amber-500">
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