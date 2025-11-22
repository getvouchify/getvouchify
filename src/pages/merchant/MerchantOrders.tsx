import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMerchant } from "@/hooks/useMerchant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Search, Eye, Download, Truck, Package, CheckCircle, Clock, MapPin, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  time_slot?: string;
  status: string;
  qr_code: string;
  special_instructions?: string;
  created_at: string;
  deal_id: string;
  customer_address?: string;
  delivery_status?: string;
  shipped_at?: string;
  delivered_at?: string;
  tracking_notes?: string;
  deals?: {
    title: string;
    current_price: number;
    fulfillment_type?: string;
    delivery_address?: string;
    delivery_fee?: number;
  };
}

export default function MerchantOrders() {
  const { merchantData } = useMerchant();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [trackingNote, setTrackingNote] = useState("");

  useEffect(() => {
    if (merchantData?.id) {
      fetchBookings();
    }
  }, [merchantData]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, statusFilter, fulfillmentFilter]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          deals (
            title,
            current_price,
            fulfillment_type,
            delivery_address,
            delivery_fee
          )
        `)
        .eq("merchant_id", merchantData?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.qr_code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    if (fulfillmentFilter !== "all") {
      filtered = filtered.filter((b) => {
        if (fulfillmentFilter === "pickup") {
          return b.deals?.fulfillment_type === "pickup";
        } else if (fulfillmentFilter === "delivery") {
          return b.deals?.fulfillment_type === "delivery";
        }
        return true;
      });
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setTrackingNote("");
    setIsDetailOpen(true);
  };

  const getDeliveryStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "out_for_delivery":
        return "bg-indigo-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDeliveryStatusLabel = (status?: string) => {
    switch (status) {
      case "out_for_delivery":
        return "Out for Delivery";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
    }
  };

  const updateDeliveryStatus = async (bookingId: string, newStatus: string) => {
    try {
      const updateData: any = { delivery_status: newStatus };
      
      if (newStatus === "shipped") {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === "delivered") {
        updateData.delivered_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", bookingId);
        
      if (error) throw error;
      
      await fetchBookings();
      setSelectedBooking((prev) => prev ? { ...prev, delivery_status: newStatus, ...updateData } : null);
      toast.success(`Order marked as ${getDeliveryStatusLabel(newStatus)}`);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Failed to update delivery status");
    }
  };

  const addTrackingNote = async () => {
    if (!selectedBooking || !trackingNote.trim()) return;

    try {
      const timestamp = format(new Date(), "MMM dd, yyyy hh:mm a");
      const newNote = `${timestamp} - ${trackingNote}`;
      const existingNotes = selectedBooking.tracking_notes || "";
      const updatedNotes = existingNotes 
        ? `${newNote}\n${existingNotes}` 
        : newNote;

      const { error } = await supabase
        .from("bookings")
        .update({ tracking_notes: updatedNotes })
        .eq("id", selectedBooking.id);
        
      if (error) throw error;
      
      await fetchBookings();
      setSelectedBooking((prev) => prev ? { ...prev, tracking_notes: updatedNotes } : null);
      setTrackingNote("");
      toast.success("Tracking note added");
    } catch (error) {
      console.error("Error adding tracking note:", error);
      toast.error("Failed to add tracking note");
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Deal", "Date", "Time", "Status", "Amount"];
    const rows = filteredBookings.map((b) => [
      b.qr_code,
      b.customer_name,
      b.customer_email,
      b.deals?.title || "N/A",
      format(new Date(b.booking_date), "PP"),
      b.time_slot || "N/A",
      b.status,
      `₦${b.deals?.current_price || 0}`,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Orders exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders & Bookings</h1>
          <p className="text-muted-foreground">Manage all customer orders and bookings</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage customer bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fulfillmentFilter} onValueChange={setFulfillmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Fulfillment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pickup">Pick-Up Only</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">{booking.qr_code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{booking.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.deals?.title || "N/A"}</TableCell>
                      <TableCell>
                        {booking.deals?.fulfillment_type === "pickup" ? (
                          <Badge variant="outline" className="gap-1">
                            <Package className="h-3 w-3" />
                            Pick-Up
                          </Badge>
                        ) : booking.deals?.fulfillment_type === "delivery" ? (
                          <Badge variant="outline" className="gap-1">
                            <Truck className="h-3 w-3" />
                            Delivery
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(booking.booking_date), "PP")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {booking.deals?.fulfillment_type === "delivery" ? (
                          <Badge className={getDeliveryStatusColor(booking.delivery_status)}>
                            {getDeliveryStatusLabel(booking.delivery_status)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>₦{booking.deals?.current_price || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete information for this booking</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Fulfillment Type Badge */}
              <div className="flex items-center gap-2">
                {selectedBooking.deals?.fulfillment_type === "pickup" ? (
                  <Badge variant="outline" className="gap-1">
                    <Package className="h-4 w-4" />
                    Pick-Up Order
                  </Badge>
                ) : selectedBooking.deals?.fulfillment_type === "delivery" ? (
                  <Badge variant="outline" className="gap-1">
                    <Truck className="h-4 w-4" />
                    Delivery Order
                  </Badge>
                ) : null}
                <Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge>
              </div>

              {/* Delivery Timeline - Only for Delivery Orders */}
              {selectedBooking.deals?.fulfillment_type === "delivery" && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Delivery Timeline
                  </h3>
                  <div className="space-y-2">
                    {["pending", "processing", "shipped", "out_for_delivery", "delivered"].map((status, index) => {
                      const isActive = selectedBooking.delivery_status === status;
                      const isPast = ["pending", "processing", "shipped", "out_for_delivery", "delivered"].indexOf(selectedBooking.delivery_status || "pending") > index;
                      const timestamp = status === "shipped" ? selectedBooking.shipped_at : status === "delivered" ? selectedBooking.delivered_at : null;
                      
                      return (
                        <div key={status} className={`flex items-center gap-3 ${isActive || isPast ? "text-foreground" : "text-muted-foreground"}`}>
                          {isActive || isPast ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{getDeliveryStatusLabel(status)}</div>
                            {timestamp && (
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(timestamp), "MMM dd, yyyy hh:mm a")}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t">
                    {selectedBooking.delivery_status === "pending" && (
                      <Button size="sm" onClick={() => updateDeliveryStatus(selectedBooking.id, "processing")}>
                        Mark as Processing
                      </Button>
                    )}
                    {selectedBooking.delivery_status === "processing" && (
                      <Button size="sm" onClick={() => updateDeliveryStatus(selectedBooking.id, "shipped")}>
                        Mark as Shipped
                      </Button>
                    )}
                    {selectedBooking.delivery_status === "shipped" && (
                      <Button size="sm" onClick={() => updateDeliveryStatus(selectedBooking.id, "out_for_delivery")}>
                        Mark as Out for Delivery
                      </Button>
                    )}
                    {selectedBooking.delivery_status === "out_for_delivery" && (
                      <Button size="sm" onClick={() => updateDeliveryStatus(selectedBooking.id, "delivered")}>
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm">{selectedBooking.qr_code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                    <p>{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedBooking.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{selectedBooking.customer_phone || "N/A"}</p>
                  </div>
                  {selectedBooking.customer_address && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Delivery Address
                      </p>
                      <p className="text-sm mt-1">{selectedBooking.customer_address}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedBooking.customer_address || "");
                          toast.success("Address copied to clipboard");
                        }}
                      >
                        Copy Address
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Information */}
              <div className="space-y-3">
                <h3 className="font-semibold">Deal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deal</p>
                    <p>{selectedBooking.deals?.title || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p>₦{selectedBooking.deals?.current_price || 0}</p>
                  </div>
                  {selectedBooking.deals?.delivery_fee && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Delivery Fee</p>
                      <p>₦{selectedBooking.deals.delivery_fee}</p>
                      <p className="text-xs text-muted-foreground">(Paid to rider)</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Booking Date</p>
                    <p>{format(new Date(selectedBooking.booking_date), "PPP")}</p>
                  </div>
                  {selectedBooking.time_slot && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time Slot</p>
                      <p>{selectedBooking.time_slot}</p>
                    </div>
                  )}
                  {selectedBooking.special_instructions && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Special Instructions</p>
                      <p className="text-sm">{selectedBooking.special_instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Notes - Only for Delivery Orders */}
              {selectedBooking.deals?.fulfillment_type === "delivery" && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Tracking Notes
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tracking_note">Add Note</Label>
                    <Textarea
                      id="tracking_note"
                      placeholder="E.g., Package dispatched, Rider assigned, etc."
                      value={trackingNote}
                      onChange={(e) => setTrackingNote(e.target.value)}
                      rows={2}
                    />
                    <Button size="sm" onClick={addTrackingNote} disabled={!trackingNote.trim()}>
                      Add Note
                    </Button>
                  </div>

                  {selectedBooking.tracking_notes && (
                    <div className="space-y-2 pt-3 border-t">
                      <p className="text-sm font-medium text-muted-foreground">Note History</p>
                      <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
                        {selectedBooking.tracking_notes.split('\n').map((note, index) => (
                          <p key={index} className="text-muted-foreground">{note}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
