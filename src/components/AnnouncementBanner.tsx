import { X } from "lucide-react";
import { useState } from "react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary text-white py-2 relative overflow-hidden transition-all duration-300">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="mx-8 text-sm md:text-base font-semibold">
          🔥 BLACK FRIDAY MEGA SALE - Up to 70% OFF on All Categories!
        </span>
        <span className="mx-8 text-sm md:text-base font-semibold">
          ⚡ Flash Deals Every Hour - Don't Miss Out!
        </span>
        <span className="mx-8 text-sm md:text-base font-semibold">
          🎁 Extra 10% OFF with Code: BLACKFRIDAY
        </span>
        <span className="mx-8 text-sm md:text-base font-semibold">
          🔥 BLACK FRIDAY MEGA SALE - Up to 70% OFF on All Categories!
        </span>
        <span className="mx-8 text-sm md:text-base font-semibold">
          ⚡ Flash Deals Every Hour - Don't Miss Out!
        </span>
        <span className="mx-8 text-sm md:text-base font-semibold">
          🎁 Extra 10% OFF with Code: BLACKFRIDAY
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded-full p-1 transition-colors"
        aria-label="Close announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBanner;