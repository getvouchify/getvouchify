import { MerchantSidebar } from "./MerchantSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export const MerchantLayout = ({ children }: MerchantLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MerchantSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">Vouchify Merchant</h1>
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
