'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js'; 
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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

export default function CompleteProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  const [user, setUser] = useState<User | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Data states
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [religionCasteData, setReligionCasteData] = useState<ReligionCasteData[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [religions, setReligions] = useState<string[]>([]);
  const [castes, setCastes] = useState<string[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login/citizen');
        return;
      }
      
      setUser(user);
      
      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          village: profile.village || '',
          district: profile.district || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
          religion: profile.religion || '',
          caste: profile.caste || ''
        });
        
        // If state exists, load districts
        if (profile.state) {
          loadDistricts(profile.state);
        }
        
        // If state and religion exist, load castes
        if (profile.state && profile.religion) {
          loadCastes(profile.state, profile.religion);
        }
      }
    };
    
    checkUser();
    
    // Load CSV data
    loadCsvData();
  }, [router]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { 
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
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) { 
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          village: formData.village,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          religion: formData.religion,
          caste: formData.caste
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      router.push('/citizen');
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: "#f87060ff" }}></div>
          <p className="mt-4 text-[#102542ff]">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />
      
      <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#F5F5F5] shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#102542ff]">Complete Your Profile</h1>
            <p className="text-[#102542ff]">Please provide your details to continue</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="Your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="+91 9876543210"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                Village
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="Your village"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
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
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                District
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
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
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                Religion
              </label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
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
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                Caste
              </label>
              <select
                name="caste"
                value={formData.caste}
                onChange={handleChange}
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
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#102542ff]">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff]"
                placeholder="123456"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex cusror-pointer justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#f87060ff] hover:bg-[#e55a4aff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f87060ff] disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}