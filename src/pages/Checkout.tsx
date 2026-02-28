import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Lock, CreditCard, ExternalLink, AlertTriangle } from "lucide-react";

export default function Checkout() {
  const { items, totalEUR, totalSEK, clearCart } = useCart();
  const [currency, setCurrency] = useState<"EUR" | "SEK">("EUR");

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Nothing to checkout</h1>
        <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
      </main>
    );
  }

  const total = currency === "EUR" ? `€${totalEUR}` : `${totalSEK} SEK`;

  // Check which items have Stripe Payment Links configured
  const itemsWithLinks = items.filter((i) => i.product.stripePaymentLink);
  const itemsWithoutLinks = items.filter((i) => !i.product.stripePaymentLink);
  const allHaveLinks = itemsWithoutLinks.length === 0;

  const handlePayNow = (paymentLink: string) => {
    // Stripe Payment Links open in a new tab — customer completes payment on Stripe's hosted page
    window.open(paymentLink, "_blank", "noopener");
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-2xl">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Currency toggle */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Currency</span>
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(["EUR", "SEK"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold transition-colors ${
                  currency === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="card-motorsport p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const price = currency === "EUR"
                ? `€${item.product.priceEUR * item.quantity}`
                : `${item.product.priceSEK * item.quantity} SEK`;
              return (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-secondary-foreground">
                    {item.product.shortName} × {item.quantity}
                  </span>
                  <span className="font-mono text-foreground">{price}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-mono text-xl font-bold text-foreground">{total}</span>
          </div>
        </div>

        {/* Payment section */}
        {allHaveLinks && items.length === 1 ? (
          /* Single item with payment link — direct checkout */
          <div className="card-motorsport p-8 text-center">
            <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Secure Payment via Stripe</h2>
            <p className="text-muted-foreground text-sm mb-6">
              You'll be redirected to Stripe's secure checkout page to complete your payment.
              Stripe supports cards, Klarna, iDEAL, and more.
            </p>
            <button
              onClick={() => handlePayNow(items[0].product.stripePaymentLink!)}
              className="cta-primary !px-10 !py-3.5 !text-base inline-flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" /> Pay {total}
              <ExternalLink className="w-4 h-4 opacity-60" />
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
              <Lock className="w-3 h-3" />
              <span>256-bit SSL encryption — powered by Stripe</span>
            </div>
          </div>
        ) : allHaveLinks && items.length > 1 ? (
          /* Multiple items — pay each via its own link */
          <div className="space-y-4">
            <div className="card-motorsport p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">Multiple Items</h2>
                  <p className="text-muted-foreground text-sm">
                    Each product has its own secure Stripe checkout. Complete each payment separately.
                    For a single-checkout experience, contact us for a combined invoice.
                  </p>
                </div>
              </div>
            </div>
            {items.map((item) => {
              const price = currency === "EUR"
                ? `€${item.product.priceEUR * item.quantity}`
                : `${item.product.priceSEK * item.quantity} SEK`;
              return (
                <div key={item.product.id} className="card-motorsport p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-foreground truncate">{item.product.shortName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} — {price}</p>
                  </div>
                  <button
                    onClick={() => handlePayNow(item.product.stripePaymentLink!)}
                    className="cta-primary !px-5 !py-2.5 !text-sm inline-flex items-center gap-2 flex-shrink-0"
                  >
                    Pay <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* No payment links configured — setup guide */
          <div className="card-motorsport p-8">
            <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2 text-center">Payment Setup Required</h2>
            <p className="text-muted-foreground text-sm mb-6 text-center">
              Add Stripe Payment Links to enable checkout. No backend required — Stripe hosts the entire payment page.
            </p>
            <div className="bg-secondary/50 rounded-lg p-5 text-sm space-y-3">
              <h3 className="font-display font-bold text-foreground">Setup in 3 steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-secondary-foreground">
                <li>Go to <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe Dashboard → Payment Links</a></li>
                <li>Create a payment link for each product (set price, enable Klarna/iDEAL)</li>
                <li>Paste the link URL into each product's <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">stripePaymentLink</code> field in <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">src/data/products.ts</code></li>
              </ol>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
              <CreditCard className="w-4 h-4" />
              <span>Visa, Mastercard, Klarna, iDEAL — powered by Stripe</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
