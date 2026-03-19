"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight, Users, FileText, MessageSquare, CheckCircle, Star, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Update the image titles and descriptions to match the new prompts
  const imageTitles = [
    "Rural Empowerment",
    "Urban Development",
    "Education & Youth",
    "Healthcare Access",
    "Cultural Integration"
  ];
  const imageDescriptions = [
    "Transforming villages through agricultural schemes and digital inclusion",
    "Building smart cities while preserving our rich heritage",
    "Empowering youth with education and digital learning",
    "Bringing quality healthcare to every corner of India",
    "Uniting diverse communities through inclusive development"
  ];
  const images = Array.from({ length: 5 }, (_, i) => `/images/hero-section/${i + 1}.png`);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);
  
  return (
    <section className="relative min-h-screen text-gray-800 overflow-hidden bg-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMxMDI1NDIiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMCA2MEw2MCAwTTYwIDYwTCA2MCIvPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full border border-[#f87060ff]/30"
                style={{ backgroundColor: "rgba(248, 112, 96, 0.05)" }}
              >
                <Sparkles className="h-5 w-5 mr-2 text-[#f87060ff]" />
                <span className="text-sm font-medium text-[#f87060ff]">Government Benefits Portal</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Access <span className="text-[#f87060ff] relative">
                  Government Schemes
                </span> with Ease
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-lg md:text-xl max-w-xl text-[#102542ff]/80"
              >
                Discover and apply for government benefits tailored to your needs. Join thousands who have already benefited from our platform.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-row gap-3 w-full"
            >
              <Link href="/schemes" className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 font-semibold rounded-2xl flex items-center justify-center group bg-gradient-to-r from-[#f87060ff] to-[#f87060ff]/90 shadow-lg shadow-[#f87060ff]/20 transition-all duration-300 text-white text-sm sm:text-base sm:px-6 sm:py-4"
                >
                  <span className="truncate">Explore Schemes</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </motion.button>
              </Link>
              
              <Link href="/profile-selection" className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center group bg-white border-2 border-[#f87060ff] text-[#f87060ff] hover:bg-[#f87060ff] hover:text-white shadow-sm text-sm sm:text-base sm:px-6 sm:py-4"
                >
                  <span className="truncate">Go to Dashboard</span>
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-6"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-white border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#102542ff]">19k+</div>
                <div className="text-xs sm:text-sm text-[#102542ff]/70">Users</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-white border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#102542ff]">800+</div>
                <div className="text-xs sm:text-sm text-[#102542ff]/70">Schemes</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-white border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#102542ff]">4800+</div>
                <div className="text-xs sm:text-sm text-[#102542ff]/70">Resolved</div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square w-full max-w-lg mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-md">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`absolute inset-0 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                  initial={{ scale: 1.05 }}
                  animate={{ 
                    scale: index === currentImageIndex ? 1 : 1.05,
                    opacity: index === currentImageIndex ? 1 : 0
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <Image
                    src={image}
                    alt={imageTitles[index]}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </motion.div>
              ))}
              
              {/* Image indicators */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-full transition-all ${index === currentImageIndex ? 'w-8' : 'w-2 h-2'}`}
                    style={{
                      height: index === currentImageIndex ? "0.5rem" : "0.5rem",
                      backgroundColor: index === currentImageIndex ? "#f87060ff" : "rgba(255, 255, 255, 0.5)"
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`View ${imageTitles[index]}`}
                  />
                ))}
              </div>
              
              {/* Image title and description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-4 left-4 right-16 px-4 py-3 rounded-xl backdrop-blur-md bg-black/40 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white">{imageTitles[currentImageIndex]}</h3>
                <p className="text-sm text-white/90 line-clamp-2">{imageDescriptions[currentImageIndex]}</p>
              </motion.div>
            </div>
            
            {/* Feature cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ y: -5 }}
                className="p-5 rounded-2xl bg-white border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-[#f87060ff]/10">
                    <CheckCircle className="h-6 w-6 text-[#f87060ff]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#102542ff]">Eligibility Check</p>
                    <p className="text-xs mt-1 text-[#102542ff]/70">Find schemes you qualify for</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ y: -5 }}
                className="p-5 rounded-2xl bg-white border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-[#f87060ff]/10">
                    <Star className="h-6 w-6 text-[#f87060ff]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#102542ff]">Track Applications</p>
                    <p className="text-xs mt-1 text-[#102542ff]/70">Real-time status updates</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 hidden lg:block">
        <svg
          className="w-full h-28"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F5F5F5ff"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;