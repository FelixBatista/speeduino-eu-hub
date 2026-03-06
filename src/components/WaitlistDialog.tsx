import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bell, Loader2, CheckCircle2, Mail } from "lucide-react";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
}

export default function WaitlistDialog({ open, onOpenChange, productId, productName }: WaitlistDialogProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, email: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage((data as { error?: string })?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
      setMessage((data as { alreadyExists?: boolean })?.alreadyExists
        ? "You're already on the waitlist for this item."
        : "You're on the list! We'll notify you as soon as it's back in stock.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setTimeout(() => { setStatus("idle"); setMessage(""); setEmail(""); }, 300);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Notify me when back in stock</DialogTitle>
              <DialogDescription className="mt-0.5">
                <span className="font-medium text-foreground">{productName}</span> is currently out of stock.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-sm text-foreground font-medium">{message}</p>
            <button onClick={() => handleClose(false)} className="cta-secondary !py-2 !text-sm mt-2">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a one-time notification when this item is available again.
            </p>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); setMessage(""); }}
                placeholder="your@email.com"
                disabled={status === "loading"}
                className="w-full pl-9 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                autoFocus
              />
            </div>

            {message && status === "error" && (
              <p className="text-sm text-destructive">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full cta-primary !py-3 disabled:opacity-60"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Adding to waitlist…</>
              ) : (
                <><Bell className="w-4 h-4 inline mr-2" /> Notify me when available</>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              One email only. No marketing. Unsubscribe any time.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
