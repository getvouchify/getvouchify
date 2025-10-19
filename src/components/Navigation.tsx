import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/vouchify-logo-no-background.png";
import WaitlistModal from "./WaitlistModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistType, setWaitlistType] = useState<"customer" | "business">("customer");

  return (
    <>
      <nav className="fixed top-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={logo} alt="Vouchify Logo" className="h-10 md:h-14 w-auto" />
            </Link>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                size="lg"
                onClick={() => {
                  setWaitlistType("customer");
                  setShowWaitlist(true);
                }}
                className="gradient-primary text-white hover-lift shadow-glow font-bold"
              >
                Join Waitlist
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setWaitlistType("business");
                  setShowWaitlist(true);
                }}
                className="border-2 border-primary hover:bg-primary hover:text-white font-bold"
              >
                For Business
              </Button>
            </div>

            {/* Mobile - Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    {/* Join Waitlist Buttons */}
                    <Button
                      className="w-full gradient-primary text-white font-bold"
                      size="lg"
                      onClick={() => {
                        setWaitlistType("customer");
                        setShowWaitlist(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Join Waitlist
                    </Button>

                    <Button
                      className="w-full border-2 border-primary font-bold"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setWaitlistType("business");
                        setShowWaitlist(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      For Business
                    </Button>

                    {/* Instagram Link */}
                    <a
                      href="https://instagram.com/get.vouchify"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-3 mt-4"
                    >
                      <Instagram className="w-5 h-5" />
                      @get.vouchify
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <WaitlistModal open={showWaitlist} onOpenChange={setShowWaitlist} type={waitlistType} />
    </>
  );
};

export default Navigation;
