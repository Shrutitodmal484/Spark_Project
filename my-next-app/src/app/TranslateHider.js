'use client';

export default function TranslateHider() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Function to hide all Google Translate elements
          function hideGoogleTranslateElements() {
            const selectors = [
              '.goog-te-banner-frame',
              '.goog-te-gadget',
              '.goog-te-balloon-frame',
              '#goog-gt-tt',
              '.goog-tooltip',
              '.goog-tooltip:hover',
              '.skiptranslate',
              'body > .skiptranslate',
              '.goog-te-menu-frame',
              '.goog-te-menu-value',
              '.goog-te-combo'
            ];
            
            selectors.forEach(selector => {
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
            
            // Also hide any iframes from Google Translate
            document.querySelectorAll('iframe').forEach(iframe => {
              if (iframe.src && iframe.src.includes('translate.google.com')) {
                iframe.style.setProperty('display', 'none', 'important');
                iframe.style.setProperty('visibility', 'hidden', 'important');
                iframe.style.setProperty('width', '1px', 'important');
                iframe.style.setProperty('height', '1px', 'important');
                iframe.style.setProperty('position', 'absolute', 'important');
                iframe.style.setProperty('left', '-9999px', 'important');
                iframe.style.setProperty('top', '-9999px', 'important');
              }
            });
          }
          
          // Run immediately
          hideGoogleTranslateElements();
          
          // Set up MutationObserver to catch dynamically added elements
          const observer = new MutationObserver((mutations) => {
            hideGoogleTranslateElements();
          });
          
          // Start observing the document body
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
          });
          
          // Run periodically as a fallback
          setInterval(hideGoogleTranslateElements, 1000);
        `,
      }}
    />
  );
}