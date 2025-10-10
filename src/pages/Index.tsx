import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import MerchantBenefits from "@/components/MerchantBenefits";
import Categories from "@/components/Categories";
import FeaturedDeals from "@/components/FeaturedDeals";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <AnnouncementBanner />
      <Navigation />
      <Hero />
      
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
