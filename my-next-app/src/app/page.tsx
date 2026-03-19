import { User } from 'lucide-react';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import UserSection from './components/UserSection';
import ImageSection from './components/ImageSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';


export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UserSection />
      <ImageSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
