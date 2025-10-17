import { useState } from "react";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/hero-woman-vouchify.png";
import { motion } from "framer-motion";
import { Users, Store } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
const Hero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"shopper" | "merchant">("shopper");
  const openModal = (type: "shopper" | "merchant") => {
    setModalType(type);
    setModalOpen(true);
  };
  return <>
      <section className="min-h-[70vh] relative overflow-hidden bg-white pt-28 md:pt-36 lg:pt-40 pb-12 md:pb-16 lg:pb-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
            {/* Left Content */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="text-center lg:text-left space-y- md:space-y-">
              {/* Tagline */}
              

              {/* Coming Soon Badge */}
              

              {/* Main Heading */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight lg:leading-[1.1] text-foreground mb-2 animate-fade-in">
                Your City,{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Your Deals.
                </span>
                <br />
                <span className="text-primary">Curated Just for You.</span>
              </h1>

              <p className="text-base md:text-xl lg:text-2xl font-bold text-primary/90 italic">More Than A Daily Deal</p>

              <p className="text-sm md:text-lg text-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover limited-time perks near you — join the waitlist today!
              </p>

              {/* Dual Waitlist Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in">
                <Button onClick={() => openModal("shopper")} size="lg" className="h-12 sm:h-14 px-5 sm:px-8 text-sm sm:text-lg font-bold gradient-primary text-white hover-lift shadow-glow transition-all duration-300">
                  Join as Shopper
                </Button>
                <Button onClick={() => openModal("merchant")} size="lg" variant="outline" className="h-12 sm:h-14 px-5 sm:px-8 text-sm sm:text-lg font-bold border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300">
                  Join as Merchant
                </Button>
              </div>

              {/* Coming Soon Tag */}
              <div className="mt-4 sm:mt-6 flex justify-center lg:justify-start">
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-sm animate-pulse">
                  🚀 Coming Soon
                </span>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div className="relative" initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
              <motion.img src={illustration} alt="Vouchify platform showcasing exclusive deals and vouchers for shoppers and merchants" className="w-full h-auto rounded-2xl" animate={{
              y: [0, -10, 0]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }} />
            </motion.div>
          </div>
        </div>
      </section>

      <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} type={modalType} />
    </>;
};
export default Hero;