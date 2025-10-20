import { useState } from "react";
import { Button } from "@/components/ui/button";
import illustration from "@/assets/hero-woman-vouchify.png";
import { motion } from "framer-motion";
import { Users, Store } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
const Hero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"customer" | "business">("customer");
  const openModal = (type: "customer" | "business") => {
    setModalType(type);
    setModalOpen(true);
  };
  return <>
      <section className="min-h-[70vh] relative overflow-hidden pt-20 md:pt-32 lg:pt-36 pb-12 md:pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[60vh]">
            {/* Left Content */}
            <motion.div className="text-center lg:text-left space-y-6 md:space-y-8 mt-8" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }}>
              {/* Tagline */}
              <motion.p className="text-base md:text-lg font-semibold text-primary/70 uppercase tracking-wider" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.2
            }}>
            </motion.p>

              {/* Coming Soon Badge */}
              <motion.div className="inline-block mt-4" initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 0.3,
              type: "spring"
            }}>
                <span className="gradient-gold px-4 py-2 rounded-full text-sm font-semibold shadow-elegant">
                  Coming Soon
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight lg:leading-[1.1] text-foreground mb-2 animate-fade-in">
                Your City,{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Your Deals.
                </span>
                <br />
                <span className="text-foreground">Curated Just for You.</span>
              </h1>

              <p className="text-base md:text-xl lg:text-2xl font-bold text-foreground italic">More Than A Daily Deal</p>

              <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed mb-4">
                Discover limited-time perks near you. Be among the first to experience Lagos like never before.
              </p>

              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="text-foreground font-semibold text-sm">Limited Early Access Spots</span>
              </div>

              {/* Single Prominent CTA */}
              <div className="flex flex-col gap-4 justify-center lg:justify-start animate-fade-in">
                <Button onClick={() => openModal("customer")} size="lg" className="h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-bold gradient-primary text-white hover-lift shadow-glow transition-all duration-300">
                  Join the Waitlist Now
                </Button>
                <Button onClick={() => openModal("business")} size="sm" variant="ghost" className="font-semibold underline hover:no-underline">
                  Are you a business? Click here
                </Button>
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
              duration: 1.5,
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