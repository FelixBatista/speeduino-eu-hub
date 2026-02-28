import { useState } from "react";
import { Link } from "react-router-dom";
import { products, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useAvailability } from "@/hooks/useAvailability";
import { motion } from "framer-motion";
import { Filter, ArrowRight, ShoppingCart, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import ecuProduct from "@/assets/ecu-product.jpg";

const categories = [
  { id: "all", label: "All Products" },
  { id: "ecu", label: "ECU Kits" },
  { id: "harness", label: "Harnesses" },
  { id: "sensors", label: "Sensors" },
  { id: "bundle", label: "Bundles" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currency, setCurrency] = useState<"EUR" | "SEK">("EUR");
  const { addItem } = useCart();
  const { availability } = useAvailability();

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  const price = (p: Product) => currency === "EUR" ? `€${p.priceEUR}` : `${p.priceSEK} SEK`;
  const stockQty = (productId: string) => typeof availability[productId] === "number" ? availability[productId] : -1;
  const outOfStock = (productId: string) => stockQty(productId) === 0;

  return (
    <main className="pt-24 pb-20">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Shop</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Shop</h1>
            <p className="text-muted-foreground mt-2">Speeduino ECU kits, harnesses, sensors, and bundles — shipped from the EU.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="data-label text-xs">Currency</span>
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
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground mt-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/product/${product.slug}`}
                className="card-motorsport p-5 flex flex-col h-full group block"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-secondary/50">
                  <img
                    src={ecuProduct}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                {product.badge && (
                  <span className="self-start text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded mb-2">
                    {product.badge}
                  </span>
                )}
                {outOfStock(product.id) && (
                  <span className="self-start text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Out of stock
                  </span>
                )}
                {stockQty(product.id) > 0 && stockQty(product.id) <= 3 && (
                  <span className="self-start text-xs text-muted-foreground mb-2">Only {stockQty(product.id)} left</span>
                )}
                <h2 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.shortName}
                </h2>
                <p className="text-sm text-muted-foreground mb-3 flex-1">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-lg text-foreground">{price(product)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (outOfStock(product.id)) {
                          toast.error("This item is out of stock.");
                          return;
                        }
                        addItem(product);
                        toast.success(`${product.shortName} added to cart`);
                      }}
                      disabled={outOfStock(product.id)}
                      className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <span className="text-primary text-sm flex items-center gap-1">
                      Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">All prices include VAT for EU customers. Shipping calculated at checkout.</p>
      </div>

      {/* JSON-LD for products */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: p.name,
                description: p.description,
                offers: {
                  "@type": "Offer",
                  price: p.priceEUR,
                  priceCurrency: "EUR",
                  availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                },
              },
            })),
          }),
        }}
      />
    </main>
  );
}
