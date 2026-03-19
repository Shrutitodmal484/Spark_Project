'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Home, MapPin, IdCard, Edit, Save, X } from 'lucide-react';

const COLORS = {
  primary: '#102542ff',
  accent: '#f87060ff',
  white: '#ffffffff',
  lightGray: '#F5F5F5',
  textLight: '#6b7280',
  border: '#e5e7eb',
  lightPrimary: 'rgba(16, 37, 66, 0.1)',
};

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
}

interface ProfileInfoProps {
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export default function ProfileInfo({ userProfile, onUpdateProfile }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [error, setError] = useState('');

  // Update form data when userProfile prop changes
  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(userProfile);
    setError('');
  };

  const handleSaveClick = async () => {
    setIsUpdating(true);
    setError('');

    try {
      // Only send editable fields to update
      const updatedData = {
        full_name: formData.full_name,
        phone: formData.phone,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
      };

      await onUpdateProfile(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border mb-6 sm:mb-8" style={{ borderColor: COLORS.border }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.primary }}>
          Your Profile Information
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <span className="px-3 py-1 rounded-full text-sm font-medium w-full sm:w-auto text-center" 
                style={{ backgroundColor: COLORS.accent, color: COLORS.white }}>
            {userProfile.role}
          </span>
          
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center cusror-pointer px-4 py-2 rounded-xl transition-colors w-full sm:w-auto justify-center"
              style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          ) : (
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={handleCancelClick}
                className="flex items-center cusror-pointer px-4 py-2 rounded-xl transition-colors w-full sm:w-auto justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isUpdating}
                className="flex items-center px-4 py-2 cusror-pointer rounded-xl transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 text-sm" style={{ color: COLORS.accent }}>{error}</div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex items-start">
          <div className="p-3 rounded-lg mr-3 sm:mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.lightPrimary }}>
            <User className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm" style={{ color: COLORS.textLight }}>Full Name</p>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
              />
            ) : (
              <p className="text-base sm:text-lg font-medium truncate" style={{ color: COLORS.primary }}>
                {userProfile.full_name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-3 rounded-lg mr-3 sm:mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.lightPrimary }}>
            <Mail className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm" style={{ color: COLORS.textLight }}>Email Address</p>
            <p className="text-base sm:text-lg font-medium truncate" style={{ color: COLORS.primary }}>
              {userProfile.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-3 rounded-lg mr-3 sm:mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.lightPrimary }}>
            <Phone className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm" style={{ color: COLORS.textLight }}>Phone Number</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
              />
            ) : (
              <p className="text-base sm:text-lg font-medium" style={{ color: COLORS.primary }}>
                {userProfile.phone}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-3 rounded-lg mr-3 sm:mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.lightPrimary }}>
            <Home className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm" style={{ color: COLORS.textLight }}>Village</p>
            {isEditing ? (
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
              />
            ) : (
              <p className="text-base sm:text-lg font-medium truncate" style={{ color: COLORS.primary }}>
                {userProfile.village}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-3 rounded-lg mr-3 sm:mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.lightPrimary }}>
            <MapPin className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm" style={{ color: COLORS.textLight }}>District</p>
            {isEditing ? (
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
              />
            ) : (
              <p className="text-base sm:text-lg font-medium truncate" style={{ color: COLORS.primary }}>
                {userProfile.district}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="p-3 rounded-lg mr-3 sm:mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.lightPrimary }}>
            <IdCard className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm" style={{ color: COLORS.textLight }}>Pincode</p>
            {isEditing ? (
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: COLORS.border }}
              />
            ) : (
              <p className="text-base sm:text-lg font-medium" style={{ color: COLORS.primary }}>
                {userProfile.pincode}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}