import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "@/data/products";
import { Package, ArrowRight } from "lucide-react";
import ecuProduct from "@/assets/ecu-product.jpg";

const skillColors: Record<string, string> = {
  Beginner: "text-green-400",
  Intermediate: "text-amber",
  Advanced: "text-primary",
};

export default function BundleShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const featured = getFeaturedProducts();

  return (
    <section className="py-20 md:py-32 relative" ref={ref}>
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="data-label text-primary mb-3">Featured Products</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Everything You Need to Build
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Boards, sensors, and modules — pick what your build needs, or use the configurator to get a shopping list.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/product/${product.slug}`}
                className="card-motorsport p-6 flex flex-col h-full group block"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-5 bg-secondary/50">
                  <img
                    src={ecuProduct}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Badge */}
                {product.badge && (
                  <span className="self-start text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded mb-3">
                    {product.badge}
                  </span>
                )}

                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.shortName}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{product.description}</p>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="data-label text-[10px]">Price</p>
                    <p className="font-mono font-semibold text-foreground">€{product.priceEUR}</p>
                  </div>
                  <div>
                    <p className="data-label text-[10px]">Lead Time</p>
                    <p className="font-mono text-foreground">{product.leadTimeDays} days</p>
                  </div>
                  <div>
                    <p className="data-label text-[10px]">Skill Level</p>
                    <p className={`font-mono ${skillColors[product.skillLevel] || "text-foreground"}`}>
                      {product.skillLevel}
                    </p>
                  </div>
                  <div>
                    <p className="data-label text-[10px]">Items</p>
                    <p className="font-mono text-foreground">{product.included.length} included</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="cta-secondary">
            <Package className="w-4 h-4 mr-2 inline" /> View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
