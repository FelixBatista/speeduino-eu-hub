import { useState, useEffect } from "react";
import { Lock, Loader2, LogOut, Package, ShoppingBag, Truck, CheckCircle, Settings2, Plus, Trash2 } from "lucide-react";

const ADMIN_TOKEN_KEY = "speeduino-admin-token";

type Order = {
  id: string;
  created_at: string;
  status: string;
  currency: string;
  amount_total: number;
  stripe_session_id: string;
  customer_email: string | null;
  shipping_json?: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
};
type InventoryRow = { product_id: string; qty: number; updated_at: string };

type ShippingOptionRow = { id: string; label: string; amountEUR: number; amountSEK: number };

export default function Admin() {
  const [token, setTokenState] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOptionRow[]>([]);
  const [shippingCountries, setShippingCountries] = useState("");
  const [shippingConfigSaving, setShippingConfigSaving] = useState(false);
  const [shippingConfigError, setShippingConfigError] = useState<string | null>(null);

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
      const [ordersRes, invRes, shippingRes] = await Promise.all([
        fetch("/api/admin/orders", { headers }),
        fetch("/api/admin/inventory", { headers }),
        fetch("/api/admin/shipping-config", { headers }),
      ]);
      if (ordersRes.status === 401 || invRes.status === 401 || shippingRes.status === 401) {
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
      if (shippingRes.ok) {
        const shippingData = await shippingRes.json();
        setShippingOptions(shippingData.shipping_options ?? []);
        setShippingCountries(Array.isArray(shippingData.shipping_allowed_countries) ? shippingData.shipping_allowed_countries.join(", ") : "");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    else { setOrders([]); setInventory([]); setShippingOptions([]); setShippingCountries(""); }
  }, [token]);

  const handleSaveShippingConfig = async () => {
    setShippingConfigError(null);
    setShippingConfigSaving(true);
    try {
      const countries = shippingCountries
        .split(/[\s,]+/)
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length === 2);
      const res = await fetch("/api/admin/shipping-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          shipping_options: shippingOptions.filter((o) => o.id.trim() && o.label.trim()),
          shipping_allowed_countries: countries,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setShippingConfigError(data?.error ?? "Failed to save.");
        return;
      }
    } catch {
      setShippingConfigError("Network error.");
    } finally {
      setShippingConfigSaving(false);
    }
  };

  const addShippingOption = () => {
    setShippingOptions((prev) => [...prev, { id: "", label: "", amountEUR: 0, amountSEK: 0 }]);
  };
  const removeShippingOption = (index: number) => {
    setShippingOptions((prev) => prev.filter((_, i) => i !== index));
  };
  const updateShippingOption = (index: number, field: keyof ShippingOptionRow, value: string | number) => {
    setShippingOptions((prev) =>
      prev.map((o, i) => (i !== index ? o : { ...o, [field]: value }))
    );
  };

  const handleMarkShipped = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "SHIPPED",
          tracking_number: trackingNumber.trim() || undefined,
          tracking_carrier: trackingCarrier.trim() || undefined,
        }),
      });
      if (res.ok) {
        setShippingOrderId(null);
        setTrackingNumber("");
        setTrackingCarrier("");
        fetchData();
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    if (!confirm("Mark this order as delivered? The customer will receive an email.")) return;
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "DELIVERED" }),
      });
      if (res.ok) fetchData();
    } finally {
      setUpdatingOrderId(null);
    }
  };

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

  const submitToken = () => {
    const trimmed = inputToken.trim();
    setError(null);
    setToken(trimmed);
  };

  if (!token) {
    return (
      <main className="pt-32 pb-20 container max-w-md mx-auto">
        <div className="card-motorsport p-8">
          <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold text-foreground mb-2 text-center">Admin</h1>
          <p className="text-muted-foreground text-sm mb-4 text-center">Enter the admin token to continue.</p>
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          <input
            type="password"
            value={inputToken}
            onChange={(e) => { setInputToken(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && submitToken()}
            placeholder="Token"
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground mb-4"
          />
          <button
            onClick={submitToken}
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
                      <th className="text-left py-2 font-medium">Ship to</th>
                      <th className="text-left py-2 font-medium">Tracking</th>
                      <th className="text-right py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-border/50 align-top">
                        <td className="py-2 font-mono text-xs">{o.id}</td>
                        <td className="py-2 text-muted-foreground">{o.created_at}</td>
                        <td className="py-2">
                          <span className="font-medium">{o.status}</span>
                          {o.shipped_at && (
                            <span className="block text-xs text-muted-foreground">Shipped {o.shipped_at}</span>
                          )}
                          {o.delivered_at && (
                            <span className="block text-xs text-muted-foreground">Delivered {o.delivered_at}</span>
                          )}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {o.currency === "SEK" ? `${(o.amount_total / 100).toLocaleString("sv-SE")} SEK` : `€${(o.amount_total / 100).toFixed(2)}`}
                        </td>
                        <td className="py-2 text-muted-foreground truncate max-w-[160px]">{o.customer_email ?? "—"}</td>
                        <td className="py-2 text-muted-foreground max-w-[200px]">
                          {o.shipping_json ? (() => {
                            try {
                              const s = JSON.parse(o.shipping_json);
                              const name = [s.name?.trim()].filter(Boolean).join(" ") || "—";
                              const addr = s.address;
                              const line = addr ? [addr.line1, addr.line2, addr.city, addr.postal_code, addr.country].filter(Boolean).join(", ") : "";
                              return (
                                <span title={line || undefined} className="block truncate text-xs">
                                  {name}
                                  {line ? ` · ${line}` : ""}
                                </span>
                              );
                            } catch {
                              return "—";
                            }
                          })() : "—"}
                        </td>
                        <td className="py-2 text-muted-foreground text-xs max-w-[140px]">
                          {o.tracking_number ? (
                            <span title={o.tracking_carrier ?? undefined}>
                              {o.tracking_carrier && `${o.tracking_carrier}: `}{o.tracking_number}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2 text-right">
                          {shippingOrderId === o.id ? (
                            <div className="flex flex-col gap-1 items-end">
                              <input
                                type="text"
                                placeholder="Tracking number"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="w-32 px-2 py-1 rounded border border-border bg-background text-foreground text-xs"
                              />
                              <input
                                type="text"
                                placeholder="Carrier (e.g. Postnord)"
                                value={trackingCarrier}
                                onChange={(e) => setTrackingCarrier(e.target.value)}
                                className="w-32 px-2 py-1 rounded border border-border bg-background text-foreground text-xs"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleMarkShipped(o.id)}
                                  disabled={updatingOrderId === o.id}
                                  className="text-xs text-primary hover:underline disabled:opacity-50"
                                >
                                  {updatingOrderId === o.id ? "Saving…" : "Confirm shipped"}
                                </button>
                                <button
                                  onClick={() => { setShippingOrderId(null); setTrackingNumber(""); setTrackingCarrier(""); }}
                                  className="text-xs text-muted-foreground hover:underline"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1 justify-end">
                              {o.status !== "SHIPPED" && o.status !== "DELIVERED" && (
                                <button
                                  onClick={() => setShippingOrderId(o.id)}
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                  title="Mark as shipped and send customer an email"
                                >
                                  <Truck className="w-3.5 h-3.5" /> Shipped
                                </button>
                              )}
                              {(o.status === "SHIPPED" || o.status === "PAID") && o.status !== "DELIVERED" && (
                                <button
                                  onClick={() => handleMarkDelivered(o.id)}
                                  disabled={updatingOrderId === o.id}
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
                                  title="Mark as delivered and send customer an email"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Delivered
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card-motorsport p-6 mb-8">
            <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5" /> Shipping settings
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Shipping options shown at checkout. Prices: EUR in cents (e.g. 500 = €5.00), SEK in öre (e.g. 4900 = 49 SEK). Allowed countries: 2-letter codes, comma-separated.
            </p>
            {shippingConfigError && (
              <div className="p-3 mb-4 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {shippingConfigError}
              </div>
            )}
            <div className="space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Shipping options</span>
                <button type="button" onClick={addShippingOption} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add option
                </button>
              </div>
              {shippingOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No options. Add one so customers can choose shipping at checkout.</p>
              ) : (
                <ul className="space-y-3">
                  {shippingOptions.map((opt, index) => (
                    <li key={index} className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border bg-background/50">
                      <input
                        type="text"
                        placeholder="ID (e.g. standard)"
                        value={opt.id}
                        onChange={(e) => updateShippingOption(index, "id", e.target.value)}
                        className="w-24 px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={opt.label}
                        onChange={(e) => updateShippingOption(index, "label", e.target.value)}
                        className="flex-1 min-w-[140px] px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        step={1}
                        placeholder="EUR cents"
                        value={opt.amountEUR || ""}
                        onChange={(e) => updateShippingOption(index, "amountEUR", parseInt(e.target.value, 10) || 0)}
                        className="w-24 px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm text-right"
                      />
                      <input
                        type="number"
                        min={0}
                        step={1}
                        placeholder="SEK öre"
                        value={opt.amountSEK || ""}
                        onChange={(e) => updateShippingOption(index, "amountSEK", parseInt(e.target.value, 10) || 0)}
                        className="w-24 px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm text-right"
                      />
                      <button type="button" onClick={() => removeShippingOption(index)} className="p-1.5 text-muted-foreground hover:text-destructive" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Allowed countries (2-letter codes, comma-separated)</label>
              <input
                type="text"
                placeholder="AT, BE, DE, SE, GB, ..."
                value={shippingCountries}
                onChange={(e) => setShippingCountries(e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveShippingConfig}
              disabled={shippingConfigSaving || shippingOptions.length === 0}
              className="cta-primary !py-2 !text-sm disabled:opacity-50"
            >
              {shippingConfigSaving ? "Saving…" : "Save shipping settings"}
            </button>
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
