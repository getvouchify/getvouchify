import { CloudUpload, Shield, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import merchantGraphic from "@/assets/merchant-vouchify-graphic.png";
import { motion } from "framer-motion";
import { useState } from "react";
import WaitlistModal from "@/components/WaitlistModal";

const benefits = [
  {
    icon: CloudUpload,
    title: "Upload Deals Instantly",
    description: "Simple dashboard to create and manage your offers in minutes",
  },
  {
    icon: Shield,
    title: "Secure Escrow Payments",
    description: "Protected transactions with guaranteed payment after service delivery",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance, redemption rates, and customer insights",
  },
  {
    icon: Megaphone,
    title: "Boost Your Visibility",
    description: "Reach 500,000+ active shoppers instantly with zero marketing costs",
  },
];

const MerchantBenefits = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 md:mb-6">
                Grow Your Business with Vouchify
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8">
                Reach 500,000+ shoppers instantly. Secure payments. Simple dashboard.
              </p>

              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg group-hover:bg-primary transition-colors">
                      <benefit.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={() => setModalOpen(true)}
                size="lg"
                className="gradient-primary text-white font-semibold text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-elegant hover-lift"
              >
                Sign Up as Merchant
              </Button>
            </motion.div>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="gradient-primary rounded-2xl p-8 shadow-elegant overflow-hidden">
                <img 
                  src={merchantGraphic} 
                  alt="Merchant dashboard analytics with growth charts and mobile app interface" 
                  className="w-full h-auto rounded-lg"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 gradient-gold rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full opacity-20 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <WaitlistModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type="merchant"
      />
    </>
  );
};

export default MerchantBenefits;
