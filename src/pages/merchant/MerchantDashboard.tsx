import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tag, ShoppingCart, DollarSign, Wallet, QrCode, MessageSquare, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function MerchantDashboard() {
  const [stats, setStats] = useState({
    activeDeals: 0,
    totalOrders: 0,
    totalBookings: 0,
    revenue: 0,
    pendingPayout: 0,
    unreadMessages: 0,
    pendingRedemptions: 0,
  });
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [dealRevenueData, setDealRevenueData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: merchant } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!merchant) return;

      // Count active deals
      const { count: dealsCount } = await supabase
        .from("deals")
        .select("*", { count: 'exact', head: true })
        .eq("merchant_id", merchant.id)
        .eq("is_active", true);

      // Count orders this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("deal_id, deals!inner(merchant_id)", { count: 'exact', head: true })
        .eq("deals.merchant_id", merchant.id)
        .gte("created_at", startOfMonth.toISOString());

      // Count bookings
      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: 'exact', head: true })
        .eq("merchant_id", merchant.id)
        .eq("status", "confirmed");

      // Calculate revenue
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, deal_id, deals!inner(merchant_id)")
        .eq("deals.merchant_id", merchant.id)
        .eq("payment_status", "completed");

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Get pending payout
      const { data: settlements } = await supabase
        .from("settlements")
        .select("total_amount")
        .eq("merchant_id", merchant.id)
        .eq("payout_status", "pending");

      const pendingPayout = settlements?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0;

      // Count unread messages
      const { count: unreadCount } = await supabase
        .from("merchant_messages")
        .select("*", { count: 'exact', head: true })
        .eq("merchant_id", merchant.id)
        .eq("is_read", false)
        .eq("sender_type", "customer");

      // Count pending redemptions
      const { count: pendingRedemptions } = await supabase
        .from("bookings")
        .select("*", { count: 'exact', head: true })
        .eq("merchant_id", merchant.id)
        .eq("status", "confirmed")
        .is("redeemed_at", null);

      setStats({
        activeDeals: dealsCount || 0,
        totalOrders: ordersCount || 0,
        totalBookings: bookingsCount || 0,
        revenue: totalRevenue,
        pendingPayout,
        unreadMessages: unreadCount || 0,
        pendingRedemptions: pendingRedemptions || 0,
      });

      // Load chart data (last 30 days of orders)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        return {
          date: format(date, "MMM dd"),
          orders: 0,
        };
      });
      setOrdersData(last30Days);

      // Mock top deals revenue data
      setDealRevenueData([
        { dealName: "Deal 1", revenue: 0 },
        { dealName: "Deal 2", revenue: 0 },
        { dealName: "Deal 3", revenue: 0 },
        { dealName: "Deal 4", revenue: 0 },
        { dealName: "Deal 5", revenue: 0 },
      ]);

      setRecentActivity([]);

    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getNextPayoutDate = () => {
    const next = new Date();
    next.setDate(next.getDate() + ((8 - next.getDay()) % 7));
    return format(next, "MMM dd");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your merchant portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">Visible to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+{stats.totalBookings} bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Next payout: {getNextPayoutDate()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Redemptions</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRedemptions}</div>
            <p className="text-xs text-muted-foreground">QR codes to scan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Customer inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
            <CardDescription>Daily orders over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Deals</CardTitle>
            <CardDescription>Revenue by deal this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dealName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your business</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-2">Activity will appear here once you start receiving orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
