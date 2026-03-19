"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState('');
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };
  
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
  
  const teamMembers = [
    {
      name: "Rahul Verma",
      position: "Chief Executive Officer",
      bio: "Former IAS officer with 15+ years of experience in implementing government welfare schemes.",
      image: "/images/our-team/rahul-verma.png"
    },
    {
      name: "Priya Singh",
      position: "Chief Technology Officer",
      bio: "Tech entrepreneur specializing in digital transformation of public services.",
      image: "/images/our-team/priya-singh.png"
    },
    {
      name: "Amit Kumar",
      position: "Director of Policy",
      bio: "Policy expert with a background in social welfare and public administration.",
      image: "/images/our-team/amit-kumar.png"
    },
    {
      name: "Sneha Reddy",
      position: "Head of User Experience",
      bio: "UX designer focused on creating accessible interfaces for all citizens.",
      image: "/images/our-team/sneha-reddy.png"
    }
  ];
  
  const milestones = [
    { year: "2018", title: "Inception", description: "Samriddhi Portal was founded with a vision to simplify access to government schemes." },
    { year: "2019", title: "First Launch", description: "Launched with support for 50+ government schemes across 5 states." },
    { year: "2020", title: "National Expansion", description: "Expanded to cover all 28 states and 8 union territories." },
    { year: "2021", title: "Mobile App", description: "Launched mobile application for on-the-go scheme access." },
    { year: "2022", title: "AI Integration", description: "Introduced AI-powered scheme recommendations." },
    { year: "2023", title: "2 Million Users", description: "Reached milestone of 2 million registered users." }
  ];
  
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #F5F5F5, #ffffffff)" }}>
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "#102542ff" }}>
              About <span style={{ color: "#f87060ff" }}>Samriddhi</span> Portal
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "#102542ff" }}>
              Empowering citizens by simplifying access to government schemes and benefits through technology
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#102542ff" }}>Table of Contents</h3>
              <nav>
                <ul className="space-y-2">
                  {[
                    { id: 'our-mission', title: 'Our Mission' },
                    { id: 'our-vision', title: 'Our Vision' },
                    { id: 'our-story', title: 'Our Story' },
                    { id: 'milestones', title: 'Milestones' },
                    { id: 'our-team', title: 'Our Team' },
                    { id: 'values', title: 'Our Values' },
                    { id: 'impact', title: 'Our Impact' },
                    { id: 'contact', title: 'Contact Us' }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200 ${activeSection === item.id
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
            {/* Our Mission */}
            <section id="our-mission" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Our Mission</h2>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                Our mission is to bridge the gap between citizens and government welfare schemes by providing
                a unified, accessible, and user-friendly platform. We strive to ensure that every eligible
                citizen can easily discover, understand, and apply for government benefits without barriers.
              </p>
            </section>
            
            {/* Our Vision */}
            <section id="our-vision" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Our Vision</h2>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                We envision a India where no citizen is left behind due to lack of information or access
                to government welfare schemes. Through digital innovation and citizen-centric design,
                we aim to create an inclusive ecosystem that empowers every individual to lead a better life.
              </p>
            </section>
            
            {/* Our Story */}
            <section id="our-story" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Our Story</h2>
              <p className="leading-relaxed mb-4" style={{ color: "#102542ff" }}>
                Samriddhi Portal was born out of a simple observation: while India offers numerous welfare
                schemes, many eligible citizens remain unaware of them or find the application process
                too complex. Our founder, Dr. Rajesh Sharma, experienced this firsthand during his tenure
                as an IAS officer, where he saw countless deserving citizens miss out on benefits due
                to information gaps.
              </p>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                What started as a small initiative in 2018 has now grown into a national platform serving
                millions of citizens. Today, Samriddhi Portal stands as a testament to the power of
                technology in driving social change and inclusive governance.
              </p>
            </section>
            
            {/* Milestones */}
            <section id="milestones" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Our Journey</h2>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#f87060ff" }}>
                        {milestone.year}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="h-full w-1 mt-2" style={{ backgroundColor: "#F5F5F5" }}></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1" style={{ color: "#102542ff" }}>{milestone.title}</h3>
                      <p style={{ color: "#102542ff" }}>{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Our Team */}
            <section id="our-team" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Our Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="rounded-xl p-6" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden" style={{ backgroundColor: "#F5F5F5" }}>
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: "#102542ff" }}>{member.name}</h3>
                        <p style={{ color: "#102542ff" }}>{member.position}</p>
                      </div>
                    </div>
                    <p style={{ color: "#102542ff" }}>{member.bio}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Our Values */}
            <section id="values" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#102542ff" }}>Accessibility</h3>
                  <p style={{ color: "#102542ff" }}>Ensuring our platform is usable by everyone, regardless of digital literacy or physical abilities.</p>
                </div>
                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#102542ff" }}>Transparency</h3>
                  <p style={{ color: "#102542ff" }}>Providing clear, honest information about schemes and application processes.</p>
                </div>
                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#102542ff" }}>Innovation</h3>
                  <p style={{ color: "#102542ff" }}>Continuously improving our platform with new technologies and user feedback.</p>
                </div>
              </div>
            </section>
            
            {/* Our Impact */}
            <section id="impact" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Our Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#102542ff" }}>2M+</div>
                  <p style={{ color: "#102542ff" }}>Registered Users</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#102542ff" }}>800+</div>
                  <p style={{ color: "#102542ff" }}>Government Schemes</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2" style={{ color: "#102542ff" }}>28</div>
                  <p style={{ color: "#102542ff" }}>States &amp; UTs Covered</p>
                </div>
              </div>
              <p className="mt-6 leading-relaxed" style={{ color: "#102542ff" }}>
                Since our inception, we&apos;ve helped millions of citizens access government benefits they
                were eligible for but unaware of. Our platform has simplified complex application
                processes, reduced paperwork, and significantly decreased the time required to
                receive benefits from months to weeks.
              </p>
            </section>
            
            {/* Contact Us */}
            <section id="contact" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Contact Us</h2>
              <p className="mb-4" style={{ color: "#102542ff" }}>
                Have questions or suggestions? We&apos;d love to hear from you.
              </p>
              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                <p style={{ color: "#102542ff" }}>
                  <strong>Email:</strong> contact@samriddhi.gov.in<br />
                  <strong>Phone:</strong> 1800-123-4567<br />
                  <strong>Address:</strong> Samriddhi Portal, Government Services Center, New Delhi - 110001
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;