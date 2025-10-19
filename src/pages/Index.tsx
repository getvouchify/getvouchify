import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ScrollingCountdown from "@/components/ScrollingCountdown";
import HowItWorks from "@/components/HowItWorks";
import MerchantBenefits from "@/components/MerchantBenefits";
import Categories from "@/components/Categories";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import QuickValueProp from "@/components/QuickValueProp";
import StickyCTA from "@/components/StickyCTA";
import lagosImage from "@/assets/lagos-bridge.jpg";
import phoneMockup from "@/assets/vouchify-phone-mockup.png";
const Index = () => {
  return <div className="min-h-screen scroll-smooth">
      <AnnouncementBanner />
      <ScrollingCountdown />
      <Navigation />
      <Hero />
      
      <QuickValueProp />
      
      <section className="w-full py-4 md:py-6 lg:py-8 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl lg:text-5xl text-primary font-bold mb-2 md:mb-4">
              Explore Lagos, One Deal at a Time!
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the best of Lagos with exclusive offers from top venues
            </p>
          </div>
          <img src={lagosImage} alt="Lagos cityscape featuring the iconic bridge" className="w-full h-[250px] md:h-[400px] object-cover rounded-xl shadow-elegant" loading="lazy" />
        </div>
      </section>
      
      
      
      <section id="categories" className="bg-white py-4 md:py-6 lg:py-8">
        <Categories />
      </section>

      <section id="how-it-works" className="bg-gray-50 py-12 md:py-16 lg:py-24">
        <HowItWorks />
      </section>
      
      <section className="hidden md:block bg-white py-12 md:py-16 lg:py-24">
        <MerchantBenefits />
      </section>
      
      <StickyCTA />
      <Footer />
    </div>;
};
export default Index;