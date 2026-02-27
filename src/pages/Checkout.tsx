import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";

export default function Checkout() {
  const { items, totalEUR } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Nothing to checkout</h1>
        <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-2xl">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Order summary */}
        <div className="card-motorsport p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-secondary-foreground">
                  {item.product.shortName} × {item.quantity}
                </span>
                <span className="font-mono text-foreground">€{item.product.priceEUR * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-mono text-xl font-bold text-foreground">€{totalEUR}</span>
          </div>
        </div>

        {/* Stripe placeholder */}
        <div className="card-motorsport p-8 text-center">
          <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Secure Payment</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Stripe payment integration requires Lovable Cloud to securely process payments server-side.
            Enable Cloud to activate checkout with Stripe Elements, supporting cards, Klarna, iDEAL, and more.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="w-4 h-4" />
            <span>Visa, Mastercard, Klarna, iDEAL — powered by Stripe</span>
          </div>
        </div>
      </div>
    </main>
  );
}
