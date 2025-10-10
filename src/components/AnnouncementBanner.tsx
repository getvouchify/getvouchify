import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <p className="text-sm md:text-base font-medium">
          🎉 Grand Launch Sale! Use code <span className="font-bold">LAGOS25</span> & save up to 50%
        </p>
        <Button 
          variant="secondary" 
          size="sm"
          className="hidden md:inline-flex"
        >
          Shop Now!
        </Button>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;