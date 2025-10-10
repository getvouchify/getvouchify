import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import dealFood from "@/assets/deal-food.jpg";
import dealSpa from "@/assets/deal-spa.jpg";
import dealFitness from "@/assets/deal-fitness.jpg";

const deals = [
  {
    id: 1,
    image: dealFood,
    merchant: "The Gourmet Kitchen",
    title: "3-Course Tasting Menu for Two",
    category: "Food & Drink",
    discount: "55% OFF",
    originalPrice: 48000,
    currentPrice: 21600,
    soldCount: 847,
  },
  {
    id: 2,
    image: dealSpa,
    merchant: "Serenity Spa & Wellness",
    title: "90-Min Deep Tissue Massage",
    category: "Beauty & Spa",
    discount: "65% OFF",
    originalPrice: 72000,
    currentPrice: 25200,
    soldCount: 1203,
  },
  {
    id: 3,
    image: dealFitness,
    merchant: "FitZone Premium Studio",
    title: "6-Month All-Access Membership",
    category: "Health & Fitness",
    discount: "70% OFF",
    originalPrice: 239600,
    currentPrice: 71600,
    soldCount: 562,
  },
  {
    id: 4,
    image: dealFood,
    merchant: "Bella Italia Ristorante",
    title: "Authentic Italian Dinner & Wine",
    category: "Food & Drink",
    discount: "45% OFF",
    originalPrice: 34000,
    currentPrice: 18400,
    soldCount: 923,
  },
  {
    id: 5,
    image: dealSpa,
    merchant: "Glow Beauty Bar",
    title: "Deluxe Facial + Manicure Combo",
    category: "Beauty & Spa",
    discount: "60% OFF",
    originalPrice: 56000,
    currentPrice: 22400,
    soldCount: 1456,
  },
  {
    id: 6,
    image: dealFitness,
    merchant: "Yoga Sanctuary",
    title: "20 Yoga Classes + Mat",
    category: "Health & Fitness",
    discount: "50% OFF",
    originalPrice: 96000,
    currentPrice: 48000,
    soldCount: 689,
  },
];

const FeaturedDeals = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Trending in Lagos
            </h2>
            <p className="text-muted-foreground">
              Discover the hottest deals near you
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Deals
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.slice(0, 3).map((deal, index) => (
            <div
              key={deal.id}
              className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-bold">
                  {deal.discount}
                </Badge>
              </div>

              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{deal.category}</p>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {deal.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {deal.merchant}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground line-through">
                      ₦{deal.originalPrice.toLocaleString()}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₦{deal.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {deal.soldCount}+ sold
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="w-full md:w-auto">
            View All Deals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
