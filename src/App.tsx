import * as React from "react";
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
import AdminMerchantAccounts from "./pages/admin/AdminMerchantAccounts";
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";
import { AdminLayout } from "./components/admin/AdminLayout";
import MerchantLogin from "./pages/merchant/MerchantLogin";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import MerchantDeals from "./pages/merchant/MerchantDeals";
import CreateDeal from "./pages/merchant/CreateDeal";
import EditDeal from "./pages/merchant/EditDeal";
import ApplicationSubmitted from "./pages/merchant/ApplicationSubmitted";
import { MerchantAuthGuard } from "./components/merchant/MerchantAuthGuard";
import { MerchantLayout } from "./components/merchant/MerchantLayout";

const queryClient = new QueryClient();

function App() {
  return (
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
          
          {/* Merchant Routes */}
          <Route path="/merchant/login" element={<MerchantLogin />} />
          <Route 
            path="/merchant/dashboard" 
            element={
              <MerchantAuthGuard>
                <MerchantLayout>
                  <MerchantDashboard />
                </MerchantLayout>
              </MerchantAuthGuard>
            } 
          />
          <Route 
            path="/merchant/deals" 
            element={
              <MerchantAuthGuard>
                <MerchantLayout>
                  <MerchantDeals />
                </MerchantLayout>
              </MerchantAuthGuard>
            } 
          />
          <Route 
            path="/merchant/deals/new" 
            element={
              <MerchantAuthGuard>
                <MerchantLayout>
                  <CreateDeal />
                </MerchantLayout>
              </MerchantAuthGuard>
            } 
          />
          <Route 
            path="/merchant/deals/:id/edit" 
            element={
              <MerchantAuthGuard>
                <MerchantLayout>
                  <EditDeal />
                </MerchantLayout>
              </MerchantAuthGuard>
            } 
          />
          <Route 
            path="/merchant/application-submitted" 
            element={
              <MerchantAuthGuard>
                <ApplicationSubmitted />
              </MerchantAuthGuard>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          <Route 
            path="/admin/offers" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminDeals />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          <Route 
            path="/admin/merchants" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminMerchants />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          <Route 
            path="/admin/waitlist" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminWaitlist />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          <Route 
            path="/admin/email-logs" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminEmailLogs />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          <Route 
            path="/admin/merchants/create-accounts" 
            element={
              <AdminAuthGuard>
                <AdminLayout>
                  <AdminMerchantAccounts />
                </AdminLayout>
              </AdminAuthGuard>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
}

export default App;
