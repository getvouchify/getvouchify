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
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t-2 border-primary shadow-elegant p-4"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              onClick={() => setModalOpen(true)}
              className="w-full h-14 text-lg font-bold gradient-primary"
              size="lg"
            >
              Join Waitlist Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} type="shopper" />
    </>
  );
};

export default StickyCTA;
