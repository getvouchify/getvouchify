import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface WaitlistMerchant {
  id: string;
  email: string;
  name: string;
  business_name: string;
  category: string;
  state: string;
  local_government: string;
  phone: string;
  created_at: string;
}

interface AccountStatus {
  [email: string]: 'not_created' | 'created' | 'creating' | 'error';
}

export default function AdminMerchantAccounts() {
  const [merchants, setMerchants] = useState<WaitlistMerchant[]>([]);
  const [accountStatuses, setAccountStatuses] = useState<AccountStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPassword, setSelectedPassword] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      setIsLoading(true);
      
      // Fetch waitlist merchants
      const { data: waitlistData, error: waitlistError } = await supabase
        .from("waitlist")
        .select("*")
        .eq("type", "merchant")
        .order("created_at", { ascending: false });

      if (waitlistError) throw waitlistError;

      // Check which merchants already have accounts
      const { data: existingMerchants, error: merchantsError } = await supabase
        .from("merchants")
        .select("email, user_id")
        .not("user_id", "is", null);

      if (merchantsError) throw merchantsError;

      const existingEmails = new Set(existingMerchants?.map(m => m.email) || []);
      
      const statuses: AccountStatus = {};
      waitlistData?.forEach(merchant => {
        statuses[merchant.email] = existingEmails.has(merchant.email) ? 'created' : 'not_created';
      });

      setMerchants(waitlistData || []);
      setAccountStatuses(statuses);
    } catch (error: any) {
      console.error("Error loading merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (merchantEmail: string) => {
    setAccountStatuses(prev => ({ ...prev, [merchantEmail]: 'creating' }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-merchant-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ merchantEmail }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create account');
      }

      setAccountStatuses(prev => ({ ...prev, [merchantEmail]: 'created' }));
      setSelectedPassword({
        email: result.email,
        password: result.password,
        name: result.name || result.business_name,
      });
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Error creating account:", error);
      setAccountStatuses(prev => ({ ...prev, [merchantEmail]: 'error' }));
      toast.error(error.message || "Failed to create account");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const copyLoginCredentials = () => {
    if (!selectedPassword) return;
    
    const text = `Vouchify Merchant Login Credentials\n\nEmail: ${selectedPassword.email}\nPassword: ${selectedPassword.password}\n\nLogin at: ${window.location.origin}/merchant/login\n\nPlease change your password after first login.`;
    
    navigator.clipboard.writeText(text);
    toast.success("Login credentials copied!");
  };

  const filteredMerchants = merchants.filter(m => 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (email: string) => {
    const status = accountStatuses[email];
    
    switch (status) {
      case 'created':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Created</Badge>;
      case 'creating':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Creating...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Not Created</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Merchant Accounts</h1>
        <p className="text-muted-foreground mt-2">
          Generate authentication accounts for waitlist merchants
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by email, name, or business..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredMerchants.length} merchant{filteredMerchants.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMerchants.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell className="font-medium">{merchant.email}</TableCell>
                <TableCell>{merchant.name || '-'}</TableCell>
                <TableCell>{merchant.business_name || '-'}</TableCell>
                <TableCell>{merchant.category || '-'}</TableCell>
                <TableCell>{merchant.state || '-'}, {merchant.local_government || '-'}</TableCell>
                <TableCell>{merchant.phone || '-'}</TableCell>
                <TableCell>{getStatusBadge(merchant.email)}</TableCell>
                <TableCell className="text-right">
                  {accountStatuses[merchant.email] === 'not_created' && (
                    <Button
                      size="sm"
                      onClick={() => createAccount(merchant.email)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                  )}
                  {accountStatuses[merchant.email] === 'creating' && (
                    <Button size="sm" disabled>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </Button>
                  )}
                  {accountStatuses[merchant.email] === 'created' && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Created
                    </Badge>
                  )}
                  {accountStatuses[merchant.email] === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => createAccount(merchant.email)}
                    >
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPassword} onOpenChange={() => setSelectedPassword(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Created Successfully!</DialogTitle>
            <DialogDescription>
              Save these credentials - they won't be shown again
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Merchant</label>
              <div className="text-sm text-muted-foreground">{selectedPassword?.name}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm">{selectedPassword?.email}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(selectedPassword?.email || '', 'Email')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{selectedPassword?.password}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(selectedPassword?.password || '', 'Password')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button onClick={copyLoginCredentials} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Full Login Credentials
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Send these credentials to the merchant via email or WhatsApp
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
