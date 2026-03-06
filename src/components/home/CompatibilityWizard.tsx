import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { configuratorSteps, isProductVisible, ConfiguratorInputs, Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useAvailability } from "@/hooks/useAvailability";
import { ChevronRight, ChevronLeft, Check, ShoppingCart, Plus, Loader2, AlertTriangle, Bell, Info, ExternalLink } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import WaitlistDialog from "@/components/WaitlistDialog";
import { useConfiguratorInfo } from "@/hooks/useConfiguratorInfo";

type Selections = Partial<ConfiguratorInputs>;

const levelLabels: Record<string, { title: string; color: string }> = {
  required: { title: "Required", color: "text-primary" },
  recommended: { title: "Recommended", color: "text-amber-500" },
  optional: { title: "Optional", color: "text-muted-foreground" },
};

export default function CompatibilityWizard() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({});
  const [showResult, setShowResult] = useState(false);
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { data: configuratorInfo = {} } = useConfiguratorInfo();
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

  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);

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
    navigate("/cart");
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
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight">{step.label}</h3>
                  {configuratorInfo[step.field] && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <span
                          role="button"
                          tabIndex={0}
                          className="mt-1 p-0.5 rounded text-muted-foreground hover:text-primary transition-colors cursor-pointer flex-shrink-0"
                          aria-label={`What is ${step.label}?`}
                        >
                          <Info className="w-4 h-4" />
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 text-sm" side="top" align="start">
                        <p className="text-popover-foreground leading-relaxed">{configuratorInfo[step.field].stepInfo}</p>
                        {configuratorInfo[step.field].docUrl && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <a
                              href={configuratorInfo[step.field].docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                              Official documentation
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-6">{step.description}</p>

                <div className="grid gap-3">
                  {step.options.map((opt) => {
                    const selected = selections[step.field] === opt.value;
                    const optInfo = configuratorInfo[step.field]?.options?.[opt.value];
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
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{opt.label}</p>
                            {opt.hint && <p className="text-sm text-muted-foreground mt-1">{opt.hint}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {optInfo && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.stopPropagation(); }}
                                    className="p-0.5 rounded text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                    aria-label={`Learn more about ${opt.label}`}
                                  >
                                    <Info className="w-4 h-4" />
                                  </span>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-72 text-sm"
                                  side="top"
                                  align="end"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <p className="text-popover-foreground leading-relaxed">{optInfo.info}</p>
                                  <div className="mt-3 pt-3 border-t border-border/50">
                                    <p className="text-xs font-semibold text-foreground mb-1">Is it for me?</p>
                                    <p className="text-popover-foreground leading-relaxed">{optInfo.forMe}</p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                            {selected && <Check className="w-5 h-5 text-primary" />}
                          </div>
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
                                <div
                                  key={product.id}
                                  className={`flex items-start gap-4 p-4 rounded-lg border transition-opacity ${
                                    oos
                                      ? "bg-secondary/10 border-border/30 opacity-60"
                                      : "bg-secondary/30 border-border/50"
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${oos ? "bg-muted" : "bg-primary/10"}`}>
                                    <ShoppingCart className={`w-4 h-4 ${oos ? "text-muted-foreground" : "text-primary"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${oos ? "text-muted-foreground" : "text-foreground"}`}>{product.shortName}</p>
                                    <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className={`font-mono font-semibold text-sm ${oos ? "text-muted-foreground line-through" : "text-primary"}`}>
                                        €{product.priceEUR}
                                      </span>
                                      {oos && (
                                        <span className="text-xs text-destructive font-medium flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3" /> Out of stock
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {oos ? (
                                    <button
                                      onClick={() => setWaitlistProduct(product)}
                                      className="p-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex-shrink-0"
                                      aria-label={`Join waitlist for ${product.shortName}`}
                                      title="Join waitlist"
                                    >
                                      <Bell className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        addItem(product);
                                        toast.success(`${product.shortName} added to cart`);
                                        navigate("/cart");
                                      }}
                                      className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
                                      aria-label={`Add ${product.shortName} to cart`}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  )}
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
      <WaitlistDialog
        open={!!waitlistProduct}
        onOpenChange={(open) => { if (!open) setWaitlistProduct(null); }}
        productId={waitlistProduct?.id ?? ""}
        productName={waitlistProduct?.name ?? ""}
      />
    </section>
  );
}
