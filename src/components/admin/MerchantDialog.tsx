import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant?: any;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Restaurant & Food",
  "Beauty & Spa",
  "Health & Fitness",
  "Retail & Shopping",
  "Things to Do",
  "Electronics",
  "Home & Lifestyle",
];

export function MerchantDialog({ open, onOpenChange, merchant, onSuccess }: MerchantDialogProps) {
  const [formData, setFormData] = useState({
    name: merchant?.name || "",
    email: merchant?.email || "",
    phone: merchant?.phone || "",
    address: merchant?.address || "",
    category: merchant?.category || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (merchant) {
        // Update existing merchant
        const { error } = await supabase
          .from("merchants")
          .update(formData)
          .eq("id", merchant.id);

        if (error) throw error;
        toast.success("Merchant updated successfully");
      } else {
        // Create new merchant
        const { error } = await supabase
          .from("merchants")
          .insert([formData]);

        if (error) throw error;
        toast.success("Merchant added successfully");
      }

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        category: "",
      });
    } catch (error: any) {
      console.error("Error saving merchant:", error);
      toast.error(error.message || "Failed to save merchant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{merchant ? "Edit Merchant" : "Add New Merchant"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter business name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="business@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Business address"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : merchant ? "Update" : "Add Merchant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}