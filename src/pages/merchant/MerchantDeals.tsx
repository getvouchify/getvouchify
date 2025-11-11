import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Tag } from "lucide-react";
import { DealCard } from "@/components/merchant/DealCard";

export default function MerchantDeals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, [statusFilter]);

  const loadDeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: merchant } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!merchant) return;

      let query = supabase
        .from("deals")
        .select("*")
        .eq("merchant_id", merchant.id)
        .order("created_at", { ascending: false });

      if (statusFilter === "active") {
        query = query.eq("is_active", true);
      } else if (statusFilter === "inactive") {
        query = query.eq("is_active", false);
      } else if (statusFilter === "expired") {
        query = query.lt("expiry_date", new Date().toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error("Error loading deals:", error);
      toast.error("Failed to load deals");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Deals</h2>
          <p className="text-muted-foreground">Create and manage your exclusive deals</p>
        </div>
        <Button asChild>
          <Link to="/merchant/deals/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Deal
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Tabs value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <TabsList>
            <TabsTrigger value="all">All ({deals.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({deals.filter(d => d.is_active).length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({deals.filter(d => !d.is_active).length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              Expired ({deals.filter(d => new Date(d.expiry_date) < new Date()).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : filteredDeals.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No deals yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first deal to start attracting customers
          </p>
          <Button asChild>
            <Link to="/merchant/deals/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Deal
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} onUpdate={loadDeals} />
          ))}
        </div>
      )}
    </div>
  );
}
