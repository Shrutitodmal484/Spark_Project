"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Github, Linkedin, Mail, MapPin, Phone, Mail as MailIcon } from 'lucide-react';

const OurTeam = () => {
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

  const teamMembers = [
    {
      name: "Rahul Verma",
      position: "Lead Developer",
      bio: "Full-stack developer with expertise in React, Next.js, and Node.js. Passionate about creating accessible and user-friendly applications.",
      image: "/images/our-team/rahul-verma.png",
      social: {
        github: "https://github.com/",
        linkedin: "https:",
        email: "rahul.verma@samriddhi.gov.in"
      }
    },
    {
      name: "Priya Singh",
      position: "Frontend Developer",
      bio: "UI/UX enthusiast who specializes in creating responsive and visually appealing interfaces. Focuses on user experience and accessibility.",
      image: "/images/our-team/priya-singh.png",
      social: {
        github: "https:",
        linkedin: "https:",
        email: "priya.singh@samriddhi.gov.in"
      }
    },
    {
      name: "Amit Kumar",
      position: "Backend Developer",
      bio: "Server-side specialist with strong knowledge of database design, API development, and system architecture.",
      image: "/images/our-team/amit-kumar.png",
      social: {
        github: "https:",
        linkedin: "https:",
        email: "amit.kumar@samriddhi.gov.in"
      }
    },
    {
      name: "Sneha Reddy",
      position: "UI/UX Designer",
      bio: "Creative designer who transforms complex requirements into intuitive and beautiful user interfaces.",
      image: "/images/our-team/sneha-reddy.png",
      social: {
        github: "https://",
        linkedin: "https:",
        email: "sneha.reddy@samriddhi.gov.in"
      }
    }
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
              Meet Our <span style={{ color: "#f87060ff" }}>Team</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "#102542ff" }}>
              The talented individuals who designed, built, and maintain the Samriddhi platform
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
                    { id: 'office', title: 'Our Office' },
                    { id: 'team', title: 'Our Team' },
                    { id: 'team-photo', title: 'Team Photo' },
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
            {/* Our Office */}
            <section id="office" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Our Office</h2>
              <div className="relative rounded-2xl overflow-hidden h-96 mb-6">
                <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(16, 37, 66, 0.4), transparent)" }}></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">Samriddhi Tech Hub</h3>
                  <p style={{ color: "#F5F5F5" }}>Innovation Center, Bangalore</p>
                </div>
                {/* Office Image */}
                <Image
                  src="/images/our-team/office.png"
                  alt="Samriddhi Office"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="leading-relaxed" style={{ color: "#102542ff" }}>
                Our office is located in the heart of Bangalore's tech district, designed to foster creativity,
                collaboration, and innovation. With open workspaces, modern amenities, and a vibrant culture,
                it's the perfect environment for our team to build solutions that make a difference.
              </p>
            </section>

            {/* Our Team */}
            <section id="team" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-xl p-6"
                    style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: "#102542ff" }}>{member.name}</h3>
                        <p style={{ color: "#102542ff" }}>{member.position}</p>
                      </div>
                    </div>
                    <p className="mb-4" style={{ color: "#102542ff" }}>{member.bio}</p>
                    <div className="flex space-x-3">
                      <a href={member.social.github} className="transition-colors" style={{ color: "#f87060ff" }}>
                        <Github className="h-5 w-5" />
                      </a>
                      <a href={member.social.linkedin} className="transition-colors" style={{ color: "#f87060ff" }}>
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href={`mailto:${member.social.email}`} className="transition-colors" style={{ color: "#f87060ff" }}>
                        <Mail className="h-5 w-5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
            
            {/* Team Photo */}
            <section id="team-photo" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#102542ff" }}>Team Photo</h2>
              <div className="relative rounded-2xl overflow-hidden h-96">
                <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(16, 37, 66, 0.7), transparent)" }}></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">The Samriddhi Team</h3>
                  <p style={{ color: "#F5F5F5" }}>Working together to make a difference</p>
                </div>
                {/* Team Photo */}
                <Image
                  src="/images/our-team/our-team.png"
                  alt="Samriddhi Team"
                  fill
                  className="object-cover"
                />
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)", border: "1px solid #F5F5F5" }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#102542ff" }}>Contact Us</h2>
              <p className="mb-6" style={{ color: "#102542ff" }}>
                Have questions or want to get in touch with our team? Reach out to us:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-1" style={{ color: "#f87060ff" }} />
                    <div>
                      <h3 className="font-medium mb-1" style={{ color: "#102542ff" }}>Our Address</h3>
                      <p style={{ color: "#102542ff" }}>
                        Samriddhi Tech Hub, 3rd Floor, Innovation Center<br />
                        Bangalore, Karnataka - 560001
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 mt-1" style={{ color: "#f87060ff" }} />
                    <div>
                      <h3 className="font-medium mb-1" style={{ color: "#102542ff" }}>Phone</h3>
                      <p style={{ color: "#102542ff" }}>+91 80 1234 5678</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <div className="flex items-start">
                    <MailIcon className="h-5 w-5 mr-3 mt-1" style={{ color: "#f87060ff" }} />
                    <div>
                      <h3 className="font-medium mb-1" style={{ color: "#102542ff" }}>Email</h3>
                      <p style={{ color: "#102542ff" }}>team@samriddhi.gov.in</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(245, 245, 245, 0.6)", backdropFilter: "blur(5px)", border: "1px solid #F5F5F5" }}>
                  <div className="flex items-start">
                    <Github className="h-5 w-5 mr-3 mt-1" style={{ color: "#f87060ff" }} />
                    <div>
                      <h3 className="font-medium mb-1" style={{ color: "#102542ff" }}>GitHub</h3>
                      <p style={{ color: "#102542ff" }}>github.com/samriddhi</p>
                    </div>
                  </div>
                </div>
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

export default OurTeam;