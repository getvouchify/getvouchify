import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Loader2, AlertTriangle, FileText, Eye, Download, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MerchantReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: any;
  onSuccess: () => void;
}

export const MerchantReviewDialog = ({ open, onOpenChange, merchant, onSuccess }: MerchantReviewDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const maskAccountNumber = (accNum: string) => {
    if (!accNum || accNum.length < 4) return accNum;
    return "*".repeat(accNum.length - 4) + accNum.slice(-4);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: updateError } = await supabase
        .from("merchants")
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by_admin_id: user?.id,
        })
        .eq("id", merchant.id);
        
      if (updateError) throw updateError;
      
      await supabase.functions.invoke('send-merchant-approval', {
        body: {
          merchant_email: merchant.email || merchant.primary_contact_email,
          merchant_name: merchant.name,
          dashboard_url: `${window.location.origin}/merchant/dashboard`,
        }
      });
      
      toast.success(`${merchant.name} has been approved and notified via email.`);
      onSuccess();
      onOpenChange(false);
      
    } catch (error: any) {
      toast.error(error.message || "Approval failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason required");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: updateError } = await supabase
        .from("merchants")
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason.trim(),
          approved_by_admin_id: user?.id,
        })
        .eq("id", merchant.id);
        
      if (updateError) throw updateError;
      
      await supabase.functions.invoke('send-merchant-rejection', {
        body: {
          merchant_email: merchant.email || merchant.primary_contact_email,
          merchant_name: merchant.name,
          rejection_reason: rejectionReason.trim(),
          resubmit_url: `${window.location.origin}/merchant/login`,
        }
      });
      
      toast.success(`${merchant.name} has been notified via email.`);
      setShowRejectDialog(false);
      onSuccess();
      onOpenChange(false);
      
    } catch (error: any) {
      toast.error(error.message || "Rejection failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!merchant) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Review Merchant Application</DialogTitle>
            <DialogDescription>
              {merchant.name} - Applied on {merchant.created_at ? formatDate(merchant.created_at) : "N/A"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-full pr-4">
            {/* Business Information */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Business Name</Label>
                  <p className="font-medium">{merchant.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{merchant.category || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{merchant.short_description || merchant.full_description || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            {(merchant.logo_url || merchant.storefront_image_url) && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Business Images</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  {merchant.logo_url && (
                    <div>
                      <Label>Logo</Label>
                      <img src={merchant.logo_url} alt="Logo" className="w-32 h-32 object-cover rounded mt-2" />
                    </div>
                  )}
                  {merchant.storefront_image_url && (
                    <div>
                      <Label>Storefront</Label>
                      <img src={merchant.storefront_image_url} alt="Storefront" className="w-48 h-32 object-cover rounded mt-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {merchant.address && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p>{merchant.address}</p>
                    </div>
                    {(merchant.state || merchant.city) && (
                      <div>
                        <Label className="text-muted-foreground">State / City / LGA</Label>
                        <p>{[merchant.state, merchant.city, merchant.lga].filter(Boolean).join(", ") || "N/A"}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            {(merchant.primary_contact_email || merchant.email) && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground font-semibold">Primary Contact</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      {merchant.primary_contact_name && <div><strong>Name:</strong> {merchant.primary_contact_name}</div>}
                      {merchant.primary_contact_email && <div><strong>Email:</strong> {merchant.primary_contact_email}</div>}
                      {merchant.primary_contact_phone && <div><strong>Phone:</strong> {merchant.primary_contact_phone}</div>}
                      {!merchant.primary_contact_email && merchant.email && <div><strong>Email:</strong> {merchant.email}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Banking Information */}
            {merchant.bank_name && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Banking Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Bank Name</Label>
                    <p className="font-medium">{merchant.bank_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Name</Label>
                    <p className="font-medium">{merchant.account_name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Account Number</Label>
                    <p className="font-mono">{merchant.account_number ? maskAccountNumber(merchant.account_number) : "N/A"}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
          
          <DialogFooter className="border-t pt-4 mt-4">
            {merchant.status === 'pending' && (
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Application
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve Merchant
                </Button>
              </div>
            )}
            
            {merchant.status === 'approved' && (
              <Badge variant="default" className="text-lg py-2 px-4">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Approved {merchant.approved_at && `on ${formatDate(merchant.approved_at)}`}
              </Badge>
            )}
            
            {merchant.status === 'rejected' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Rejected</AlertTitle>
                <AlertDescription>
                  Reason: {merchant.rejection_reason || "No reason provided"}
                </AlertDescription>
              </Alert>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Merchant Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejection. This will be sent to the merchant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea 
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            className="my-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? "Processing..." : "Reject Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
