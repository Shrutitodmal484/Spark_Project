'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  LogOut,
  Search,
  MapPin,
  User,
  Phone,
  Mail,
  Hash,
  Trash2,
  FileText,
  Award,
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pincode: string;
  village?: string;
  district?: string;
  state?: string;
  role: string;
  created_at: string;
  updated_at: string;
  religion?: string;
  caste?: string;
}

export default function GramsevakDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [gramsevakProfile, setGramsevakProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('myProfile');
  const [pincode, setPincode] = useState('');
  const [searchedPincodes, setSearchedPincodes] = useState<string[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login/gramsevak');
        return;
      }
      
      // Get gramsevak profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile?.role !== 'gramsevak') {
        router.push('/unauthorized');
        return;
      }
      
      setUser(user);
      setGramsevakProfile(profile);
      loadSearchedPincodes();
      
      // By default, search for users in gramsevak's pincode
      if (profile.pincode) {
        setPincode(profile.pincode);
        searchUsersByPincode(profile.pincode);
      }
    };
    
    checkUser();
  }, [router]);
  
  // Load previously searched pincodes from cookies
  const loadSearchedPincodes = () => {
    if (typeof window !== 'undefined') {
      const savedPincodes = document.cookie
        .split('; ')
        .find(row => row.startsWith('searchedPincodes='));
      
      if (savedPincodes) {
        try {
          const pincodes = JSON.parse(decodeURIComponent(savedPincodes.split('=')[1]));
          setSearchedPincodes(pincodes);
        } catch (e) {
          console.error('Error parsing pincodes from cookie:', e);
        }
      }
    }
  };
  
  // Save searched pincode to cookie
  const savePincodeToCookie = (newPincode: string) => {
    if (typeof window === 'undefined') return;
    
    // Update state
    let updatedPincodes = [newPincode];
    
    // Add existing pincodes, avoiding duplicates
    searchedPincodes.forEach(pin => {
      if (pin !== newPincode) {
        updatedPincodes.push(pin);
      }
    });
    
    // Keep only the last 5 pincodes
    if (updatedPincodes.length > 5) {
      updatedPincodes = updatedPincodes.slice(0, 5);
    }
    
    setSearchedPincodes(updatedPincodes);
    
    // Save to cookie (expires in 30 days)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `searchedPincodes=${encodeURIComponent(JSON.stringify(updatedPincodes))}; expires=${expires.toUTCString()}; path=/`;
  };
  
  // Clear pincode history from cookies and state
  const clearPincodeHistory = () => {
    if (typeof window === 'undefined') return;
    
    // Clear the cookie by setting expiration to the past
    document.cookie = 'searchedPincodes=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear the state
    setSearchedPincodes([]);
  };
  
  // Search for users by pincode
  const searchUsersByPincode = async (searchPincode: string) => {
    if (!searchPincode.trim()) {
      setError('Please enter a pincode');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('pincode', searchPincode)
        .eq('role', 'citizen');
      
      if (error) {
        setError('Error fetching users. Please try again.');
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
        savePincodeToCookie(searchPincode);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsersByPincode(pincode);
  };
  
  const handlePincodeClick = (clickedPincode: string) => {
    setPincode(clickedPincode);
    searchUsersByPincode(clickedPincode);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Profile editing functions
  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({ ...gramsevakProfile! });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSaveClick = async () => {
    if (!editForm) return;

    setProfileLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          religion: editForm.religion,
          caste: editForm.caste,
        })
        .eq('id', user.id);

      if (error) {
        setError('Failed to update profile. Please try again.');
        console.error('Error updating profile:', error);
      } else {
        // Update the local state
        setGramsevakProfile(editForm);
        setIsEditing(false);
        setEditForm(null);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setProfileLoading(false);
    }
  };
  
  if (!user) {
    return <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f87060ff]"></div>
    </div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#102542ff]">Gramsevak Dashboard</h1>
            <p className="text-[#6b7280]">Manage users and schemes</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center cusror-pointer  px-4 py-2 rounded-2xl transition-colors w-full sm:w-auto justify-center bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap border-b border-[#e5e7eb] mb-6">
          <button
            className={`px-4 py-2 font-medium cusror-pointer  text-sm sm:text-base transition-colors ${
              activeTab === 'myProfile' 
                ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
                : 'text-[#6b7280] hover:text-[#102542ff]'
            }`}
            onClick={() => setActiveTab('myProfile')}
          >
            My Profile
          </button>
          <button
            className={`px-4 py-2 font-medium  cusror-pointer text-sm sm:text-base transition-colors ${
              activeTab === 'usersByPincode' 
                ? 'text-[#f87060ff] border-b-2 border-[#f87060ff]' 
                : 'text-[#6b7280] hover:text-[#102542ff]'
            }`}
            onClick={() => setActiveTab('usersByPincode')}
          >
            Users by Pincode
          </button>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-[#e5e7eb]">
          {/* My Profile Tab */}
          {activeTab === 'myProfile' && gramsevakProfile && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#102542ff]">My Profile</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="flex cusror-pointer  items-center px-4 py-2 rounded-xl transition-colors bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelClick}
                      className="flex items-center cusror-pointer  px-4 py-2 rounded-xl transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveClick}
                      disabled={profileLoading}
                      className="flex items-center cusror-pointer  px-4 py-2 rounded-xl transition-colors disabled:opacity-50 bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {profileLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mb-4 text-sm text-[#f87060ff]">{error}</div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6 bg-[rgba(16,37,66,0.05)]">
                  <h3 className="text-lg font-medium text-[#102542ff] mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#f87060ff]" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#6b7280]">Full Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="full_name"
                          value={editForm?.full_name || ''}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#f87060ff] border-[#e5e7eb] text-[#102542ff]"
                        />
                      ) : (
                        <p className="font-medium text-[#102542ff]">{gramsevakProfile.full_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Email</p>
                      <p className="font-medium text-[#102542ff]">{gramsevakProfile.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={editForm?.phone || ''}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#f87060ff] border-[#e5e7eb] text-[#102542ff]"
                        />
                      ) : (
                        <p className="font-medium text-[#102542ff]">{gramsevakProfile.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Role</p>
                      <p className="font-medium text-[#102542ff] capitalize">{gramsevakProfile.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl p-6 bg-[rgba(16,37,66,0.05)]">
                  <h3 className="text-lg font-medium text-[#102542ff] mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-[#f87060ff]" />
                    Location Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#6b7280]">Village</p>
                      <p className="font-medium text-[#102542ff]">{gramsevakProfile.village || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">District</p>
                      <p className="font-medium text-[#102542ff]">{gramsevakProfile.district || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">State</p>
                      <p className="font-medium text-[#102542ff]">{gramsevakProfile.state || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Pincode</p>
                      <p className="font-medium text-[#102542ff]">{gramsevakProfile.pincode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl p-6 bg-[rgba(16,37,66,0.05)]">
                  <h3 className="text-lg font-medium text-[#102542ff] mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-[#f87060ff]" />
                    Account Status
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#6b7280]">Status</p>
                      <p className="font-medium text-[#102542ff]">Active</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280] flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-[#f87060ff]" />
                        Member Since
                      </p>
                      <p className="font-medium text-[#102542ff]">
                        {new Date(gramsevakProfile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Last Updated</p>
                      <p className="font-medium text-[#102542ff]">
                        {new Date(gramsevakProfile.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl p-6 bg-[rgba(16,37,66,0.05)]">
                  <h3 className="text-lg font-medium text-[#102542ff] mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-[#f87060ff]" />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#6b7280]">Account ID</p>
                      <p className="font-medium text-[#102542ff] text-sm">{gramsevakProfile.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Religion</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="religion"
                          value={editForm?.religion || ''}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#f87060ff] border-[#e5e7eb] text-[#102542ff]"
                        />
                      ) : (
                        <p className="font-medium text-[#102542ff]">{gramsevakProfile.religion || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#6b7280]">Caste</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="caste"
                          value={editForm?.caste || ''}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#f87060ff] border-[#e5e7eb] text-[#102542ff]"
                        />
                      ) : (
                        <p className="font-medium text-[#102542ff]">{gramsevakProfile.caste || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Users by Pincode Tab */}
          {activeTab === 'usersByPincode' && (
            <div>
              <h2 className="text-xl sm:text-2xl rounded-2xl font-bold text-[#102542ff] mb-4">Search Users by Pincode</h2>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-[#6b7280]" />
                    </div>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter pincode..."
                      className="block w-full pl-10 pr-3 py-2 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#f87060ff] border-[#e5e7eb] text-[#102542ff]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center  cusror-pointer px-4 py-2 rounded-xl transition-colors disabled:opacity-50 w-full sm:w-auto justify-center bg-[#f87060ff] text-white hover:bg-[#e55a4aff]"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-2 text-sm text-[#f87060ff]">{error}</div>
                )}
              </form>
              
              {/* Previously Searched Pincodes */}
              {searchedPincodes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-[#102542ff]">Recently Searched Pincodes</h3>
                    <button
                      onClick={clearPincodeHistory}
                      className="flex items-center cusror-pointer  text-sm text-[#6b7280] hover:text-[#102542ff] transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchedPincodes.map((code, index) => (
                      <button
                        key={index}
                        onClick={() => handlePincodeClick(code)}
                        className="flex  cusror-pointer items-center px-3 py-1.5 rounded-lg transition-colors bg-[rgba(16,37,66,0.05)] text-[#102542ff] hover:bg-[rgba(16,37,66,0.1)]"
                      >
                        <Hash className="h-4 w-4 mr-1" />
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Users List */}
              {users.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium text-[#102542ff] mb-4">
                    Users in Pincode: {pincode} ({users.length} found)
                  </h3>
                  
                  <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
                    <table className="min-w-full divide-y divide-[#e5e7eb]">
                      <thead className="bg-[rgba(16,37,66,0.05)]">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Name</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Contact</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Location</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Member Since</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#e5e7eb]">
                        {users.map((profile) => (
                          <tr key={profile.id} className="hover:bg-[rgba(16,37,66,0.05)] transition-colors">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-[rgba(16,37,66,0.05)]">
                                  <User className="h-5 w-5 text-[#f87060ff]" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-[#102542ff]">{profile.full_name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#6b7280] flex items-center mb-1">
                                <Mail className="h-4 w-4 mr-1 text-[#f87060ff]" />
                                <span className="truncate max-w-xs">{profile.email}</span>
                              </div>
                              <div className="text-sm text-[#6b7280] flex items-center">
                                <Phone className="h-4 w-4 mr-1 text-[#f87060ff]" />
                                {profile.phone}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#6b7280]">
                                {profile.village && <div className="font-medium text-[#102542ff]">{profile.village}</div>}
                                {profile.district && <div className="text-xs">{profile.district}</div>}
                                {profile.state && <div className="text-xs">{profile.state}</div>}
                                <div className="text-xs font-semibold mt-1 text-[#f87060ff]">{profile.pincode}</div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-[#f87060ff]" />
                                {new Date(profile.created_at).toLocaleDateString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                pincode && !loading && !error && (
                  <div className="rounded-lg p-8 text-center bg-[rgba(16,37,66,0.05)]">
                    <p className="text-[#6b7280]">No users found for pincode: {pincode}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}