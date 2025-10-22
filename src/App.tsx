import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDeals from "./pages/admin/AdminDeals";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMerchants from "./pages/admin/AdminMerchants";
import AdminWaitlist from "./pages/admin/AdminWaitlist";
import AdminEmailLogs from "./pages/admin/AdminEmailLogs";
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
          <Route path="/admin/offers" element={<AdminAuthGuard><AdminDeals /></AdminAuthGuard>} />
          <Route path="/admin/orders" element={<AdminAuthGuard><AdminOrders /></AdminAuthGuard>} />
          <Route path="/admin/merchants" element={<AdminAuthGuard><AdminMerchants /></AdminAuthGuard>} />
          <Route path="/admin/waitlist" element={<AdminAuthGuard><AdminWaitlist /></AdminAuthGuard>} />
          <Route path="/admin/email-logs" element={<AdminAuthGuard><AdminEmailLogs /></AdminAuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
