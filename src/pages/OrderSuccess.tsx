import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import GetStartedSection from "@/components/GetStartedSection";

type OrderData = {
  order: { id: string; created_at: string; status: string; currency: string; amount_total: number; customer_email: string | null };
  items: { product_id: string; name: string; qty: number; unit_amount: number; line_amount: number }[];
};

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError(true);
      return;
    }
    fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load order");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your order…</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="pt-32 pb-20 container text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Order not found</h1>
        <p className="text-muted-foreground text-sm mb-6">
          We couldn't find this order. If you just paid, wait a moment and refresh. Otherwise return to the shop.
        </p>
        <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
      </main>
    );
  }

  const { order, items } = data;
  const totalFormatted = `€${(order.amount_total / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-2xl">
        <div className="card-motorsport p-8 text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Thank you for your order</h1>
          <p className="text-muted-foreground">
            Order <span className="font-mono text-foreground">{order.id}</span> — {totalFormatted}
          </p>
        </div>

        <div className="card-motorsport p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">What you purchased</h2>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.product_id} className="flex justify-between text-sm">
                <span className="text-secondary-foreground">
                  {item.name} × {item.qty}
                </span>
                <span className="font-mono">
                  {`€${(item.line_amount / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="prose prose-sm text-muted-foreground max-w-none">
          <h2 className="font-display text-lg font-bold text-foreground">Next steps</h2>
          <p>We'll send a confirmation to your email if you entered one at checkout. You'll receive shipping details once your order is dispatched.</p>
        </div>
      </div>

      <div className="container max-w-3xl mt-12">
        <GetStartedSection showHeader />
      </div>
    </main>
  );
}
