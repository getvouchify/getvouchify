import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import MerchantBenefits from "@/components/MerchantBenefits";
import Categories from "@/components/Categories";
import FeaturedDeals from "@/components/FeaturedDeals";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import lagosImage from "@/assets/lagos-bridge.jpg";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <AnnouncementBanner />
      <Navigation />
      <Hero />
      
      <section className="w-full py-12 px-4">
        <div className="container mx-auto">
          <img 
            src={lagosImage} 
            alt="Lagos cityscape featuring the iconic bridge" 
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>
      
      <section className="bg-white py-16">
        <FeaturedDeals />
      </section>
      
      <section className="bg-background py-16">
        <Categories />
      </section>

      <section className="bg-muted py-16">
        <HowItWorks />
      </section>
      
      <section className="bg-white py-16">
        <MerchantBenefits />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
