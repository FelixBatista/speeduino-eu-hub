import { useState, useEffect } from "react";

/** Fetches /api/availability once. Returns productId -> qty. If fetch fails (e.g. no backend), returns {}. */
export function useAvailability(): { availability: Record<string, number>; loaded: boolean } {
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          if (data?.availability) setAvailability(data.availability);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  return { availability, loaded };
}

/** For a single product: qty from server, or -1 if unknown/not loaded. outOfStock = true when qty === 0. */
export function useStock(productId: string | undefined): { qty: number; outOfStock: boolean; loaded: boolean } {
  const { availability, loaded } = useAvailability();
  if (!productId) return { qty: 0, outOfStock: false, loaded: true };
  const qty = typeof availability[productId] === "number" ? availability[productId] : -1;
  return { qty, outOfStock: qty === 0, loaded };
}
