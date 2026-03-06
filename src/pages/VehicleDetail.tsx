import { useParams, Link } from "react-router-dom";
import { getVehicleBySlug, vehicles } from "@/data/vehicles";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { Check, ShoppingCart, Wrench, Clock, Users, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import ecuProduct from "@/assets/ecu-product.jpg";

export default function VehicleDetail() {
  const { slug } = useParams();
  const vehicle = getVehicleBySlug(slug || "");
  const { addItem } = useCart();

  if (!vehicle) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
        <Link to="/vehicles" className="text-primary hover:underline">← All Vehicles</Link>
      </main>
    );
  }

  const { data: allProducts = [] } = useProducts();
  const bundle = allProducts.find((p) => p.id === vehicle.recommendedBundleId);

  return (
    <main className="pt-24 pb-20">
      {/* Meta title */}
      <title>{vehicle.metaTitle}</title>
      <meta name="description" content={vehicle.metaDescription} />

      <div className="container">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/vehicles" className="hover:text-foreground">Vehicles</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{vehicle.name}</span>
        </nav>

        <Link to="/vehicles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> All Vehicles
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded">{vehicle.engine}</span>
            <span className="text-xs font-mono bg-secondary text-secondary-foreground px-3 py-1 rounded">{vehicle.years}</span>
            <span className="text-xs font-mono bg-secondary text-secondary-foreground px-3 py-1 rounded">{vehicle.cylinders}-cyl {vehicle.induction}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{vehicle.heroTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{vehicle.heroDescription}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Stats */}
          <div className="card-motorsport p-5 text-center">
            <Wrench className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="data-label mb-1">Difficulty</p>
            <p className="font-display text-lg font-bold text-foreground">{vehicle.difficulty}</p>
          </div>
          <div className="card-motorsport p-5 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="data-label mb-1">Estimated Time</p>
            <p className="font-display text-lg font-bold text-foreground">{vehicle.estimatedTime}</p>
          </div>
          <div className="card-motorsport p-5 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="data-label mb-1">Community Builds</p>
            <p className="font-display text-lg font-bold text-foreground">{vehicle.communityBuilds}+</p>
          </div>
        </div>

        {/* Why Speeduino */}
        <section className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Why Speeduino for {vehicle.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {vehicle.whySpeeduino.map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-secondary-foreground">{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Install Notes */}
        <section className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">Installation Notes</h2>
          <div className="space-y-3">
            {vehicle.installNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20 border border-border/30">
                <Wrench className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm text-secondary-foreground">{note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Compatibility notes */}
        <section className="mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Compatibility Details</h2>
          <div className="card-motorsport p-6">
            <p className="text-sm text-secondary-foreground leading-relaxed">{vehicle.compatibilityNotes}</p>
            <div className="mt-4 flex items-start gap-2 p-3 rounded bg-accent/10 border border-accent/20">
              <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Features vary by firmware version and hardware variant. Always verify compatibility for your specific vehicle and configuration before ordering.
              </p>
            </div>
          </div>
        </section>

        {/* Recommended Bundle */}
        {bundle && (
          <section className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">Recommended Kit</h2>
            <div className="card-motorsport p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                <img src={ecuProduct} alt={bundle.shortName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{bundle.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-2xl font-bold text-foreground">€{bundle.priceEUR}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { addItem(bundle); toast.success(`${bundle.shortName} added to cart`); }}
                    className="cta-primary !px-6 !py-2.5 !text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 inline" /> Add to Cart
                  </button>
                  <Link to={`/product/${bundle.slug}`} className="cta-secondary !px-6 !py-2.5 !text-sm">
                    Details <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other vehicles */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Other Supported Vehicles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.filter((v) => v.slug !== vehicle.slug).slice(0, 3).map((v) => (
              <Link key={v.slug} to={`/vehicles/${v.slug}`} className="card-motorsport p-5 group">
                <p className="text-xs font-mono text-primary mb-2">{v.engine}</p>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">{v.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{v.years} · {v.cylinders}-cyl {v.induction}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: vehicle.metaTitle,
        description: vehicle.metaDescription,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://speeduino.eu/" },
            { "@type": "ListItem", position: 2, name: "Vehicles", item: "https://speeduino.eu/vehicles" },
            { "@type": "ListItem", position: 3, name: vehicle.name },
          ],
        },
      }) }} />
    </main>
  );
}
