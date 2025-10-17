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
  return <>
      <AnimatePresence>
        {isVisible}
      </AnimatePresence>

      <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} type="shopper" />
    </>;
};
export default StickyCTA;