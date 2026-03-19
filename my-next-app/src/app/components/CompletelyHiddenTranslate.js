'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function CompletelyHiddenTranslate() {
  useEffect(() => {
    // Function to hide all Google Translate elements
    const hideGoogleTranslateElements = () => {
      const elements = [
        '.goog-te-banner-frame',
        '.goog-te-gadget',
        '.goog-te-balloon-frame',
        '#goog-gt-tt',
        '.goog-tooltip',
        '.goog-tooltip:hover',
        '.skiptranslate',
        'body > .skiptranslate'
      ];
      
      elements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('position', 'absolute', 'important');
          el.style.setProperty('left', '-9999px', 'important');
          el.style.setProperty('top', '-9999px', 'important');
          el.style.setProperty('width', '1px', 'important');
          el.style.setProperty('height', '1px', 'important');
          el.style.setProperty('overflow', 'hidden', 'important');
        });
      });
    };

    // Run immediately
    hideGoogleTranslateElements();
    
    // Set up MutationObserver to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      hideGoogleTranslateElements();
    });
    
    // Start observing the document body for added nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      
      <div id="google_translate_element" style={{ 
        display: 'none',
        visibility: 'hidden',
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }} />
      
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,mr',
                autoDisplay: false,
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
              
              // Hide elements after initialization
              setTimeout(() => {
                const elements = document.querySelectorAll('.goog-te-gadget, .goog-te-combo');
                elements.forEach(el => {
                  el.style.display = 'none';
                  el.style.visibility = 'hidden';
                  el.style.position = 'absolute';
                  el.style.left = '-9999px';
                  el.style.top = '-9999px';
                  el.style.width = '1px';
                  el.style.height = '1px';
                  el.style.overflow = 'hidden';
                });
              }, 500);
            }
          `,
        }}
      />
    </>
  );
}