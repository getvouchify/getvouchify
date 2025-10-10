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

const categories = [
  {
    icon: Utensils,
    title: "Food & Drink",
    description: "Restaurants, bars, cafes. Lagos has a booming food scene, but competition is fierce.",
    color: "text-primary",
    images: [restaurant1, restaurant2],
  },
  {
    icon: Sparkles,
    title: "Beauty & Spa",
    description: "Salons, nail techs, skincare clinics. High demand for self-care services.",
    color: "text-primary",
    images: [beautySpa1, beautySpa2],
  },
  {
    icon: Dumbbell,
    title: "Health & Fitness",
    description: "Gyms, yoga classes, dance studios, wellness coaches. Rising interest in fitness culture.",
    color: "text-primary",
    images: [healthFitness1, healthFitness2],
  },
  {
    icon: Compass,
    title: "Things To Do",
    description: "Paint & sip, escape rooms, boat cruises, comedy shows, tours, game nights.",
    color: "text-primary",
    images: [thingsToDo],
  },
  {
    icon: ShoppingBag,
    title: "Retail",
    description: "Fashion boutiques, thrift stores, accessories, home decor. Targets impulse buyers with deal urgency.",
    color: "text-primary",
    images: [retail1, retail2],
  },
];

const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
              Lagos-Focused
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our 5 Core Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Tap into Lagos' urban youth, young professionals, and experience-seeking middle-class
          </p>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Categories that benefit most from off-peak boosts and word-of-mouth exposure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image Background */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={category.images[0]}
                  alt={`${category.title} - Main`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    hoveredIndex === index && category.images.length > 1
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                />
                {category.images.length > 1 && (
                  <img
                    src={category.images[1]}
                    alt={`${category.title} - Secondary`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      hoveredIndex === index
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="mb-3 flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full group-hover:bg-primary transition-all duration-300">
                    <category.icon className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {category.title}
                </h3>
                
                <p className="text-xs text-white/90 mb-3 leading-relaxed line-clamp-3">
                  {category.description}
                </p>

                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full bg-white text-foreground hover:bg-white/90 font-semibold shadow-lg"
                >
                  View Deals
                </Button>
              </div>

              {/* Image Count Indicator */}
              {category.images.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-1.5">
                  {category.images.map((_, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        hoveredIndex === index && imgIndex === 1
                          ? "w-6 bg-white"
                          : hoveredIndex !== index && imgIndex === 0
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
