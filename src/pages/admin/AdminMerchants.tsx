import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { MerchantDialog } from "@/components/admin/MerchantDialog";
import { MerchantReviewDialog } from "@/components/admin/MerchantReviewDialog";
import { ExportButton } from "@/components/admin/ExportButton";

export default function AdminMerchants() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
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
    } catch (error: any) {
      console.error("Error loading merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
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
    } catch (error: any) {
      console.error("Error deleting merchant:", error);
      toast.error("Failed to delete merchant");
    }
  };

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch = 
      merchant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = merchants.filter(m => m.status === 'pending').length;
  const approvedCount = merchants.filter(m => m.status === 'approved').length;
  const rejectedCount = merchants.filter(m => m.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const exportData = filteredMerchants.map((merchant) => ({
    Name: merchant.name,
    Email: merchant.email,
    Category: merchant.category,
    Status: merchant.status || 'pending',
    Phone: merchant.phone,
    Address: merchant.address,
    "Created At": merchant.created_at ? new Date(merchant.created_at).toLocaleDateString() : "",
  }));

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Merchants</CardTitle>
                <CardDescription>Manage merchant accounts and profiles</CardDescription>
              </div>
              <div className="flex gap-2">
                <ExportButton data={exportData} filename="merchants" sheetName="Merchants" />
                <Button onClick={() => {
                  setSelectedMerchant(null);
                  setDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Merchant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">All ({merchants.length})</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingCount})
                    {pendingCount > 0 && (
                      <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mb-4">
                <Input
                  placeholder="Search merchants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMerchants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No merchants found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMerchants.map((merchant) => (
                          <TableRow key={merchant.id}>
                            <TableCell className="font-medium">{merchant.name}</TableCell>
                            <TableCell>{merchant.email}</TableCell>
                            <TableCell>{merchant.category}</TableCell>
                            <TableCell>{getStatusBadge(merchant.status || 'pending')}</TableCell>
                            <TableCell>
                              {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedMerchant(merchant);
                                  setReviewDialogOpen(true);
                                }}
                                title="Review Application"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <MerchantDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            merchant={selectedMerchant}
            onSuccess={loadMerchants}
          />
          
          <MerchantReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            merchant={selectedMerchant}
            onSuccess={loadMerchants}
          />
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
