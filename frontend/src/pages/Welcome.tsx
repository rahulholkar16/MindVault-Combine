import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar';

const Welcome = () => {
  return (
      <div className="bg-gray-900 min-h-screen text-center">
          <Navbar />
          <HeroSection />
          <FeaturesSection />
          <Footer />
      </div>
  );
}

export default Welcome;