import { useState, useEffect } from "react";
import { Lock, Loader2, LogOut, Package, ShoppingBag } from "lucide-react";

const ADMIN_TOKEN_KEY = "speeduino-admin-token";

type Order = { id: string; created_at: string; status: string; currency: string; amount_total: number; stripe_session_id: string; customer_email: string | null };
type InventoryRow = { product_id: string; qty: number; updated_at: string };

export default function Admin() {
  const [token, setTokenState] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored) setTokenState(stored);
  }, []);

  const setToken = (t: string) => {
    setTokenState(t);
    if (t) sessionStorage.setItem(ADMIN_TOKEN_KEY, t);
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ordersRes, invRes] = await Promise.all([
        fetch("/api/admin/orders", { headers }),
        fetch("/api/admin/inventory", { headers }),
      ]);
      if (ordersRes.status === 401 || invRes.status === 401) {
        setToken("");
        setTokenState("");
        setError("Invalid or expired token.");
        return;
      }
      if (!ordersRes.ok || !invRes.ok) {
        setError("Failed to load data.");
        return;
      }
      const ordersData = await ordersRes.json();
      const invData = await invRes.json();
      setOrders(ordersData.orders ?? []);
      setInventory(invData.inventory ?? []);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    else { setOrders([]); setInventory([]); }
  }, [token]);

  const handleSaveQty = async (productId: string) => {
    const qty = editingQty[productId];
    if (qty === undefined) return;
    setSavingId(productId);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id: productId, qty }),
      });
      if (res.ok) {
        setInventory((prev) => prev.map((r) => (r.product_id === productId ? { ...r, qty } : r)));
        setEditingQty((p) => ({ ...p, [productId]: undefined }));
      }
    } finally {
      setSavingId(null);
    }
  };

  if (!token) {
    return (
      <main className="pt-32 pb-20 container max-w-md mx-auto">
        <div className="card-motorsport p-8">
          <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold text-foreground mb-2 text-center">Admin</h1>
          <p className="text-muted-foreground text-sm mb-4 text-center">Enter the admin token to continue.</p>
          <input
            type="password"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setToken(inputToken)}
            placeholder="Token"
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground mb-4"
          />
          <button
            onClick={() => setToken(inputToken)}
            className="w-full cta-primary !py-2.5"
          >
            Continue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 container max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin</h1>
        <button
          onClick={() => { setToken(""); setInputToken(""); }}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <section className="card-motorsport p-6 mb-8">
            <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Recent orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">ID</th>
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-left py-2 font-medium">Status</th>
                      <th className="text-right py-2 font-medium">Total</th>
                      <th className="text-left py-2 font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-border/50">
                        <td className="py-2 font-mono text-xs">{o.id}</td>
                        <td className="py-2 text-muted-foreground">{o.created_at}</td>
                        <td className="py-2">{o.status}</td>
                        <td className="py-2 text-right font-mono">
                          {o.currency === "SEK" ? `${(o.amount_total / 100).toLocaleString("sv-SE")} SEK` : `€${(o.amount_total / 100).toFixed(2)}`}
                        </td>
                        <td className="py-2 text-muted-foreground truncate max-w-[160px]">{o.customer_email ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card-motorsport p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" /> Inventory
            </h2>
            {inventory.length === 0 ? (
              <p className="text-muted-foreground text-sm">No inventory rows. Run the seed script.</p>
            ) : (
              <ul className="space-y-2">
                {inventory.map((row) => (
                  <li key={row.product_id} className="flex items-center justify-between gap-4 py-2 border-b border-border/50">
                    <span className="font-mono text-sm">{row.product_id}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={editingQty[row.product_id] ?? row.qty}
                        onChange={(e) => setEditingQty((p) => ({ ...p, [row.product_id]: parseInt(e.target.value, 10) || 0 }))}
                        className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground text-sm text-right"
                      />
                      <button
                        onClick={() => handleSaveQty(row.product_id)}
                        disabled={savingId === row.product_id}
                        className="text-xs text-primary hover:underline disabled:opacity-50"
                      >
                        {savingId === row.product_id ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
