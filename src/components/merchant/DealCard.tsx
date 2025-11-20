import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  BarChart3, 
  Copy, 
  Trash2,
  Gift,
  Percent
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface DealCardProps {
  deal: any;
  onUpdate: () => void;
}

export const DealCard = ({ deal, onUpdate }: DealCardProps) => {
  const navigate = useNavigate();
  const isExpired = deal.expiry_date && new Date(deal.expiry_date) < new Date();

  const toggleActive = async () => {
    try {
      const { error } = await supabase
        .from("deals")
        .update({ is_active: !deal.is_active })
        .eq("id", deal.id);
      
      if (error) throw error;
      toast.success(`Deal ${!deal.is_active ? 'activated' : 'deactivated'}`);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update deal");
    }
  };

  const deleteDeal = async () => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    
    try {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", deal.id);
      
      if (error) throw error;
      toast.success("Deal deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <img 
          src={deal.image_url} 
          alt={deal.title}
          className="w-full h-full object-cover"
        />
        {isExpired && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Expired
          </Badge>
        )}
        {!isExpired && (
          <Badge 
            variant={deal.is_active ? "default" : "secondary"}
            className="absolute top-2 right-2"
          >
            {deal.is_active ? "Active" : "Inactive"}
          </Badge>
        )}
        {deal.listing_type === 'loyalty_program' && (
          <Badge variant="secondary" className="absolute top-2 left-2 flex items-center gap-1">
            <Gift className="h-3 w-3" />
            Loyalty Rewards
          </Badge>
        )}
        {deal.listing_type === 'discounted_offer' && deal.discount && (
          <Badge variant="destructive" className="absolute top-2 left-2 flex items-center gap-1">
            <Percent className="h-3 w-3" />
            {deal.discount}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{deal.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {deal.listing_type === 'full_price' && (
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Standard Listing
            </Badge>
          )}
          {deal.listing_type === 'loyalty_program' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              Merchant Loyalty
            </Badge>
          )}
          {deal.listing_type === 'discounted_offer' && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Percent className="h-3 w-3" />
              Discounted Offer
            </Badge>
          )}
          <Badge variant="outline">{deal.category}</Badge>
        </div>
        {deal.listing_type === 'loyalty_program' && deal.merchant_loyalty_details && (
          <CardDescription className="mt-2 text-xs">
            {deal.merchant_loyalty_details}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {deal.listing_type === 'discounted_offer' && deal.discount && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Discount:</span>
              <span className="font-bold text-primary">{deal.discount}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price:</span>
            <div className="flex items-center gap-2">
              {deal.listing_type === 'discounted_offer' && deal.original_price && (
                <span className="text-sm line-through text-muted-foreground">
                  ₦{Number(deal.original_price).toLocaleString()}
                </span>
              )}
              <span className="font-bold">
                ₦{Number(deal.current_price).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sold:</span>
            <span className="font-medium">{deal.sold_count || 0}</span>
          </div>
          {deal.expiry_date && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expires:</span>
              <span className="text-sm">
                {format(new Date(deal.expiry_date), "MMM dd, yyyy")}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => navigate(`/merchant/deals/${deal.id}/edit`)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleActive}
          disabled={isExpired}
        >
          {deal.is_active ? (
            <><EyeOff className="h-4 w-4 mr-1" />Hide</>
          ) : (
            <><Eye className="h-4 w-4 mr-1" />Show</>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/merchant/deals/${deal.id}/analytics`)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={deleteDeal}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
