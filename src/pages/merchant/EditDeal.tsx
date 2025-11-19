import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DEAL_CATEGORIES, ListingType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Check, Loader2, Info, Calculator, Upload, X, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ListingTypeSelector } from "@/components/merchant/ListingTypeSelector";

const STEPS = [
  { id: 1, label: "Listing Type" },
  { id: 2, label: "Basic Info" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Availability" },
  { id: 5, label: "Booking" },
  { id: 6, label: "Details" },
  { id: 7, label: "Images" },
  { id: 8, label: "Review" },
];

export default function EditDeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    offer: '',
    listing_type: 'full_price' as ListingType,
    merchant_loyalty_details: '',
    original_price: '',
    discount_type: 'percentage',
    discount: '',
    current_price: '',
    deal_start_date: '',
    deal_end_date: '',
    expiry_date: '',
    usage_limit: '',
    daily_limit: '',
    requires_booking: false,
    requires_time_slot: false,
    requires_qr_code: true,
    available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    available_time_slots: [] as any[],
    age_restriction: '',
    terms_and_conditions: '',
    image_url: '',
    deal_images: [] as string[],
  });

  useEffect(() => {
    loadDeal();
  }, [id]);

  const loadDeal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required");
        navigate("/merchant/login");
        return;
      }

      const { data: merchantData } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!merchantData) {
        toast.error("Merchant profile not found");
        navigate("/merchant/deals");
        return;
      }

      const { data: dealData, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;

      // Security check: verify merchant owns this deal
      if (dealData.merchant_id !== merchantData.id) {
        toast.error("You don't have permission to edit this deal");
        navigate("/merchant/deals");
        return;
      }

      // Extract discount value from the formatted string
      let discountValue = '';
      let discountType = 'percentage';
      if (dealData.discount) {
        if (dealData.discount.includes('%')) {
          discountValue = dealData.discount.replace('%', '');
          discountType = 'percentage';
        } else if (dealData.discount.includes('₦')) {
          discountValue = dealData.discount.replace('₦', '');
          discountType = 'fixed';
        }
      }

      // Pre-populate form with existing data
      setFormData({
        title: dealData.title || '',
        category: dealData.category || '',
        offer: dealData.offer || '',
        listing_type: (dealData.listing_type || 'full_price') as ListingType,
        merchant_loyalty_details: dealData.merchant_loyalty_details || '',
        original_price: dealData.original_price?.toString() || '',
        discount_type: dealData.discount_type || discountType,
        discount: discountValue,
        current_price: dealData.current_price?.toString() || '',
        deal_start_date: dealData.deal_start_date || '',
        deal_end_date: dealData.deal_end_date || '',
        expiry_date: dealData.expiry_date || '',
        usage_limit: dealData.usage_limit?.toString() || '',
        daily_limit: dealData.daily_limit?.toString() || '',
        requires_booking: dealData.requires_booking || false,
        requires_time_slot: dealData.requires_time_slot || false,
        requires_qr_code: dealData.requires_qr_code !== false,
        available_days: dealData.available_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        available_time_slots: Array.isArray(dealData.available_time_slots) ? dealData.available_time_slots : [],
        age_restriction: dealData.age_restriction || '',
        terms_and_conditions: dealData.terms_and_conditions || '',
        image_url: dealData.image_url || '',
        deal_images: Array.isArray(dealData.deal_images) ? dealData.deal_images.filter((img): img is string => typeof img === 'string') : [],
      });

      setImagePreview(dealData.image_url || '');
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading deal:", error);
      toast.error("Failed to load deal");
      navigate("/merchant/deals");
    }
  };

  // Auto-calculate current price
  useEffect(() => {
    const original = Number(formData.original_price);
    
    if (formData.listing_type === 'discounted_offer' && formData.discount) {
      const discount = Number(formData.discount);
      let currentPrice = original;
      
      if (formData.discount_type === 'percentage') {
        currentPrice = original - (original * discount / 100);
      } else {
        currentPrice = original - discount;
      }
      
      setFormData(prev => ({ ...prev, current_price: currentPrice.toString() }));
    } else if (formData.listing_type === 'full_price' || formData.listing_type === 'loyalty_program') {
      setFormData(prev => ({ ...prev, current_price: formData.original_price }));
    }
  }, [formData.original_price, formData.discount, formData.discount_type, formData.listing_type]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('merchant-deal-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('merchant-deal-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setImagePreview(publicUrl);
      toast.success("Main image uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (formData.deal_images.length + files.length > 5) {
      toast.error("Maximum 5 additional images allowed");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required");
        return;
      }

      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('merchant-deal-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('merchant-deal-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        deal_images: [...prev.deal_images, ...uploadedUrls]
      }));

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error(error.message || "Failed to upload images");
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deal_images: prev.deal_images.filter((_, i) => i !== index)
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      available_time_slots: [...prev.available_time_slots, { start: '', end: '' }]
    }));
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      available_time_slots: prev.available_time_slots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      available_time_slots: prev.available_time_slots.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return !!formData.listing_type;
      case 2:
        return formData.title && formData.category && formData.offer;
      case 3:
        if (!formData.original_price) return false;
        if (formData.listing_type === 'loyalty_program' && !formData.merchant_loyalty_details) return false;
        if (formData.listing_type === 'discounted_offer' && !formData.discount) return false;
        return true;
      case 4:
        return formData.available_days.length > 0;
      case 7:
        return !!formData.image_url;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: merchant } = await supabase
        .from("merchants")
        .select("id, name")
        .eq("user_id", user.id)
        .single();

      if (!merchant) throw new Error("Merchant not found");

      const { error } = await supabase
        .from("deals")
        .update({
          title: formData.title,
          category: formData.category,
          listing_type: formData.listing_type,
          merchant_loyalty_details: formData.listing_type === 'loyalty_program' ? formData.merchant_loyalty_details : null,
          discount: formData.listing_type === 'discounted_offer' 
            ? (formData.discount_type === 'percentage' ? `${formData.discount}%` : `₦${formData.discount}`)
            : null,
          discount_type: formData.listing_type === 'discounted_offer' ? formData.discount_type : null,
          original_price: formData.original_price ? Number(formData.original_price) : null,
          current_price: formData.current_price ? Number(formData.current_price) : null,
          image_url: formData.image_url,
          deal_images: formData.deal_images,
          offer: formData.offer,
          deal_start_date: formData.deal_start_date || null,
          deal_end_date: formData.deal_end_date || null,
          expiry_date: formData.expiry_date || null,
          usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
          daily_limit: formData.daily_limit ? Number(formData.daily_limit) : null,
          requires_booking: formData.requires_booking,
          requires_time_slot: formData.requires_time_slot,
          requires_qr_code: formData.requires_qr_code,
          available_days: formData.available_days,
          available_time_slots: formData.available_time_slots,
          age_restriction: formData.age_restriction || null,
          terms_and_conditions: formData.terms_and_conditions || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Deal updated successfully!");
      navigate("/merchant/deals");
      
    } catch (error: any) {
      console.error("Error updating deal:", error);
      toast.error(error.message || "Failed to update deal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-2xl font-bold">Choose Your Listing Type</h3>
              <p className="text-muted-foreground">
                Select how you want to offer your service. This determines the pricing structure.
              </p>
            </div>
            
            <ListingTypeSelector 
              value={formData.listing_type} 
              onChange={(value) => updateField('listing_type', value)} 
            />
            
            {formData.listing_type === 'full_price' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Full-Price Listing</AlertTitle>
                <AlertDescription>
                  Your service will be listed at regular price with no discounts.
                </AlertDescription>
              </Alert>
            )}
            
            {formData.listing_type === 'loyalty_program' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Loyalty Program</AlertTitle>
                <AlertDescription>
                  You'll add your loyalty incentive in the next steps (e.g., "Book 3 times, get 50% off the 4th").
                </AlertDescription>
              </Alert>
            )}
            
            {formData.listing_type === 'discounted_offer' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Discounted Offer</AlertTitle>
                <AlertDescription>
                  Create a time-limited promotional offer with a discount.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Relaxing Full Body Massage"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="offer">Short Description *</Label>
              <Textarea
                id="offer"
                placeholder="Brief description for preview (160 characters max)"
                value={formData.offer}
                onChange={(e) => updateField('offer', e.target.value)}
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.offer.length}/160 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
              <Badge variant="secondary">
                {formData.listing_type === 'full_price' && 'Full-Price Listing'}
                {formData.listing_type === 'loyalty_program' && 'Loyalty Program'}
                {formData.listing_type === 'discounted_offer' && 'Discounted Offer'}
              </Badge>
            </div>

            <div>
              <Label htmlFor="original_price">Service Price (₦) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <Input
                  id="original_price"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.original_price}
                  onChange={(e) => updateField('original_price', e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the regular price for your service
              </p>
            </div>

            {formData.listing_type === 'loyalty_program' && (
              <div>
                <Label htmlFor="loyalty_details">Loyalty Incentive Details *</Label>
                <Textarea
                  id="loyalty_details"
                  placeholder="e.g., Book 3 times, get 50% off the 4th session"
                  value={formData.merchant_loyalty_details}
                  onChange={(e) => updateField('merchant_loyalty_details', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Clearly describe your loyalty program benefits
                </p>
              </div>
            )}

            {formData.listing_type === 'discounted_offer' && (
              <>
                <div>
                  <Label>Discount Type *</Label>
                  <RadioGroup 
                    value={formData.discount_type} 
                    onValueChange={(v) => updateField('discount_type', v)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage">Percentage (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed Amount (₦)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="discount">Discount Value *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {formData.discount_type === 'percentage' ? '%' : '₦'}
                    </span>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="0"
                      className="pl-8"
                      value={formData.discount}
                      onChange={(e) => updateField('discount', e.target.value)}
                    />
                  </div>
                </div>

                {formData.original_price && formData.discount && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertTitle>Calculated Price</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between">
                          <span>Original Price:</span>
                          <span className="font-medium">₦{Number(formData.original_price).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="font-medium text-destructive">
                            -{formData.discount_type === 'percentage' ? `${formData.discount}%` : `₦${formData.discount}`}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-semibold">Customer Pays:</span>
                          <span className="font-semibold text-primary">
                            ₦{Number(formData.current_price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Available Days *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.available_days.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="capitalize cursor-pointer">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="deal_start_date">Deal Start Date (Optional)</Label>
              <Input
                id="deal_start_date"
                type="date"
                value={formData.deal_start_date}
                onChange={(e) => updateField('deal_start_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="deal_end_date">Deal End Date (Optional)</Label>
              <Input
                id="deal_end_date"
                type="date"
                value={formData.deal_end_date}
                onChange={(e) => updateField('deal_end_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="expiry_date">Voucher Expiry Date (Optional)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => updateField('expiry_date', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How long customers can use the voucher after purchase
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Requires Booking</Label>
                <p className="text-sm text-muted-foreground">
                  Customer must book a specific date/time
                </p>
              </div>
              <Switch
                checked={formData.requires_booking}
                onCheckedChange={(v) => updateField('requires_booking', v)}
              />
            </div>

            {formData.requires_booking && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Requires Time Slot Selection</Label>
                  <p className="text-sm text-muted-foreground">
                    Customer selects specific time slot
                  </p>
                </div>
                <Switch
                  checked={formData.requires_time_slot}
                  onCheckedChange={(v) => updateField('requires_time_slot', v)}
                />
              </div>
            )}

            {formData.requires_time_slot && (
              <div>
                <Label>Available Time Slots</Label>
                <div className="space-y-3 mt-2">
                  {formData.available_time_slots.map((slot, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                        placeholder="Start"
                      />
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                        placeholder="End"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimeSlot}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Requires QR Code</Label>
                <p className="text-sm text-muted-foreground">
                  Generate QR code for redemption
                </p>
              </div>
              <Switch
                checked={formData.requires_qr_code}
                onCheckedChange={(v) => updateField('requires_qr_code', v)}
              />
            </div>

            <div>
              <Label htmlFor="usage_limit">Usage Limit per Customer (Optional)</Label>
              <Input
                id="usage_limit"
                type="number"
                placeholder="No limit"
                value={formData.usage_limit}
                onChange={(e) => updateField('usage_limit', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="daily_limit">Daily Redemption Limit (Optional)</Label>
              <Input
                id="daily_limit"
                type="number"
                placeholder="No limit"
                value={formData.daily_limit}
                onChange={(e) => updateField('daily_limit', e.target.value)}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="age_restriction">Age Restriction (Optional)</Label>
              <Select 
                value={formData.age_restriction} 
                onValueChange={(v) => updateField('age_restriction', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No restriction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Restriction</SelectItem>
                  <SelectItem value="18+">18+ Only</SelectItem>
                  <SelectItem value="21+">21+ Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="terms">Terms and Conditions (Optional)</Label>
              <Textarea
                id="terms"
                placeholder="Enter any special terms, restrictions, or conditions..."
                value={formData.terms_and_conditions}
                onChange={(e) => updateField('terms_and_conditions', e.target.value)}
                rows={6}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label>Main Deal Image *</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="Deal preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        updateField('image_url', '');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <Label>Additional Images (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">Add up to 5 additional images</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {formData.deal_images.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={url}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeAdditionalImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {formData.deal_images.length < 5 && (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Add Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Review Your Deal</AlertTitle>
              <AlertDescription>
                Please review all information before updating your deal.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-semibold">Listing Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{formData.listing_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-semibold">Service Details</h4>
                <div>
                  <span className="text-muted-foreground text-sm">Title:</span>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Description:</span>
                  <p className="text-sm">{formData.offer}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-semibold">Pricing</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Original Price:</span>
                    <p className="font-medium">₦{Number(formData.original_price).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Customer Pays:</span>
                    <p className="font-medium text-primary">₦{Number(formData.current_price).toLocaleString()}</p>
                  </div>
                </div>
                {formData.listing_type === 'discounted_offer' && (
                  <div>
                    <span className="text-muted-foreground text-sm">Discount:</span>
                    <p className="font-medium text-destructive">
                      {formData.discount_type === 'percentage' ? `${formData.discount}%` : `₦${formData.discount}`}
                    </p>
                  </div>
                )}
                {formData.listing_type === 'loyalty_program' && (
                  <div>
                    <span className="text-muted-foreground text-sm">Loyalty Details:</span>
                    <p className="text-sm">{formData.merchant_loyalty_details}</p>
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-semibold">Availability</h4>
                <div>
                  <span className="text-muted-foreground text-sm">Available Days:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.available_days.map(day => (
                      <Badge key={day} variant="secondary" className="capitalize">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {imagePreview && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Main Image</h4>
                  <img
                    src={imagePreview}
                    alt="Deal"
                    className="w-full max-w-md rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Edit Deal</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/merchant/deals")}
          >
            Cancel
          </Button>
        </div>
        <p className="text-muted-foreground">{formData.title}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span className="text-xs mt-1 text-center hidden md:block">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 w-8 md:w-12 mx-1 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {STEPS[currentStep - 1].label}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Select your listing type"}
            {currentStep === 2 && "Enter basic service information"}
            {currentStep === 3 && "Set your pricing"}
            {currentStep === 4 && "Configure availability"}
            {currentStep === 5 && "Set booking requirements"}
            {currentStep === 6 && "Add additional details"}
            {currentStep === 7 && "Upload deal images"}
            {currentStep === 8 && "Review and update your deal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Deal
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
