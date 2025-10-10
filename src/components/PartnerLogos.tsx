import { Store, Coffee, Dumbbell, Scissors, ShoppingBag, Sparkles } from "lucide-react";

const PartnerLogos = () => {
  const partners = [
    { name: "Premium Fitness", icon: Dumbbell },
    { name: "Gourmet Eats", icon: Coffee },
    { name: "Luxury Spas", icon: Sparkles },
    { name: "Style Salon", icon: Scissors },
    { name: "Retail Plus", icon: ShoppingBag },
    { name: "Local Markets", icon: Store },
  ];

  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
          Trusted by Leading Merchants Across Industries
        </p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity group"
            >
              <partner.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs text-center text-muted-foreground font-medium">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
