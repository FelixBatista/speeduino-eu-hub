import { Link } from "react-router-dom";
import { Zap, Mail, MapPin, Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* CTA Band */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Take Control of Your Engine?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Find the right Speeduino kit for your build, or explore our shop for individual components.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compatibility" className="cta-primary">Find My Kit</Link>
            <Link to="/shop" className="cta-secondary">Shop Now</Link>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container py-10 border-b border-border">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Wiring Checklist + Base Map Tips</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Get our free starter guide — practical tips for your first Speeduino install.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button type="submit" className="cta-primary !px-6 !py-3 !text-sm">Get the Guide</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">ECU Kits</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Harnesses</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Sensors</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Bundles</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/compatibility" className="hover:text-foreground transition-colors">Compatibility</Link></li>
              <li><Link to="/compare" className="hover:text-foreground transition-colors">ECU Comparison</Link></li>
              <li><Link to="/guides" className="hover:text-foreground transition-colors">Guides & Blog</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/returns" className="hover:text-foreground transition-colors">Returns & Warranty</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@speeduino.eu</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> EU-based (Sweden)</li>
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Ships within EU</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Speeduino.eu — Open-source engine management for Europe
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center md:text-right">
            Speeduino is an open-source project. Product names mentioned are trademarks of their respective owners. All prices include VAT for EU customers.
          </p>
        </div>
      </div>
    </footer>
  );
}
