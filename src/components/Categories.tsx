import { Utensils, Sparkles, Dumbbell, Compass, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Utensils,
    title: "Food & Drink",
    description: "Restaurants, cafes, bars and more",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    title: "Beauty & Spa",
    description: "Salons, massage, cosmetic treatments",
    color: "text-primary",
  },
  {
    icon: Dumbbell,
    title: "Health & Fitness",
    description: "Gyms, yoga studios, wellness programs",
    color: "text-primary",
  },
  {
    icon: Compass,
    title: "Things to Do",
    description: "Entertainment, travel, events, workshops",
    color: "text-primary",
  },
  {
    icon: ShoppingBag,
    title: "Retail",
    description: "Fashion, gadgets, home goods",
    color: "text-primary",
  },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Explore Our Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find amazing deals across all your favorite activities and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center hover-lift shadow-card cursor-pointer group"
            >
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                  <category.icon className={`w-8 h-8 ${category.color} group-hover:text-white`} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {category.description}
              </p>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold"
              >
                View Deals
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
