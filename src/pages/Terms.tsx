import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Terms = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Vouchify, you agree to be bound by these Terms of Service.
                  If you disagree with any part of the terms, you may not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Waitlist Participation</h2>
                <p>
                  By joining our waitlist, you acknowledge that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Waitlist registration does not guarantee early access or specific launch timing</li>
                  <li>You will receive communications about Vouchify's launch and updates</li>
                  <li>Information provided during registration must be accurate and current</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. For Shoppers</h2>
                <p>As a shopper on Vouchify, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information when booking deals</li>
                  <li>Honor booked appointments and reservations</li>
                  <li>Use vouchers only as intended and within validity periods</li>
                  <li>Respect merchant policies and terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. For Merchants</h2>
                <p>Merchants using Vouchify agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate deal descriptions and terms</li>
                  <li>Honor all valid vouchers presented by customers</li>
                  <li>Maintain quality standards for advertised services</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">5. Payment and Refunds</h2>
                <p>
                  All transactions are processed through our secure escrow system. Payments are released
                  to merchants after service delivery confirmation. Refund policies will be detailed
                  at platform launch.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">6. Prohibited Activities</h2>
                <p>You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the platform for fraudulent purposes</li>
                  <li>Share or transfer vouchers unless explicitly permitted</li>
                  <li>Attempt to manipulate or abuse the system</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">7. Intellectual Property</h2>
                <p>
                  All content on Vouchify, including text, graphics, logos, and software, is the property
                  of Vouchify and protected by copyright and trademark laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">8. Limitation of Liability</h2>
                <p>
                  Vouchify serves as a platform connecting shoppers and merchants. We are not responsible
                  for the quality of services provided by merchants or disputes between parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">9. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend access to our service for violations of
                  these terms, without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">10. Changes to Terms</h2>
                <p>
                  We may modify these terms at any time. Continued use of the platform after changes
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="bg-muted p-6 rounded-xl mt-8">
                <h3 className="text-xl font-bold text-primary mb-3">Questions?</h3>
                <p>
                  For questions about these Terms of Service, contact us at{" "}
                  <a href="mailto:hello@getvouchify.com" className="text-primary hover:underline">
                    hello@getvouchify.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
