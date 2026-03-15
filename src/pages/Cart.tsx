import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import ecuProduct from "@/assets/ecu-product.jpg";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalEUR } = useCart();

  const total = `€${totalEUR}`;

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 container text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Browse our shop to find the right kit for your build.</p>
        <Link to="/shop" className="cta-primary !px-8 !py-3 !text-base">
          <ArrowLeft className="w-4 h-4 mr-2 inline" /> Browse Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="container max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Cart</span>
        </nav>

        <div className="flex items-end justify-between mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground">Cart</h1>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-motorsport p-4 flex gap-4 items-stretch"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0 self-start">
                <img src={item.product.imageUrl || ecuProduct} alt={item.product.shortName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.product.slug}`} className="font-display font-bold text-foreground hover:text-primary transition-colors">
                    {item.product.shortName}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">{item.product.description}</p>
                </div>
              <div
                className="flex items-center gap-2 shrink-0 pt-3 pb-2 md:pt-0 md:pb-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity - 1); }}
                  className="min-w-[48px] min-h-[48px] p-3 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center justify-center [touch-action:manipulation]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 pointer-events-none" />
                </button>
                <span className="font-mono text-sm w-8 text-center text-foreground py-2">{item.quantity}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity + 1); }}
                  className="min-w-[48px] min-h-[48px] p-3 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center justify-center [touch-action:manipulation]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 pointer-events-none" />
                </button>
                <span className="font-mono font-bold text-foreground w-16 md:w-24 text-right ml-1 md:ml-0">
                  {`€${item.product.priceEUR * item.quantity}`}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(item.product.id); }}
                  className="min-w-[48px] min-h-[48px] p-3 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center [touch-action:manipulation]"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="w-4 h-4 pointer-events-none" />
                </button>
              </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card-motorsport p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono text-xl font-bold text-foreground">{total}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Shipping calculated at checkout. All prices include VAT for EU customers.</p>
          <div className="flex gap-3">
            <button onClick={clearCart} className="cta-secondary flex-1 !py-3 !text-sm">Clear Cart</button>
            <Link to="/checkout" className="cta-primary flex-1 !py-3 !text-sm text-center">
              Checkout <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>
        </div>

        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </main>
  );
}
