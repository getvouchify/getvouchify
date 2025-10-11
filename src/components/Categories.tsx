import { Utensils, Sparkles, Dumbbell, Compass, ShoppingBag, Home, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import WaitlistModal from "@/components/WaitlistModal";

// Import category images
import restaurant1 from "@/assets/categories/restaurant-1.jpg";
import restaurant2 from "@/assets/categories/restaurant-2.webp";
import beautySpa1 from "@/assets/categories/beauty-spa-1.jpg";
import beautySpa2 from "@/assets/categories/beauty-spa-2.jpg";
import healthFitness1 from "@/assets/categories/health-fitness-1.webp";
import healthFitness2 from "@/assets/categories/health-fitness-2.jpg";
import thingsToDo from "@/assets/categories/things-to-do.jpg";
import retail1 from "@/assets/categories/retail-1.webp";
import retail2 from "@/assets/categories/retail-2.webp";
import homeLifestyle1 from "@/assets/categories/home-lifestyle-1.jpeg";
import homeLifestyle2 from "@/assets/categories/home-lifestyle-2.jpeg";
import electronics1 from "@/assets/categories/electronics-1.jpg";
import electronics2 from "@/assets/categories/electronics-2.webp";
const categories = [{
  icon: Utensils,
  title: "Food & Drink",
  description: "Discover exclusive restaurant deals, happy hour offers, and 2-for-1 dining experiences at Lagos' hottest food spots.",
  color: "text-primary",
  images: [restaurant1, restaurant2]
}, {
  icon: Sparkles,
  title: "Beauty & Spa",
  description: "Indulge in discounted facials, massages, mani-pedis, and more. Self-care just got a whole lot more affordable.",
  color: "text-primary",
  images: [beautySpa1, beautySpa2]
}, {
  icon: Dumbbell,
  title: "Health & Fitness",
  description: "From fitness classes to yoga sessions and gym passes — find deals that help you move, sweat, and feel your best.",
  color: "text-primary",
  images: [healthFitness1, healthFitness2]
}, {
  icon: Compass,
  title: "Things To Do",
  description: "Paint-and-sip, boat cruises, games, events — explore Lagos with unbeatable deals on experiences.",
  color: "text-primary",
  images: [thingsToDo]
}, {
  icon: ShoppingBag,
  title: "Retail",
  description: "Shop exclusive discounts on fashion, accessories, thrift finds, and more. Stylish steals you won't find anywhere else.",
  color: "text-primary",
  images: [retail1, retail2]
}, {
  icon: Home,
  title: "Home & Lifestyle",
  description: "Transform your space with deals on furniture, decor, and lifestyle essentials. Style your home for less.",
  color: "text-primary",
  images: [homeLifestyle1, homeLifestyle2]
}, {
  icon: Smartphone,
  title: "Electronics & Gadgets",
  description: "Score deals on the latest tech, gadgets, and electronics. Upgrade your devices without breaking the bank.",
  color: "text-primary",
  images: [electronics1, electronics2]
}];
const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  
  return <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Categories</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Tap into Lagos' urban youth, young professionals, and experience-seeking middle-class
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Categories that benefit most from off-peak boosts and word-of-mouth exposure
          </p>
        </div>

        {/* Desktop: 7 columns, Tablet: 3 columns, Mobile: 1 column */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-6">
          {categories.map((category, index) => <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-white" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Image - Fixed height, no scaling */}
              <div className="relative h-64 overflow-hidden">
                <img src={hoveredIndex === index && category.images[1] ? category.images[1] : category.images[0]} alt={category.title} className="w-full h-full object-cover transition-opacity duration-300" />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <category.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-lg font-bold mb-2">
                  {category.title}
                </h3>
                
                <p className="text-xs text-white/90 mb-3 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full bg-white text-foreground hover:bg-white/90 font-semibold text-xs"
                  onClick={() => setIsWaitlistOpen(true)}
                >
                  View Deals
                </Button>
              </div>

              {/* Image indicator dots - only if multiple images */}
              {category.images.length > 1 && <div className="absolute top-4 right-4 flex gap-1">
                  {category.images.map((_, imgIndex) => <div key={imgIndex} className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${hoveredIndex === index && imgIndex === 1 || hoveredIndex !== index && imgIndex === 0 ? "bg-white w-4" : "bg-white/50"}`} />)}
                </div>}
            </div>)}
        </div>
      </div>
      
      <WaitlistModal 
        open={isWaitlistOpen} 
        onOpenChange={setIsWaitlistOpen}
        type="shopper"
      />
    </section>;
};
export default Categories;