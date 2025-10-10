import logo from "@/assets/vouchify-logo-new.png";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, Bell, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utensils, Sparkles, Dumbbell, Compass, ShoppingBag } from "lucide-react";

const categories = [
  { icon: Sparkles, label: "Beauty & Spas" },
  { icon: Compass, label: "Things To Do" },
  { icon: Utensils, label: "Food & Drink" },
  { icon: Dumbbell, label: "Health & Fitness" },
  { icon: ShoppingBag, label: "Retail" },
];

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      {/* Main Navigation Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src={logo} alt="Vouchify" className="h-16 w-auto" />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="relative w-full">
                <div className="flex items-center bg-background border border-input rounded-full overflow-hidden">
                  <Search className="w-5 h-5 text-muted-foreground ml-4" />
                  <Input
                    type="text"
                    placeholder="Search for deals"
                    className="border-0 focus-visible:ring-0 flex-1"
                  />
                  <div className="flex items-center gap-2 px-4 border-l border-input">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium whitespace-nowrap">Lagos</span>
                  </div>
                  <Button size="sm" className="rounded-full m-1">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden lg:flex">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Sign In</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-background/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 py-3 overflow-x-auto">
            {categories.map((category, index) => (
              <button
                key={index}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap group"
              >
                <category.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
