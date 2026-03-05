import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useStock } from "@/hooks/useAvailability";
import { motion } from "framer-motion";
import { ShoppingCart, Check, X, ArrowLeft, Truck, Shield, Headphones, AlertCircle, BookOpen, MessageCircle, Loader2, Layers } from "lucide-react";
import { SPEEDUINO_WIKI, SPEEDUINO_DISCORD } from "@/data/speeduinoLinks";
import { toast } from "sonner";
import ecuProduct from "@/assets/ecu-product.jpg";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const { qty: stockQty, outOfStock, loaded: stockLoaded } = useStock(product?.id);

  if (isLoading) {
    return (
      <main className="pt-32 pb-20 container flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.shortName}</span>
        </nav>

        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> All Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border">
              <img src={ecuProduct} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {product.badge && (
              <span className="inline-block text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded mb-3">
                {product.badge}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.longDescription}</p>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-3xl font-bold text-foreground">€{product.priceEUR}</span>
              <span className="font-mono text-lg text-muted-foreground">{product.priceSEK} SEK</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="card-motorsport p-3 text-center">
                <Truck className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Ships in {product.leadTimeDays} days</p>
              </div>
              <div className="card-motorsport p-3 text-center">
                <Shield className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">12-month warranty</p>
              </div>
              <div className="card-motorsport p-3 text-center">
                <Headphones className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">EU-based support</p>
              </div>
            </div>

            {stockLoaded && (
              <div className="mb-4">
                {outOfStock ? (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> Out of stock — check back later or contact us.
                  </p>
                ) : stockQty >= 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {stockQty === 1 ? "Only 1 left in stock." : `${stockQty} in stock.`}
                  </p>
                ) : null}
              </div>
            )}

            <button
              onClick={() => {
                if (outOfStock) {
                  toast.error("This item is currently out of stock.");
                  return;
                }
                addItem(product);
                toast.success(`${product.shortName} added to cart`);
              }}
              disabled={outOfStock}
              className="cta-primary w-full mb-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ShoppingCart className="w-5 h-5 mr-2 inline" /> Add to Cart — €{product.priceEUR}
            </button>

            <Link
              to="/find-my-kit"
              className="w-full mb-4 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/30 text-primary hover:bg-primary/10 transition-colors px-6 py-3 text-sm font-semibold"
            >
              <Layers className="w-4 h-4" /> Make a Bundle
              <span className="text-xs font-normal text-muted-foreground ml-1">— build a complete kit</span>
            </Link>

            <p className="text-xs text-muted-foreground text-center mb-4">Prices include VAT. Free shipping on orders over €250. Stock is reserved at checkout.</p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Official docs & community:</span>
              <a href={SPEEDUINO_WIKI} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <BookOpen className="w-4 h-4 flex-shrink-0" /> Wiki
              </a>
              <a href={SPEEDUINO_DISCORD} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <MessageCircle className="w-4 h-4 flex-shrink-0" /> Discord
              </a>
            </div>

            <div className="mb-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-3">What's Included</h2>
              <ul className="space-y-2">
                {product.included.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {product.notIncluded && product.notIncluded.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display text-sm font-bold text-muted-foreground mb-2">Not Included</h3>
                <ul className="space-y-1">
                  {product.notIncluded.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="w-3.5 h-3.5 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-3">Specifications</h2>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border/30 text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.longDescription,
            offers: {
              "@type": "Offer",
              price: product.priceEUR,
              priceCurrency: "EUR",
              availability: outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "Speeduino.eu" },
            },
          }),
        }}
      />
    </main>
  );
}
