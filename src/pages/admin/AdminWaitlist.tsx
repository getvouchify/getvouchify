import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { ExportButton } from "@/components/admin/ExportButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [editEntry, setEditEntry] = useState<any>(null);
  const [deleteEntry, setDeleteEntry] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    type: "",
    interests: [] as string[],
  });

  useEffect(() => {
    loadWaitlist();
  }, []);

  const loadWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWaitlist(data || []);
    } catch (error) {
      console.error("Error loading waitlist:", error);
      toast.error("Failed to load waitlist");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWaitlist = waitlist.filter(entry =>
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const merchantWaitlist = filteredWaitlist.filter(entry => entry.type === "merchant");
  const shopperWaitlist = filteredWaitlist.filter(entry => entry.type === "shopper");

  const getActiveData = () => {
    switch (activeTab) {
      case "merchants":
        return merchantWaitlist;
      case "shoppers":
        return shopperWaitlist;
      default:
        return filteredWaitlist;
    }
  };

  const activeData = getActiveData();

  const handleEdit = (entry: any) => {
    setEditEntry(entry);
    setFormData({
      name: entry.name || "",
      email: entry.email || "",
      phone: entry.phone || "",
      business_name: entry.business_name || "",
      type: entry.type || "",
      interests: entry.interests || [],
    });
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from("waitlist")
        .update({
          name: formData.name || null,
          email: formData.email,
          phone: formData.phone || null,
          business_name: formData.business_name || null,
          type: formData.type,
          interests: formData.interests.length > 0 ? formData.interests : null,
        })
        .eq("id", editEntry.id);

      if (error) throw error;
      
      toast.success("Waitlist entry updated successfully");
      setEditEntry(null);
      loadWaitlist();
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error("Failed to update entry");
    }
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;

    try {
      const { error } = await supabase
        .from("waitlist")
        .delete()
        .eq("id", deleteEntry.id);

      if (error) throw error;
      
      toast.success("Waitlist entry deleted successfully");
      setDeleteEntry(null);
      loadWaitlist();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const exportData = activeData.map(entry => ({
    Email: entry.email,
    Name: entry.name || "N/A",
    Phone: entry.phone || "N/A",
    "Business Name": entry.business_name || "N/A",
    Type: entry.type,
    Interests: entry.interests?.join(", ") || "N/A",
    "Signed Up": new Date(entry.created_at).toLocaleDateString(),
  }));

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Waitlist</h2>
              <p className="text-muted-foreground">
                Manage waitlist signups
              </p>
            </div>
            <ExportButton 
              data={exportData} 
              filename="vouchify-waitlist" 
              sheetName="Waitlist" 
            />
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search waitlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="outline" className="ml-2">{filteredWaitlist.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="merchants">
                Merchants <Badge variant="outline" className="ml-2">{merchantWaitlist.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="shoppers">
                Shoppers <Badge variant="outline" className="ml-2">{shopperWaitlist.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : activeData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No waitlist entries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeData.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.email}</TableCell>
                          <TableCell>{entry.name || "N/A"}</TableCell>
                          <TableCell>{entry.phone || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={entry.type === "shopper" ? "default" : "secondary"}>
                              {entry.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{entry.business_name || "N/A"}</TableCell>
                          <TableCell>
                            {entry.interests?.join(", ") || "N/A"}
                          </TableCell>
                          <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(entry)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteEntry(entry)}
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
            </TabsContent>
          </Tabs>

          <Dialog open={!!editEntry} onOpenChange={() => setEditEntry(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Waitlist Entry</DialogTitle>
                <DialogDescription>
                  Update the details for this waitlist entry
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-business">Business Name</Label>
                  <Input
                    id="edit-business"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopper">Shopper</SelectItem>
                      <SelectItem value="merchant">Merchant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditEntry(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!deleteEntry} onOpenChange={() => setDeleteEntry(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this waitlist entry. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
