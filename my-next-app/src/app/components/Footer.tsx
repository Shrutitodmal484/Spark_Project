"use client";
import Link from 'next/link';
import { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet data
      const wsData = [
        ["Email", "Subscription Date"],
        [email, new Date().toLocaleString()]
      ];
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Newsletter Subscriptions");
      
      // Save workbook as Excel file
      XLSX.writeFile(workbook, "newsletter_subscriptions.xlsx");
      
      // Show success message
      setIsSubscribed(true);
      setEmail('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      console.error("Error saving to Excel:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/our-team" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Disclaimer", href: "/disclaimer" },
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: <FaFacebook className="w-5 h-5" /> },
    { name: "Twitter", href: "#", icon: <FaTwitter className="w-5 h-5" /> },
    { name: "Instagram", href: "#", icon: <FaInstagram className="w-5 h-5" /> },
    { name: "LinkedIn", href: "#", icon: <FaLinkedin className="w-5 h-5" /> },
  ];

  return (
    <>
      <style jsx>{`
        .footer-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      <footer className="pt-16 pb-8" style={{ backgroundColor: "#0a1929", borderTop: "1px solid #1e3a5f" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and about */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3" style={{ backgroundColor: "#f87060ff" }}>
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: "#F5F5F5" }}>Samriddhi</span>
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: "#cdd7d6ff" }}>
                Your trusted partner for navigating government schemes and assistance programs. 
                We simplify the process so you can focus on what matters most.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#F5F5F5"
                    }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Footer links */}
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#F5F5F5" }}>{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="transition-colors hover:text-[#f87060ff] duration-300 text-sm text-[#cdd7d6ff]"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Newsletter */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#F5F5F5" }}>Stay Updated</h3>
              <p className="mb-4 text-sm" style={{ color: "#cdd7d6ff" }}>
                Subscribe to our newsletter for the latest scheme updates and announcements.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Your email address"
                  className=" text-white w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-transparent focus:border-gray-400 border-2 border-gray-700"
                  required
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full font-medium py-3 cusror-pointer rounded-xl transition-colors duration-300 disabled:opacity-70"
                  style={{ backgroundColor: "#f87060ff", color: "#ffffffff" }}
                >
                  {isProcessing ? "Subscribing..." : "Subscribe"}
                </button>
                {isSubscribed && (
                  <div className="text-sm flex items-center" style={{ color: "#4ade80" }}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Successfully saved to Excel!
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-6 text-center" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <p className="text-sm" style={{ color: "#cdd7d6ff" }}>
              © {new Date().getFullYear()} Samriddhi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;