import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WaitlistModal from "./WaitlistModal";

const FeaturedDeals = ({ searchQuery }: { searchQuery?: string }) => {
  const [sortBy, setSortBy] = useState("popular");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error("Error loading deals:", error);
      toast({
        title: "Error",
        description: "Failed to load deals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        if (!a.current_price) return 1;
        if (!b.current_price) return -1;
        return a.current_price - b.current_price;
      case "price-high":
        if (!a.current_price) return 1;
        if (!b.current_price) return -1;
        return b.current_price - a.current_price;
      case "discount":
        return parseInt(b.discount) - parseInt(a.discount);
      case "popular":
      default:
        return b.sold_count - a.sold_count;
    }
  });

  return (
    <section id="featured-deals" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Preview: Deals Coming Soon"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {searchQuery ? `Found ${filteredDeals.length} deals` : "Join the waitlist to be the first to access exclusive offers"}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          <div className="flex gap-3 items-center">
            <span className="text-base font-semibold text-foreground">Filter:</span>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px] min-h-[44px] border-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2">
                <SelectItem value="all" className="min-h-[44px]">All Categories</SelectItem>
                <SelectItem value="Food & Drinks" className="min-h-[44px]">Food & Drinks 🍴</SelectItem>
                <SelectItem value="Beauty & Spa" className="min-h-[44px]">Beauty & Spa</SelectItem>
                <SelectItem value="Health & Fitness" className="min-h-[44px]">Health & Fitness</SelectItem>
                <SelectItem value="Things To Do" className="min-h-[44px]">Things To Do</SelectItem>
                <SelectItem value="Retail" className="min-h-[44px]">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 items-center">
            <span className="text-base font-semibold text-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] min-h-[44px] border-2">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2">
                <SelectItem value="popular" className="min-h-[44px]">Most Popular</SelectItem>
                <SelectItem value="discount" className="min-h-[44px]">Highest Discount</SelectItem>
                <SelectItem value="price-low" className="min-h-[44px]">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="min-h-[44px]">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          {isLoading ? (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-muted-foreground">Loading deals...</p>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <Sparkles className="w-16 h-16 mx-auto text-primary/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Amazing Deals Coming Soon! 🎉
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  We're curating the best deals in Lagos just for you. Be the first to know when we launch exclusive offers!
                </p>
                <Button 
                  onClick={() => setWaitlistOpen(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-14 text-lg min-h-[44px] gradient-primary hover-lift"
                >
                  Join the Waitlist
                </Button>
              </div>
            </div>
          ) : (
            filteredDeals.map((deal, index) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl shadow-card hover-lift overflow-hidden group cursor-pointer animate-fade-in border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image with Discount Badge */}
              <div className="relative overflow-hidden h-56 md:h-64">
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="gradient-gold text-accent-foreground font-bold text-base md:text-lg px-4 py-2 shadow-lg">
                    {deal.discount}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-white/95 text-foreground font-semibold">
                    {deal.category}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge className="bg-white text-primary font-bold text-lg px-4 py-2">
                    Coming Soon
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <p className="text-sm md:text-base text-muted-foreground mb-2 font-medium">{deal.merchant}</p>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                  {deal.title}
                </h3>

                {/* Price or Offer */}
                <div className="mb-4">
                  {deal.current_price ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        ₦{Number(deal.current_price).toLocaleString()}
                      </span>
                      {deal.original_price && (
                        <span className="text-base md:text-lg text-muted-foreground line-through">
                          ₦{Number(deal.original_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-lg md:text-xl font-bold text-primary">
                      {deal.offer}
                    </div>
                  )}
                </div>

                {/* Sold Count */}
                <p className="text-sm md:text-base text-muted-foreground mb-6">
                  🔥 {deal.sold_count.toLocaleString()}+ interested
                </p>

                <Button 
                  onClick={() => setWaitlistOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base h-12 min-h-[44px]"
                >
                  Get Notified
                </Button>
              </div>
            </div>
          ))
          )}
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg" 
            onClick={() => setWaitlistOpen(true)}
            className="border-2 border-primary text-white bg-primary hover:bg-primary/90 font-bold px-10 h-14 text-lg min-h-[44px] gradient-primary hover-lift"
          >
            Join Waitlist for Early Access
          </Button>
        </div>
      </div>
      
      <WaitlistModal 
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        type="customer"
      />
    </section>
  );
};

export default FeaturedDeals;
