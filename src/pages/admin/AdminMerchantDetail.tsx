import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ArrowLeft, Building2, MapPin, Globe, Phone, CreditCard, 
  FileText, Download, Mail, ExternalLink, Loader2, Package,
  ShoppingBag, Calendar, DollarSign, Eye, Image as ImageIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminMerchantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadMerchantDetails();
    }
  }, [id]);

  const loadMerchantDetails = async () => {
    try {
      setLoading(true);
      
      // Load merchant data
      const { data: merchantData, error: merchantError } = await supabase
        .from("merchants")
        .select("*")
        .eq("id", id)
        .single();

      if (merchantError) throw merchantError;
      setMerchant(merchantData);

      // Load branches
      const { data: branchesData } = await supabase
        .from("merchant_branches")
        .select("*")
        .eq("merchant_id", id);
      setBranches(branchesData || []);

      // Load deals
      const { data: dealsData } = await supabase
        .from("deals")
        .select("*")
        .eq("merchant_id", id)
        .order("created_at", { ascending: false })
        .limit(10);
      setDeals(dealsData || []);

      // Load orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, deals(title)")
        .eq("deal_id", id)
        .order("created_at", { ascending: false })
        .limit(10);
      setOrders(ordersData || []);

    } catch (error: any) {
      console.error("Error loading merchant details:", error);
      toast.error("Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      setDownloading(true);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success(`${filename} downloaded successfully`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`${filename} downloaded`);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const downloadAllDealImages = async (deal: any) => {
    const images = [deal.image_url, ...(deal.deal_images || [])];
    for (let i = 0; i < images.length; i++) {
      const filename = `${merchant.name}-${deal.title}-image-${i + 1}.jpg`.replace(/[^a-z0-9.-]/gi, '-');
      await downloadImage(images[i], filename);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    toast.success(`Downloaded ${images.length} images`);
  };

  const openDealDetailDialog = (deal: any) => {
    setSelectedDeal(deal);
    setDealDialogOpen(true);
  };

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'full_price':
        return 'Full Price';
      case 'loyalty_program':
        return 'Loyalty Program';
      case 'discounted_offer':
        return 'Discounted Offer';
      default:
        return type;
    }
  };

  const getListingTypeBadge = (type: string) => {
    switch (type) {
      case 'full_price':
        return 'default';
      case 'loyalty_program':
        return 'secondary';
      case 'discounted_offer':
        return 'default';
      default:
        return 'outline';
    }
  };

  const exportMerchantData = () => {
    if (!merchant) return;
    
    const data = {
      ...merchant,
      branches,
      deals: deals.length,
      orders: orders.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-${merchant.name}-${Date.now()}.json`;
    a.click();
    toast.success("Merchant data exported");
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </AdminLayout>
      </AdminAuthGuard>
    );
  }

  if (!merchant) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Merchant not found</p>
            <Button onClick={() => navigate("/admin/merchants")} className="mt-4">
              Back to Merchants
            </Button>
          </div>
        </AdminLayout>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/admin/merchants")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{merchant.name}</h1>
                <p className="text-muted-foreground">{merchant.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(merchant.status)}
              <Button variant="outline" onClick={exportMerchantData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="business">Business Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
              <TabsTrigger value="branches">Branches ({branches.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getStatusBadge(merchant.status)}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{deals.filter(d => d.is_active).length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{orders.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Member Since</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(merchant.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{merchant.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">{merchant.business_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year Established</p>
                      <p className="font-medium">{merchant.year_established || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{merchant.short_description || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Primary Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{merchant.primary_contact_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{merchant.primary_contact_role || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{merchant.primary_contact_email || merchant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{merchant.primary_contact_phone || merchant.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Business Name</Label>
                      <p className="font-medium">{merchant.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Registered Name</Label>
                      <p className="font-medium">{merchant.registered_name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Registration Number</Label>
                      <p className="font-medium">{merchant.business_reg_number || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Tax ID</Label>
                      <p className="font-medium">{merchant.tax_id || 'N/A'}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-muted-foreground">Full Description</Label>
                    <p className="mt-2">{merchant.full_description || 'N/A'}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="mt-1">{merchant.address || 'N/A'}</p>
                      <p className="text-sm">{merchant.city}, {merchant.state}</p>
                      <p className="text-sm text-muted-foreground">{merchant.lga}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Landmark</Label>
                      <p className="mt-1">{merchant.landmark || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p>{merchant.primary_contact_name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Role</Label>
                      <p>{merchant.primary_contact_role || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p>{merchant.primary_contact_email || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p>{merchant.primary_contact_phone || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Secondary Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p>{merchant.secondary_contact_name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Role</Label>
                      <p>{merchant.secondary_contact_role || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p>{merchant.secondary_contact_email || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p>{merchant.secondary_contact_phone || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Digital Presence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {merchant.website && (
                      <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    {merchant.facebook_url && (
                      <a href={merchant.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                        Facebook
                      </a>
                    )}
                    {merchant.instagram_handle && (
                      <p className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Instagram: @{merchant.instagram_handle}
                      </p>
                    )}
                    {!merchant.website && !merchant.facebook_url && !merchant.instagram_handle && (
                      <p className="text-muted-foreground">No digital presence information</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Support Contacts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Customer Service</Label>
                      <p>{merchant.customer_service_contact || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Support Email</Label>
                      <p>{merchant.support_email || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Support Phone</Label>
                      <p>{merchant.support_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">WhatsApp</Label>
                      <p>{merchant.support_whatsapp || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Images</CardTitle>
                  <CardDescription>Visual branding and storefront photos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Business Logo</Label>
                      {merchant.logo_url ? (
                        <>
                          <img 
                            src={merchant.logo_url} 
                            alt="Business Logo"
                            className="w-full max-w-[200px] h-auto border rounded-lg object-contain bg-muted/30 p-2"
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadFile(merchant.logo_url, `${merchant.name}-logo.png`)}
                              disabled={downloading}
                            >
                              {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => window.open(merchant.logo_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Full Size
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/20">
                          No logo uploaded
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label>Storefront Image</Label>
                      {merchant.storefront_image_url ? (
                        <>
                          <img 
                            src={merchant.storefront_image_url} 
                            alt="Storefront"
                            className="w-full max-w-[200px] h-auto border rounded-lg object-cover"
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadFile(merchant.storefront_image_url, `${merchant.name}-storefront.png`)}
                              disabled={downloading}
                            >
                              {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => window.open(merchant.storefront_image_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Full Size
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/20">
                          No storefront image uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Documents</CardTitle>
                  <CardDescription>Legal documents and certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {merchant.cac_document_url && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">CAC Document</p>
                            <p className="text-sm text-muted-foreground">Business registration certificate</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => downloadFile(merchant.cac_document_url, `${merchant.name}-cac.pdf`)}
                            disabled={downloading}
                          >
                            {downloading ? <Loader2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.open(merchant.cac_document_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {merchant.owner_id_url && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Owner ID</p>
                            <p className="text-sm text-muted-foreground">Owner identification document</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => downloadFile(merchant.owner_id_url, `${merchant.name}-owner-id.pdf`)}
                            disabled={downloading}
                          >
                            {downloading ? <Loader2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.open(merchant.owner_id_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {merchant.other_documents && Array.isArray(merchant.other_documents) && merchant.other_documents.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <h3 className="font-semibold">Additional Documents</h3>
                        {merchant.other_documents.map((doc: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => downloadFile(doc.url, doc.name)}
                                disabled={downloading}
                              >
                                {downloading ? <Loader2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Merchant Deals</CardTitle>
                  <CardDescription>All deals created by this merchant</CardDescription>
                </CardHeader>
                <CardContent>
                  {deals.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Listing Type</TableHead>
                          <TableHead>Images</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deals.map((deal) => (
                          <TableRow key={deal.id}>
                            <TableCell>
                              <img 
                                src={deal.image_url} 
                                alt={deal.title}
                                className="w-12 h-12 rounded object-cover cursor-pointer hover:scale-110 transition-transform"
                                onClick={() => window.open(deal.image_url, '_blank')}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{deal.title}</TableCell>
                            <TableCell>{deal.category}</TableCell>
                            <TableCell>
                              <Badge variant={getListingTypeBadge(deal.listing_type) as any}>
                                {getListingTypeLabel(deal.listing_type)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <ImageIcon className="h-4 w-4" />
                                {1 + (deal.deal_images?.length || 0)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={deal.is_active ? "default" : "secondary"}>
                                {deal.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openDealDetailDialog(deal)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No deals created yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branches" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Branch Locations</CardTitle>
                  <CardDescription>All branch locations for this merchant</CardDescription>
                </CardHeader>
                <CardContent>
                  {branches.length > 0 ? (
                    <div className="space-y-4">
                      {branches.map((branch) => (
                        <Card key={branch.id}>
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Branch Name</Label>
                                <p className="font-medium">{branch.branch_name}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Address</Label>
                                <p>{branch.address}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Manager</Label>
                                <p>{branch.manager_name}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Manager Phone</Label>
                                <p>{branch.manager_phone}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No branches added</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Deal Detail Dialog */}
        <Dialog open={dealDialogOpen} onOpenChange={setDealDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedDeal && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedDeal.title}</span>
                    <Badge variant={selectedDeal.is_active ? "default" : "secondary"}>
                      {selectedDeal.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                {/* Image Gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Deal Images</span>
                      <Button 
                        size="sm" 
                        onClick={() => downloadAllDealImages(selectedDeal)}
                        disabled={downloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All ({1 + (selectedDeal.deal_images?.length || 0)})
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main Image */}
                    <div>
                      <Label>Main Image</Label>
                      <div className="relative group mt-2">
                        <img 
                          src={selectedDeal.image_url} 
                          alt="Main deal image"
                          className="w-full h-64 object-cover rounded-lg cursor-pointer"
                          onClick={() => window.open(selectedDeal.image_url, '_blank')}
                        />
                        <Button 
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => downloadImage(
                            selectedDeal.image_url, 
                            `${merchant?.name}-${selectedDeal.title}-main.jpg`.replace(/[^a-z0-9.-]/gi, '-')
                          )}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Additional Images */}
                    {selectedDeal.deal_images && selectedDeal.deal_images.length > 0 && (
                      <div>
                        <Label>Additional Images ({selectedDeal.deal_images.length})</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          {selectedDeal.deal_images.map((img: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <img 
                                src={img} 
                                alt={`Additional image ${idx + 1}`}
                                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                                onClick={() => window.open(img, '_blank')}
                              />
                              <Button 
                                size="sm"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => downloadImage(
                                  img, 
                                  `${merchant?.name}-${selectedDeal.title}-${idx + 2}.jpg`.replace(/[^a-z0-9.-]/gi, '-')
                                )}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Listing Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Listing Type</Label>
                        <div className="mt-1">
                          <Badge variant={getListingTypeBadge(selectedDeal.listing_type) as any}>
                            {getListingTypeLabel(selectedDeal.listing_type)}
                          </Badge>
                        </div>
                      </div>
                      {selectedDeal.listing_type === 'loyalty_program' && selectedDeal.merchant_loyalty_details && (
                        <div className="col-span-2">
                          <Label>Loyalty Program Details</Label>
                          <p className="text-sm mt-1">{selectedDeal.merchant_loyalty_details}</p>
                        </div>
                      )}
                      <div>
                        <Label>Category</Label>
                        <p className="text-sm mt-1">{selectedDeal.category}</p>
                      </div>
                      <div>
                        <Label>Created</Label>
                        <p className="text-sm mt-1">{new Date(selectedDeal.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedDeal.original_price && (
                        <div>
                          <Label>Original Price</Label>
                          <p className="text-lg font-semibold mt-1">₦{selectedDeal.original_price?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedDeal.current_price && (
                        <div>
                          <Label>Current Price</Label>
                          <p className="text-lg font-semibold mt-1">₦{selectedDeal.current_price?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedDeal.discount && (
                        <div>
                          <Label>Discount</Label>
                          <p className="text-lg font-semibold text-green-600 mt-1">{selectedDeal.discount}% off</p>
                        </div>
                      )}
                      {selectedDeal.sold_count !== null && (
                        <div>
                          <Label>Units Sold</Label>
                          <p className="text-lg font-semibold mt-1">{selectedDeal.sold_count}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Description & Offer */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description & Offer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedDeal.offer && (
                      <div>
                        <Label>Offer Description</Label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedDeal.offer}</p>
                      </div>
                    )}
                    {selectedDeal.terms_and_conditions && (
                      <div>
                        <Label>Terms & Conditions</Label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedDeal.terms_and_conditions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Availability & Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Availability & Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedDeal.available_days && selectedDeal.available_days.length > 0 && (
                      <div>
                        <Label>Available Days</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDeal.available_days.map((day: string) => (
                            <Badge key={day} variant="outline">{day}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {(selectedDeal.deal_start_date || selectedDeal.deal_end_date) && (
                      <div>
                        <Label>Valid Period</Label>
                        <p className="text-sm mt-1">
                          {selectedDeal.deal_start_date ? new Date(selectedDeal.deal_start_date).toLocaleDateString() : 'N/A'} 
                          {' to '}
                          {selectedDeal.deal_end_date ? new Date(selectedDeal.deal_end_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {selectedDeal.requires_booking && (
                        <Badge variant="secondary">Requires Booking</Badge>
                      )}
                      {selectedDeal.requires_time_slot && (
                        <Badge variant="secondary">Requires Time Slot</Badge>
                      )}
                      {selectedDeal.requires_qr_code && (
                        <Badge variant="secondary">Requires QR Code</Badge>
                      )}
                    </div>
                    {selectedDeal.usage_limit && (
                      <div>
                        <Label>Usage Limit</Label>
                        <p className="text-sm mt-1">{selectedDeal.usage_limit} per customer</p>
                      </div>
                    )}
                    {selectedDeal.daily_limit && (
                      <div>
                        <Label>Daily Limit</Label>
                        <p className="text-sm mt-1">{selectedDeal.daily_limit} per day</p>
                      </div>
                    )}
                    {selectedDeal.age_restriction && (
                      <div>
                        <Label>Age Restriction</Label>
                        <p className="text-sm mt-1">{selectedDeal.age_restriction}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminAuthGuard>
  );
}