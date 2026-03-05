import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { configuratorSteps, isProductVisible, ConfiguratorInputs, Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAvailability } from "@/hooks/useAvailability";
import { ChevronRight, ChevronLeft, Check, ShoppingCart, Plus, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type Selections = Partial<ConfiguratorInputs>;

const levelLabels: Record<string, { title: string; color: string }> = {
  required: { title: "Required", color: "text-primary" },
  recommended: { title: "Recommended", color: "text-amber-500" },
  optional: { title: "Optional", color: "text-muted-foreground" },
};

export default function CompatibilityWizard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [showResult, setShowResult] = useState(false);
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const { availability } = useAvailability();

  const step = configuratorSteps[currentStep];

  const handleSelect = (value: string) => {
    setSelections({ ...selections, [step.field]: value });
  };

  const canNext = !!selections[step?.field];

  const next = () => {
    if (currentStep < configuratorSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const prev = () => {
    if (showResult) {
      setShowResult(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setSelections({});
    setShowResult(false);
  };

  const filteredProducts = useMemo(() => {
    if (!showResult) return [];
    return allProducts.filter((p) => isProductVisible(p, selections));
  }, [showResult, allProducts, selections]);

  const grouped = useMemo(() => {
    const groups: Record<string, Product[]> = { required: [], recommended: [], optional: [] };
    filteredProducts.forEach((p) => {
      const level = p.requirementLevel || "optional";
      if (groups[level]) groups[level].push(p);
    });
    return groups;
  }, [filteredProducts]);

  const totalEUR = filteredProducts.reduce((sum, p) => sum + p.priceEUR, 0);

  const addAllToCart = () => {
    let added = 0;
    filteredProducts.forEach((p) => {
      if (availability[p.id] !== 0) {
        addItem(p);
        added++;
      }
    });
    toast.success(`${added} item${added !== 1 ? "s" : ""} added to cart`);
  };

  return (
    <section className="py-20 md:py-32 relative" ref={ref} id="find-my-kit">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="data-label text-primary mb-3">Kit Builder</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Find Your Kit
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Answer a few questions about your engine setup and we'll show you exactly which components you need.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Progress */}
          <div className="flex gap-1 mb-8">
            {configuratorSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStep || showResult ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!showResult && step ? (
              <motion.div
                key={step.field}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card-motorsport p-6 md:p-8"
              >
                <p className="data-label text-primary mb-1">Step {currentStep + 1} of {configuratorSteps.length}</p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">{step.label}</h3>
                <p className="text-muted-foreground text-sm mb-6">{step.description}</p>

                <div className="grid gap-3">
                  {step.options.map((opt) => {
                    const selected = selections[step.field] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`text-left p-4 rounded-lg border transition-all ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30 bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{opt.label}</p>
                            {opt.hint && <p className="text-sm text-muted-foreground mt-1">{opt.hint}</p>}
                          </div>
                          {selected && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    className="cta-secondary !px-5 !py-2.5 !text-sm disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1 inline" /> Back
                  </button>
                  <button
                    onClick={next}
                    disabled={!canNext}
                    className="cta-primary !px-5 !py-2.5 !text-sm disabled:opacity-30"
                  >
                    {currentStep === configuratorSteps.length - 1 ? "See My Kit" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </button>
                </div>
              </motion.div>
            ) : showResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-motorsport p-6 md:p-8"
              >
                <p className="data-label text-primary mb-1">Your Shopping List</p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                  Compatible Components
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Based on your selections, here's everything you need for your build.
                </p>

                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {(["required", "recommended", "optional"] as const).map((level) => {
                      const items = grouped[level];
                      if (!items || items.length === 0) return null;
                      const { title, color } = levelLabels[level];
                      return (
                        <div key={level}>
                          <h4 className={`data-label ${color} mb-3`}>{title}</h4>
                          <div className="space-y-3">
                            {items.map((product) => {
                              const stock = typeof availability[product.id] === "number" ? availability[product.id] : -1;
                              const oos = stock === 0;
                              return (
                                <div key={product.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground">{product.shortName}</p>
                                    <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="font-mono text-primary font-semibold text-sm">€{product.priceEUR}</span>
                                      {oos && (
                                        <span className="text-xs text-destructive flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3" /> Out of stock
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      if (oos) {
                                        toast.error("This item is out of stock.");
                                        return;
                                      }
                                      addItem(product);
                                      toast.success(`${product.shortName} added to cart`);
                                    }}
                                    disabled={oos}
                                    className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none flex-shrink-0"
                                    aria-label={`Add ${product.shortName} to cart`}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">{filteredProducts.length} components</span>
                    <span className="font-mono text-lg font-bold text-foreground">Total: €{totalEUR}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={reset} className="cta-secondary flex-1 !py-3 !text-sm">Start Over</button>
                    <button
                      onClick={addAllToCart}
                      className="cta-primary flex-1 !py-3 !text-sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 inline" /> Add All to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
