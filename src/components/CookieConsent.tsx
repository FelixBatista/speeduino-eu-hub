import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "speeduino-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60] card-motorsport p-5 border-primary/20 shadow-2xl"
        >
          <button onClick={reject} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">Cookie Notice</p>
              <p className="text-xs text-muted-foreground mb-4">
                We use essential cookies for site functionality and optional analytics cookies to improve your experience. Read our{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
              <div className="flex gap-2">
                <button onClick={accept} className="px-4 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  Accept All
                </button>
                <button onClick={reject} className="px-4 py-1.5 rounded-md text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
