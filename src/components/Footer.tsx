import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import logo from "@/assets/vouchify-logo-no-background.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-secondary/30 border-t border-border" style={{
    boxShadow: '0 -10px 40px -10px hsl(274 59% 50% / 0.2)'
  }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <img src={logo} alt="Vouchify - Daily Deals Platform" className="h-12 md:h-16 w-auto" />
            <p className="text-xs md:text-sm text-muted-foreground max-w-xs">
              Discover and redeem amazing deals across food, beauty, fitness, and more. Join the waitlist today!
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit our Facebook page">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit our Twitter page">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/get.vouchify" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit our Instagram page">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit our LinkedIn page">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-primary font-semibold hover:text-primary/80 transition-colors text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:hello@getvouchify.com" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hello@getvouchify.com
                </a>
              </li>
              <li>
                <a href="tel:+2348093337317" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +234 809 333 7317
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Vouchify. All rights reserved.</p>
          
        </div>
      </div>
    </footer>;
};
export default Footer;