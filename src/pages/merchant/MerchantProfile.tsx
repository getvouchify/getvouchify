import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMerchant } from "@/hooks/useMerchant";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DocumentUploader } from "@/components/merchant/DocumentUploader";
import { Loader2, Upload, X, Plus, Pencil, Trash2, Package, ShoppingCart, TrendingUp, Eye } from "lucide-react";

interface Branch {
  id?: string;
  branch_name: string;
  address: string;
  manager_name: string;
  manager_phone: string;
}

export default function MerchantProfile() {
  const { merchantData, isLoading: merchantLoading } = useMerchant();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDeals, setActiveDeals] = useState<any[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    registered_name: "",
    business_type: "",
    category: "",
    short_description: "",
    full_description: "",
    year_established: "",
    business_reg_number: "",
    tax_id: "",
    address: "",
    state: "",
    city: "",
    lga: "",
    landmark: "",
    working_days: [] as string[],
    working_hours: { open: "09:00", close: "17:00" },
    pickup_available: false,
    delivery_available: false,
    delivery_method: "",
    delivery_coverage: "",
    avg_delivery_time: "",
    primary_contact_name: "",
    primary_contact_role: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    secondary_contact_name: "",
    secondary_contact_role: "",
    secondary_contact_email: "",
    secondary_contact_phone: "",
    website: "",
    facebook_url: "",
    instagram_handle: "",
    tiktok_handle: "",
    twitter_handle: "",
    google_business_url: "",
    online_menu_url: "",
    logo_url: "",
    storefront_image_url: "",
    menu_pdf_url: "",
    cac_document_url: "",
    owner_id_url: "",
    bank_name: "",
    account_name: "",
    account_number: "",
    settlement_frequency: "weekly",
    escrow_type: "standard",
    customer_service_contact: "",
    support_email: "",
    support_phone: "",
    support_whatsapp: "",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [storefrontPreview, setStorefrontPreview] = useState<string>("");

  useEffect(() => {
    if (merchantData) {
      setFormData({
        name: merchantData.name || "",
        registered_name: merchantData.registered_name || "",
        business_type: merchantData.business_type || "",
        category: merchantData.category || "",
        short_description: merchantData.short_description || "",
        full_description: merchantData.full_description || "",
        year_established: merchantData.year_established?.toString() || "",
        business_reg_number: merchantData.business_reg_number || "",
        tax_id: merchantData.tax_id || "",
        address: merchantData.address || "",
        state: merchantData.state || "",
        city: merchantData.city || "",
        lga: merchantData.lga || "",
        landmark: merchantData.landmark || "",
        working_days: merchantData.working_days || [],
        working_hours: merchantData.working_hours || { open: "09:00", close: "17:00" },
        pickup_available: merchantData.pickup_available || false,
        delivery_available: merchantData.delivery_available || false,
        delivery_method: merchantData.delivery_method || "",
        delivery_coverage: merchantData.delivery_coverage || "",
        avg_delivery_time: merchantData.avg_delivery_time || "",
        primary_contact_name: merchantData.primary_contact_name || "",
        primary_contact_role: merchantData.primary_contact_role || "",
        primary_contact_email: merchantData.primary_contact_email || "",
        primary_contact_phone: merchantData.primary_contact_phone || "",
        secondary_contact_name: merchantData.secondary_contact_name || "",
        secondary_contact_role: merchantData.secondary_contact_role || "",
        secondary_contact_email: merchantData.secondary_contact_email || "",
        secondary_contact_phone: merchantData.secondary_contact_phone || "",
        website: merchantData.website || "",
        facebook_url: merchantData.facebook_url || "",
        instagram_handle: merchantData.instagram_handle || "",
        tiktok_handle: merchantData.tiktok_handle || "",
        twitter_handle: merchantData.twitter_handle || "",
        google_business_url: merchantData.google_business_url || "",
        online_menu_url: merchantData.online_menu_url || "",
        logo_url: merchantData.logo_url || "",
        storefront_image_url: merchantData.storefront_image_url || "",
        menu_pdf_url: merchantData.menu_pdf_url || "",
        cac_document_url: merchantData.cac_document_url || "",
        owner_id_url: merchantData.owner_id_url || "",
        bank_name: merchantData.bank_name || "",
        account_name: merchantData.account_name || "",
        account_number: merchantData.account_number || "",
        settlement_frequency: merchantData.settlement_frequency || "weekly",
        escrow_type: merchantData.escrow_type || "standard",
        customer_service_contact: merchantData.customer_service_contact || "",
        support_email: merchantData.support_email || "",
        support_phone: merchantData.support_phone || "",
        support_whatsapp: merchantData.support_whatsapp || "",
      });
      setLogoPreview(merchantData.logo_url || "");
      setStorefrontPreview(merchantData.storefront_image_url || "");
      loadBranches();
    }
  }, [merchantData]);

  const loadBranches = async () => {
    if (!merchantData?.id) return;
    const { data, error } = await supabase
      .from("merchant_branches")
      .select("*")
      .eq("merchant_id", merchantData.id);
    if (!error && data) setBranches(data);
  };

  const loadDeals = async () => {
    if (!merchantData?.id) return;
    setLoadingDeals(true);
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("merchant_id", merchantData.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error && data) setActiveDeals(data);
    } catch (error) {
      console.error("Error loading deals:", error);
    } finally {
      setLoadingDeals(false);
    }
  };

  useEffect(() => {
    if (merchantData?.id) {
      setDocuments((merchantData.other_documents as any) || []);
      loadDeals();
    }
  }, [merchantData]);

  const handleImageUpload = async (file: File, type: 'logo' | 'storefront') => {
    // Get authenticated user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive"
      });
      return;
    }

    const bucket = type === 'logo' ? 'merchant-logos' : 'merchant-storefronts';
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      toast({ 
        title: "Upload failed", 
        description: uploadError.message, 
        variant: "destructive" 
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
    
    if (type === 'logo') {
      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      setLogoPreview(publicUrl);
    } else {
      setFormData(prev => ({ ...prev, storefront_image_url: publicUrl }));
      setStorefrontPreview(publicUrl);
    }

    toast({
      title: "Upload successful",
      description: `${file.name} has been uploaded`,
    });
  };

  const handleFileUpload = async (file: File, field: string) => {
    // Get authenticated user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive"
      });
      return;
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('merchant-documents')
      .upload(filePath, file);

    if (uploadError) {
      toast({ 
        title: "Upload failed", 
        description: uploadError.message, 
        variant: "destructive" 
      });
      return;
    }

    // Use signed URL for private bucket (expires in 1 year)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('merchant-documents')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    if (urlError || !signedUrlData) {
      toast({
        title: "Error generating URL",
        description: "File uploaded but couldn't generate access URL",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, [field]: signedUrlData.signedUrl }));
    
    toast({
      title: "Upload successful",
      description: `${file.name} has been uploaded`,
    });
  };

  const handleSave = async () => {
    if (!merchantData?.id) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("merchants")
      .update({
        name: formData.name,
        registered_name: formData.registered_name,
        business_type: formData.business_type,
        category: formData.category,
        short_description: formData.short_description,
        full_description: formData.full_description,
        year_established: formData.year_established ? parseInt(formData.year_established) : null,
        business_reg_number: formData.business_reg_number,
        tax_id: formData.tax_id,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        lga: formData.lga,
        landmark: formData.landmark,
        working_days: formData.working_days,
        working_hours: formData.working_hours,
        pickup_available: formData.pickup_available,
        delivery_available: formData.delivery_available,
        delivery_method: formData.delivery_method,
        delivery_coverage: formData.delivery_coverage,
        avg_delivery_time: formData.avg_delivery_time,
        primary_contact_name: formData.primary_contact_name,
        primary_contact_role: formData.primary_contact_role,
        primary_contact_email: formData.primary_contact_email,
        primary_contact_phone: formData.primary_contact_phone,
        secondary_contact_name: formData.secondary_contact_name,
        secondary_contact_role: formData.secondary_contact_role,
        secondary_contact_email: formData.secondary_contact_email,
        secondary_contact_phone: formData.secondary_contact_phone,
        website: formData.website,
        facebook_url: formData.facebook_url,
        instagram_handle: formData.instagram_handle,
        tiktok_handle: formData.tiktok_handle,
        twitter_handle: formData.twitter_handle,
        google_business_url: formData.google_business_url,
        online_menu_url: formData.online_menu_url,
        logo_url: formData.logo_url,
        storefront_image_url: formData.storefront_image_url,
        menu_pdf_url: formData.menu_pdf_url,
        cac_document_url: formData.cac_document_url,
        owner_id_url: formData.owner_id_url,
        bank_name: formData.bank_name,
        account_name: formData.account_name,
        account_number: formData.account_number,
        settlement_frequency: formData.settlement_frequency,
        escrow_type: formData.escrow_type,
        customer_service_contact: formData.customer_service_contact,
        support_email: formData.support_email,
        support_phone: formData.support_phone,
        support_whatsapp: formData.support_whatsapp,
      })
      .eq("id", merchantData.id);

    setIsSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
    }
  };

  const handleBranchSave = async (branch: Branch) => {
    if (!merchantData?.id) return;

    if (branch.id) {
      const { error } = await supabase
        .from("merchant_branches")
        .update(branch)
        .eq("id", branch.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    } else {
      const { error } = await supabase
        .from("merchant_branches")
        .insert({ ...branch, merchant_id: merchantData.id });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }

    toast({ title: "Success", description: "Branch saved successfully" });
    setBranchDialogOpen(false);
    setEditingBranch(null);
    loadBranches();
  };

  const handleBranchDelete = async (branchId: string) => {
    const { error } = await supabase
      .from("merchant_branches")
      .delete()
      .eq("id", branchId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Branch deleted successfully" });
      loadBranches();
    }
  };

  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  if (merchantLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Profile</h1>
          <p className="text-muted-foreground">Manage your business information and settings</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Manage your deals and orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate("/merchant/deals/new")} className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Create New Deal</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/merchant/deals")} className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>View My Deals</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/merchant/orders")} className="h-20 flex flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Manage Orders</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="deals">
            Deals ({activeDeals.length})
          </TabsTrigger>
        </TabsList>

        {/* Business Information Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Basic information about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registered_name">Registered Business Name</Label>
                  <Input
                    id="registered_name"
                    value={formData.registered_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, registered_name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Lounge">Lounge</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Spa">Spa</SelectItem>
                      <SelectItem value="Fitness Center">Fitness Center</SelectItem>
                      <SelectItem value="Retail Store">Retail Store</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food and Drinks">Food and Drinks</SelectItem>
                      <SelectItem value="Beauty and Spa">Beauty and Spa</SelectItem>
                      <SelectItem value="Things To Do">Things To Do</SelectItem>
                      <SelectItem value="Health and Fitness">Health and Fitness</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year_established">Year Established</Label>
                  <Input
                    id="year_established"
                    type="number"
                    value={formData.year_established}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_established: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_reg_number">Business Registration Number</Label>
                  <Input
                    id="business_reg_number"
                    value={formData.business_reg_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_reg_number: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax_id: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Business Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  disabled={!isEditing}
                  maxLength={150}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Full Business Description</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lga">LGA</Label>
                  <Input
                    id="lga"
                    value={formData.lga}
                    onChange={(e) => setFormData(prev => ({ ...prev, lga: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Working Days</Label>
                <div className="flex flex-wrap gap-4">
                  {weekDays.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.working_days.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, working_days: [...prev.working_days, day] }));
                          } else {
                            setFormData(prev => ({ ...prev, working_days: prev.working_days.filter(d => d !== day) }));
                          }
                        }}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={day} className="capitalize">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open_time">Opening Time</Label>
                  <Input
                    id="open_time"
                    type="time"
                    value={formData.working_hours.open}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      working_hours: { ...prev.working_hours, open: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close_time">Closing Time</Label>
                  <Input
                    id="close_time"
                    type="time"
                    value={formData.working_hours.close}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      working_hours: { ...prev.working_hours, close: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pickup_available"
                    checked={formData.pickup_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pickup_available: checked }))}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="pickup_available">Pickup Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="delivery_available"
                    checked={formData.delivery_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, delivery_available: checked }))}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="delivery_available">Delivery Available</Label>
                </div>
              </div>

              {formData.delivery_available && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery_method">Delivery Method</Label>
                    <Select
                      value={formData.delivery_method}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, delivery_method: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In house">In house</SelectItem>
                        <SelectItem value="Third party">Third party</SelectItem>
                        <SelectItem value="External logistics">External logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_coverage">Delivery Coverage Area</Label>
                    <Input
                      id="delivery_coverage"
                      value={formData.delivery_coverage}
                      onChange={(e) => setFormData(prev => ({ ...prev, delivery_coverage: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avg_delivery_time">Average Delivery Time</Label>
                    <Input
                      id="avg_delivery_time"
                      value={formData.avg_delivery_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, avg_delivery_time: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="e.g., 30-45 minutes"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Branches</Label>
                  {isEditing && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingBranch(null);
                        setBranchDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Branch
                    </Button>
                  )}
                </div>
                {branches.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Phone</TableHead>
                        {isEditing && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches.map(branch => (
                        <TableRow key={branch.id}>
                          <TableCell>{branch.branch_name}</TableCell>
                          <TableCell>{branch.address}</TableCell>
                          <TableCell>{branch.manager_name}</TableCell>
                          <TableCell>{branch.manager_phone}</TableCell>
                          {isEditing && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingBranch(branch);
                                    setBranchDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => branch.id && handleBranchDelete(branch.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-sm">No branches added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Primary and secondary contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Primary Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_name">Full Name *</Label>
                    <Input
                      id="primary_contact_name"
                      value={formData.primary_contact_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_role">Role/Position *</Label>
                    <Input
                      id="primary_contact_role"
                      value={formData.primary_contact_role}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_role: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_email">Email *</Label>
                    <Input
                      id="primary_contact_email"
                      type="email"
                      value={formData.primary_contact_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact_phone">Phone Number *</Label>
                    <Input
                      id="primary_contact_phone"
                      value={formData.primary_contact_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Secondary Contact (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary_contact_name">Full Name</Label>
                    <Input
                      id="secondary_contact_name"
                      value={formData.secondary_contact_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_contact_name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_contact_role">Role/Position</Label>
                    <Input
                      id="secondary_contact_role"
                      value={formData.secondary_contact_role}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_contact_role: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_contact_email">Email</Label>
                    <Input
                      id="secondary_contact_email"
                      type="email"
                      value={formData.secondary_contact_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_contact_email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_contact_phone">Phone Number</Label>
                    <Input
                      id="secondary_contact_phone"
                      value={formData.secondary_contact_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_contact_phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Presence Tab */}
        <TabsContent value="digital" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Digital Presence</CardTitle>
              <CardDescription>Online presence and social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook Page URL</Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_handle">Instagram Handle</Label>
                  <Input
                    id="instagram_handle"
                    value={formData.instagram_handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@yourbusiness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok_handle">TikTok Handle</Label>
                  <Input
                    id="tiktok_handle"
                    value={formData.tiktok_handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktok_handle: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@yourbusiness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_handle">X (Twitter) Profile</Label>
                  <Input
                    id="twitter_handle"
                    value={formData.twitter_handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_handle: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="@yourbusiness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google_business_url">Google Business Profile Link</Label>
                  <Input
                    id="google_business_url"
                    type="url"
                    value={formData.google_business_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, google_business_url: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="online_menu_url">Online Menu Link</Label>
                  <Input
                    id="online_menu_url"
                    type="url"
                    value={formData.online_menu_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, online_menu_url: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="For restaurants"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Uploads Tab */}
        <TabsContent value="uploads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Images</CardTitle>
              <CardDescription>Logo and storefront images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Business Logo *</Label>
                  {logoPreview && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'logo');
                      }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Storefront Image *</Label>
                  {storefrontPreview && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img src={storefrontPreview} alt="Storefront" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {isEditing && (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'storefront');
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {merchantData?.id && (
            <DocumentUploader
              merchantId={merchantData.id}
              documents={documents}
              onDocumentsChange={setDocuments}
            />
          )}
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment and Escrow Details</CardTitle>
              <CardDescription>Banking information and settlement preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    id="account_name"
                    value={formData.account_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settlement_frequency">Settlement Preference</Label>
                  <Select
                    value={formData.settlement_frequency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, settlement_frequency: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant payout</SelectItem>
                      <SelectItem value="daily">Daily payout</SelectItem>
                      <SelectItem value="weekly">Weekly payout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escrow_type">Preferred Escrow Type</Label>
                  <Select
                    value={formData.escrow_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, escrow_type: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Escrow (default)</SelectItem>
                      <SelectItem value="instant">Instant settlement with fees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service & Communication Tab */}
        <TabsContent value="service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Service and Communication</CardTitle>
              <CardDescription>Customer service and support contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_service_contact">Customer Service Contact</Label>
                  <Input
                    id="customer_service_contact"
                    value={formData.customer_service_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_service_contact: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_email">Support Email</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={formData.support_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, support_email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_phone">Support Phone</Label>
                  <Input
                    id="support_phone"
                    type="tel"
                    value={formData.support_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, support_phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_whatsapp">WhatsApp Support</Label>
                  <Input
                    id="support_whatsapp"
                    type="tel"
                    value={formData.support_whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, support_whatsapp: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Active Deals</CardTitle>
              <CardDescription>Recently created deals</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDeals ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : activeDeals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell className="font-medium">{deal.title}</TableCell>
                        <TableCell>{deal.category}</TableCell>
                        <TableCell>{deal.discount}</TableCell>
                        <TableCell>
                          <Badge variant={deal.is_active ? "default" : "secondary"}>
                            {deal.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/merchant/deals/${deal.id}/edit`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active deals</p>
                  <Button onClick={() => navigate("/merchant/deals/new")} className="mt-4">
                    Create Your First Deal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Branch Dialog */}
      <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch_name">Branch Name</Label>
              <Input
                id="branch_name"
                value={editingBranch?.branch_name || ""}
                onChange={(e) => setEditingBranch(prev => ({ ...prev!, branch_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch_address">Address</Label>
              <Input
                id="branch_address"
                value={editingBranch?.address || ""}
                onChange={(e) => setEditingBranch(prev => ({ ...prev!, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager_name">Manager Name</Label>
              <Input
                id="manager_name"
                value={editingBranch?.manager_name || ""}
                onChange={(e) => setEditingBranch(prev => ({ ...prev!, manager_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager_phone">Manager Phone</Label>
              <Input
                id="manager_phone"
                value={editingBranch?.manager_phone || ""}
                onChange={(e) => setEditingBranch(prev => ({ ...prev!, manager_phone: e.target.value }))}
              />
            </div>
            <Button onClick={() => editingBranch && handleBranchSave(editingBranch)}>
              Save Branch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
