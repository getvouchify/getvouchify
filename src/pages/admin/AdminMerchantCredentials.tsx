import { useState, useEffect } from "react";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, Download, Search, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Credential {
  id: string;
  merchant_id: string;
  merchant_email: string;
  merchant_name: string;
  business_name: string;
  temporary_password: string;
  created_by_admin_id: string;
  created_at: string;
  password_changed: boolean;
  first_login_at: string | null;
  notes: string | null;
}

const AdminMerchantCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [selectedCredentials, setSelectedCredentials] = useState<Set<string>>(new Set());
  const [resettingPassword, setResettingPassword] = useState<string | null>(null);
  const [bulkResetting, setBulkResetting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetTarget, setResetTarget] = useState<{ type: 'single' | 'bulk', email?: string }>({ type: 'single' });
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState<{ email: string; password: string; loginUrl: string } | null>(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [searchTerm, credentials]);

  const loadCredentials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("merchant_account_credentials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error: any) {
      console.error("Error loading credentials:", error);
      toast.error("Failed to load credentials");
    } finally {
      setLoading(false);
    }
  };

  const filterCredentials = () => {
    if (!searchTerm) {
      setFilteredCredentials(credentials);
      return;
    }

    const filtered = credentials.filter(
      (cred) =>
        cred.merchant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.merchant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCredentials(filtered);
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const copyLoginInfo = (cred: Credential) => {
    const loginUrl = `${window.location.origin}/merchant/login`;
    const info = `
Merchant Login Credentials
━━━━━━━━━━━━━━━━━━━━━━━━
Business: ${cred.business_name || cred.merchant_name}
Email: ${cred.merchant_email}
Password: ${cred.temporary_password}
Login URL: ${loginUrl}

⚠️ This password can be changed anytime in Settings.
    `.trim();
    
    navigator.clipboard.writeText(info);
    toast.success("Full login info copied to clipboard");
  };

  const resetPassword = async (email: string) => {
    setResettingPassword(email);
    try {
      const { data, error } = await supabase.functions.invoke('reset-merchant-password', {
        body: { merchantEmail: email }
      });

      if (error) throw error;

      toast.success("Password reset successfully!");
      setNewPasswordData({
        email: email,
        password: data.newPassword,
        loginUrl: `${window.location.origin}/merchant/login`
      });
      setShowNewPasswordDialog(true);
      
      // Reload credentials to show updated data
      loadCredentials();
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setResettingPassword(null);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Business Name", "Contact Name", "Email", "Password", "Created Date", "Password Changed"],
      ...filteredCredentials.map((cred) => [
        cred.business_name || "",
        cred.merchant_name || "",
        cred.merchant_email,
        cred.temporary_password,
        format(new Date(cred.created_at), "yyyy-MM-dd HH:mm"),
        cred.password_changed ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `merchant-credentials-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Credentials exported to CSV");
  };

  const getPasswordChangedBadge = (changed: boolean) => {
    return changed ? (
      <Badge variant="default" className="bg-green-500">
        Changed
      </Badge>
    ) : (
      <Badge variant="secondary">Not Changed</Badge>
    );
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Merchant Credentials</h1>
              <p className="text-muted-foreground mt-1">
                View and manage all generated merchant account passwords
              </p>
            </div>
            <Button onClick={exportToCSV} disabled={filteredCredentials.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-yellow-600 flex items-center gap-2">
                ⚠️ Security Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>These passwords are temporary and should be changed by merchants on first login</li>
                <li>Do not share passwords over insecure channels</li>
                <li>All password views are logged for security audit purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Credentials ({filteredCredentials.length})</CardTitle>
                  <CardDescription>Generated merchant account passwords</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading credentials...</p>
                </div>
              ) : filteredCredentials.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No credentials found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCredentials.map((cred) => (
                        <TableRow key={cred.id}>
                          <TableCell className="font-medium">
                            {cred.business_name || "-"}
                          </TableCell>
                          <TableCell>{cred.merchant_name || "-"}</TableCell>
                          <TableCell>{cred.merchant_email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                {visiblePasswords[cred.id]
                                  ? cred.temporary_password
                                  : "••••••••••••"}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePasswordVisibility(cred.id)}
                              >
                                {visiblePasswords[cred.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(cred.created_at), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            {getPasswordChangedBadge(cred.password_changed)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cred.temporary_password, "Password")}
                                title="Copy password"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyLoginInfo(cred)}
                              >
                                Copy Login Info
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setResetTarget({ type: 'single', email: cred.merchant_email });
                                  setShowResetDialog(true);
                                }}
                                disabled={resettingPassword === cred.merchant_email}
                                title="Reset password"
                              >
                                {resettingPassword === cred.merchant_email ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reset Password Confirmation Dialog */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Password?</AlertDialogTitle>
              <AlertDialogDescription>
                This will generate a new temporary password for <strong>{resetTarget.email}</strong>.
                The old password will no longer work.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (resetTarget.email) resetPassword(resetTarget.email);
                setShowResetDialog(false);
              }}>
                Reset Password
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* New Password Display Dialog */}
        <Dialog open={showNewPasswordDialog} onOpenChange={setShowNewPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Password Generated</DialogTitle>
              <DialogDescription>
                Password has been reset successfully. Share this with the merchant securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="font-mono text-sm">{newPasswordData?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">New Password:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">{newPasswordData?.password}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(newPasswordData?.password || '', 'Password')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Login URL:</span>
                  <span className="text-xs text-muted-foreground">{newPasswordData?.loginUrl}</span>
                </div>
              </div>
              
              <Button
                className="w-full"
                onClick={() => {
                  const info = `
Merchant Login Credentials (RESET)
━━━━━━━━━━━━━━━━━━━━━━━━
Email: ${newPasswordData?.email}
Password: ${newPasswordData?.password}
Login URL: ${newPasswordData?.loginUrl}

⚠️ This is a new password. The old password no longer works.
                  `.trim();
                  copyToClipboard(info, 'Full login info');
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Full Login Info
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminAuthGuard>
  );
};

export default AdminMerchantCredentials;
