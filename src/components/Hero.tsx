import { useState } from "react";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/vouchify-illustration.png";
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

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero pt-40 pb-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div 
              className="text-center lg:text-left space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Coming Soon Badge */}
              <motion.div 
                className="inline-block"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <span className="gradient-gold px-4 py-2 rounded-full text-sm font-semibold shadow-elegant">
                  🚀 Coming Soon
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                Discover Daily Deals You'll Love
              </h1>

              <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0">
                Book and redeem exclusive deals across food, beauty, fitness, and retail. Join the waitlist today!
              </p>

              {/* Dual Waitlist Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
                <Button
                  onClick={() => openModal("shopper")}
                  size="lg"
                  className="h-12 px-6 bg-white text-primary font-semibold hover:bg-white/90 flex-1"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join as Shopper
                </Button>
                
                <Button
                  onClick={() => openModal("merchant")}
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-all flex-1"
                >
                  <Store className="mr-2 h-5 w-5" />
                  Join as Merchant
                </Button>
              </div>

              <p className="text-sm text-white/80">
                ✨ Be among the first to access exclusive deals when we launch
              </p>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src={illustration} 
                alt="Vouchify platform showcasing exclusive deals and vouchers for shoppers and merchants" 
                className="w-full h-auto rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <WaitlistModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
      />
    </>
  );
};

export default Hero;
