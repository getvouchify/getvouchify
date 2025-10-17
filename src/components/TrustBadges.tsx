import { Shield, Lock, CheckCircle, Award, Users, TrendingUp } from "lucide-react";
import visaLogo from "@/assets/visa-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import paypalLogo from "@/assets/paypal-logo.png";
import stripeLogo from "@/assets/stripe-logo.png";
const TrustBadges = () => {
  const stats = [{
    icon: Users,
    value: "500K+",
    label: "Active Users"
  }, {
    icon: TrendingUp,
    value: "10K+",
    label: "Daily Deals"
  }, {
    icon: Award,
    value: "5K+",
    label: "Verified Merchants"
  }, {
    icon: CheckCircle,
    value: "98%",
    label: "Satisfaction Rate"
  }];
  return <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            Your Trust & Security is Our Priority
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">
                  256-bit SSL encryption protects all transactions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Escrow Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Funds held securely until service confirmed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Verified Merchants</h4>
                <p className="text-sm text-muted-foreground">
                  All businesses thoroughly vetted and approved
                </p>
              </div>
            </div>
          </div>

          {/* Payment & Security Logos */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Trusted Payment Partners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <img src={visaLogo} alt="Visa" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <img src={mastercardLogo} alt="Mastercard" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <img src={paypalLogo} alt="PayPal" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
              <img src={stripeLogo} alt="Stripe" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        
      </div>
    </section>;
};
export default TrustBadges;