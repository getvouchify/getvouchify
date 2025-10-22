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
  const [offers, setOffers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
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
      setOffers(data || []);
    } catch (error) {
      console.error("Error loading offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({ is_active: !currentStatus })
        .eq("id", offerId);

      if (error) throw error;
      
      toast.success(`Offer ${!currentStatus ? "activated" : "deactivated"}`);
      loadOffers();
    } catch (error) {
      toast.error("Failed to update offer status");
    }
  };

  const deleteOffer = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", offerId);

      if (error) throw error;
      
      toast.success("Offer deleted successfully");
      loadOffers();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = filteredOffers.map(offer => ({
    Merchant: offer.merchants?.name || offer.merchant,
    Title: offer.title,
    Category: offer.category,
    Discount: offer.discount,
    "Original Price": offer.original_price,
    "Current Price": offer.current_price,
    "Sold Count": offer.sold_count,
    Status: offer.is_active ? "Active" : "Inactive",
    "Created At": new Date(offer.created_at).toLocaleDateString(),
  }));

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Offers</h2>
              <p className="text-muted-foreground">
                Manage all offers on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <ExportButton 
                data={exportData} 
                filename="vouchify-offers" 
                sheetName="Offers" 
              />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Offer
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search offers..."
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
                ) : filteredOffers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No offers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        {offer.merchants?.name || offer.merchant}
                      </TableCell>
                      <TableCell>{offer.title}</TableCell>
                      <TableCell>{offer.category}</TableCell>
                      <TableCell>{offer.discount}</TableCell>
                      <TableCell>
                        {offer.current_price ? `₦${offer.current_price}` : offer.offer}
                      </TableCell>
                      <TableCell>{offer.sold_count}</TableCell>
                      <TableCell>
                        <Badge variant={offer.is_active ? "default" : "secondary"}>
                          {offer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                          >
                            {offer.is_active ? (
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
                            onClick={() => deleteOffer(offer.id)}
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
