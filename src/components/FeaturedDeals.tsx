import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import dealFood from "@/assets/deal-food.jpg";
import dealSpa from "@/assets/deal-spa.jpg";
import dealFitness from "@/assets/deal-fitness.jpg";
import dealThingsToDo from "@/assets/categories/things-to-do.jpg";
import paintSip from "@/assets/paint-sip.jpg";
import dealRetail1 from "@/assets/deal-retail-1.webp";
import dealRetail2 from "@/assets/deal-retail-2.webp";

const deals = [
  {
    id: 1,
    image: dealFood,
    merchant: "Lagoon Restaurant",
    title: "2 for 1 Cocktails",
    category: "Food & Drink",
    discount: "HAPPY HOUR",
    offer: "Only during happy hour 4-7 PM on weekdays",
    soldCount: 847,
  },
  {
    id: 2,
    image: dealSpa,
    merchant: "Serenity Spa",
    title: "Self-Care Wednesday: Facials & Massages",
    category: "Beauty & Spa",
    discount: "65% OFF",
    offer: "Up to 65% Off",
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
    image: dealRetail1,
    merchant: "Afrocentric Boutique",
    title: "Designer Clothing & Accessories",
    category: "Retail",
    discount: "50% OFF",
    offer: "Half Off Everything",
    soldCount: 634,
  },
  {
    id: 5,
    image: paintSip,
    merchant: "Lagos Adventure Club",
    title: "Paint & Sip Experience",
    category: "Things To Do",
    discount: "40% OFF",
    offer: "Group Discount Available",
    soldCount: 892,
  },
  {
    id: 6,
    image: dealRetail2,
    merchant: "Urban Fashion House",
    title: "Premium Fashion Collection",
    category: "Retail",
    discount: "SALE",
    offer: "Up to 60% Off",
    soldCount: 745,
  },
];

const FeaturedDeals = ({ searchQuery }: { searchQuery?: string }) => {
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState("popular");
  const [filterCategory, setFilterCategory] = useState("all");

  // Filter deals
  let filteredDeals = deals.filter((deal) => {
    const matchesSearch = !searchQuery || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || deal.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort deals
  filteredDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.currentPrice - b.currentPrice;
      case "price-high":
        return b.currentPrice - a.currentPrice;
      case "discount":
        return parseInt(b.discount) - parseInt(a.discount);
      case "popular":
      default:
        return b.soldCount - a.soldCount;
    }
  });

  return (
    <section id="featured-deals" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Today's Featured Deals"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {searchQuery ? `Found ${filteredDeals.length} deals` : "Limited time offers you don't want to miss"}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                <SelectItem value="Beauty & Spa">Beauty & Spa</SelectItem>
                <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                <SelectItem value="Things To Do">Things To Do</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="discount">Highest Discount</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDeals.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-muted-foreground">No deals found matching your criteria</p>
            </div>
          ) : (
            filteredDeals.map((deal, index) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow-card hover-lift overflow-hidden group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image with Discount Badge */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="gradient-gold text-accent-foreground font-bold text-lg px-4 py-2 shadow-lg">
                    {deal.discount}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {deal.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{deal.merchant}</p>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {deal.title}
                </h3>

                {/* Price or Offer */}
                <div className="mb-3">
                  {deal.currentPrice ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-primary">
                        ₦{deal.currentPrice.toLocaleString()}
                      </span>
                      {deal.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₦{deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-primary">
                      {deal.offer}
                    </div>
                  )}
                </div>

                {/* Sold Count */}
                <p className="text-sm text-muted-foreground mb-4">
                  🔥 {deal.soldCount.toLocaleString()}+ sold
                </p>

                <Button 
                  onClick={() => addToCart(deal)}
                  className="w-full bg-primary hover:bg-accent hover:text-accent-foreground font-semibold"
                >
                  Claim Now!
                </Button>
              </div>
            </div>
          ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8"
          >
            View All Deals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
