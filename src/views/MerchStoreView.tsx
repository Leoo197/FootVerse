import React, { useState } from "react";
import { Product, PageView } from "../types";
import { PageCarousel } from "../components/PageCarousel";

interface MerchStoreViewProps {
  products: Product[];
  onAddToCart: (product: Product, selectedSize?: string, customText?: string) => void;
  setActiveView: (view: PageView) => void;
}

export const MerchStoreView: React.FC<MerchStoreViewProps> = ({ products, onAddToCart, setActiveView }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(300);

  const categories = ["All", "Jerseys", "Shoes", "Shirts", "Shorts", "Training Gear", "Accessories", "Collectibles"];
  
  const filteredProducts = products.filter((p) => {
    const catMatch = selectedCategory === "All" || p.category === selectedCategory;
    const priceMatch = p.price <= maxPrice;
    return catMatch && priceMatch;
  });

  const merchSlides = [
    {
      id: "ms1",
      tag: "Official Drop",
      title: "ELITE MATCH GEAR",
      subtitle: "Engineered for the fastest players on the pitch. Experience breathable micro-mesh and iconic pitch aesthetics.",
      buttonText: "Shop the Collection",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA",
      onAction: () => window.scrollTo({ top: 800, behavior: 'smooth' })
    },
    {
      id: "ms2",
      tag: "Limited Edition",
      title: "PRO SPEED SERIES BOOTS",
      subtitle: "Ultra-light carbon fiber soleplates with chevron stud placement. Built exclusively for explosive acceleration.",
      buttonText: "Secure Your Pair",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_XPSRhIxOP1zn2MFRNFtw6XIgG_cwbg47O8DnKv6EwAJ8zKBBQto603-FvwjmIyeHkOBhfcYBlhohRPaDXYI7_hEd3pj-GSFLKBvAKHoqP2ya3RGdpgT9cD_FAPempzAoDppshLAh1Q12hEpiVe8CfyNeTujNHaCGoKcQvt6Y8iiAwIX82doYfFg7oixo_q84RoinLfbWiAhHQiCI4Y_NL72ZxRmoZGQ1yWGQvn7qq7_bHYR7Ol5pzH66I7blKTWRKnrUUSkOvgtv",
      onAction: () => window.scrollTo({ top: 800, behavior: 'smooth' })
    }
  ];

  return (
    <div className="space-y-12 pb-16 animate-fade-in-up">
      <PageCarousel slides={merchSlides} />

      <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)] gap-8 max-w-[1680px] mx-auto px-4 md:px-8">
        <aside className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <h3 className="font-headline-md text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#007A4D] dark:text-[#CCFF00]">tune</span> Filters
            </h3>
            
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Category</p>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="text-[#007A4D] dark:text-[#CCFF00]" />
                    <span className={`text-sm ${selectedCategory === cat ? "text-[#007A4D] dark:text-[#CCFF00] font-bold" : "text-slate-600 dark:text-gray-400"}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Max Price: ${maxPrice}</p>
              <input type="range" min="10" max="300" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#007A4D] dark:accent-[#CCFF00] cursor-pointer" />
            </div>
          </div>
        </aside>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between">
                <div className="aspect-[4/5] relative bg-white/40 dark:bg-black/20 p-3">
                  <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between border-t border-black/5 dark:border-white/5">
                  <div>
                    <p className="text-xs text-[#007A4D] dark:text-[#CCFF00] font-bold uppercase tracking-wider">{prod.category}</p>
                    <h4 className="font-headline-md text-xl text-slate-900 dark:text-white leading-tight mt-1">{prod.name}</h4>
                    <p className="font-stat-value text-2xl text-slate-900 dark:text-white mt-2">${prod.price.toFixed(2)}</p>
                  </div>
                  <div className="pt-2">
                    <button onClick={() => onAddToCart(prod)} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-[#007A4D] dark:hover:bg-[#CCFF00] transition-colors shadow-md">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};