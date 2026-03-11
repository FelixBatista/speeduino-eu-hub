import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Truck } from "lucide-react";
import {
  SPEEDUINO_MAIN,
  SPEEDUINO_FORUM,
  SPEEDUINO_WIKI,
  SPEEDUINO_DISCORD,
  SPEEDUINO_SPEEDYLOADER,
  SPEEDUINO_TUNERSTUDIO,
} from "@/data/speeduinoLinks";
import logoIcon from "@/assets/logo-icon.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage((data as { error?: string })?.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
      setMessage("Thanks! Check your inbox for the starter guide.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <footer className="border-t border-border bg-card mt-16">
      {/* CTA Band */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container py-12 md:py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Take Control of Your Engine?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Browse boards, sensors, and modules — everything you need to build your own open-source ECU.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-my-kit" className="cta-primary">Find My Kit</Link>
            <Link to="/shop" className="cta-secondary">Shop Now</Link>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container py-10 border-b border-border">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Wiring Checklist + Base Map Tips</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Get our free starter guide — practical tips for your first ECU install.
          </p>
          <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                aria-label="Email for starter guide"
              />
              <button type="submit" disabled={status === "loading"} className="cta-primary !px-6 !py-3 !text-sm disabled:opacity-60">
                {status === "loading" ? "Sending…" : "Get the Guide"}
              </button>
            </div>
            {message && (
              <p className={`text-sm ${status === "success" ? "text-green-600 dark:text-green-400" : status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Boards</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Sensors</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Modules & Drivers</Link></li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/find-my-kit" className="hover:text-foreground transition-colors">Find My Kit</Link></li>
              <li><Link to="/compare" className="hover:text-foreground transition-colors">ECU Comparison</Link></li>
              <li><Link to="/guides" className="hover:text-foreground transition-colors">Guides & Blog</Link></li>
              <li><Link to="/get-started" className="hover:text-foreground transition-colors">Get Started</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">Speeduino project</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={SPEEDUINO_WIKI} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Documentation (Wiki)</a></li>
              <li>
                <a href={SPEEDUINO_TUNERSTUDIO} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">TunerStudio</a>
                <span className="block text-xs text-muted-foreground/80">Tuning software — required for all builds</span>
              </li>
              <li>
                <a href={SPEEDUINO_SPEEDYLOADER} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">SpeedyLoader</a>
                <span className="block text-xs text-muted-foreground/80">Firmware flasher — no compiling needed</span>
              </li>
              <li><a href={SPEEDUINO_FORUM} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Forum</a></li>
              <li><a href={SPEEDUINO_DISCORD} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a></li>
              <li>
                <a href={SPEEDUINO_MAIN} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Speeduino.com
                </a>
                <span className="block text-xs text-muted-foreground/80">Project home (no boards sold here)</span>
              </li>
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
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@wrenchoverwallet.com</li>
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
            <img src={logoIcon} alt="Wrench over Wallet" className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Wrench over Wallet — Speeduino-compatible engine management for Europe
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center md:text-right">
            Independent EU seller of Speeduino-compatible hardware — not affiliated with the Speeduino project. Product names mentioned are trademarks of their respective owners. All prices include VAT for EU customers.
          </p>
        </div>
      </div>
    </footer>
  );
}
