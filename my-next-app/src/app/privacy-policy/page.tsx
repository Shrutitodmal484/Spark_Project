"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');
  
  // Function to scroll to a section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };
  
  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop;
        const sectionHeight = htmlSection.clientHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#102542ff" }}>Table of Contents</h3>
              <nav>
                <ul className="space-y-2">
                  {[
                    { id: 'introduction', title: 'Introduction' },
                    { id: 'information-collection', title: 'Information We Collect' },
                    { id: 'how-we-use', title: 'How We Use Your Information' },
                    { id: 'data-sharing', title: 'Data Sharing and Disclosure' },
                    { id: 'data-security', title: 'Data Security' },
                    { id: 'your-rights', title: 'Your Rights' },
                    { id: 'cookies', title: 'Cookies' },
                    { id: 'changes', title: 'Changes to This Policy' },
                    { id: 'contact', title: 'Contact Us' }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 cusror-pointer  rounded-lg transition-colors duration-200 ${
                          activeSection === item.id
                            ? 'font-medium'
                            : 'hover:bg-opacity-10'
                        }`}
                        style={{
                          color: activeSection === item.id ? "#102542ff" : "#102542ff",
                          backgroundColor: activeSection === item.id ? "#F5F5F5" : "transparent"
                        }}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Content Sections */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <section id="introduction" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h1 className="text-3xl font-bold mb-4" style={{ color: "#102542ff" }}>Privacy Policy</h1>
              <p className="mb-4" style={{ color: "#102542ff" }}>
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                Samriddhi Portal ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                government scheme portal.
              </p>
            </section>
            
            {/* Information We Collect */}
            <section id="information-collection" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#102542ff" }}>Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1" style={{ color: "#102542ff" }}>
                    <li>Name and contact details (email, phone number, address)</li>
                    <li>Government identification numbers (Aadhaar, PAN, etc.)</li>
                    <li>Demographic information (age, gender, occupation)</li>
                    <li>Bank account details for benefit transfers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#102542ff" }}>Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1" style={{ color: "#102542ff" }}>
                    <li>IP address and browser information</li>
                    <li>Device information and usage data</li>
                    <li>Cookies and similar technologies</li>
                    <li>Pages visited and time spent on our portal</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* How We Use Your Information */}
            <section id="how-we-use" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>How We Use Your Information</h2>
              <p className="mb-4" style={{ color: "#102542ff" }}>
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2" style={{ color: "#102542ff" }}>
                <li>To verify your eligibility for government schemes</li>
                <li>To process and administer benefit applications</li>
                <li>To communicate with you about your applications</li>
                <li>To improve our services and user experience</li>
                <li>To comply with legal and regulatory requirements</li>
                <li>To prevent fraud and ensure security</li>
              </ul>
            </section>
            
            {/* Data Sharing and Disclosure */}
            <section id="data-sharing" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Data Sharing and Disclosure</h2>
              <p className="mb-4" style={{ color: "#102542ff" }}>
                We do not sell your personal information. We may share your data only:
              </p>
              <ul className="list-disc list-inside space-y-2" style={{ color: "#102542ff" }}>
                <li>With government agencies for scheme administration</li>
                <li>With financial institutions for benefit disbursement</li>
                <li>With service providers who assist in our operations</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>
            
            {/* Data Security */}
            <section id="data-security" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Data Security</h2>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, 
                secure servers, and regular security assessments. However, no internet transmission is completely secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>
            
            {/* Your Rights */}
            <section id="your-rights" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Your Rights</h2>
              <p className="mb-4" style={{ color: "#102542ff" }}>
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2" style={{ color: "#102542ff" }}>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data (subject to legal requirements)</li>
                <li>Objection to processing of your data</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
            </section>
            
            {/* Cookies */}
            <section id="cookies" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Cookies</h2>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                We use cookies and similar tracking technologies to enhance your experience on our portal. 
                You can control cookies through your browser settings, but disabling cookies may affect certain 
                features of our services. We use both session cookies (which expire when you close your browser) 
                and persistent cookies (which remain on your device for a set period).
              </p>
            </section>
            
            {/* Changes to This Policy */}
            <section id="changes" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Changes to This Policy</h2>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                We may update this Privacy Policy from time to time. The updated version will be indicated by a revised 
                "Last updated" date. We encourage you to review this policy periodically for any changes. Changes to 
                this policy are effective when they are posted on this page.
              </p>
            </section>
            
            {/* Contact Us */}
            <section id="contact" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Contact Us</h2>
              <p className="mb-4" style={{ color: "#102542ff" }}>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                <p style={{ color: "#102542ff" }}>
                  <strong>Email:</strong> privacy@samriddhi.gov.in<br />
                  <strong>Phone:</strong> 1800-123-4567<br />
                  <strong>Address:</strong> Samriddhi Portal, Government Services Center, New Delhi - 110001
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;