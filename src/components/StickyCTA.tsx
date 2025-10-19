import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WaitlistModal from "./WaitlistModal";
const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 80vh
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-accent to-primary p-4 shadow-elegant md:hidden"
          >
            <div className="container mx-auto flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Don't miss out!</p>
                <p className="text-white/90 text-xs">Join the waitlist today</p>
              </div>
              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg animate-pulse"
              >
                Join Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} type="customer" />
    </>
  );
};
export default StickyCTA;