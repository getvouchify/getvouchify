import { Upload, Search, Ticket, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Business Uploads a Deal",
    description: "List exclusive offers with time slots and availability — we help you get discovered.",
  },
  {
    icon: Search,
    title: "Shoppers Discover & Book Deals",
    description: "500,000+ shoppers browse the app to find exclusive offers and book instantly — all from their phone.",
  },
  {
    icon: Ticket,
    title: "Voucher Generation",
    description: "Each booking comes with a unique voucher code for smooth and secure redemption.",
  },
  {
    icon: CheckCircle,
    title: "Fast, Verified Payouts",
    description: "Once the voucher is used and verified, payment is securely processed — no delays, no stress.",
  },
];

const HowItWorks = () => {
  const gradients = [
    "from-primary/5 via-white to-accent/5",
    "from-accent/5 via-white to-primary/5",
    "from-primary/10 via-accent/5 to-white",
    "from-accent/10 via-primary/5 to-white",
  ];

  const iconGradients = [
    "from-primary/20 to-accent/30",
    "from-accent/20 to-primary/30",
    "from-primary/25 to-accent/25",
    "from-accent/25 to-primary/25",
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            How It Works ✨
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and seamless deal discovery and redemption
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 300
              }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              {/* Enhanced Step Number */}
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={`absolute -top-5 -right-3 bg-gradient-to-br from-primary to-accent text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-glow z-20 rotate-6 group-hover:rotate-0 transition-transform duration-300`}
              >
                {index + 1}
              </motion.div>

              {/* Card with gradient background */}
              <div className={`bg-gradient-to-br ${gradients[index]} rounded-2xl p-6 md:p-8 shadow-lg group-hover:shadow-2xl border border-primary/10 group-hover:border-primary/30 transition-all duration-300 h-full`}>
                
                {/* Enhanced Icon */}
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="mb-6 flex justify-center"
                >
                  <div className={`bg-gradient-to-br ${iconGradients[index]} p-8 rounded-full shadow-md group-hover:shadow-glow transition-shadow duration-300`}>
                    <step.icon className="w-12 h-12 text-primary" />
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Enhanced Animated Arrow */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                  className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-primary/40 group-hover:text-primary transition-colors duration-300">
                    <defs>
                      <linearGradient id={`arrow-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <motion.path 
                      d="M6 16h20M20 10l6 6-6 6" 
                      stroke={`url(#arrow-gradient-${index})`}
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: index * 0.15 + 0.5 }}
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
