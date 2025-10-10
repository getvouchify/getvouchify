import { Utensils, Sparkles, Dumbbell, Compass, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
const categories = [{
  icon: Utensils,
  title: "Food & Drink",
  description: "Restaurants, bars, cafes. Lagos has a booming food scene, but competition is fierce.",
  color: "text-primary",
  images: [restaurant1, restaurant2]
}, {
  icon: Sparkles,
  title: "Beauty & Spa",
  description: "Salons, nail techs, skincare clinics. High demand for self-care services.",
  color: "text-primary",
  images: [beautySpa1, beautySpa2]
}, {
  icon: Dumbbell,
  title: "Health & Fitness",
  description: "Gyms, yoga classes, dance studios, wellness coaches. Rising interest in fitness culture.",
  color: "text-primary",
  images: [healthFitness1, healthFitness2]
}, {
  icon: Compass,
  title: "Things To Do",
  description: "Paint & sip, escape rooms, boat cruises, comedy shows, tours, game nights.",
  color: "text-primary",
  images: [thingsToDo]
}, {
  icon: ShoppingBag,
  title: "Retail",
  description: "Fashion boutiques, thrift stores, accessories, home decor. Targets impulse buyers with deal urgency.",
  color: "text-primary",
  images: [retail1, retail2]
}];
const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
              Lagos-Focused
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Categories</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Tap into Lagos' urban youth, young professionals, and experience-seeking middle-class
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Categories that benefit most from off-peak boosts and word-of-mouth exposure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover-scale cursor-pointer" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Image Background */}
              <div className="relative h-80 overflow-hidden">
                <img src={category.images[0]} alt={`${category.title} - Main`} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hoveredIndex === index && category.images.length > 1 ? "opacity-0 scale-110" : "opacity-100 scale-100"}`} />
                {category.images.length > 1 && <img src={category.images[1]} alt={`${category.title} - Secondary`} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-110"}`} />}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="mb-4 flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <category.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:translate-x-1 transition-transform">
                  {category.title}
                </h3>
                
                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                  {category.description}
                </p>

                <Button variant="secondary" className="w-full bg-white text-foreground hover:bg-white/90 font-semibold shadow-lg">
                  View Deals
                </Button>
              </div>

              {/* Image Count Indicator */}
              {category.images.length > 1 && <div className="absolute top-4 right-4 flex gap-1.5">
                  {category.images.map((_, imgIndex) => <div key={imgIndex} className={`h-1.5 rounded-full transition-all duration-300 ${hoveredIndex === index && imgIndex === 1 ? "w-6 bg-white" : hoveredIndex !== index && imgIndex === 0 ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />)}
                </div>}
            </div>)}
        </div>
      </div>
    </section>;
};
export default Categories;