import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useStock } from "@/hooks/useAvailability";
import { motion } from "framer-motion";
import { ShoppingCart, Check, X, ArrowLeft, Truck, Shield, Headphones, AlertCircle, BookOpen, MessageCircle, Layers, Bell } from "lucide-react";
import { SPEEDUINO_WIKI, SPEEDUINO_DISCORD } from "@/data/speeduinoLinks";
import { toast } from "sonner";
import ecuProduct from "@/assets/ecu-product.jpg";
import WaitlistDialog from "@/components/WaitlistDialog";
import SEOHead from "@/components/SEOHead";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const { qty: stockQty, outOfStock, loaded: stockLoaded } = useStock(product?.id);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="pt-24 pb-20">
        <div className="container animate-pulse">
          <div className="h-4 w-48 rounded bg-secondary mb-8" />
          <div className="h-4 w-28 rounded bg-secondary mb-6" />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="aspect-square rounded-xl bg-secondary/70" />
            <div className="flex flex-col gap-4">
              <div className="h-5 w-20 rounded bg-secondary" />
              <div className="h-9 w-3/4 rounded bg-secondary" />
              <div className="h-4 w-full rounded bg-secondary/60" />
              <div className="h-4 w-5/6 rounded bg-secondary/60" />
              <div className="h-4 w-2/3 rounded bg-secondary/60 mb-2" />
              <div className="h-10 w-40 rounded bg-secondary" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 rounded-lg bg-secondary/70" />
                <div className="h-16 rounded-lg bg-secondary/70" />
                <div className="h-16 rounded-lg bg-secondary/70" />
              </div>
              <div className="h-12 rounded-lg bg-secondary mt-2" />
              <div className="h-12 rounded-lg bg-secondary/50" />
              <div className="mt-4 space-y-2">
                <div className="h-5 w-36 rounded bg-secondary" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full rounded bg-secondary/50" />
                ))}
              </div>
            </div>
          </div>
        </div>
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: product.slug,
    brand: { "@type": "Brand", name: "Speeduino" },
    url: `https://wrenchoverwallet.com/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.priceEUR,
      priceCurrency: "EUR",
      availability: outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Wrench over Wallet", url: "https://wrenchoverwallet.com" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "EU" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"] },
          cutoffTime: "14:00:00+01:00",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: product.leadTimeDays, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  return (
    <>
      <SEOHead
        title={`${product.name} — Speeduino ECU Part for Europe`}
        description={`Buy ${product.name} from €${product.priceEUR} inc. VAT. Speeduino-compatible aftermarket ECU part shipped from the EU. ${product.longDescription.slice(0, 100)}`}
        canonical={`/product/${product.slug}`}
        ogType="product"
        schema={productSchema}
      />
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
            <div className={`aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border relative ${outOfStock && stockLoaded ? "opacity-70" : ""}`}>
              <img src={product.imageUrl || ecuProduct} alt={product.name} className="w-full h-full object-cover" />
              {outOfStock && stockLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground text-sm font-bold px-4 py-2 rounded-lg shadow-lg rotate-[-8deg]">
                    Out of Stock
                  </span>
                </div>
              )}
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

            {/* Stock status */}
            {stockLoaded && (
              <div className="mb-4">
                {outOfStock ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">Out of Stock</p>
                      <p className="text-xs text-muted-foreground">Join the waitlist and we'll notify you when it's available.</p>
                    </div>
                  </div>
                ) : stockQty >= 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {stockQty === 1 ? "Only 1 left in stock." : `${stockQty} in stock.`}
                  </p>
                ) : null}
              </div>
            )}

            {/* CTA buttons */}
            {stockLoaded && outOfStock ? (
              <button
                onClick={() => setWaitlistOpen(true)}
                className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded-lg bg-destructive/10 border-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors px-6 py-3 font-semibold"
              >
                <Bell className="w-5 h-5" /> Add me to the waitlist
              </button>
            ) : (
              <button
                onClick={() => {
                  addItem(product);
                  toast.success(`${product.shortName} added to cart`);
                }}
                className="cta-primary w-full mb-3"
              >
                <ShoppingCart className="w-5 h-5 mr-2 inline" /> Add to Cart — €{product.priceEUR}
              </button>
            )}

            {!stockLoaded && (
              <div className="w-full mb-3 h-12 rounded-lg bg-secondary/50 animate-pulse" />
            )}

            <Link
              to="/find-my-kit"
              className="w-full mb-4 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/30 text-primary hover:bg-primary/10 transition-colors px-6 py-3 text-sm font-semibold"
            >
              <Layers className="w-4 h-4" /> Make a Bundle
              <span className="text-xs font-normal text-muted-foreground ml-1">— build a complete kit</span>
            </Link>

            <p className="text-xs text-muted-foreground text-center mb-4">
              {outOfStock && stockLoaded
                ? "Join the waitlist — one email when stock returns, nothing else."
                : "Prices include VAT. Free shipping on orders over €250. Stock is reserved at checkout."}
            </p>

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

      {/* Waitlist dialog */}
      <WaitlistDialog
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        productId={product.id}
        productName={product.name}
      />

    </main>
    </>
  );
}
