import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Lock, CreditCard, Loader2, AlertCircle } from "lucide-react";

type CheckoutError = "invalid" | "out_of_stock" | "server" | null;

export default function Checkout() {
  const { items, totalEUR, totalSEK } = useCart();
  const [currency, setCurrency] = useState<"EUR" | "SEK">("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutError>(null);

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Nothing to checkout</h1>
        <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
      </main>
    );
  }

  const total = currency === "EUR" ? `€${totalEUR}` : `${totalSEK} SEK`;

  const handlePayNow = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          currency,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) setError("out_of_stock");
        else if (res.status === 400) setError("invalid");
        else setError("server");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError("server");
    } catch {
      setError("server");
    } finally {
      setLoading(false);
    }
  };

  const errorMessage =
    error === "out_of_stock"
      ? "One or more items are out of stock or quantity is too high. Please reduce quantity or remove items and try again."
      : error === "invalid"
        ? "Your cart is invalid. Please refresh and try again."
        : error === "server"
          ? "Something went wrong. Please try again later."
          : null;

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-2xl">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Currency</span>
          <div className="flex rounded-lg overflow-hidden border border-border">
            {(["EUR", "SEK"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                disabled={loading}
                className={`px-3 py-1.5 text-xs font-mono font-semibold transition-colors ${
                  currency === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

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

        {errorMessage && (
          <div className="flex items-start gap-2 p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="card-motorsport p-8 text-center">
          <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Secure Payment via Stripe</h2>
          <p className="text-muted-foreground text-sm mb-6">
            You'll be redirected to Stripe's secure checkout. Stripe supports cards, Klarna, iDEAL, and more.
          </p>
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="cta-primary !px-10 !py-3.5 !text-base inline-flex items-center justify-center gap-2 min-w-[180px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {loading ? "Redirecting…" : `Pay ${total}`}
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
            <Lock className="w-3 h-3" />
            <span>256-bit SSL encryption — powered by Stripe</span>
          </div>
        </div>
      </div>
    </main>
  );
}
