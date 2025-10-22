import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About Vouchify
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-xl leading-relaxed">
                Vouchify is revolutionizing how people discover and redeem exclusive offers across Nigeria.
                We're building a platform that connects shoppers with amazing offers from local businesses.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Our Mission</h2>
              <p>
                To make quality experiences more accessible while helping local businesses thrive.
                We believe everyone deserves access to great offers, and every business deserves to reach
                customers who will love what they offer.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Why Vouchify?</h2>
              <p>
                Traditional offer platforms charge high commissions and complicate the process. We're different.
                Our secure escrow system ensures businesses get paid after service delivery, our simple
                dashboard makes offer management effortless, and our growing community of 500,000+ shoppers
                means instant visibility.
              </p>

              <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Our Vision</h2>
              <p>
                We envision a future where discovering amazing local experiences is as easy as opening an app,
                and where businesses of all sizes can compete on equal footing to reach their ideal customers.
              </p>

              <div className="bg-muted p-8 rounded-xl mt-12">
                <h3 className="text-xl font-bold text-primary mb-4">Join Our Journey</h3>
                <p className="mb-4">
                  We're currently in waitlist mode, building the platform with feedback from early users
                  and merchants. Be part of shaping the future of local offers.
                </p>
                <a
                  href="/"
                  className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Join the Waitlist
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
