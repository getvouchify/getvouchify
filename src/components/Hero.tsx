import { useState } from "react";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/vouchify-hero.png";
import { motion } from "framer-motion";
import { Users, Store } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import CountdownTimer from "@/components/CountdownTimer";
const Hero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"shopper" | "merchant">("shopper");
  const openModal = (type: "shopper" | "merchant") => {
    setModalType(type);
    setModalOpen(true);
  };
  return <>
      <section className="min-h-[70vh] relative overflow-hidden bg-white pt-16 md:pt-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] py-8 md:py-12">
            {/* Left Content */}
            <motion.div className="text-center lg:text-left space-y-4 md:space-y-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }}>
              {/* Coming Soon Badge */}
              <motion.div className="inline-block" initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 0.3,
              type: "spring"
            }}>
                <span className="gradient-gold px-4 py-2 rounded-full text-sm font-semibold shadow-elegant">
                  🚀 Coming Soon
                </span>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5,
              duration: 0.6
            }}>
                <CountdownTimer />
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary">
                Discover Daily Deals You'll Love
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 md:text-2xl">Unlock exclusive deals in food, beauty, fitness, retail and more — join the waitlist today!</p>

              {/* Dual Waitlist Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
                <Button onClick={() => openModal("shopper")} size="lg" className="h-16 sm:h-14 px-8 gradient-primary text-white font-semibold text-lg sm:text-base hover-lift group flex-1">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Shopper
                </Button>
                
                <Button onClick={() => openModal("merchant")} size="lg" variant="outline" className="h-16 sm:h-14 px-8 border-2 border-primary text-primary font-semibold text-lg sm:text-base hover:bg-primary hover:text-white transition-all hover-lift flex-1">
                  <Store className="mr-2 h-5 w-5" />
                  Join as Merchant
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">Join 1,000+ early members securing exclusive access!</p>
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
              <img src={illustration} alt="Vouchify platform showcasing exclusive deals and vouchers for shoppers and merchants" className="w-full h-auto rounded-2xl" style={{
              filter: 'drop-shadow(0 0 30px hsl(274 59% 50% / 0.25))'
            }} />
            </motion.div>
          </div>
        </div>
      </section>

      <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} type={modalType} />
    </>;
};
export default Hero;