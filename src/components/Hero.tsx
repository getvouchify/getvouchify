import { useState } from "react";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/hero-woman-vouchify.png";
import { motion } from "framer-motion";
import { Users, Store, ShoppingBag, Ticket, Heart, UtensilsCrossed, Wine, QrCode, Dumbbell, Sparkles } from "lucide-react";
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
                Your City, Your Deals. Curated Just for You.
              </h1>

              <p className="text-xl md:text-2xl font-semibold text-primary/80 italic">More Than Just A Daily Deal</p>

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
              {/* Animated Icons Around Image */}
              {/* Top Left - Shopping Bag */}
              <motion.div 
                className="absolute top-8 left-4 md:top-12 md:left-8 z-10 bg-primary/10 backdrop-blur-sm p-3 rounded-full"
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </motion.div>

              {/* Top Right - Sparkles */}
              <motion.div 
                className="absolute top-4 right-8 md:top-8 md:right-12 z-10 bg-accent/10 backdrop-blur-sm p-3 rounded-full"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-accent" />
              </motion.div>

              {/* Middle Left - Heart */}
              <motion.div 
                className="absolute top-1/3 -left-2 md:left-2 z-10 bg-red-500/10 backdrop-blur-sm p-3 rounded-full hidden sm:block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-red-500 fill-red-500/50" />
              </motion.div>

              {/* Middle Right - Ticket */}
              <motion.div 
                className="absolute top-1/4 -right-2 md:right-4 z-10 bg-primary/10 backdrop-blur-sm p-3 rounded-full"
                animate={{ y: [0, -12, 0], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Ticket className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </motion.div>

              {/* Bottom Left - Utensils */}
              <motion.div 
                className="absolute bottom-32 left-0 md:left-4 z-10 bg-orange-500/10 backdrop-blur-sm p-3 rounded-full hidden md:block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <UtensilsCrossed className="w-6 h-6 text-orange-500" />
              </motion.div>

              {/* Bottom Right - Dumbbell */}
              <motion.div 
                className="absolute bottom-24 right-4 md:right-8 z-10 bg-primary/10 backdrop-blur-sm p-3 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </motion.div>

              {/* Bottom Center - Wine */}
              <motion.div 
                className="absolute bottom-8 left-1/4 z-10 bg-purple-500/10 backdrop-blur-sm p-2 md:p-3 rounded-full"
                animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <Wine className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </motion.div>

              {/* QR Code - Bottom Right Corner */}
              <motion.div 
                className="absolute bottom-4 right-12 md:right-16 z-10 bg-primary/10 backdrop-blur-sm p-2 rounded-full hidden sm:block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <QrCode className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </motion.div>

              <motion.img 
                src={illustration} 
                alt="Vouchify platform showcasing exclusive deals and vouchers for shoppers and merchants" 
                className="w-full h-auto rounded-2xl relative z-0" 
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