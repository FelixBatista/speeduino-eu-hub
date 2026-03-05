import { Link } from "react-router-dom";
import { Mail, MessageCircle, BookOpen, Youtube, Headphones } from "lucide-react";
import { SPEEDUINO_FORUM, SPEEDUINO_DISCORD, SPEEDUINO_WIKI } from "@/data/speeduinoLinks";

const channels = [
  { icon: Mail, title: "Email Support", desc: "EU-based support for products purchased from our shop. Typical response time: 1–2 business days.", action: "support@speeduino.eu", href: "mailto:support@speeduino.eu" },
  { icon: Headphones, title: "Remote Tuning Review", desc: "Book a session for base map review, wiring check, or troubleshooting help. Available by appointment.", action: "Coming soon" },
  { icon: MessageCircle, title: "Forum", desc: "The Speeduino forum is searchable and archival — great for build logs and detailed threads.", action: "Speeduino forum", href: SPEEDUINO_FORUM },
  { icon: MessageCircle, title: "Discord community", desc: "Fastest for real-time help: \"Is this normal?\" debugging and quick questions.", action: "Join Discord", href: SPEEDUINO_DISCORD },
  { icon: BookOpen, title: "Wiki & Documentation", desc: "Comprehensive wiki with wiring diagrams, firmware guides, and configuration references.", action: "Official wiki", href: SPEEDUINO_WIKI },
  { icon: Youtube, title: "YouTube Guides", desc: "Video tutorials from the community covering builds, wiring, and tuning walkthroughs.", action: "Search 'Speeduino' on YouTube" },
];

export default function Support() {
  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Support</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Support</h1>
        <p className="text-muted-foreground mb-12">We're here to help. Whether you need technical support, tuning assistance, or just want to connect with the community.</p>

        <div className="space-y-4">
          {channels.map((ch, i) => (
            <div key={i} className="card-motorsport p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ch.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground mb-1">{ch.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">{ch.desc}</p>
                {"href" in ch && ch.href ? (
                  <a href={ch.href} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-primary hover:underline">
                    {ch.action}
                  </a>
                ) : (
                  <p className="font-mono text-sm text-primary">{ch.action}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
