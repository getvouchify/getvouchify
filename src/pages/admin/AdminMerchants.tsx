import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { ExportButton } from "@/components/admin/ExportButton";
import { MerchantDialog } from "@/components/admin/MerchantDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminMerchants() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      console.error("Error loading merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMerchant = async (merchantId: string) => {
    if (!confirm("Are you sure you want to delete this merchant?")) return;

    try {
      const { error } = await supabase
        .from("merchants")
        .delete()
        .eq("id", merchantId);

      if (error) throw error;
      
      toast.success("Merchant deleted successfully");
      loadMerchants();
    } catch (error) {
      toast.error("Failed to delete merchant");
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = filteredMerchants.map(merchant => ({
    Name: merchant.name,
    Email: merchant.email,
    Phone: merchant.phone,
    Address: merchant.address,
    Category: merchant.category,
    "Created At": new Date(merchant.created_at).toLocaleDateString(),
  }));

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Merchants</h2>
              <p className="text-muted-foreground">
                Manage merchant accounts
              </p>
            </div>
            <div className="flex gap-2">
              <ExportButton 
                data={exportData} 
                filename="vouchify-merchants" 
                sheetName="Merchants" 
              />
              <Button onClick={() => {
                setSelectedMerchant(null);
                setDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Merchant
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredMerchants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No merchants found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMerchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.name}</TableCell>
                      <TableCell>{merchant.email}</TableCell>
                      <TableCell>{merchant.phone || "N/A"}</TableCell>
                      <TableCell>{merchant.category}</TableCell>
                      <TableCell>{new Date(merchant.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMerchant(merchant.id)}
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
        
        <MerchantDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          merchant={selectedMerchant}
          onSuccess={loadMerchants}
        />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
