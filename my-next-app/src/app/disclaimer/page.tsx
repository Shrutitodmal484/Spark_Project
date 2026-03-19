'use client';
import { AlertTriangle } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const COLORS = {
  primary: '#102542ff',
  accent: '#f87060ff',
  white: '#ffffffff',
  lightGray: '#F5F5F5',
  textLight: '#6b7280',
  border: '#e5e7eb',
  lightPrimary: 'rgba(16, 37, 66, 0.1)',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="text-center py-8">
          <h1 className="text-3xl sm:text-3xl font-bold mb-4" style={{ color: COLORS.primary }}>
            Disclaimer
          </h1>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: COLORS.accent }}></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border mb-8" style={{ borderColor: COLORS.border }}>
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-full mb-4" style={{ backgroundColor: COLORS.lightPrimary }}>
              <AlertTriangle className="h-10 w-10" style={{ color: COLORS.accent }} />
            </div>
            <h2 className="text-xl font-bold text-center" style={{ color: COLORS.primary }}>
              Important Information
            </h2>
            <p className="text-sm text-center mt-2" style={{ color: COLORS.textLight }}>
              Please read this disclaimer carefully before using this website.
            </p>
          </div>
          
          <div className="space-y-6 text-sm sm:text-base" style={{ color: COLORS.textLight }}>
            <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.lightPrimary }}>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>General Information</h3>
              <p>
                The information provided on this website is for general informational purposes only. 
                All information on the Site is provided in good faith, however we make no representation 
                or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, 
                reliability, availability or completeness of any information on the Site.
              </p>
            </div>
            
            <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.lightPrimary }}>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>No Liability</h3>
              <p>
                Under no circumstance shall we have any liability to you for any loss or damage of any 
                kind incurred as a result of the use of the site or reliance on any information provided 
                on the site. Your use of the site and your reliance on any information on the site is 
                solely at your own risk.
              </p>
            </div>
            
            <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.lightPrimary }}>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>Government Schemes</h3>
              <p>
                This website is not affiliated with any government organization. The schemes and 
                information listed here are collected from publicly available sources. We do not 
                guarantee the accuracy or completeness of scheme details. Users are advised to verify 
                all information directly with the relevant government authorities before applying for 
                any scheme.
              </p>
            </div>
            
            <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.lightPrimary }}>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>External Links</h3>
              <p>
                The site may contain links to other websites or content belonging to or originating 
                from third parties. Such external links are not investigated, monitored, or checked 
                for accuracy, adequacy, validity, reliability, availability or completeness by us.
              </p>
            </div>
            
            <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.lightPrimary }}>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>Professional Advice</h3>
              <p>
                The information on this website does not constitute legal, financial, or professional 
                advice. You should consult with a qualified professional for advice specific to your 
                situation.
              </p>
            </div>
            
            <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.lightPrimary }}>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>Changes to Disclaimer</h3>
              <p>
                We reserve the right to modify, update, or change this disclaimer at any time without 
                prior notice. By continuing to use this website, you agree to be bound by the then-current 
                version of this disclaimer.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: COLORS.border }}>
            <p className="text-sm" style={{ color: COLORS.textLight }}>
              If you have any questions about this Disclaimer, please contact us at: 
              <span className="font-medium block mt-1" style={{ color: COLORS.primary }}> support@yourwebsite.com</span>
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm" style={{ color: COLORS.textLight }}>
          <p>© {new Date().getFullYear()} Your Website Name. All rights reserved.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}