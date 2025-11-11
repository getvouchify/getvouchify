import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Upload, X, Plus, Trash2, Info, 
  CheckCircle2, Loader2, Building2, MapPin, 
  Globe, Phone, CreditCard, Shield, Eye,
  ChevronLeft, ChevronRight, Clock
} from "lucide-react";
import { useMerchant } from "@/hooks/useMerchant";

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const NIGERIAN_BANKS = [
  'Access Bank', 'Citibank', 'Ecobank', 'Fidelity Bank', 'First Bank',
  'First City Monument Bank (FCMB)', 'Globus Bank', 'Guaranty Trust Bank (GTBank)',
  'Heritage Bank', 'Keystone Bank', 'Kuda Bank', 'OPay', 'PalmPay',
  'Polaris Bank', 'Providus Bank', 'Stanbic IBTC Bank', 'Standard Chartered',
  'Sterling Bank', 'SunTrust Bank', 'Union Bank', 'United Bank for Africa (UBA)',
  'Unity Bank', 'Wema Bank', 'Zenith Bank'
];

const BUSINESS_CATEGORIES = [
  'Restaurant', 'Beauty & Spa', 'Retail', 'Health & Fitness', 
  'Things To Do', 'Electronics', 'Home & Lifestyle'
];

const BUSINESS_TYPES = [
  'Sole Proprietorship', 'Partnership', 'Limited Liability Company (LLC)', 
  'Corporation', 'Cooperative'
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const steps = [
  { id: 1, label: 'Business Info', icon: Building2 },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Digital', icon: Globe },
  { id: 4, label: 'Contacts', icon: Phone },
  { id: 5, label: 'Banking', icon: CreditCard },
  { id: 6, label: 'Documents', icon: Shield },
  { id: 7, label: 'Review', icon: Eye },
];

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const { merchantData, isLoading: merchantLoading } = useMerchant();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isPrePopulated, setIsPrePopulated] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    registered_name: '',
    business_type: '',
    category: '',
    short_description: '',
    full_description: '',
    year_established: '',
    business_reg_number: '',
    logo_url: '',
    storefront_image_url: '',
    
    address: '',
    state: '',
    city: '',
    lga: '',
    landmark: '',
    working_hours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' },
    },
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as string[],
    pickup_available: false,
    delivery_available: false,
    delivery_method: '',
    delivery_coverage: '',
    avg_delivery_time: '',
    branches: [{
      branch_name: 'Main Branch',
      address: '',
      state: '',
      city: '',
      lga: '',
      manager_name: '',
      manager_phone: '',
      is_primary: true,
    }],
    
    website: '',
    facebook_url: '',
    instagram_handle: '',
    tiktok_handle: '',
    twitter_handle: '',
    google_business_url: '',
    online_menu_url: '',
    menu_pdf_url: '',
    
    primary_contact_name: '',
    primary_contact_role: '',
    primary_contact_email: '',
    primary_contact_phone: '',
    secondary_contact_name: '',
    secondary_contact_email: '',
    secondary_contact_phone: '',
    customer_service_contact: '',
    support_email: '',
    support_phone: '',
    support_whatsapp: '',
    
    bank_name: '',
    account_name: '',
    account_number: '',
    settlement_frequency: 'weekly',
    escrow_type: 'standard',
    
    cac_document_url: '',
    owner_id_url: '',
    other_documents: [] as any[],
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [storefrontPreview, setStorefrontPreview] = useState('');
  const [cacDocPreview, setCacDocPreview] = useState('');
  const [ownerIdPreview, setOwnerIdPreview] = useState('');

  // Pre-populate form data from merchant profile
  useEffect(() => {
    if (merchantData && !isPrePopulated && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: merchantData.name || '',
        category: merchantData.category || '',
        state: merchantData.state || '',
        lga: merchantData.lga || '',
        address: merchantData.address || '',
        city: merchantData.city || '',
        phone: merchantData.phone || '',
        primary_contact_name: merchantData.primary_contact_name || '',
        primary_contact_email: merchantData.primary_contact_email || '',
        primary_contact_phone: merchantData.primary_contact_phone || '',
      }));
      setIsPrePopulated(true);
      toast.info("We've pre-filled some details from your registration");
    }
  }, [merchantData, isPrePopulated, formData.name]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateWorkingHours = (day: string, type: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day as keyof typeof prev.working_hours],
          [type]: value
        }
      }
    }));
  };

  const toggleWorkingDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day]
    }));
  };

  const addBranch = () => {
    setFormData(prev => ({
      ...prev,
      branches: [...prev.branches, {
        branch_name: '',
        address: '',
        state: '',
        city: '',
        lga: '',
        manager_name: '',
        manager_phone: '',
        is_primary: false,
      }]
    }));
  };

  const removeBranch = (index: number) => {
    if (formData.branches.length === 1) {
      toast.error("You must have at least one branch");
      return;
    }
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index)
    }));
  };

  const updateBranch = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.map((branch, i) => 
        i === index ? { ...branch, [field]: value } : branch
      )
    }));
  };

  const uploadFile = async (file: File, bucket: string, folder: string = '') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    bucket: string,
    setPreview: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast.loading('Uploading image...', { id: 'upload' });
    try {
      const url = await uploadFile(file, bucket, merchantData?.id + '/');
      updateField(field, url);
      toast.success('Image uploaded successfully', { id: 'upload' });
    } catch (error) {
      toast.error('Failed to upload image', { id: 'upload' });
      setPreview('');
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    setPreview: (name: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Document must be less than 10MB');
      return;
    }
    
    setPreview(file.name);
    
    toast.loading('Uploading document...', { id: 'doc-upload' });
    try {
      const url = await uploadFile(file, 'merchant-documents', merchantData?.id + '/');
      updateField(field, url);
      toast.success('Document uploaded successfully', { id: 'doc-upload' });
    } catch (error) {
      toast.error('Failed to upload document', { id: 'doc-upload' });
      setPreview('');
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          toast.error('Business name is required');
          return false;
        }
        if (!formData.business_type) {
          toast.error('Business type is required');
          return false;
        }
        if (!formData.category) {
          toast.error('Category is required');
          return false;
        }
        if (!formData.short_description.trim() || formData.short_description.length > 160) {
          toast.error('Short description is required (max 160 characters)');
          return false;
        }
        if (!formData.full_description.trim()) {
          toast.error('Full description is required');
          return false;
        }
        if (!formData.logo_url) {
          toast.error('Logo is required');
          return false;
        }
        return true;
        
      case 2:
        if (!formData.address.trim()) {
          toast.error('Address is required');
          return false;
        }
        if (!formData.state) {
          toast.error('State is required');
          return false;
        }
        if (!formData.city.trim()) {
          toast.error('City is required');
          return false;
        }
        if (formData.working_days.length === 0) {
          toast.error('Select at least one working day');
          return false;
        }
        const validBranch = formData.branches.some(b => b.branch_name && b.address);
        if (!validBranch) {
          toast.error('Complete at least one branch information');
          return false;
        }
        return true;
        
      case 3:
        return true;
        
      case 4:
        if (!formData.primary_contact_name.trim()) {
          toast.error('Primary contact name is required');
          return false;
        }
        if (!formData.primary_contact_email.trim()) {
          toast.error('Primary contact email is required');
          return false;
        }
        if (!formData.primary_contact_phone.trim()) {
          toast.error('Primary contact phone is required');
          return false;
        }
        return true;
        
      case 5:
        if (!formData.bank_name) {
          toast.error('Bank name is required');
          return false;
        }
        if (!formData.account_name.trim()) {
          toast.error('Account name is required');
          return false;
        }
        if (!formData.account_number.trim() || formData.account_number.length !== 10) {
          toast.error('Valid 10-digit account number is required');
          return false;
        }
        return true;
        
      case 6:
        if (!formData.cac_document_url) {
          toast.error('CAC/Business registration document is required');
          return false;
        }
        if (!formData.owner_id_url) {
          toast.error('Owner ID document is required');
          return false;
        }
        return true;
        
      case 7:
        if (!acceptedTerms) {
          toast.error('Please accept the terms and conditions');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
      window.scrollTo(0, 0);
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error: merchantError } = await supabase
        .from('merchants')
        .update({
          name: formData.name,
          registered_name: formData.registered_name || null,
          business_type: formData.business_type,
          category: formData.category,
          short_description: formData.short_description,
          full_description: formData.full_description,
          year_established: formData.year_established ? parseInt(formData.year_established) : null,
          business_reg_number: formData.business_reg_number || null,
          logo_url: formData.logo_url,
          storefront_image_url: formData.storefront_image_url || null,
          
          address: formData.address,
          state: formData.state,
          city: formData.city,
          lga: formData.lga || null,
          landmark: formData.landmark || null,
          working_hours: formData.working_hours,
          working_days: formData.working_days,
          pickup_available: formData.pickup_available,
          delivery_available: formData.delivery_available,
          delivery_method: formData.delivery_method || null,
          delivery_coverage: formData.delivery_coverage || null,
          avg_delivery_time: formData.avg_delivery_time || null,
          
          website: formData.website || null,
          facebook_url: formData.facebook_url || null,
          instagram_handle: formData.instagram_handle || null,
          tiktok_handle: formData.tiktok_handle || null,
          twitter_handle: formData.twitter_handle || null,
          google_business_url: formData.google_business_url || null,
          online_menu_url: formData.online_menu_url || null,
          menu_pdf_url: formData.menu_pdf_url || null,
          
          primary_contact_name: formData.primary_contact_name,
          primary_contact_role: formData.primary_contact_role || null,
          primary_contact_email: formData.primary_contact_email,
          primary_contact_phone: formData.primary_contact_phone,
          secondary_contact_name: formData.secondary_contact_name || null,
          secondary_contact_email: formData.secondary_contact_email || null,
          secondary_contact_phone: formData.secondary_contact_phone || null,
          customer_service_contact: formData.customer_service_contact || null,
          support_email: formData.support_email || null,
          support_phone: formData.support_phone || null,
          support_whatsapp: formData.support_whatsapp || null,
          
          bank_name: formData.bank_name,
          account_name: formData.account_name,
          account_number: formData.account_number,
          settlement_frequency: formData.settlement_frequency,
          escrow_type: formData.escrow_type,
          
          cac_document_url: formData.cac_document_url,
          owner_id_url: formData.owner_id_url,
          other_documents: formData.other_documents,
          
          status: 'pending',
        })
        .eq('user_id', user.id);
      
      if (merchantError) throw merchantError;
      
      const branchesToInsert = formData.branches
        .filter(b => b.branch_name && b.address)
        .map(branch => ({
          merchant_id: merchantData?.id,
          ...branch,
        }));
      
      if (branchesToInsert.length > 0) {
        const { error: branchError } = await supabase
          .from('merchant_branches')
          .insert(branchesToInsert);
        
        if (branchError) throw branchError;
      }
      
      const documents = [
        { type: 'CAC Document', url: formData.cac_document_url },
        { type: 'Owner ID', url: formData.owner_id_url },
      ];
      
      const docsToInsert = documents.map(doc => ({
        merchant_id: merchantData?.id,
        document_type: doc.type,
        document_url: doc.url,
        verified: false,
      }));
      
      const { error: docError } = await supabase
        .from('merchant_documents')
        .insert(docsToInsert);
      
      if (docError) throw docError;
      
      toast.success('Application submitted successfully!');
      navigate('/merchant/application-submitted');
      
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (merchantLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const progressPercentage = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Business Registration</h1>
            <Badge variant="secondary">Step {currentStep} of 7</Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center cursor-pointer ${
                    isCurrent ? 'opacity-100' : isCompleted ? 'opacity-100' : 'opacity-50'
                  }`}
                  onClick={() => goToStep(step.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : isCompleted 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs text-center hidden md:block">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = steps[currentStep - 1].icon;
                return <Icon className="w-5 h-5" />;
              })()}
              {steps[currentStep - 1].label}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your business"}
              {currentStep === 2 && "Where are you located and when do you operate?"}
              {currentStep === 3 && "Your online presence"}
              {currentStep === 4 && "How can we reach you?"}
              {currentStep === 5 && "Payment and settlement details"}
              {currentStep === 6 && "Verification documents"}
              {currentStep === 7 && "Review and submit your application"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g., Joe's Restaurant"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registered_name">Registered Business Name</Label>
                  <Input
                    id="registered_name"
                    value={formData.registered_name}
                    onChange={(e) => updateField('registered_name', e.target.value)}
                    placeholder="Official registered name (if different)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Business Type *</Label>
                    <Select value={formData.business_type} onValueChange={(val) => updateField('business_type', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(val) => updateField('category', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year_established">Year Established</Label>
                    <Input
                      id="year_established"
                      type="number"
                      value={formData.year_established}
                      onChange={(e) => updateField('year_established', e.target.value)}
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_reg_number">Registration Number</Label>
                    <Input
                      id="business_reg_number"
                      value={formData.business_reg_number}
                      onChange={(e) => updateField('business_reg_number', e.target.value)}
                      placeholder="CAC/BN number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description * ({formData.short_description.length}/160)</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => updateField('short_description', e.target.value)}
                    placeholder="Brief description for listings"
                    maxLength={160}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_description">Full Description *</Label>
                  <Textarea
                    id="full_description"
                    value={formData.full_description}
                    onChange={(e) => updateField('full_description', e.target.value)}
                    placeholder="Detailed description of your business, services, and what makes you unique"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Business Logo *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {logoPreview ? (
                        <div className="relative">
                          <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setLogoPreview('');
                              updateField('logo_url', '');
                            }}
                          >
                            <X className="w-4 h-4 mr-1" /> Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload logo</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'logo_url', 'merchant-logos', setLogoPreview)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Storefront Image (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {storefrontPreview ? (
                        <div className="relative">
                          <img src={storefrontPreview} alt="Storefront preview" className="max-h-32 mx-auto rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setStorefrontPreview('');
                              updateField('storefront_image_url', '');
                            }}
                          >
                            <X className="w-4 h-4 mr-1" /> Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload photo</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'storefront_image_url', 'merchant-storefronts', setStorefrontPreview)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Operations */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Primary Location
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Enter full street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(val) => updateField('state', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIAN_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lga">LGA</Label>
                      <Input
                        id="lga"
                        value={formData.lga}
                        onChange={(e) => updateField('lga', e.target.value)}
                        placeholder="Local Government"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => updateField('landmark', e.target.value)}
                      placeholder="Nearby landmark for easier location"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Working Days & Hours *
                  </h3>
                  
                  <div className="space-y-3">
                    {DAYS.map(day => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="flex items-center space-x-2 w-32">
                          <Checkbox
                            id={day}
                            checked={formData.working_days.includes(day)}
                            onCheckedChange={() => toggleWorkingDay(day)}
                          />
                          <Label htmlFor={day} className="capitalize cursor-pointer">
                            {day}
                          </Label>
                        </div>
                        
                        {formData.working_days.includes(day) && (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="time"
                              value={formData.working_hours[day as keyof typeof formData.working_hours].open}
                              onChange={(e) => updateWorkingHours(day, 'open', e.target.value)}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={formData.working_hours[day as keyof typeof formData.working_hours].close}
                              onChange={(e) => updateWorkingHours(day, 'close', e.target.value)}
                              className="w-32"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Fulfillment Options</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pickup"
                      checked={formData.pickup_available}
                      onCheckedChange={(checked) => updateField('pickup_available', checked)}
                    />
                    <Label htmlFor="pickup">Pickup Available</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="delivery"
                      checked={formData.delivery_available}
                      onCheckedChange={(checked) => updateField('delivery_available', checked)}
                    />
                    <Label htmlFor="delivery">Delivery Available</Label>
                  </div>

                  {formData.delivery_available && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="delivery_method">Delivery Method</Label>
                        <Input
                          id="delivery_method"
                          value={formData.delivery_method}
                          onChange={(e) => updateField('delivery_method', e.target.value)}
                          placeholder="e.g., In-house, Third-party"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="delivery_coverage">Coverage Area</Label>
                        <Input
                          id="delivery_coverage"
                          value={formData.delivery_coverage}
                          onChange={(e) => updateField('delivery_coverage', e.target.value)}
                          placeholder="e.g., Within 5km"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avg_delivery_time">Avg. Delivery Time</Label>
                        <Input
                          id="avg_delivery_time"
                          value={formData.avg_delivery_time}
                          onChange={(e) => updateField('avg_delivery_time', e.target.value)}
                          placeholder="e.g., 30-45 mins"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Additional Branches</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addBranch}>
                      <Plus className="w-4 h-4 mr-1" /> Add Branch
                    </Button>
                  </div>

                  {formData.branches.map((branch, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant={branch.is_primary ? "default" : "secondary"}>
                            {branch.is_primary ? "Primary Branch" : `Branch ${index + 1}`}
                          </Badge>
                          {!branch.is_primary && formData.branches.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBranch(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Branch Name</Label>
                            <Input
                              value={branch.branch_name}
                              onChange={(e) => updateBranch(index, 'branch_name', e.target.value)}
                              placeholder="e.g., Ikeja Branch"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                              value={branch.address}
                              onChange={(e) => updateBranch(index, 'address', e.target.value)}
                              placeholder="Branch address"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>State</Label>
                            <Select 
                              value={branch.state} 
                              onValueChange={(val) => updateBranch(index, 'state', val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {NIGERIAN_STATES.map(state => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                              value={branch.city}
                              onChange={(e) => updateBranch(index, 'city', e.target.value)}
                              placeholder="City"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Manager Name</Label>
                            <Input
                              value={branch.manager_name}
                              onChange={(e) => updateBranch(index, 'manager_name', e.target.value)}
                              placeholder="Branch manager"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Manager Phone</Label>
                            <Input
                              value={branch.manager_phone}
                              onChange={(e) => updateBranch(index, 'manager_phone', e.target.value)}
                              placeholder="Contact number"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Digital Presence */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    All fields in this section are optional but recommended to help customers find and connect with you.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook_url">Facebook Page</Label>
                    <Input
                      id="facebook_url"
                      type="url"
                      value={formData.facebook_url}
                      onChange={(e) => updateField('facebook_url', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram_handle">Instagram Handle</Label>
                    <Input
                      id="instagram_handle"
                      value={formData.instagram_handle}
                      onChange={(e) => updateField('instagram_handle', e.target.value)}
                      placeholder="@yourbusiness"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter_handle">Twitter/X Handle</Label>
                    <Input
                      id="twitter_handle"
                      value={formData.twitter_handle}
                      onChange={(e) => updateField('twitter_handle', e.target.value)}
                      placeholder="@yourbusiness"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tiktok_handle">TikTok Handle</Label>
                    <Input
                      id="tiktok_handle"
                      value={formData.tiktok_handle}
                      onChange={(e) => updateField('tiktok_handle', e.target.value)}
                      placeholder="@yourbusiness"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_business_url">Google Business Profile</Label>
                  <Input
                    id="google_business_url"
                    type="url"
                    value={formData.google_business_url}
                    onChange={(e) => updateField('google_business_url', e.target.value)}
                    placeholder="https://g.page/yourbusiness"
                  />
                </div>

                {formData.category === 'Restaurant' && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold">Menu (For Restaurants)</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="online_menu_url">Online Menu URL</Label>
                        <Input
                          id="online_menu_url"
                          type="url"
                          value={formData.online_menu_url}
                          onChange={(e) => updateField('online_menu_url', e.target.value)}
                          placeholder="Link to your online menu"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="menu_pdf_url">Menu PDF</Label>
                        <Input
                          id="menu_pdf_url"
                          type="url"
                          value={formData.menu_pdf_url}
                          onChange={(e) => updateField('menu_pdf_url', e.target.value)}
                          placeholder="Link to menu PDF"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Primary Contact *</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary_contact_name">Full Name *</Label>
                      <Input
                        id="primary_contact_name"
                        value={formData.primary_contact_name}
                        onChange={(e) => updateField('primary_contact_name', e.target.value)}
                        placeholder="Contact person name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary_contact_role">Role/Position</Label>
                      <Input
                        id="primary_contact_role"
                        value={formData.primary_contact_role}
                        onChange={(e) => updateField('primary_contact_role', e.target.value)}
                        placeholder="e.g., Owner, Manager"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary_contact_email">Email *</Label>
                      <Input
                        id="primary_contact_email"
                        type="email"
                        value={formData.primary_contact_email}
                        onChange={(e) => updateField('primary_contact_email', e.target.value)}
                        placeholder="email@business.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary_contact_phone">Phone *</Label>
                      <Input
                        id="primary_contact_phone"
                        type="tel"
                        value={formData.primary_contact_phone}
                        onChange={(e) => updateField('primary_contact_phone', e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Secondary Contact (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="secondary_contact_name">Full Name</Label>
                      <Input
                        id="secondary_contact_name"
                        value={formData.secondary_contact_name}
                        onChange={(e) => updateField('secondary_contact_name', e.target.value)}
                        placeholder="Alternative contact"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary_contact_phone">Phone</Label>
                      <Input
                        id="secondary_contact_phone"
                        type="tel"
                        value={formData.secondary_contact_phone}
                        onChange={(e) => updateField('secondary_contact_phone', e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="secondary_contact_email">Email</Label>
                      <Input
                        id="secondary_contact_email"
                        type="email"
                        value={formData.secondary_contact_email}
                        onChange={(e) => updateField('secondary_contact_email', e.target.value)}
                        placeholder="email@business.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Support (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="support_email">Support Email</Label>
                      <Input
                        id="support_email"
                        type="email"
                        value={formData.support_email}
                        onChange={(e) => updateField('support_email', e.target.value)}
                        placeholder="support@business.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="support_phone">Support Phone</Label>
                      <Input
                        id="support_phone"
                        type="tel"
                        value={formData.support_phone}
                        onChange={(e) => updateField('support_phone', e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="support_whatsapp">WhatsApp Number</Label>
                      <Input
                        id="support_whatsapp"
                        type="tel"
                        value={formData.support_whatsapp}
                        onChange={(e) => updateField('support_whatsapp', e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer_service_contact">General Inquiry</Label>
                      <Input
                        id="customer_service_contact"
                        value={formData.customer_service_contact}
                        onChange={(e) => updateField('customer_service_contact', e.target.value)}
                        placeholder="Contact for general inquiries"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Banking & Payment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    This information is required for receiving payments from deals sold on Vouchify.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name *</Label>
                  <Select value={formData.bank_name} onValueChange={(val) => updateField('bank_name', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_BANKS.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_name">Account Name *</Label>
                    <Input
                      id="account_name"
                      value={formData.account_name}
                      onChange={(e) => updateField('account_name', e.target.value)}
                      placeholder="Account holder name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number *</Label>
                    <Input
                      id="account_number"
                      value={formData.account_number}
                      onChange={(e) => updateField('account_number', e.target.value)}
                      placeholder="10-digit account number"
                      maxLength={10}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Settlement Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="settlement_frequency">Settlement Frequency</Label>
                    <Select 
                      value={formData.settlement_frequency} 
                      onValueChange={(val) => updateField('settlement_frequency', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How often you'd like to receive payments
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escrow_type">Escrow Type</Label>
                    <Select 
                      value={formData.escrow_type} 
                      onValueChange={(val) => updateField('escrow_type', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (Released after redemption)</SelectItem>
                        <SelectItem value="express">Express (Released immediately)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Standard is recommended for better customer protection
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Documents */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Upload verification documents. All documents must be clear and legible. Accepted formats: PDF, JPG, PNG (Max 10MB).
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>CAC/Business Registration Document *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {cacDocPreview ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span className="font-medium">{cacDocPreview}</span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setCacDocPreview('');
                            updateField('cac_document_url', '');
                          }}
                        >
                          <X className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload CAC document</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload(e, 'cac_document_url', setCacDocPreview)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Owner/Director ID Document *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {ownerIdPreview ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span className="font-medium">{ownerIdPreview}</span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setOwnerIdPreview('');
                            updateField('owner_id_url', '');
                          }}
                        >
                          <X className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload ID (NIN, Driver's License, Passport)</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload(e, 'owner_id_url', setOwnerIdPreview)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    These documents will be reviewed by our team. Approval typically takes 2-3 business days.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 7: Review */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Please review your information carefully before submitting. You can edit any section by clicking on it.
                  </AlertDescription>
                </Alert>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="business">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Business Information
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Business Name:</span>
                          <span className="font-medium">{formData.name}</span>
                          
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{formData.category}</span>
                          
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{formData.business_type}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => goToStep(1)}>Edit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="location">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location & Operations
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium">{formData.address}</span>
                          
                          <span className="text-muted-foreground">State/City:</span>
                          <span className="font-medium">{formData.state}, {formData.city}</span>
                          
                          <span className="text-muted-foreground">Working Days:</span>
                          <span className="font-medium">{formData.working_days.length} days</span>
                          
                          <span className="text-muted-foreground">Branches:</span>
                          <span className="font-medium">{formData.branches.length}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => goToStep(2)}>Edit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="digital">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Digital Presence
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          {formData.website && (
                            <>
                              <span className="text-muted-foreground">Website:</span>
                              <span className="font-medium truncate">{formData.website}</span>
                            </>
                          )}
                          {formData.instagram_handle && (
                            <>
                              <span className="text-muted-foreground">Instagram:</span>
                              <span className="font-medium">{formData.instagram_handle}</span>
                            </>
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => goToStep(3)}>Edit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="contacts">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Information
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Primary Contact:</span>
                          <span className="font-medium">{formData.primary_contact_name}</span>
                          
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{formData.primary_contact_email}</span>
                          
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{formData.primary_contact_phone}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => goToStep(4)}>Edit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="banking">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Banking Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Bank:</span>
                          <span className="font-medium">{formData.bank_name}</span>
                          
                          <span className="text-muted-foreground">Account:</span>
                          <span className="font-medium">{formData.account_number}</span>
                          
                          <span className="text-muted-foreground">Settlement:</span>
                          <span className="font-medium capitalize">{formData.settlement_frequency}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => goToStep(5)}>Edit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="documents">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Documents
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>CAC Document uploaded</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>Owner ID uploaded</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => goToStep(6)}>Edit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Separator />

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                    I confirm that all information provided is accurate and I accept Vouchify's{' '}
                    <a href="/terms" target="_blank" className="text-primary underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-primary underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {currentStep < 7 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting || !acceptedTerms}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
