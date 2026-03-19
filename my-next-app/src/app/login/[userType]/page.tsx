'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface LoginPageProps {
  params: Promise<{
    userType: string;
  }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  // Unwrap the params promise with React.use()
  const { userType } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for error in URL parameters
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam === 'unauthorized') {
      setError('You are not authorized to access this page');
    } else if (errorParam === 'auth') {
      setError('Authentication error. Please try again');
    }
  }, [searchParams]);
  
  const getUserTitle = () => {
    switch(userType) {
      case 'admin': return 'Admin';
      case 'gramsevak': return 'Gramsevak';
      case 'citizen': return 'Citizen';
      default: return 'User';
    }
  };
  
  const getRegisterPath = () => {
    return `/register/${userType}`;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (authError) {
        throw authError;
      }
      
      if (data.user) {
        // First check if user exists in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        // If profile doesn't exist, check pending_approvals table
        if (profileError) {
          const { data: pending, error: pendingError } = await supabase
            .from('pending_approvals')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
          
          if (pendingError || !pending) {
            await supabase.auth.signOut();
            throw new Error('Your account is not registered properly');
          }
          
          // Check if pending approval is for the correct user type
          if (pending.role !== userType) {
            await supabase.auth.signOut();
            throw new Error(`You are not authorized to access the ${userType} dashboard`);
          }
          
          // Check if pending approval is approved
          if (pending.status !== 'approved') {
            await supabase.auth.signOut();
            throw new Error(`Your account is ${pending.status}. Please wait for approval.`);
          }
          
          // If we get here, the user is approved but doesn't have a profile yet
          // Create the profile now
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: pending.full_name,
              email: pending.email,
              phone: pending.phone,
              role: pending.role,
              village: pending.village,
              district: pending.district,
              state: pending.state,
              pincode: pending.pincode,
              religion: pending.religion,
              caste: pending.caste,
              status: 'approved'
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            // Even if profile creation fails, we can still allow login if they're approved
            // But we should log the error for debugging
          }
          
          // Now proceed with login flow
          if (userType === 'citizen') {
            router.push('/citizen/complete-profile');
          } else if (userType === 'admin') {
            router.push('/admin');
          } else if (userType === 'gramsevak') {
            router.push('/gramsevak');
          }
          return;
        }
        
        // If profile exists, check role and status
        if (profile.role !== userType) {
          await supabase.auth.signOut();
          throw new Error(`You are not authorized to access the ${userType} dashboard`);
        }
        
        if (profile.status !== 'approved') {
          await supabase.auth.signOut();
          throw new Error(`Your account has been ${profile.status}. Please contact the administrator.`);
        }
        
        // For citizen users, check if profile is complete
        if (userType === 'citizen') {
          const isProfileComplete = profile.full_name && 
                                   profile.phone && 
                                   profile.village && 
                                   profile.district && 
                                   profile.state && 
                                   profile.pincode;
          
          if (!isProfileComplete) {
            router.push('/citizen/complete-profile');
            return;
          }
          
          router.push('/citizen');
          return;
        }
        
        // For admin and gramsevak users, redirect to their dashboards
        if (userType === 'admin') {
          router.push('/admin');
        } else if (userType === 'gramsevak') {
          router.push('/gramsevak');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />
      <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-[#F5F5F5] shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#102542ff] mb-2">{getUserTitle()} Login</h1>
            <p className="text-[#102542ff]">Enter your credentials to access your account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#102542ff] mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-[#102542ff] mb-2">
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
                  className="absolute  cusror-pointer inset-y-0 right-0 pr-3 flex items-center text-[#f87060ff]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 focus:ring-[#f87060ff] border-[#F5F5F5] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#102542ff]">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#f87060ff] hover:text-[#e55a4aff]">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex  cusror-pointer justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#f87060ff] hover:bg-[#e55a4aff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f87060ff] disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#102542ff]">
              Don't have an account?{' '}
              <a href={getRegisterPath()} className="font-medium text-[#f87060ff] hover:text-[#e55a4aff]">
                Create new account
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}