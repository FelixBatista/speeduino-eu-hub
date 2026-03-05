import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalEUR: number;
  totalSEK: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "speeduino-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (validated || items.length === 0) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) return;
        const data = await res.json();
        const activeIds = new Set((data.products as Product[]).map((p) => p.id));

        if (cancelled) return;

        setItems((prev) => {
          const valid = prev.filter((i) => activeIds.has(i.product.id));
          const removed = prev.length - valid.length;
          if (removed > 0) {
            toast.info(`${removed} item${removed > 1 ? "s" : ""} removed from cart (no longer available).`);
          }
          return valid;
        });
      } catch {
        /* network error: keep cart as-is */
      } finally {
        if (!cancelled) setValidated(true);
      }
    })();

    return () => { cancelled = true; };
  }, [validated, items.length]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalEUR = items.reduce((sum, i) => sum + i.product.priceEUR * i.quantity, 0);
  const totalSEK = items.reduce((sum, i) => sum + i.product.priceSEK * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalEUR, totalSEK }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
