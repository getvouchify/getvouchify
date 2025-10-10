import { Upload, Search, Ticket, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Merchant Uploads Deal",
    description: "Merchants list exclusive deals with details and booking slots",
  },
  {
    icon: Search,
    title: "Shoppers Browse & Book",
    description: "500,000+ shoppers discover and book amazing offers",
  },
  {
    icon: Ticket,
    title: "Voucher Generation",
    description: "Unique voucher codes generated for easy redemption",
  },
  {
    icon: CheckCircle,
    title: "Redemption & Payment",
    description: "Secure payment after confirmation and voucher verification",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and seamless deal discovery and redemption
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Step Number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 md:-left-4 md:translate-x-0 bg-accent text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-card hover-lift">
                <div className="mb-4 flex justify-center">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Arrow (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
