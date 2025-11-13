import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingCart, 
  QrCode,
  MessageSquare,
  DollarSign,
  Store,
  Settings,
  LogOut 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  { title: "Profile", url: "/merchant/profile", icon: Store },
  { title: "My Deals", url: "/merchant/deals", icon: Tag },
  { title: "Orders & Bookings", url: "/merchant/orders", icon: ShoppingCart },
  { title: "QR Redemptions", url: "/merchant/redemptions", icon: QrCode },
  { title: "Messages", url: "/merchant/messages", icon: MessageSquare },
  { title: "Settlements", url: "/merchant/settlements", icon: DollarSign },
  { title: "Settings", url: "/merchant/settings", icon: Settings },
];

export const MerchantSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/merchant/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Merchant Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
