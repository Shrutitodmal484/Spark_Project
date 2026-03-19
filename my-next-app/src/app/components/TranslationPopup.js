'use client';

import { useEffect, useState } from 'react';

export default function CustomTranslatePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTranslate = (targetLang) => {
    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${targetLang}; path=/`;
    // Also set the cookie in the root domain to ensure it works
    document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
    // Reload page to apply translation
    window.location.reload();
  };

  const handleClose = () => {
    setShowPopup(false);
    // Remember user choice for 24 hours
    document.cookie = `translationDismissed=true; path=/; max-age=86400`;
    document.cookie = `translationDismissed=true; path=/; domain=${window.location.hostname}; max-age=86400`;
  };

  // Check if user previously dismissed
  useEffect(() => {
    if (document.cookie.includes('translationDismissed=true')) {
      setShowPopup(false);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <>
      {/* Popup Overlay */}
      <div 
        className="fixed inset-0bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Popup Content */}
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Translate this page?</h3>
            <p className="text-gray-600 mb-6">
              Would you like to translate this page to Marathi?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleTranslate('mr')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                Translate to Marathi
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition duration-200"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}