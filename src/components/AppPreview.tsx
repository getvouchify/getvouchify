import { motion } from "framer-motion";
import desktopMockup from "@/assets/vouchify-mockup-desktop.png";
import tabletMockup from "@/assets/vouchify-mockup-tablet.png";

const AppPreview = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-gold px-4 py-2 rounded-full text-sm font-semibold shadow-elegant inline-block mb-4">
            Coming Soon
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Experience Vouchify
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a sneak peek at how you'll discover and claim amazing deals across Lagos
          </p>
        </motion.div>

        {/* Mockup Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={desktopMockup}
              alt="Vouchify desktop platform preview showing deals and offers"
              className="w-full h-auto rounded-lg shadow-elegant hover-lift"
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <img
              src={tabletMockup}
              alt="Vouchify tablet platform preview showing deals and offers"
              className="w-full h-auto rounded-lg shadow-elegant hover-lift"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
