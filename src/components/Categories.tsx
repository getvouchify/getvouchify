import { Utensils, Sparkles, Dumbbell, Compass, ShoppingBag } from "lucide-react";
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
import thingsToDo2 from "@/assets/categories/things-to-do-2.png";
import retail1 from "@/assets/categories/retail-1.webp";
import retail2 from "@/assets/categories/retail-2.webp";
const categories = [{
  icon: Utensils,
  title: "Food & Drinks 🍴",
  description: "Discover exclusive restaurant offers, happy hour offers, and 2-for-1 dining experiences at Lagos' hottest food spots.",
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
  description: "From fitness classes to yoga sessions and gym passes — find offers that help you move, sweat, and feel your best.",
  color: "text-primary",
  images: [healthFitness1, healthFitness2]
}, {
  icon: Compass,
  title: "Things To Do",
  description: "Paint-and-sip, boat cruises, games, events — explore Lagos with unbeatable offers on experiences.",
  color: "text-primary",
  images: [thingsToDo, thingsToDo2]
}, {
  icon: ShoppingBag,
  title: "Retail",
  description: "Shop exclusive discounts on fashion, accessories, thrift finds, and more. Stylish steals you won't find anywhere else.",
  color: "text-primary",
  images: [retail1, retail2]
}];
const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  return <section id="categories" className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Categories</h2>
          
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">Smart offers that drive traffic, fill quiet hours, and get people talking.</p>
        </div>

        {/* Desktop: 5 columns, Tablet: 3 columns, Mobile: 1 column */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
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
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-white">
                <h3 className="text-base md:text-lg font-bold mb-1.5 md:mb-2">
                  {category.title}
                </h3>
                
                <p className="text-[10px] md:text-xs text-white/90 mb-2 md:mb-3 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                <div className="mt-2 space-y-2">
                  <span className="inline-block bg-primary/20 text-white text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                  <Button variant="secondary" size="sm" className="w-full bg-white text-foreground hover:bg-white/90 font-semibold text-[10px] md:text-xs h-8 md:h-9" onClick={() => setIsWaitlistOpen(true)}>
                    Get Notified
                  </Button>
                </div>
              </div>

              {/* Image indicator dots - only if multiple images */}
              {category.images.length > 1 && <div className="absolute top-4 right-4 flex gap-1">
                  {category.images.map((_, imgIndex) => <div key={imgIndex} className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${hoveredIndex === index && imgIndex === 1 || hoveredIndex !== index && imgIndex === 0 ? "bg-white w-4" : "bg-white/50"}`} />)}
                </div>}
            </div>)}
        </div>
      </div>
      
      <WaitlistModal open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} type="customer" />
    </section>;
};
export default Categories;