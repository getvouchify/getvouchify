import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
const QuickValueProp = () => {
  const benefits = ["Up to 70% off local experiences", "Verified merchants & instant vouchers", "Exclusive deals updated daily"];
  return <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div className="max-w-4xl mx-auto text-center space-y-8" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              What is Vouchify?
            </h2>
            <p className="text-xl md:text-2xl text-foreground leading-relaxed max-w-3xl mx-auto">Lagos' first ever local e-commerce discovery platform. For exclusive time-limited offers from various businesses across the city. </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12">
            {benefits.map((benefit, index) => <motion.div key={benefit} className="flex items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-card hover-lift" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-lg font-semibold text-foreground">{benefit}</span>
              </motion.div>)}
          </div>
        </motion.div>
      </div>
    </section>;
};
export default QuickValueProp;