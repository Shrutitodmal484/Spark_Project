'use client';

import Script from 'next/script';

export default function GoogleTranslateInit() {
  return (
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
          }
        `,
      }}
    />
  );
}