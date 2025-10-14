import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tag, ShoppingCart, Store, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalMerchants: 0,
    waitlistCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [dealsRes, ordersRes, merchantsRes, waitlistRes] = await Promise.all([
        supabase.from("deals").select("*", { count: "exact" }),
        supabase.from("orders").select("total_amount", { count: "exact" }),
        supabase.from("merchants").select("*", { count: "exact" }),
        supabase.from("waitlist").select("*", { count: "exact" }),
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const activeDeals = dealsRes.data?.filter(d => d.is_active).length || 0;

      setStats({
        totalDeals: dealsRes.count || 0,
        activeDeals,
        totalOrders: ordersRes.count || 0,
        totalRevenue,
        totalMerchants: merchantsRes.count || 0,
        waitlistCount: waitlistRes.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Deals",
      value: stats.totalDeals,
      subtitle: `${stats.activeDeals} active`,
      icon: Tag,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtitle: `₦${stats.totalRevenue.toLocaleString()} revenue`,
      icon: ShoppingCart,
    },
    {
      title: "Merchants",
      value: stats.totalMerchants,
      icon: Store,
    },
    {
      title: "Waitlist",
      value: stats.waitlistCount,
      icon: Users,
    },
  ];

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of your Vouchify platform
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
