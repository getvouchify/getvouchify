import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, Search, Heart, ShoppingCart, Bell, User, Utensils, Sparkles, Dumbbell, Compass, ShoppingBag, Home, Smartphone, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/vouchify-logo-new.png";
import WaitlistModal from "./WaitlistModal";
import CartSidebar from "./CartSidebar";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const categories = [
  {
    icon: Utensils,
    label: "Food & Drink",
    href: "#categories",
    subcategories: [
      "Restaurants & Fine Dining",
      "Fast Food & Quick Bites",
      "Cafés & Brunch Spots",
      "Bars & Happy Hour"
    ]
  },
  {
    icon: Sparkles,
    label: "Beauty & Spa",
    href: "#categories",
    subcategories: [
      "Hair, Nails & Grooming",
      "Spas & Massage Therapy",
      "Skincare Clinics & Facials",
      "Lash, Brow & Waxing Services"
    ]
  },
  {
    icon: Dumbbell,
    label: "Health & Fitness",
    href: "#categories",
    subcategories: [
      "Gyms & Studios",
      "Yoga, Pilates & Dance",
      "Personal Trainers",
      "Wellness & Nutrition"
    ]
  },
  {
    icon: Compass,
    label: "Things To Do",
    href: "#categories",
    subcategories: [
      "Paint & Sip / Escape Rooms",
      "Boat Cruises / Tours",
      "Events & Pop-ups",
      "Games & Group Activities"
    ]
  },
  {
    icon: ShoppingBag,
    label: "Retail",
    href: "#categories",
    subcategories: [
      "Fashion & Thrift",
      "Accessories & Footwear",
      "Local Brands & Pop-ups",
      "Books, Gifts & Lifestyle"
    ]
  },
  {
    icon: Smartphone,
    label: "Electronics & Gadgets",
    href: "#categories",
    subcategories: [
      "Phones & Accessories",
      "TVs, ACs & Smart Devices",
      "Power Banks & Gadgets",
      "Repairs & Installations"
    ]
  },
  {
    icon: Home,
    label: "Home & Lifestyle",
    href: "#categories",
    subcategories: [
      "Home Services (laundry, cleaning, fumigation)",
      "Furniture & Décor",
      "Kitchenware & Storage",
      "Candles, Bedding, Home Fragrances",
      "Green Energy & Installations (e.g. solar)"
    ]
  }
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistType, setWaitlistType] = useState<"shopper" | "merchant">("shopper");
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={logo} alt="Vouchify Logo" className="h-14 w-auto" />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl gap-2">
              <Select defaultValue="lagos">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for deals, restaurants, spas..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Heart className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Bell className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setWaitlistType("shopper");
                  setShowWaitlist(true);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="hidden md:block border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-6 py-3">
              {categories.map((category) => (
                <DropdownMenu key={category.label}>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors outline-none">
                    <category.icon className="w-4 h-4" />
                    {category.label}
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[280px] bg-background border shadow-lg z-50">
                    {category.subcategories.map((subcategory) => (
                      <DropdownMenuItem key={subcategory} asChild>
                        <a
                          href={category.href}
                          className="cursor-pointer"
                        >
                          {subcategory}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search deals..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Mobile Cart & Actions */}
              <div className="flex items-center gap-2 justify-between">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowCart(true);
                    setIsOpen(false);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Bell className="w-5 h-5" />
                </Button>
              </div>
              {categories.map((category) => (
                <Collapsible key={category.label}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2">
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <a
                        key={subcategory}
                        href={category.href}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {subcategory}
                      </a>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
              <Button 
                className="w-full"
                onClick={() => {
                  setWaitlistType("shopper");
                  setShowWaitlist(true);
                  setIsOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        )}
      </nav>

      <WaitlistModal open={showWaitlist} onOpenChange={setShowWaitlist} type={waitlistType} />
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Navigation;
