import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Pricing" },
  { id: 3, label: "Availability" },
  { id: 4, label: "Booking" },
  { id: 5, label: "Details" },
  { id: 6, label: "Images" },
  { id: 7, label: "Review" },
];

export default function CreateDeal() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    offer: '',
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

  // Auto-calculate current price
  useEffect(() => {
    if (formData.original_price && formData.discount) {
      const original = Number(formData.original_price);
      const discount = Number(formData.discount);
      
      let currentPrice = original;
      if (formData.discount_type === 'percentage') {
        currentPrice = original - (original * discount / 100);
      } else {
        currentPrice = original - discount;
      }
      
      setFormData(prev => ({ ...prev, current_price: currentPrice.toString() }));
    }
  }, [formData.original_price, formData.discount, formData.discount_type]);

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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("merchant-deal-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("merchant-deal-images")
        .getPublicUrl(fileName);

      setImagePreview(publicUrl);
      updateField('image_url', publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async () => {
    if (!formData.image_url) {
      toast.error("Please upload a deal image");
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
        .insert({
          merchant_id: merchant.id,
          merchant: merchant.name,
          title: formData.title,
          category: formData.category,
          discount: formData.discount_type === 'percentage' 
            ? `${formData.discount}%` 
            : `₦${formData.discount}`,
          discount_type: formData.discount_type,
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
          is_active: true,
        });

      if (error) throw error;
      
      toast.success("Deal created successfully!");
      navigate("/merchant/deals");
      
    } catch (error: any) {
      console.error("Error creating deal:", error);
      toast.error(error.message || "Failed to create deal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., 50% Off Spa Package"
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
                  <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                  <SelectItem value="Beauty & Spa">Beauty & Spa</SelectItem>
                  <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                  <SelectItem value="Things To Do">Things To Do</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
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

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="original_price">Regular Price (₦) *</Label>
              <Input
                id="original_price"
                type="number"
                placeholder="10000"
                value={formData.original_price}
                onChange={(e) => updateField('original_price', e.target.value)}
                min="0"
                step="100"
              />
            </div>

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
              <Label htmlFor="discount">
                Discount {formData.discount_type === 'percentage' ? '(%)' : '(₦)'} *
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder={formData.discount_type === 'percentage' ? '50' : '5000'}
                value={formData.discount}
                onChange={(e) => updateField('discount', e.target.value)}
                min="0"
                max={formData.discount_type === 'percentage' ? '100' : undefined}
              />
            </div>

            <Alert>
              <Calculator className="h-4 w-4" />
              <AlertTitle>Vouchify Price (Calculated)</AlertTitle>
              <AlertDescription>
                <span className="text-2xl font-bold text-primary">
                  ₦{Number(formData.current_price || 0).toLocaleString()}
                </span>
                <p className="text-sm mt-2">
                  Customers will pay this discounted price
                </p>
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deal_start_date">Deal Start Date</Label>
                <Input
                  id="deal_start_date"
                  type="date"
                  value={formData.deal_start_date}
                  onChange={(e) => updateField('deal_start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="deal_end_date">Deal End Date</Label>
                <Input
                  id="deal_end_date"
                  type="date"
                  value={formData.deal_end_date}
                  onChange={(e) => updateField('deal_end_date', e.target.value)}
                  min={formData.deal_start_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiry_date">Voucher Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => updateField('expiry_date', e.target.value)}
                min={formData.deal_end_date || new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Last date customers can use purchased vouchers
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usage_limit">Total Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  placeholder="Unlimited"
                  value={formData.usage_limit}
                  onChange={(e) => updateField('usage_limit', e.target.value)}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="daily_limit">Daily Limit</Label>
                <Input
                  id="daily_limit"
                  type="number"
                  placeholder="Unlimited"
                  value={formData.daily_limit}
                  onChange={(e) => updateField('daily_limit', e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="requires_booking" className="font-medium">
                  Requires Booking
                </Label>
                <p className="text-sm text-muted-foreground">
                  Customers must select a date/time
                </p>
              </div>
              <Switch
                id="requires_booking"
                checked={formData.requires_booking}
                onCheckedChange={(checked) => updateField('requires_booking', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="requires_qr_code" className="font-medium">
                  Requires QR Code Verification
                </Label>
                <p className="text-sm text-muted-foreground">
                  Merchant must scan QR to redeem
                </p>
              </div>
              <Switch
                id="requires_qr_code"
                checked={formData.requires_qr_code}
                onCheckedChange={(checked) => updateField('requires_qr_code', checked)}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Age Restriction</Label>
              <RadioGroup 
                value={formData.age_restriction}
                onValueChange={(v) => updateField('age_restriction', v)}
                className="space-y-3 mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="no-restriction" />
                  <Label htmlFor="no-restriction" className="font-normal cursor-pointer">No restriction</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="18+" id="18plus" />
                  <Label htmlFor="18plus" className="font-normal cursor-pointer">18+ only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="21+" id="21plus" />
                  <Label htmlFor="21plus" className="font-normal cursor-pointer">21+ only</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="terms_and_conditions">Terms & Conditions</Label>
              <Textarea
                id="terms_and_conditions"
                placeholder="Enter any special terms, restrictions, or requirements..."
                value={formData.terms_and_conditions}
                onChange={(e) => updateField('terms_and_conditions', e.target.value)}
                rows={6}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label>Primary Deal Image *</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Primary" 
                      className="mx-auto max-h-64 rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
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
                  <>
                    <ImagePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="primary-image"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById('primary-image')?.click()}
                    >
                      Choose Image
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max 5MB, JPG or PNG
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Review Your Deal</AlertTitle>
              <AlertDescription>
                Please review all information before submitting.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Deal Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.image_url && (
                    <img src={formData.image_url} alt={formData.title} className="w-full aspect-video object-cover rounded-lg" />
                  )}
                  <div>
                    <Badge>{formData.category}</Badge>
                    <h3 className="text-2xl font-bold mt-2">{formData.title}</h3>
                    <p className="text-muted-foreground">{formData.offer}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      ₦{Number(formData.current_price).toLocaleString()}
                    </span>
                    {formData.original_price && (
                      <span className="text-lg line-through text-muted-foreground">
                        ₦{Number(formData.original_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category && formData.offer;
      case 2:
        return formData.original_price && formData.discount && formData.current_price;
      case 6:
        return formData.image_url;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/merchant/deals")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Create New Deal</h2>
          <p className="text-muted-foreground">Step {currentStep} of {STEPS.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${index < STEPS.length - 1 ? 'flex-1' : ''}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
              `}>
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="text-xs hidden md:block">{step.label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!isStepValid()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepValid()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Deal
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
