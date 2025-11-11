import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditDeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeal();
  }, [id]);

  const loadDeal = async () => {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      // TODO: Populate form with existing data
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load deal");
      navigate("/merchant/deals");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Edit Deal</h2>
      <p className="text-muted-foreground">Edit deal functionality coming soon...</p>
    </div>
  );
}
