import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/data/products";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data.products as Product[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product | null>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return (data.product as Product) ?? null;
    },
    enabled: !!slug,
  });
}
