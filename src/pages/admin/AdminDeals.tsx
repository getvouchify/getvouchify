import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { ExportButton } from "@/components/admin/ExportButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDeals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          merchants (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error("Error loading deals:", error);
      toast.error("Failed to load deals");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDealStatus = async (dealId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({ is_active: !currentStatus })
        .eq("id", dealId);

      if (error) throw error;
      
      toast.success(`Deal ${!currentStatus ? "activated" : "deactivated"}`);
      loadDeals();
    } catch (error) {
      toast.error("Failed to update deal status");
    }
  };

  const deleteDeal = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", dealId);

      if (error) throw error;
      
      toast.success("Deal deleted successfully");
      loadDeals();
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = filteredDeals.map(deal => ({
    Merchant: deal.merchants?.name || deal.merchant,
    Title: deal.title,
    Category: deal.category,
    Discount: deal.discount,
    "Original Price": deal.original_price,
    "Current Price": deal.current_price,
    "Sold Count": deal.sold_count,
    Status: deal.is_active ? "Active" : "Inactive",
    "Created At": new Date(deal.created_at).toLocaleDateString(),
  }));

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Deals</h2>
              <p className="text-muted-foreground">
                Manage all deals on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <ExportButton 
                data={exportData} 
                filename="vouchify-deals" 
                sheetName="Deals" 
              />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No deals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">
                        {deal.merchants?.name || deal.merchant}
                      </TableCell>
                      <TableCell>{deal.title}</TableCell>
                      <TableCell>{deal.category}</TableCell>
                      <TableCell>{deal.discount}</TableCell>
                      <TableCell>
                        {deal.current_price ? `₦${deal.current_price}` : deal.offer}
                      </TableCell>
                      <TableCell>{deal.sold_count}</TableCell>
                      <TableCell>
                        <Badge variant={deal.is_active ? "default" : "secondary"}>
                          {deal.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleDealStatus(deal.id, deal.is_active)}
                          >
                            {deal.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDeal(deal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
