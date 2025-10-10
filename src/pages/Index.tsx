import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import MerchantBenefits from "@/components/MerchantBenefits";
import ScrollSection from "@/components/ScrollSection";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Navigation />
      <Hero />
      
      <div className="relative">
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
