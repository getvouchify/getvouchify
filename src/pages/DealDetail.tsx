import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar,
  Package,
  Truck,
  Star,
  CheckCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Deal {
  id: string;
  title: string;
  category: string;
  merchant: string;
  merchant_id: string;
  image_url: string;
  deal_images: any;
  current_price: number | null;
  original_price: number | null;
  discount: string | null;
  offer: string | null;
  full_description?: string;
  terms_and_conditions: string | null;
  listing_type: string | null;
  merchant_loyalty_details: string | null;
  fulfillment_type: string | null;
  delivery_fee: number | null;
  delivery_address: string | null;
  requires_booking: boolean;
  available_days: string[] | null;
  deal_start_date: string | null;
  deal_end_date: string | null;
  age_restriction: string | null;
  sold_count: number;
  merchants?: {
    name: string;
    address: string;
    phone: string;
    logo_url: string;
  };
}

const DealDetail = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (dealId) {
      loadDeal();
    }
  }, [dealId]);

  const loadDeal = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          merchants (
            name,
            address,
            phone,
            logo_url
          )
        `)
        .eq("id", dealId)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      
      setDeal(data);
      setSelectedImage(data.image_url);
    } catch (error) {
      console.error("Error loading deal:", error);
      toast({
        title: "Error",
        description: "Failed to load deal details",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const getListingTypeBadge = () => {
    if (!deal) return null;
    
    if (deal.listing_type === 'loyalty_program') {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          Merchant Loyalty
        </Badge>
      );
    }
    
    if (deal.listing_type === 'discounted_offer' && deal.discount) {
      return (
        <Badge className="gradient-gold text-accent-foreground">
          {deal.discount} OFF
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        Standard Listing
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading deal details...</p>
      </div>
    );
  }

  if (!deal) {
    return null;
  }

  const allImages = deal.deal_images && Array.isArray(deal.deal_images) && deal.deal_images.length > 0
    ? [deal.image_url, ...deal.deal_images]
    : [deal.image_url];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 md:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deals
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-border">
              <img
                src={selectedImage}
                alt={deal.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === img ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${deal.title} ${idx + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Deal Information */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {deal.category}
              </Badge>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {deal.title}
                </h1>
                {getListingTypeBadge()}
              </div>
              <p className="text-lg text-muted-foreground">{deal.merchant}</p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-border py-6">
              {deal.current_price ? (
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">
                    ₦{Number(deal.current_price).toLocaleString()}
                  </span>
                  {deal.original_price && (
                    <span className="text-2xl text-muted-foreground line-through">
                      ₦{Number(deal.original_price).toLocaleString()}
                    </span>
                  )}
                </div>
              ) : deal.offer && (
                <div className="text-2xl font-bold text-primary">
                  {deal.offer}
                </div>
              )}

              {deal.merchant_loyalty_details && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-1">
                    Loyalty Reward:
                  </p>
                  <p className="text-sm text-purple-700">
                    {deal.merchant_loyalty_details}
                  </p>
                </div>
              )}
            </div>

            {/* Fulfillment Options */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Fulfillment Options
                </h3>
                
                {deal.fulfillment_type === 'pickup' && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Pick-Up Only</p>
                      <p className="text-sm text-muted-foreground">
                        Collect from merchant location
                      </p>
                    </div>
                  </div>
                )}

                {deal.fulfillment_type === 'delivery' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Home Delivery Available</p>
                        <p className="text-sm text-muted-foreground">
                          Delivery fee: ₦{Number(deal.delivery_fee || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          (Paid to rider upon delivery)
                        </p>
                      </div>
                    </div>
                    {deal.delivery_address && (
                      <div className="ml-8 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">Delivery Zone:</p>
                        <p>{deal.delivery_address}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Information */}
            {deal.requires_booking && (
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Booking Required
                  </h3>
                  
                  {deal.available_days && deal.available_days.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Available Days:</p>
                      <div className="flex flex-wrap gap-2">
                        {deal.available_days.map((day) => (
                          <Badge key={day} variant="outline">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(deal.deal_start_date || deal.deal_end_date) && (
                    <div className="text-sm text-muted-foreground">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {deal.deal_start_date && deal.deal_end_date ? (
                        <>Valid: {new Date(deal.deal_start_date).toLocaleDateString()} - {new Date(deal.deal_end_date).toLocaleDateString()}</>
                      ) : deal.deal_start_date ? (
                        <>Starts: {new Date(deal.deal_start_date).toLocaleDateString()}</>
                      ) : (
                        <>Ends: {new Date(deal.deal_end_date!).toLocaleDateString()}</>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {deal.full_description && (
              <div>
                <h3 className="font-semibold text-lg mb-3">About This Deal</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {deal.full_description}
                </p>
              </div>
            )}

            {/* Terms & Conditions */}
            {deal.terms_and_conditions && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Terms & Conditions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {deal.terms_and_conditions}
                </p>
              </div>
            )}

            {/* Age Restriction */}
            {deal.age_restriction && (
              <div className="text-sm text-muted-foreground">
                Age Restriction: {deal.age_restriction}
              </div>
            )}

            {/* Social Proof */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{deal.sold_count.toLocaleString()}+ people interested</span>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate(`/checkout/${deal.id}`)}
              size="lg"
              className="w-full h-14 text-lg gradient-primary hover-lift"
            >
              Book Now
            </Button>

            {/* Merchant Info */}
            {deal.merchants && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {deal.merchants.logo_url && (
                      <img
                        src={deal.merchants.logo_url}
                        alt={deal.merchants.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        {deal.merchants.name}
                      </h4>
                      {deal.merchants.address && (
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {deal.merchants.address}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DealDetail;
