import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import MerchantBenefits from "@/components/MerchantBenefits";
import Categories from "@/components/Categories";
import FeaturedDeals from "@/components/FeaturedDeals";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import QuickValueProp from "@/components/QuickValueProp";
import StickyCTA from "@/components/StickyCTA";
import lagosImage from "@/assets/lagos-bridge.jpg";
const Index = () => {
  return <div className="min-h-screen scroll-smooth">
      <AnnouncementBanner />
      <Navigation />
      <Hero />
      
      <QuickValueProp />
      
      <section className="w-full py-16 md:py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-4">
              Explore Lagos, One Deal at a Time!
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the best of Lagos with exclusive offers from top venues
            </p>
          </div>
          <img 
            src={lagosImage} 
            alt="Lagos cityscape featuring the iconic bridge" 
            className="w-full h-[250px] md:h-[400px] object-cover rounded-xl shadow-elegant" 
            loading="lazy"
          />
        </div>
      </section>
      
      <section className="bg-gray-50 py-16 md:py-24">
        <FeaturedDeals />
      </section>
      
      <section className="bg-white py-16 md:py-24">
        <Categories />
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <HowItWorks />
      </section>
      
      <section className="bg-white py-16 md:py-24">
        <MerchantBenefits />
      </section>
      
      <StickyCTA />
      <Footer />
    </div>;
};
export default Index;