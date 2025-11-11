import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MerchantData {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  [key: string]: any;
}

export const useMerchant = () => {
  const [isMerchant, setIsMerchant] = useState(false);
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [merchantStatus, setMerchantStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkMerchantStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkMerchantStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkMerchantStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsMerchant(false);
        setMerchantData(null);
        setMerchantStatus(null);
        setIsLoading(false);
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "merchant")
        .maybeSingle();

      if (roleError) throw roleError;
      
      setIsMerchant(!!roleData);

      if (roleData) {
        const { data: merchant, error: merchantError } = await supabase
          .from("merchants")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (merchantError) throw merchantError;
        
        setMerchantData(merchant as MerchantData);
        setMerchantStatus((merchant?.status as 'pending' | 'approved' | 'rejected') || 'pending');
      }
    } catch (error) {
      console.error("Error checking merchant status:", error);
      setIsMerchant(false);
      setMerchantData(null);
      setMerchantStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isMerchant, merchantData, merchantStatus, isLoading };
};
