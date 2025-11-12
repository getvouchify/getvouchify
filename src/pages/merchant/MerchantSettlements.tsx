import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMerchant } from "@/hooks/useMerchant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Settlement {
  id: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  payout_status: string;
  payout_date?: string;
  transaction_reference?: string;
  notes?: string;
  created_at: string;
}

export default function MerchantSettlements() {
  const { merchantData } = useMerchant();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [filteredSettlements, setFilteredSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Calculate summary metrics
  const totalEarnings = settlements.reduce((sum, s) => sum + Number(s.total_amount), 0);
  const pendingPayout = settlements
    .filter((s) => s.payout_status === "pending")
    .reduce((sum, s) => sum + Number(s.total_amount), 0);
  const lastPayout = settlements.find((s) => s.payout_status === "paid");
  const nextPayout = settlements.find((s) => s.payout_status === "pending");

  useEffect(() => {
    if (merchantData?.id) {
      fetchSettlements();
    }
  }, [merchantData]);

  useEffect(() => {
    filterSettlements();
  }, [settlements, statusFilter]);

  const fetchSettlements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("settlements")
        .select("*")
        .eq("merchant_id", merchantData?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSettlements(data || []);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      toast.error("Failed to load settlements");
    } finally {
      setIsLoading(false);
    }
  };

  const filterSettlements = () => {
    if (statusFilter === "all") {
      setFilteredSettlements(settlements);
    } else {
      setFilteredSettlements(settlements.filter((s) => s.payout_status === statusFilter));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "paid":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewDetails = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setIsDetailOpen(true);
  };

  const exportSettlements = () => {
    const headers = ["Period", "Amount", "Status", "Payout Date", "Reference"];
    const rows = filteredSettlements.map((s) => [
      `${format(new Date(s.period_start), "PP")} - ${format(new Date(s.period_end), "PP")}`,
      `₦${s.total_amount}`,
      s.payout_status,
      s.payout_date ? format(new Date(s.payout_date), "PP") : "N/A",
      s.transaction_reference || "N/A",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settlements-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Settlements exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settlements</h1>
          <p className="text-muted-foreground">Track your earnings and payouts</p>
        </div>
        <Button onClick={exportSettlements} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₦{pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{lastPayout ? Number(lastPayout.total_amount).toLocaleString() : 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastPayout?.payout_date ? format(new Date(lastPayout.payout_date), "PP") : "No payouts yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextPayout ? format(new Date(nextPayout.period_end), "PP") : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estimated date</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
          <CardDescription>View all your past and pending settlements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Settlement Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payout Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading settlements...
                    </TableCell>
                  </TableRow>
                ) : filteredSettlements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No settlements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSettlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{format(new Date(settlement.period_start), "PP")}</div>
                            <div className="text-xs text-muted-foreground">
                              to {format(new Date(settlement.period_end), "PP")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">₦{Number(settlement.total_amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(settlement.payout_status)}>{settlement.payout_status}</Badge>
                      </TableCell>
                      <TableCell>
                        {settlement.payout_date ? format(new Date(settlement.payout_date), "PP") : "Pending"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {settlement.transaction_reference || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(settlement)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settlement Details</DialogTitle>
            <DialogDescription>Complete information for this settlement</DialogDescription>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Period Start</p>
                  <p>{format(new Date(selectedSettlement.period_start), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Period End</p>
                  <p>{format(new Date(selectedSettlement.period_end), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">₦{Number(selectedSettlement.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedSettlement.payout_status)}>
                    {selectedSettlement.payout_status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payout Date</p>
                  <p>
                    {selectedSettlement.payout_date
                      ? format(new Date(selectedSettlement.payout_date), "PPP")
                      : "Not yet paid"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transaction Reference</p>
                  <p className="font-mono">{selectedSettlement.transaction_reference || "N/A"}</p>
                </div>
                {selectedSettlement.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedSettlement.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
