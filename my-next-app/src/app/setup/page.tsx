
'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

import Navbar from '../components/Navbar';

import Footer from '../components/Footer';



export default function SetupPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    email: '',

    password: '',

    confirmPassword: '',

    full_name: '',

  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const [isAdminExists, setIsAdminExists] = useState(false);



  useEffect(() => {

    checkIfAdminExists();

  }, []);



  const checkIfAdminExists = async () => {

    const { count } = await supabase

      .from('profiles')

      .select('*', { count: 'exact' })

      .eq('role', 'admin');

    

    if (count && count > 0) {

      setIsAdminExists(true);

      router.push('/login/admin');

    }

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



    if (formData.password !== formData.confirmPassword) {

      setError("Passwords don't match");

      setIsLoading(false);

      return;

    }



    try {

      
      const { data, error } = await supabase.auth.signUp({

        email: formData.email,

        password: formData.password,

      });



      if (error) throw error;



      if (data.user) {

        
        const { error: profileError } = await supabase

          .from('profiles')

          .insert({

            id: data.user.id,

            email: data.user.email,

            full_name: formData.full_name,

            role: 'admin',

          });



        if (profileError) throw profileError;



        setSuccess(true);

      }

    } catch (err: any) {

      console.error('Setup error:', err);

      setError(err.message || 'An error occurred during setup');

    } finally {

      setIsLoading(false);

    }

  };



  if (isAdminExists) {

    return (

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">

        <Navbar />

        <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-100 shadow-lg text-center">

            <h1 className="text-3xl font-bold text-amber-900 mb-4">Setup Complete</h1>

            <p className="text-amber-700 mb-6">

              An administrator account already exists. Please log in.

            </p>

            <a 

              href="/login/admin"

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



  if (success) {

    return (

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">

        <Navbar />

        <main className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-100 shadow-lg text-center">

            <h1 className="text-3xl font-bold text-amber-900 mb-4">Setup Successful!</h1>

            <p className="text-amber-700 mb-6">

              Your administrator account has been created. You can now log in.

            </p>

            <a 

              href="/login/admin"

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

            <h1 className="text-3xl font-bold text-amber-900 mb-2">Initial Setup</h1>

            <p className="text-amber-700">Create the first administrator account</p>

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

                placeholder="Administrator Name"

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

                placeholder="admin@example.com"

                required

              />

            </div>



            <div>

              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">

                Password

              </label>

              <input

                type="password"

                id="password"

                name="password"

                value={formData.password}

                onChange={handleInputChange}

                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"

                placeholder="••••••••"

                required

              />

            </div>



            <div>

              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-800 mb-2">

                Confirm Password

              </label>

              <input

                type="password"

                id="confirmPassword"

                name="confirmPassword"

                value={formData.confirmPassword}

                onChange={handleInputChange}

                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"

                placeholder="••••••••"

                required

              />

            </div>



            <div>

              <button

                type="submit"

                disabled={isLoading}

                className="w-full flex justify-center  cusror-pointer py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"

              >

                {isLoading ? 'Creating Account...' : 'Create Admin Account'}

              </button>

            </div>

          </form>

        </div>

      </main>

      <Footer />

    </div>

  );

}
