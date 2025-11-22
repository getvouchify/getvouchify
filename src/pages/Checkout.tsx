import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Package, Truck, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { z } from "zod";

interface Deal {
  id: string;
  title: string;
  merchant: string;
  merchant_id: string;
  image_url: string;
  current_price: number | null;
  fulfillment_type: string | null;
  delivery_fee: number | null;
  delivery_address: string | null;
  requires_booking: boolean;
  available_days: string[] | null;
}

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().trim().email("Invalid email address"),
  customer_phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  special_instructions: z.string().optional(),
  customer_address: z.string().optional(),
  booking_date: z.string().optional(),
  time_slot: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    special_instructions: "",
    customer_address: "",
    booking_date: "",
    time_slot: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  useEffect(() => {
    if (dealId) {
      loadDeal();
    }
  }, [dealId]);

  const loadDeal = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      setDeal(data);
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

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const generateQRCode = () => {
    return `VOU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      const validatedData = checkoutSchema.parse(formData);
      
      // Additional validation for delivery
      if (deal?.fulfillment_type === 'delivery' && !formData.customer_address?.trim()) {
        setErrors(prev => ({ ...prev, customer_address: "Delivery address is required" }));
        return;
      }

      // Additional validation for booking
      if (deal?.requires_booking && !formData.booking_date) {
        setErrors(prev => ({ ...prev, booking_date: "Booking date is required" }));
        return;
      }

      setIsSubmitting(true);

      const bookingData = {
        deal_id: dealId!,
        merchant_id: deal!.merchant_id,
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email,
        customer_phone: validatedData.customer_phone,
        customer_address: deal?.fulfillment_type === 'delivery' ? validatedData.customer_address || null : null,
        delivery_status: deal?.fulfillment_type === 'delivery' ? 'pending' : null,
        booking_date: validatedData.booking_date || null,
        time_slot: validatedData.time_slot || null,
        special_instructions: validatedData.special_instructions || null,
        qr_code: generateQRCode(),
        status: 'confirmed',
      };

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your booking has been confirmed",
      });

      navigate(`/order-confirmation/${booking.id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
      } else {
        console.error("Error creating booking:", error);
        toast({
          title: "Error",
          description: "Failed to create booking. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!deal) {
    return null;
  }

  const totalAmount = deal.current_price || 0;
  const deliveryFee = deal.fulfillment_type === 'delivery' ? (deal.delivery_fee || 0) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 md:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(`/deals/${dealId}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deal
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => handleInputChange('customer_name', e.target.value)}
                      placeholder="John Doe"
                      className={errors.customer_name ? "border-red-500" : ""}
                    />
                    {errors.customer_name && (
                      <p className="text-sm text-red-500 mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customer_email">Email Address *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => handleInputChange('customer_email', e.target.value)}
                      placeholder="john@example.com"
                      className={errors.customer_email ? "border-red-500" : ""}
                    />
                    {errors.customer_email && (
                      <p className="text-sm text-red-500 mt-1">{errors.customer_email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                      placeholder="+234 803 123 4567"
                      className={errors.customer_phone ? "border-red-500" : ""}
                    />
                    {errors.customer_phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.customer_phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address - Conditional */}
              {deal.fulfillment_type === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customer_address">Full Address *</Label>
                      <Textarea
                        id="customer_address"
                        value={formData.customer_address}
                        onChange={(e) => handleInputChange('customer_address', e.target.value)}
                        placeholder="Street address, city, state"
                        rows={3}
                        className={errors.customer_address ? "border-red-500" : ""}
                      />
                      {errors.customer_address && (
                        <p className="text-sm text-red-500 mt-1">{errors.customer_address}</p>
                      )}
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Delivery fee (₦{Number(deliveryFee).toLocaleString()}) will be paid to the rider upon delivery
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Date/Time - Conditional */}
              {deal.requires_booking && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Select Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="booking_date">Booking Date *</Label>
                      <Input
                        id="booking_date"
                        type="date"
                        value={formData.booking_date}
                        onChange={(e) => handleInputChange('booking_date', e.target.value)}
                        className={errors.booking_date ? "border-red-500" : ""}
                      />
                      {errors.booking_date && (
                        <p className="text-sm text-red-500 mt-1">{errors.booking_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="time_slot">Time Slot (Optional)</Label>
                      <Input
                        id="time_slot"
                        type="time"
                        value={formData.time_slot}
                        onChange={(e) => handleInputChange('time_slot', e.target.value)}
                      />
                    </div>

                    {deal.available_days && deal.available_days.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Available on:</p>
                        <p>{deal.available_days.join(', ')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.special_instructions}
                    onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg gradient-primary hover-lift"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={deal.image_url}
                    alt={deal.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground">{deal.merchant}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-semibold">
                      ₦{Number(totalAmount).toLocaleString()}
                    </span>
                  </div>

                  {deal.fulfillment_type === 'delivery' && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery Fee (paid to rider)</span>
                      <span>₦{Number(deliveryFee).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₦{Number(totalAmount).toLocaleString()}
                  </span>
                </div>

                {/* Fulfillment Type Badge */}
                <div className="flex items-center gap-2 text-sm">
                  {deal.fulfillment_type === 'pickup' ? (
                    <>
                      <Package className="h-4 w-4 text-primary" />
                      <span>Pick-Up Order</span>
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Delivery Order</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
