import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link><span className="mx-2">/</span><span className="text-foreground">Privacy Policy</span>
        </nav>
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-secondary-foreground leading-relaxed">
          <p><strong className="text-foreground">Last updated:</strong> [Date]</p>
          <p>Speeduino.eu ("we", "us") operates this website. This policy explains how we collect, use, and protect your personal data in compliance with the EU General Data Protection Regulation (GDPR).</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Data We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Order information: name, email, shipping address, payment details (processed by Stripe).</li>
            <li>Website analytics: anonymized usage data via [analytics provider].</li>
            <li>Newsletter: email address (opt-in only).</li>
          </ul>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">How We Use Your Data</h2>
          <p>To fulfill orders, provide customer support, improve our website, and send marketing communications (with consent).</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Your Rights</h2>
          <p>You have the right to access, correct, delete, or port your data. Contact us at support@speeduino.eu.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Cookies</h2>
          <p>We use essential cookies for site functionality and optional analytics cookies (with consent). You can manage preferences via the cookie banner.</p>
          <h2 className="font-display text-xl font-bold text-foreground mt-8">Contact</h2>
          <p>Data controller: Speeduino.eu, [Address], Sweden. Email: support@speeduino.eu</p>
        </div>
      </div>
    </main>
  );
}
