import React, { useState } from "react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: number;
  appliedCode: string;
  onApplyDiscount: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckout,
  discountCode, setDiscountCode, appliedCode, appliedDiscount, onApplyDiscount
}) => {
  const [discountMessage, setDiscountMessage] = useState("");
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal * (1 - appliedDiscount);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md glass-card bg-white/90 dark:bg-[#0A0A0A]/95 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
          <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">shopping_cart</span> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">shopping_bag</span>
              <p className="font-medium text-lg">Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="flex gap-4 glass-card p-4 rounded-2xl relative">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-contain mix-blend-multiply dark:mix-blend-normal bg-white/40 dark:bg-black/20 p-2 rounded-xl" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight pr-4">{item.product.name}</h4>
                    <button onClick={() => onRemoveItem(idx)} className="text-red-500 hover:text-red-700 absolute top-4 right-4">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Size: {item.selectedSize}</p>
                  {item.customizationText && <p className="text-xs text-[#007A4D] dark:text-[#CCFF00] font-bold mt-1 uppercase">"{item.customizationText}"</p>}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-white/10 rounded-lg px-2 py-1">
                      <button onClick={() => onUpdateQuantity(idx, -1)} className="text-slate-700 dark:text-white font-bold hover:text-[#007A4D] dark:hover:text-[#CCFF00]">-</button>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(idx, 1)} className="text-slate-700 dark:text-white font-bold hover:text-[#007A4D] dark:hover:text-[#CCFF00]">+</button>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 dark:border-white/10 glass-card rounded-t-3xl">
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Discount Code" 
                value={discountCode}
                onChange={(e) => { setDiscountCode(e.target.value); setDiscountMessage(""); }}
                className="flex-1 bg-white/50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#007A4D] dark:focus:border-[#CCFF00]"
              />
              <button 
                onClick={() => setDiscountMessage(onApplyDiscount(discountCode) ? `Applied ${discountCode.trim().toUpperCase()}.` : "Invalid discount code. The discount has been cleared.")}
                className="bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
              >
                Apply
              </button>
            </div>
            
            {discountMessage && <p role="status" className={`text-xs mb-3 ${appliedCode ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{discountMessage}</p>}
            {appliedCode && <p className="text-xs text-slate-500 mb-3">Checkout will use applied code: <strong>{appliedCode}</strong></p>}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-sm font-bold text-[#007A4D] dark:text-[#CCFF00]">
                  <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                  <span>-${(subtotal * appliedDiscount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={onCheckout} className="w-full bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity text-lg shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};