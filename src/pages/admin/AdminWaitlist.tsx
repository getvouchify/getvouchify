import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { ExportButton } from "@/components/admin/ExportButton";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
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

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const exportData = filteredWaitlist.map(entry => ({
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredWaitlist.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No waitlist entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWaitlist.map((entry) => (
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
