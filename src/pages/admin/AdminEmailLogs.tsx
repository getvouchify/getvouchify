import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { ExportButton } from "@/components/admin/ExportButton";
import { Input } from "@/components/ui/input";
import { Mail, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface EmailLog {
  timestamp: number;
  recipient: string;
  type: string;
  status: "sent" | "failed";
  error?: string;
}

export default function AdminEmailLogs() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmailLogs();
  }, []);

  const loadEmailLogs = async () => {
    try {
      setIsLoading(true);
      
      // Fetch logs from both edge functions
      const waitlistLogsPromise = supabase.functions.invoke('send-waitlist-confirmation', {
        method: 'GET',
      });
      
      const contactLogsPromise = supabase.functions.invoke('send-contact-email', {
        method: 'GET',
      });

      // Parse logs from edge function responses
      // Note: This is a simplified version. In production, you'd want to store logs in a database table
      const logs: EmailLog[] = [];
      
      // For now, we'll just show a message that logs are available through the backend
      setEmailLogs(logs);
    } catch (error) {
      console.error("Error loading email logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = emailLogs.filter(log =>
    log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = filteredLogs.map(log => ({
    Recipient: log.recipient,
    Type: log.type,
    Status: log.status,
    Timestamp: new Date(log.timestamp).toLocaleString(),
    Error: log.error || "N/A",
  }));

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Email Logs</h2>
              <p className="text-muted-foreground">
                Track all emails sent from the platform
              </p>
            </div>
            <ExportButton 
              data={exportData} 
              filename="vouchify-email-logs" 
              sheetName="Email Logs" 
            />
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by email or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="border rounded-lg">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading email logs...</p>
              </div>
            ) : emailLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Email Logs Available in Backend</h3>
                <p className="text-muted-foreground mb-4">
                  Email activity logs can be viewed through the backend logs viewer.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg max-w-md mx-auto">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm text-left">
                      <p className="font-medium mb-1">To view detailed email logs:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Open the Backend viewer</li>
                        <li>Navigate to Edge Functions</li>
                        <li>Select "send-waitlist-confirmation" or "send-contact-email"</li>
                        <li>View logs and email activity</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{log.recipient}</TableCell>
                      <TableCell className="capitalize">{log.type}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "sent" ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.error || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}