import Navigation from "@/components/Navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import MerchantBenefits from "@/components/MerchantBenefits";
import FeaturedDeals from "@/components/FeaturedDeals";
import ScrollSection from "@/components/ScrollSection";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <AnnouncementBanner />
      <Navigation />
      <Hero />
      
      <div className="relative">
        <ScrollSection bgColor="bg-background">
          <FeaturedDeals />
        </ScrollSection>
        
        <ScrollSection bgColor="bg-muted">
          <HowItWorks />
        </ScrollSection>
        
        <ScrollSection bgColor="bg-white">
          <MerchantBenefits />
        </ScrollSection>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
