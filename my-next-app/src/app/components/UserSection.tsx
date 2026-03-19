"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UserGallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  
  const userData = [
    {
      title: "Housewife",
      description: "Find schemes for women empowerment and household benefits"
    },
    {
      title: "Student",
      description: "Discover education scholarships and skill development programs"
    },
    {
      title: "Working Woman",
      description: "Explore schemes for working women and financial independence"
    },
    {
      title: "Senior Citizen",
      description: "Access pension plans and healthcare benefits easily"
    },
    {
      title: "Farmer",
      description: "Quickly find agricultural subsidies and farming schemes"
    },
    {
      title: "College Student",
      description: "Locate education loans and startup grants in minutes"
    }
  ];

  // Navigation functions
  const goToPrev = () => {
    setCurrentMobileIndex((prevIndex) => 
      prevIndex === 0 ? userData.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentMobileIndex((prevIndex) => 
      prevIndex === userData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#102542ff" }}>Find Government Schemes For</h2>
          <p className="text-lg md:text-xl" style={{ color: "#102542ff" }}>Quick access to benefits tailored for you</p>
        </div>
        
        {/* Mobile Carousel View - Simple Approach */}
        <div className="md:hidden">
          <div className="relative">
            {/* Current Slide */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <Image
                src={`/images/users/${currentMobileIndex + 1}.png`}
                alt={userData[currentMobileIndex].title}
                fill
                className="object-cover"
              />
              
              {/* Always visible overlay on mobile */}
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4" 
                   style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent)" }}>
                <h3 className="font-bold text-lg mb-1" style={{ color: "#ffffffff" }}>{userData[currentMobileIndex].title}</h3>
                <p className="text-sm line-clamp-3" style={{ color: "#ffffffff" }}>
                  {userData[currentMobileIndex].description}
                </p>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={goToPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" style={{ color: "#102542ff" }} />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" style={{ color: "#102542ff" }} />
            </button>
            
            {/* Dots indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {userData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMobileIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentMobileIndex ? 'w-6' : ''}`}
                  style={{ 
                    backgroundColor: index === currentMobileIndex ? "#f87060ff" : "#D1D5DB" 
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Desktop Horizontal View */}
        <div className="hidden md:flex h-[400px] gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.4,1)] overflow-hidden rounded-3xl
                ${
                  hoveredIndex === index
                    ? 'flex-[3] z-10'
                    : hoveredIndex !== null
                    ? 'flex-[0.7] opacity-90'
                    : 'flex-1'
                }
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={`/images/users/${index}.png`}
                alt={userData[index - 1].title}
                fill
                className="object-cover"
                style={{
                  transition: 'all 800ms cubic-bezier(0.2,0.8,0.4,1)',
                  transform: hoveredIndex === index ? 'scale(1.03)' : 'scale(1)',
                  filter: hoveredIndex !== null && hoveredIndex !== index ? 'brightness(0.95)' : 'none'
                }}
              />
              
              {/* Overlay with text */}
              <div className={`absolute inset-0 flex flex-col items-start justify-end p-6 transition-all duration-300 
                ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), transparent)"
                }}>
                <div className="w-full">
                  <h3 className="font-bold text-2xl mb-2" style={{ color: "#ffffffff" }}>{userData[index - 1].title}</h3>
                  <p className="text-base opacity-90" style={{ color: "#ffffffff" }}>{userData[index - 1].description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserGallery;