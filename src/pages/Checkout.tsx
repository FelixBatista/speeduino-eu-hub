import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Lock, CreditCard, Loader2, AlertCircle, Truck } from "lucide-react";

type CheckoutError = "invalid" | "out_of_stock" | "server" | null;

type ShippingOption = { id: string; label: string; amountEUR: number; amountSEK: number };

export default function Checkout() {
  const { items, totalEUR, totalSEK } = useCart();
  const [currency, setCurrency] = useState<"EUR" | "SEK">("EUR");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutError>(null);

  useEffect(() => {
    fetch("/api/shipping-options")
      .then((r) => r.json())
      .then((data) => {
        const opts = data?.options ?? [];
        setShippingOptions(opts);
        if (opts.length > 0 && !selectedShippingId) setSelectedShippingId(opts[0].id);
      })
      .catch(() => {});
  }, []);

  const selectedShipping = shippingOptions.find((o) => o.id === selectedShippingId);
  const shippingEUR = selectedShipping ? selectedShipping.amountEUR / 100 : 0;
  const shippingSEK = selectedShipping ? selectedShipping.amountSEK / 100 : 0;
  const totalWithShippingEUR = totalEUR + shippingEUR;
  const totalWithShippingSEK = totalSEK + shippingSEK;
  const totalDisplay =
    currency === "EUR"
      ? `€${totalWithShippingEUR.toFixed(2)}`
      : `${totalWithShippingSEK.toFixed(0)} SEK`;

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Nothing to checkout</h1>
        <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
      </main>
    );
  }

  const handlePayNow = async () => {
    if (!selectedShippingId) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          currency,
          shippingOptionId: selectedShippingId,
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
        ? "Please select a shipping option and try again."
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

        <div className="card-motorsport p-6 mb-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Shipping</h2>
          <p className="text-muted-foreground text-sm mb-3">Choose delivery speed. Your name, email, and address will be collected on the next page (Stripe checkout).</p>
          {shippingOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading options…</p>
          ) : (
            <div className="space-y-2">
              {shippingOptions.map((opt) => {
                const price =
                  currency === "EUR" ? `€${(opt.amountEUR / 100).toFixed(2)}` : `${(opt.amountSEK / 100).toFixed(0)} SEK`;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedShippingId === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={selectedShippingId === opt.id}
                      onChange={() => setSelectedShippingId(opt.id)}
                      className="sr-only"
                    />
                    <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-sm text-foreground">{opt.label}</span>
                    <span className="font-mono text-sm font-medium text-foreground">{price}</span>
                  </label>
                );
              })}
            </div>
          )}
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
            {selectedShipping && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping ({selectedShipping.label})</span>
                <span className="font-mono text-foreground">
                  {currency === "EUR" ? `€${shippingEUR.toFixed(2)}` : `${shippingSEK} SEK`}
                </span>
              </div>
            )}
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-mono text-xl font-bold text-foreground">{totalDisplay}</span>
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
            disabled={loading || !selectedShippingId || shippingOptions.length === 0}
            className="cta-primary !px-10 !py-3.5 !text-base inline-flex items-center justify-center gap-2 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {loading ? "Redirecting…" : `Pay ${totalDisplay}`}
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
