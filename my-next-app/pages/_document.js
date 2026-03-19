import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Translate Script */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        
        {/* Initialize Google Translate */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,mr', // Add your languages here
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
      </Head>
      
      <body>
        {/* Google Translate Widget Container */}
        <div id="google_translate_element" style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999
        }} />
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}