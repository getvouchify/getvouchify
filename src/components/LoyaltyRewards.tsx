import { Gift, Award, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import WaitlistModal from "@/components/WaitlistModal";

const tiers = [
  {
    icon: Award,
    title: "Silver",
    description: "Exclusive silver tier benefits",
    color: "bg-gray-400",
    textColor: "text-gray-700",
    bgLight: "bg-gray-50",
  },
  {
    icon: Star,
    title: "Gold",
    description: "Exclusive gold tier benefits",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
  },
  {
    icon: Crown,
    title: "Platinum",
    description: "Exclusive platinum tier benefits",
    color: "bg-purple-500",
    textColor: "text-primary",
    bgLight: "bg-purple-50",
  },
];

const LoyaltyRewards = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Gift className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              Vouchify Rewards & Loyalty
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto">
              Keep coming back and earn exclusive rewards! Our built-in loyalty system turns every
              purchase into progress, helping you unlock better offers and special perks as you climb
              through our reward tiers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-elegant transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${tier.color} rounded-full p-6 mb-6`}>
                    <tier.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${tier.textColor}`}>
                    {tier.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              onClick={() => setModalOpen(true)}
              size="lg"
              className="gradient-primary text-white hover-lift shadow-glow px-12 py-6 text-lg font-bold"
            >
              Join Rewards Program
            </Button>
          </motion.div>
        </div>
      </section>

      <WaitlistModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type="customer"
      />
    </>
  );
};

export default LoyaltyRewards;
