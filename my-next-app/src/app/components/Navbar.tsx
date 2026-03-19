"use client";
import { useState, useEffect } from "react";
import { User, Home, BookOpen, FileText, Info, ChevronDown, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const LANGUAGE_COOKIE_NAME = "preferred_language";
const COOKIE_EXPIRY_DAYS = 365;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for existing language preference on component mount
  useEffect(() => {
    const checkLanguage = () => {
      // First check our own cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const savedLang = getCookie(LANGUAGE_COOKIE_NAME);
      if (savedLang && (savedLang === "en" || savedLang === "mr")) {
        setCurrentLang(savedLang);
        return;
      }

      // Fallback to checking Google Translate cookie
      const cookieMatch = document.cookie.match(/(^|;)googtrans=([^;]*)/);
      if (cookieMatch) {
        const lang = cookieMatch[2].split("/")[2];
        if (lang === "mr") {
          setCurrentLang("mr");
        }
      }
    };
    checkLanguage();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMore = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  const toggleTranslate = () => {
    setIsTranslateOpen(!isTranslateOpen);
  };

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const changeLanguage = (lang: "en" | "mr") => {
    // Set our own language preference cookie
    setCookie(LANGUAGE_COOKIE_NAME, lang, COOKIE_EXPIRY_DAYS);
    
    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    
    // Update state
    setCurrentLang(lang);
    setIsTranslateOpen(false);
    
    // Reload page to apply translation
    window.location.reload();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
        } border-b border-[#e5e7eb]`}
      style={{ backgroundColor: "#ffffffff" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#f87060ff" }}>
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div
                className="text-2xl font-bold">
                Samriddhi
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-colors duration-200 hover:text-[#f87060ff] cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              href="/schemes"
              className="flex items-center space-x-2 transition-colors duration-200 hover:text-[#f87060ff] cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">Schemes</span>
            </Link>
            <div className="relative group">
              <button
                onClick={toggleMore}
                className="flex items-center space-x-2 cursor-pointer transition-colors duration-200 hover:text-[#f87060ff]">
                <Info className="h-4 w-4" />
                <span className="font-medium">More</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg transition-all duration-300 transform ${isMoreOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
                  } z-50`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  borderColor: "#e5e7eb",
                  borderWidth: "1px"
                }}
              >
                <div className="py-2">
                  <Link
                    href="/about"
                    className="block px-4 py-2 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/disclaimer"
                    className="block px-4 py-2 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    Disclaimer
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="block px-4 py-2 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleTranslate}
                className="flex items-center space-x-2 transition-colors duration-200 hover:text-[#f87060ff] cursor-pointer"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">
                  {currentLang === "en" ? "English" : "मराठी"}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isTranslateOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-40 rounded-xl shadow-lg transition-all duration-300 transform ${isTranslateOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
                  } z-50`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  borderColor: "#e5e7eb",
                  borderWidth: "1px"
                }}
              >
                <div className="py-2">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full text-left px-4 py-2 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer ${currentLang === "en" ? "text-[#f87060ff]" : ""
                      }`}
                    style={{ color: currentLang === "en" ? "#f87060ff" : "#102542ff" }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("mr")}
                    className={`block w-full text-left px-4 py-2 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer ${currentLang === "mr" ? "text-[#f87060ff]" : ""
                      }`}
                    style={{ color: currentLang === "mr" ? "#f87060ff" : "#102542ff" }}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/profile-selection"
              className="p-2 rounded-xl transition-colors duration-200 hover:bg-[#e55a4aff] cursor-pointer"
              style={{ backgroundColor: "#f87060ff" }}
            >
              <User size={20} color="white" />
            </Link>
            <button
              className="md:hidden transition-colors duration-200 hover:text-[#f87060ff] cursor-pointer"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 overflow-hidden"
          >
            <div
              className="rounded-xl shadow-"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderColor: "#e5e7eb",
                borderWidth: "1px"
              }}
            >
              <div className="py-2">
                <Link
                  href="/"
                  className="block px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link
                  href="/schemes"
                  className="block px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Schemes</span>
                  </div>
                </Link>
                
                {/* Mobile More Submenu */}
                <div className="relative">
                  <button
                    onClick={toggleMore}
                    className="flex items-center justify-between w-full px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4" />
                      <span>More</span>
                    </div>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pl-6 overflow-hidden"
                    >
                      <Link
                        href="/about"
                        className="block px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMoreOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>About Us</span>
                        </div>
                      </Link>
                      <Link
                        href="/disclaimer"
                        className="block px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMoreOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Disclaimer</span>
                        </div>
                      </Link>
                      <Link
                        href="/privacy-policy"
                        className="block px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMoreOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Privacy Policy</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </div>
                
                {/* Mobile Language Selector */}
                <div className="relative">
                  <button
                    onClick={toggleTranslate}
                    className="flex items-center justify-between w-full px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>
                        {currentLang === "en" ? "English" : "मराठी"}
                      </span>
                    </div>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isTranslateOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isTranslateOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pl-6 overflow-hidden"
                    >
                      <button
                        onClick={() => changeLanguage("en")}
                        className={`block w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer ${currentLang === "en" ? "text-[#f87060ff]" : ""
                          }`}
                        style={{ color: currentLang === "en" ? "#f87060ff" : "#102542ff" }}
                      >
                        English
                      </button>
                      <button
                        onClick={() => changeLanguage("mr")}
                        className={`block w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer ${currentLang === "mr" ? "text-[#f87060ff]" : ""
                          }`}
                        style={{ color: currentLang === "mr" ? "#f87060ff" : "#102542ff" }}
                      >
                        मराठी (Marathi)
                      </button>
                    </motion.div>
                  )}
                </div>
                
                <Link
                  href="/profile-selection"
                  className="block px-4 py-3 transition-colors duration-200 hover:bg-[rgba(16,37,66,0.05)] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;