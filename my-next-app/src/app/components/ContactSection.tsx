"use client";
import Image from 'next/image';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <section className="py-16" style={{ background: "linear-gradient(to bottom, #ffffffff, #F5F5F5)" }}>
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#102542ff" }}>Government Scheme Support</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#102542ff" }}>
            Our team is ready to assist you with application processes and eligibility requirements
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left image with overlay */}
          <div className="relative rounded-3xl overflow-hidden h-full">
            <Image
              src="/images/general/help-desk.png"
              alt="Government help desk"
              fill
              className="object-cover"
              priority
            />
<div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(165, 42, 42, 0.9), rgba(210, 105, 30, 0.5), transparent)" }}></div><div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(160, 82, 45, 0.4), rgba(205, 133, 63, 0.1), transparent)" }}></div>            <div className="absolute top-8 left-8" style={{ color: "#ffffffff" }}>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#f87060ff" }}></div>
                <span className="text-sm font-medium">Available Now</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Dedicated Support Team</h3>
              <p className="mb-4" style={{ color: "#F5F5F5" }}>Mon-Sat, 9AM-6PM</p>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>1800-123-4567</span>
              </div>
            </div>
          </div>
          
          {/* Right form */}
          <div className="rounded-3xl p-8 lg:p-10 shadow-xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: "#102542ff" }}>Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5" key={isMounted ? "client-form" : "server-form"}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 text-sm rounded-2xl focus:ring-2 focus:border-transparent"
                  style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid #F5F5F5",
                    color: "#102542ff"
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 text-sm rounded-2xl focus:ring-2 focus:border-transparent"
                  style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid #F5F5F5",
                    color: "#102542ff"
                  }}
                  required
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "#102542ff" }}>
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 text-sm rounded-2xl focus:ring-2 focus:border-transparent resize-none"
                  style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(5px)",
                    border: "1px solid #F5F5F5",
                    color: "#102542ff"
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full cusror-pointer font-medium py-3.5 px-6 rounded-2xl transition-colors duration-300 flex items-center justify-center"
                style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
              >
                Send Message
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid #F5F5F5" }}>
              <p className="text-sm" style={{ color: "#102542ff" }}>
                Need immediate assistance? Call us directly at <span className="font-medium" style={{ color: "#102542ff" }}>1800-123-4567</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;