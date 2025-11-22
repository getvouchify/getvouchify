import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Package,
  Truck,
  ArrowLeft,
  Mail
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Booking {
  id: string;
  qr_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  booking_date: string | null;
  time_slot: string | null;
  special_instructions: string | null;
  status: string;
  delivery_status: string | null;
  created_at: string;
  deals: {
    id: string;
    title: string;
    merchant: string;
    image_url: string;
    current_price: number | null;
    fulfillment_type: string | null;
    requires_qr_code: boolean;
    merchants: {
      name: string;
      address: string;
      phone: string;
    };
  };
}

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadBooking();
    }
  }, [orderId]);

  const loadBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          deals (
            id,
            title,
            merchant,
            image_url,
            current_price,
            fulfillment_type,
            requires_qr_code,
            merchants (
              name,
              address,
              phone
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error("Error loading booking:", error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-fade-in">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Your order has been successfully placed
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details</CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order ID */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono font-semibold">{booking.qr_code}</p>
              </div>

              <Separator />

              {/* Deal Information */}
              <div className="flex gap-4">
                <img
                  src={booking.deals.image_url}
                  alt={booking.deals.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{booking.deals.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {booking.deals.merchant}
                  </p>
                  {booking.deals.current_price && (
                    <p className="text-lg font-bold text-primary">
                      ₦{Number(booking.deals.current_price).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div className="space-y-2">
                <h4 className="font-semibold">Customer Information</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Name:</span> {booking.customer_name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {booking.customer_email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {booking.customer_phone}</p>
                </div>
              </div>

              {/* Booking Date/Time */}
              {booking.booking_date && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Booking Schedule
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}</p>
                      {booking.time_slot && (
                        <p><span className="text-muted-foreground">Time:</span> {booking.time_slot}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* QR Code */}
              {booking.deals.requires_qr_code && (
                <>
                  <Separator />
                  <div className="text-center space-y-3">
                    <h4 className="font-semibold">Your QR Code</h4>
                    <div className="bg-white p-6 rounded-lg border-2 border-border inline-block">
                      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Present this QR code to the merchant upon arrival
                    </p>
                  </div>
                </>
              )}

              {/* Special Instructions */}
              {booking.special_instructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Special Instructions</h4>
                    <p className="text-sm text-muted-foreground">{booking.special_instructions}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Fulfillment Information Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {booking.deals.fulfillment_type === 'pickup' ? (
                  <><Package className="h-5 w-5" /> Pick-Up Information</>
                ) : (
                  <><Truck className="h-5 w-5" /> Delivery Information</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.deals.fulfillment_type === 'pickup' && booking.deals.merchants && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Pick-Up Location</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">{booking.deals.merchants.name}</p>
                        <p className="text-muted-foreground">{booking.deals.merchants.address}</p>
                        <p className="text-muted-foreground mt-1">
                          Phone: {booking.deals.merchants.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      Please visit the merchant location to collect your order. Remember to bring your QR code!
                    </p>
                  </div>
                </div>
              )}

              {booking.deals.fulfillment_type === 'delivery' && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Address</h4>
                    <p className="text-sm text-muted-foreground">{booking.customer_address}</p>
                  </div>
                  
                  {booking.delivery_status && (
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Status</h4>
                      <Badge variant="outline">
                        {booking.delivery_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      Your order will be delivered to the address provided. The merchant will contact you with delivery updates.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Confirmation Notice */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Confirmation Email Sent</p>
                  <p className="text-muted-foreground">
                    We've sent a confirmation email to <strong>{booking.customer_email}</strong> with all your booking details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => window.print()}
              size="lg"
              className="flex-1 gradient-primary"
            >
              Print Confirmation
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
