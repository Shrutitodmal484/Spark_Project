'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function ProfileSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const profileTypes = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'System administrator with full access to all features and settings',
      image: '/images/profiles/admin.png',
      color: 'bg-red-500',
      hoverColor: 'bg-red-600',
      loginPath: '/login/admin'
    },
    {
      id: 'gramsevak',
      title: 'Gramsevak',
      description: 'Village level worker who assists citizens with government schemes',
      image: '/images/profiles/gramsevak.png',
      color: 'bg-green-500',
      hoverColor: 'bg-green-600',
      loginPath: '/login/gramsevak'
    },
    {
      id: 'citizen',
      title: 'Citizen',
      description: 'Individual user looking to apply for government schemes and benefits',
      image: '/images/profiles/citizen.png',
      color: 'bg-blue-500',
      hoverColor: 'bg-blue-600',
      loginPath: '/login/citizen'
    }
  ];
  
  const handleProfileSelect = (path: string, id: string) => {
    setIsLoading(true);
    setSelectedCard(id);
    router.push(path);
  };
  
  return (
    <div className="notranslate min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#102542ff]">
              Who are <span className="text-[#f87060ff]">you ?</span>
            </h1>
            <p className="text-lg text-[#102542ff]">
              Select your role to access the right features and benefits for your needs
            </p>
          </div>
        </div>
      </section>
      
      {/* Profile Cards */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {profileTypes.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="w-full md:w-80"
            >
              <div 
                role="button"
                tabIndex={0}
                aria-label={`Select ${profile.title} profile`}
                className={`rounded-3xl shadow-lg overflow-hidden  cusror-pointer cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#f87060ff] ${
                  selectedCard === profile.id ? 'bg-gray-100' : 'bg-white'
                }`}
                onClick={() => handleProfileSelect(profile.loginPath, profile.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleProfileSelect(profile.loginPath, profile.id);
                  }
                }}
              >
                {/* Profile Image */}
                <div className="p-8 flex justify-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-[#F5F5F5]">
                    <Image
                      src={profile.image}
                      alt={profile.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={(e) => {
                        // Hide image on error to show fallback
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                
                {/* Profile Details */}
                <div className="px-6 pb-8">
                  <h2 className="text-2xl font-bold text-center mb-3 text-[#102542ff]">
                    {profile.title}
                  </h2>
                  <p className="text-center mb-6 text-[#102542ff]">
                    {profile.description}
                  </p>
                  
                  {/* Continue Button */}
                  <div className="flex justify-center">
                    <button 
                      className="flex items-center px-5 cusror-pointer  py-2.5 font-medium rounded-full transition-colors duration-300 disabled:opacity-50 bg-[#f87060ff] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Help Section */}
        <div className="mt-20 text-center">
          <div className="inline-block rounded-2xl px-8 py-4 bg-[#F5F5F5]">
            <h3 className="text-lg font-semibold mb-2 text-[#102542ff]">Need help choosing?</h3>
            <p className="text-[#102542ff]">
              Contact our support team at <span className="font-medium">support@samriddhi.gov.in</span>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}