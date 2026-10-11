import React, { useState } from "react";
import { CartItem, PageView, Order } from "../types";
import { PageCarousel } from "../components/PageCarousel";

interface CheckoutViewProps {
  cart: CartItem[];
  appliedDiscount: number;
  onPlaceOrder: () => Promise<Order>;
  setActiveView: (view: PageView) => void;
  clearCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart, appliedDiscount, onPlaceOrder, setActiveView, clearCart
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal * (1 - appliedDiscount) + (subtotal > 0 ? 15 : 0); // $15 shipping

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessing(true);
    setError("");
    try {
      await onPlaceOrder(); // saved in the SQL database; XP and rank are updated there
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err?.message || "Could not save your demo order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in-up">
        <div className="w-24 h-24 bg-[#007A4D] dark:bg-[#CCFF00] rounded-full flex items-center justify-center mb-6 shadow-xl">
          <span className="material-symbols-outlined text-white dark:text-black text-5xl">check</span>
        </div>
        <h2 className="font-display-lg text-5xl text-slate-900 dark:text-white mb-2">Order Confirmed</h2>
        <p className="text-slate-600 dark:text-gray-300 text-lg">Your elite gear is being prepped for deployment.</p>
        <p className="text-sm text-slate-500 mt-6 mb-4">Demo order saved. No real payment was processed.</p>
        <button onClick={() => setActiveView("user-profile")} className="px-6 py-3 rounded-xl bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black font-bold">View my orders</button>
      </div>
    );
  }

  const checkoutSlides = [
    { id: "checkout-1", tag: "Demo Checkout", title: "GEAR UP WITH CONFIDENCE", subtitle: "Your selected FootVerse gear is ready. Finish your order and get back to the football action.", buttonText: "Complete Order", image: cart[0]?.product.image || "", onAction: () => document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "checkout-2", tag: "Official Store", title: "BUILT FOR MATCH DAY", subtitle: "Official kits and elite football gear, selected for fans who live every match.", buttonText: "Review Order", image: cart[1]?.product.image || cart[0]?.product.image || "", onAction: () => document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" }) }
  ].filter((slide) => slide.image);

  return (
    <div className="space-y-8 pb-12 animate-fade-in-up">
      {checkoutSlides.length > 0 && <PageCarousel slides={checkoutSlides} />}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display-lg text-4xl md:text-5xl text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-white/10 pb-4">Demo Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            <section className="glass-card p-8 rounded-3xl space-y-3">
              <h2 className="font-headline-md text-2xl text-slate-900 dark:text-white">Demo Checkout</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">This academic demo records an order in the local SQLite database. It does not collect shipping details, process card payments, or charge money. Do not enter real payment information.</p>
            </section>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="glass-card p-8 rounded-3xl sticky top-24 space-y-6">
            <h2 className="font-headline-md text-2xl text-slate-900 dark:text-white">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto space-y-4 no-scrollbar pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} className="w-12 h-12 bg-white/40 dark:bg-black/20 rounded p-1 object-contain" alt={item.product.name} />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.product.name} x{item.quantity}</p>
                      <p className="text-xs text-slate-500">Size: {item.selectedSize}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>$15.00</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-sm font-bold text-[#007A4D] dark:text-[#CCFF00]">
                  <span>Discount</span>
                  <span>-${(subtotal * appliedDiscount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-white/10">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p role="alert" className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}

            <button 
              type="submit" 
              form="checkout-form"
              disabled={isProcessing || cart.length === 0}
              className="w-full py-4 bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black font-bold rounded-2xl hover:opacity-90 transition-opacity text-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>Processing <span className="material-symbols-outlined animate-spin">refresh</span></>
              ) : (
                <>Place Demo Order <span className="material-symbols-outlined">check_circle</span></>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};