import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { wizardSteps, getRecommendation } from "@/data/compatibility";
import { products } from "@/data/products";
import { ChevronRight, ChevronLeft, Check, AlertTriangle, ShoppingCart } from "lucide-react";

export default function CompatibilityWizard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [showResult, setShowResult] = useState(false);

  const step = wizardSteps[currentStep];
  const isMulti = step?.multiSelect;

  const handleSelect = (optionId: string) => {
    if (isMulti) {
      const current = selections[step.id] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setSelections({ ...selections, [step.id]: updated });
    } else {
      setSelections({ ...selections, [step.id]: [optionId] });
    }
  };

  const canNext = (selections[step?.id] || []).length > 0;

  const next = () => {
    if (currentStep < wizardSteps.length - 1) {
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

  const recommendation = showResult ? getRecommendation(selections) : null;
  const recommendedProducts = recommendation
    ? recommendation.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)
    : [];

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
          <p className="data-label text-primary mb-3">Compatibility Wizard</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Find Your Kit
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Answer a few questions about your engine and goals. We'll recommend the right bundle.
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
            {wizardSteps.map((_, i) => (
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
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card-motorsport p-6 md:p-8"
              >
                <p className="data-label text-primary mb-1">Step {currentStep + 1} of {wizardSteps.length}</p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{step.description}</p>

                <div className="grid gap-3">
                  {step.options.map((opt) => {
                    const selected = (selections[step.id] || []).includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`text-left p-4 rounded-lg border transition-all ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30 bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-2">
                              {opt.label}
                              {!opt.supported && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Limited</span>
                              )}
                            </p>
                            {opt.description && <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>}
                            {opt.notes && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {opt.notes}
                              </p>
                            )}
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
                    {currentStep === wizardSteps.length - 1 ? "See Recommendation" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </button>
                </div>
              </motion.div>
            ) : showResult && recommendation ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-motorsport p-6 md:p-8"
              >
                <p className="data-label text-primary mb-1">Your Recommendation</p>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                  Recommended Bundle
                </h3>
                <p className="text-secondary-foreground text-sm mb-6">{recommendation.reason}</p>

                <div className="space-y-4 mb-6">
                  {recommendedProducts.map((product) => product && (
                    <div key={product.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product.shortName}</p>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <p className="font-mono text-primary font-semibold mt-1">€{product.priceEUR}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="data-label mb-1">Install Difficulty</p>
                    <p className="text-foreground font-medium">{recommendation.installDifficulty}</p>
                  </div>
                  <div>
                    <p className="data-label mb-1">Estimated Time</p>
                    <p className="text-foreground font-medium">{recommendation.estimatedTime}</p>
                  </div>
                </div>

                {recommendation.additionalNeeds.length > 0 && (
                  <div className="mb-6">
                    <p className="data-label mb-2">You'll also need</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {recommendation.additionalNeeds.map((need, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={reset} className="cta-secondary flex-1 !py-3 !text-sm">Start Over</button>
                  <Link to="/shop" className="cta-primary flex-1 !py-3 !text-sm text-center">
                    Add Bundle to Cart
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
