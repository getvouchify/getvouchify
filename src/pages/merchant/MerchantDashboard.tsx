import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MerchantDashboard() {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your merchant portal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Deals</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Revenue</CardDescription>
              <CardTitle className="text-3xl">₦0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Payouts</CardDescription>
              <CardTitle className="text-3xl">₦0</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Your full merchant dashboard with deals management, orders, analytics, and more is being built.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Phase 5-12 implementation will add complete merchant functionality including:
              deal creation, order management, QR verification, messaging, and settlements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
