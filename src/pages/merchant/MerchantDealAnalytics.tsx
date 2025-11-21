import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MerchantDealAnalytics() {
  const { dealId } = useParams();
  const [deal, setDeal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    completedBookings: 0,
    pendingBookings: 0,
  });
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    loadDealAndAnalytics();
  }, [dealId]);

  const loadDealAndAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: merchant } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!merchant) return;

      const { data: dealData, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .eq("merchant_id", merchant.id)
        .single();

      if (error) throw error;

      setDeal(dealData);

      // Query real analytics data
      // 1. Get total revenue from orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("deal_id", dealId)
        .eq("payment_status", "completed");

      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // 2. Get booking statistics
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("status")
        .eq("deal_id", dealId);

      const completedBookings = bookingsData?.filter(b => b.status === "completed").length || 0;
      const pendingBookings = bookingsData?.filter(b => b.status === "pending").length || 0;

      // 3. Get last 7 days performance data
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentBookings } = await supabase
        .from("bookings")
        .select("created_at")
        .eq("deal_id", dealId)
        .gte("created_at", sevenDaysAgo.toISOString());

      // Group bookings by day
      const dailySales: { [key: string]: number } = {};
      recentBookings?.forEach(booking => {
        const date = new Date(booking.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        dailySales[date] = (dailySales[date] || 0) + 1;
      });

      // Generate last 7 days with actual data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      const chartData = [];
      
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (today - i + 7) % 7;
        const dayName = days[dayIndex];
        chartData.push({
          name: dayName,
          sales: dailySales[dayName] || 0,
        });
      }

      setPerformanceData(chartData);
      setAnalytics({ 
        totalSales: dealData.sold_count || 0,
        totalRevenue,
        completedBookings,
        pendingBookings,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Deal not found</p>
        <Button asChild className="mt-4">
          <Link to="/merchant/deals">Back to Deals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/merchant/deals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deal Analytics</h2>
          <p className="text-muted-foreground">{deal.title}</p>
        </div>
      </div>

      {/* Deal Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-6">
            <img
              src={deal.image_url}
              alt={deal.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
              <div className="flex gap-2 mb-2">
                <Badge>{deal.category}</Badge>
                <Badge variant={deal.is_active ? "default" : "secondary"}>
                  {deal.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-primary">
                ₦{Number(deal.current_price).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total bookings sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Bookings completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Bookings for the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {performanceData.length > 0 && performanceData.some(d => d.sales > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No booking data available for the last 7 days
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Price:</span>
              <span className="font-medium">₦{Number(deal.original_price).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Price:</span>
              <span className="font-medium">₦{Number(deal.current_price).toLocaleString()}</span>
            </div>
            {deal.discount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-primary">{deal.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {new Date(deal.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {deal.usage_limit && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usage Limit:</span>
                <span className="font-medium">{deal.usage_limit}</span>
              </div>
            )}
            {deal.daily_limit && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Limit:</span>
                <span className="font-medium">{deal.daily_limit}</span>
              </div>
            )}
            {deal.expiry_date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">
                  {new Date(deal.expiry_date).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requires Booking:</span>
              <span className="font-medium">{deal.requires_booking ? "Yes" : "No"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
