import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, ShoppingBag, TrendingUp, Package, ShoppingCart, DollarSign, Store } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stats {
  totalWaitlist: number;
  merchantSignups: number;
  shopperSignups: number;
  signupsLast7Days: number;
  totalDeals: number;
  totalOrders: number;
  totalRevenue: number;
  totalMerchants: number;
}

interface RecentSignup {
  id: string;
  email: string;
  name: string;
  type: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalWaitlist: 0,
    merchantSignups: 0,
    shopperSignups: 0,
    signupsLast7Days: 0,
    totalDeals: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalMerchants: 0,
  });
  const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentSignups();
  }, []);

  const loadStats = async () => {
    try {
      // Waitlist stats
      const { data: waitlistData, error: waitlistError } = await supabase
        .from("waitlist")
        .select("*");

      if (waitlistError) throw waitlistError;

      const totalWaitlist = waitlistData?.length || 0;
      const merchantSignups = waitlistData?.filter(w => w.type === 'business').length || 0;
      const shopperSignups = waitlistData?.filter(w => w.type === 'customer').length || 0;
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const signupsLast7Days = waitlistData?.filter(
        w => new Date(w.created_at) >= sevenDaysAgo
      ).length || 0;

      // Offers stats
      const { count: dealsCount } = await supabase
        .from("deals")
        .select("*", { count: "exact", head: true });

      // Orders stats
      const { data: ordersData } = await supabase
        .from("orders")
        .select("total_amount");

      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Merchants stats
      const { count: merchantsCount } = await supabase
        .from("merchants")
        .select("*", { count: "exact", head: true });

      setStats({
        totalWaitlist,
        merchantSignups,
        shopperSignups,
        signupsLast7Days,
        totalDeals: dealsCount || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        totalMerchants: merchantsCount || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadRecentSignups = async () => {
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select("id, email, name, type, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentSignups(data || []);
    } catch (error) {
      console.error("Error loading recent signups:", error);
    }
  };

  const primaryStats = [
    {
      title: "Total Waitlist",
      value: stats.totalWaitlist,
      subtitle: "Total signups",
      icon: Users,
      trend: stats.signupsLast7Days > 0 ? `+${stats.signupsLast7Days} this week` : null
    },
    {
      title: "Merchants",
      value: stats.merchantSignups,
      subtitle: "Business signups",
      icon: Briefcase,
    },
    {
      title: "Shoppers",
      value: stats.shopperSignups,
      subtitle: "Customer signups",
      icon: ShoppingBag,
    },
    {
      title: "7 Day Growth",
      value: stats.signupsLast7Days,
      subtitle: "New signups",
      icon: TrendingUp,
    },
  ];

  const secondaryStats = [
    {
      title: "Total Offers",
      value: stats.totalDeals,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: "Merchants DB",
      value: stats.totalMerchants,
      icon: Store,
    },
  ];

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Waitlist performance and platform overview
            </p>
          </div>

          {/* Primary Stats - Large Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {primaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                    {stat.trend && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {stat.trend}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Secondary Stats - Smaller Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {secondaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Waitlist Signups */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Waitlist Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSignups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No signups yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentSignups.map((signup) => (
                      <TableRow key={signup.id}>
                        <TableCell className="font-medium">
                          {signup.name || "—"}
                        </TableCell>
                        <TableCell>{signup.email}</TableCell>
                        <TableCell className="capitalize">{signup.type}</TableCell>
                        <TableCell>
                          {new Date(signup.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}