import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMerchant } from "@/hooks/useMerchant";
import { Loader2 } from "lucide-react";

interface MerchantAuthGuardProps {
  children: React.ReactNode;
}

export const MerchantAuthGuard = ({ children }: MerchantAuthGuardProps) => {
  const { isMerchant, isLoading } = useMerchant();
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

  // Grant immediate access - no status checks needed
  return <>{children}</>;
};
