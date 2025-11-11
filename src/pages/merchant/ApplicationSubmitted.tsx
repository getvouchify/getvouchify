import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ApplicationSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Application Submitted Successfully!</CardTitle>
          <CardDescription>
            Thank you for applying to become a Vouchify merchant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Our team will review your application within 24-48 hours. 
            You'll receive an email notification once your account is approved.
          </p>
          
          <div className="bg-muted p-4 rounded-lg text-left">
            <h4 className="font-medium mb-2">What's Next?</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>We'll verify your business documents</li>
              <li>Our team will review your business information</li>
              <li>You'll receive an approval email</li>
              <li>Access your merchant dashboard</li>
            </ul>
          </div>
          
          <Button variant="outline" onClick={() => navigate("/merchant/dashboard")}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
