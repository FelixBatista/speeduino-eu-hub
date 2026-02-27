import { useParams, Link } from "react-router-dom";
import { getProductBySlug } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { ShoppingCart, Check, X, ArrowLeft, Truck, Shield, Headphones } from "lucide-react";
import { toast } from "sonner";
import ecuProduct from "@/assets/ecu-product.jpg";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCart();

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
        {/* Breadcrumb */}
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
          {/* Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border">
              <img src={ecuProduct} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Info */}
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

            <button
              onClick={() => {
                addItem(product);
                toast.success(`${product.shortName} added to cart`);
              }}
              className="cta-primary w-full mb-4"
            >
              <ShoppingCart className="w-5 h-5 mr-2 inline" /> Add to Cart — €{product.priceEUR}
            </button>
            <p className="text-xs text-muted-foreground text-center mb-8">Prices include VAT. Free shipping on orders over €250.</p>

            {/* What's included */}
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

            {product.notIncluded && (
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

            {/* Specs */}
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

      {/* JSON-LD Product */}
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
              availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Speeduino.eu" },
            },
          }),
        }}
      />
    </main>
  );
}
