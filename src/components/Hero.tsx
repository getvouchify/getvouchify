import { useState } from "react";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/hero-woman-vouchify.png";
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
      <section className="min-h-[70vh] relative overflow-hidden bg-white pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh] py-8 md:py-12">
            {/* Left Content */}
            <motion.div className="text-center lg:text-left space-y-6 md:space-y-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }}>
              {/* Tagline */}
              <motion.p 
                className="text-base md:text-lg font-semibold text-primary/70 uppercase tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Lagos' Premier Deal Discovery Platform
              </motion.p>

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-primary">
                Your City, Your Deals. Curated Just for You.
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary/90 italic">
                More Than Just A Daily Deal
              </p>

              <p className="text-lg md:text-xl text-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Unlock exclusive deals in food & drinks, beauty, fitness, things to do, retail and more — join the waitlist today!
              </p>

              {/* Dual Waitlist Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0 pt-4">
                <Button onClick={() => openModal("shopper")} size="lg" className="h-14 md:h-12 px-8 gradient-primary text-white font-bold text-base hover-lift group flex-1 min-h-[44px]">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Shopper
                </Button>
                
                <Button onClick={() => openModal("merchant")} size="lg" variant="outline" className="h-14 md:h-12 px-8 border-2 border-primary text-primary bg-white font-bold text-base hover:bg-primary hover:text-white transition-all hover-lift flex-1 min-h-[44px]">
                  <Store className="mr-2 h-5 w-5" />
                  Join as Merchant
                </Button>
              </div>

              <p className="text-base text-muted-foreground pt-2">
                Join 1,000+ early members securing exclusive access!
              </p>
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
              <motion.img 
                src={illustration} 
                alt="Vouchify platform showcasing exclusive deals and vouchers for shoppers and merchants" 
                className="w-full h-auto rounded-2xl" 
                style={{
                  filter: 'drop-shadow(0 0 30px hsl(274 59% 50% / 0.25))'
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} type={modalType} />
    </>;
};
export default Hero;