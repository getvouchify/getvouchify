import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Privacy = () => {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Information We Collect</h2>
                <p>
                  When you join our waitlist, we collect your email address, name, and other optional information
                  you provide such as location and interests. This helps us notify you when we launch and
                  personalize your experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notify you about Vouchify's launch and updates</li>
                  <li>Send you relevant deals based on your interests and location</li>
                  <li>Improve our platform and user experience</li>
                  <li>Communicate important service announcements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your personal information.
                  Your data is encrypted in transit and at rest, and we regularly review our security practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. Information Sharing</h2>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share
                  aggregated, anonymized data for analytics purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">5. Cookies</h2>
                <p>
                  We use cookies to enhance your browsing experience and analyze site traffic. You can
                  control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">7. Children's Privacy</h2>
                <p>
                  Vouchify is not intended for users under 18 years of age. We do not knowingly collect
                  information from children.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-primary mt-8 mb-4">8. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of significant
                  changes via email or through our platform.
                </p>
              </section>

              <section className="bg-muted p-6 rounded-xl mt-8">
                <h3 className="text-xl font-bold text-primary mb-3">Contact Us</h3>
                <p>
                  If you have questions about this Privacy Policy, please contact us at{" "}
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

export default Privacy;
