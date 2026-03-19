'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Calendar
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pincode: string;
  village?: string;
  district?: string;
  state?: string;
  role: 'citizen' | 'gramsevak' | 'admin';
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PendingApproval {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  village?: string;
  district?: string;
  state?: string;
  pincode: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  role: string;
  religion?: string;
  caste?: string;
}

interface UserListProps {
  userType: 'citizen' | 'gramsevak' | 'admin';
  refreshStats?: () => void;
}

export default function UserList({ userType, refreshStats }: UserListProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUsers();
    fetchPendingApprovals();
  }, [userType]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', userType)
        .order('created_at', { ascending: false });
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPendingApprovals = async () => {
    try {
      const { data } = await supabase
        .from('pending_approvals')
        .select('*')
        .eq('role', userType)
        .order('created_at', { ascending: false });
      
      setPendingApprovals(data || []);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };
  
const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'delete') => {
  setActionLoading(userId);
  
  try {
    if (action === 'delete') {
      // Step 1: Delete all dependent records in correct order
      // Delete from user_schemes first
      const { error: schemesError } = await supabase
        .from('user_schemes')
        .delete()
        .eq('user_id', userId);
      
      if (schemesError) {
        console.error('Error deleting user schemes:', schemesError);
      }
      
      // Delete extracted_document_data
      const { error: extractedDataError } = await supabase
        .from('extracted_document_data')
        .delete()
        .eq('user_id', userId);
      
      if (extractedDataError) {
        console.error('Error deleting extracted document data:', extractedDataError);
      }
      
      // Delete documents
      const { error: documentsError } = await supabase
        .from('documents')
        .delete()
        .eq('user_id', userId);
      
      if (documentsError) {
        console.error('Error deleting documents:', documentsError);
      }
      
      // Step 2: Delete from pending_approvals
      const { error: pendingError } = await supabase
        .from('pending_approvals')
        .delete()
        .eq('user_id', userId);
      
      if (pendingError) {
        console.error('Error deleting pending approval:', pendingError);
      }
      
      // Step 3: Delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw new Error(`Failed to delete profile: ${profileError.message}`);
      }
      
      // Step 4: Delete the auth user
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-auth-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ userId })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error deleting auth user:', errorData);
          alert('User profile deleted successfully, but there was an error deleting the authentication record. Please contact support.');
        }
      } catch (error: unknown) {
        console.error('Error calling delete-auth-user function:', error);
        alert('User profile deleted successfully, but there was an error deleting the authentication record. Please contact support.');
      }
    } else {
      // Update user status in profiles
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      // If profile doesn't exist, we need to create it
      if (profileUpdateError && profileUpdateError.code === 'PGRST116') {
        // Get user details from pending_approvals
        const pendingUser = pendingApprovals.find(p => p.user_id === userId);
        
        if (pendingUser) {
          // Add user to profiles
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: pendingUser.full_name,
              email: pendingUser.email,
              phone: pendingUser.phone,
              role: pendingUser.role,
              village: pendingUser.village,
              district: pendingUser.district,
              state: pendingUser.state,
              pincode: pendingUser.pincode,
              religion: pendingUser.religion,
              caste: pendingUser.caste,
              status: action === 'approve' ? 'approved' : 'rejected'
            });
          
          if (insertError) throw insertError;
        }
      } else if (profileUpdateError) {
        throw profileUpdateError;
      }
      
      // Also update status in pending_approvals if exists
      await supabase
        .from('pending_approvals')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }
    
    // Refresh the lists
    fetchUsers();
    fetchPendingApprovals();
    
    // Refresh stats if callback provided
    if (refreshStats) refreshStats();
    
  } catch (error: unknown) {
    console.error(`Error ${action}ing user:`, error);
    
    // Handle the error safely
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    alert(`Failed to ${action} user: ${errorMessage}`);
  } finally {
    setActionLoading(null);
  }
};

  
  // Combine users and pending approvals for display
  const combinedUsers = users.map(user => {
    const pending = pendingApprovals.find(p => p.user_id === user.id);
    return {
      ...user,
      status: user.status || (pending ? pending.status : 'pending')
    };
  });
  
  // Add pending approvals that aren't in the users list
  pendingApprovals.forEach(pending => {
    if (!users.some(user => user.id === pending.user_id)) {
      combinedUsers.push({
        id: pending.user_id || pending.id,
        full_name: pending.full_name,
        email: pending.email,
        phone: pending.phone,
        pincode: pending.pincode,
        village: pending.village,
        district: pending.district,
        state: pending.state,
        role: pending.role as 'citizen' | 'gramsevak' | 'admin',
        created_at: pending.created_at,
        status: pending.status
      });
    }
  });
  
  // Check if we should show location column (not for admin users)
  const showLocationColumn = userType !== 'admin';
  
  return (
    <div className="bg-white">
      <h2 className="text-xl sm:text-2xl font-bold text-[#102542ff] mb-4">
        {userType === 'citizen' ? 'Citizens' : userType === 'gramsevak' ? 'Gramsevaks' : 'Admins'} ({combinedUsers.length})
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#6b7280]">Loading {userType}s...</p>
        </div>
      ) : combinedUsers.length === 0 ? (
        <div className="bg-[rgba(16,37,66,0.05)] rounded-xl p-8 text-center">
          <p className="text-[#6b7280]">No {userType}s found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb]">
          <table className="min-w-full divide-y divide-[#e5e7eb]">
            <thead className="bg-[rgba(16,37,66,0.05)]">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Contact</th>
                {showLocationColumn && (
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Location</th>
                )}
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Member Since</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#102542ff] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {combinedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[rgba(16,37,66,0.05)] transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[rgba(16,37,66,0.05)] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#f87060ff]" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#102542ff]">{user.full_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280] flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-1 text-[#f87060ff]" />
                      <span className="truncate max-w-xs">{user.email}</span>
                    </div>
                    <div className="text-sm text-[#6b7280] flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-[#f87060ff]" />
                      {user.phone}
                    </div>
                  </td>
                  {showLocationColumn && (
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6b7280]">
                        {user.village && <div className="font-medium text-[#102542ff]">{user.village}</div>}
                        {user.district && <div className="text-xs">{user.district}</div>}
                        {user.state && <div className="text-xs">{user.state}</div>}
                        <div className="text-xs font-semibold text-[#f87060ff] mt-1">{user.pincode}</div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-[#f87060ff]" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'approved' ? 'bg-[rgba(16,150,90,0.1)] text-[#10965a]' : 
                      user.status === 'rejected' ? 'bg-[rgba(248,112,96,0.1)] text-[#f87060ff]' :
                      'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]'
                    }`}>
                      {user.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                    {user.status !== 'approved' && (
                      <button 
                        className="text-[#10965a] cusror-pointer hover:text-[#0d7a48] mr-2 flex items-center transition-colors"
                        onClick={() => handleUserAction(user.id, 'approve')}
                        disabled={actionLoading === user.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                    )}
                    {user.status !== 'rejected' && (
                      <button 
                        className="text-[#f87060ff] cursor-pointer hover:text-[#e55a4aff] mr-2 flex items-center transition-colors"
                        onClick={() => handleUserAction(user.id, 'reject')}
                        disabled={actionLoading === user.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    )}
                    <button 
                      className="text-[#6b7280] cursor-pointer hover:text-[#f87060ff] flex items-center transition-colors"
                      onClick={() => handleUserAction(user.id, 'delete')}
                      disabled={actionLoading === user.id}
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