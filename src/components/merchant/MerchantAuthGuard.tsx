import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMerchant } from "@/hooks/useMerchant";
import { Loader2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MerchantAuthGuardProps {
  children: React.ReactNode;
}

export const MerchantAuthGuard = ({ children }: MerchantAuthGuardProps) => {
  const { isMerchant, merchantData, merchantStatus, isLoading } = useMerchant();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isMerchant) {
      navigate("/merchant/login");
    }
  }, [isMerchant, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isMerchant) {
    return null;
  }

  // Show pending approval screen
  if (merchantStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription>
              Your merchant application is being reviewed by our team.
              You'll receive an email once approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Applied on:</strong>{" "}
                {merchantData?.created_at
                  ? new Date(merchantData.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              We typically review applications within 24-48 hours.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show rejection screen with reason
  if (merchantStatus === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl">Application Not Approved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Reason for Rejection</AlertTitle>
              <AlertDescription className="mt-2">
                {merchantData?.rejection_reason || "No reason provided"}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground text-center">
              You can address these concerns and resubmit your application.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate("/merchant/onboarding")}>
                Edit & Resubmit Application
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Approved - render children (dashboard)
  return <>{children}</>;
};
