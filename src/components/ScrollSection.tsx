import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

const ScrollSection = ({ children, className = "", bgColor = "bg-white" }: ScrollSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className={`min-h-screen md:sticky md:top-0 flex items-center ${bgColor} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full">
        {children}
      </div>
    </motion.section>
  );
};

export default ScrollSection;
