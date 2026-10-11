import React from "react";
import { PageView, UserProfile } from "../types";
import { UserAvatar } from "./UserAvatar";

interface TopNavbarProps {
  activeView: PageView;
  setActiveView: (view: PageView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenSideNav: () => void;
  user: UserProfile | null;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeView, setActiveView, cartCount, onOpenCart, onOpenSearch, onOpenSideNav, user
}) => {
  return (
    <header className="fixed top-0 w-full z-50 glass-card !border-x-0 !border-t-0 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-4 md:px-8 max-w-[1440px] mx-auto h-20">
        
        <div className="flex items-center gap-3">
          <button onClick={onOpenSideNav} className="text-slate-900 dark:text-white p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-transform">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          
          <button onClick={() => setActiveView("home")} className="text-left font-sans font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight focus:outline-none ml-2">
            FootVerse
          </button>
        </div>

        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div onClick={onOpenSearch} className="relative w-full cursor-pointer group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#007A4D] dark:group-hover:text-[#CCFF00] transition-colors">
              search
            </span>
            <input type="text" readOnly placeholder="Search players, clubs, or gear..." className="w-full bg-white/40 dark:bg-black/20 border border-transparent hover:border-slate-300 dark:hover:border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200 transition-all" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-semibold text-base">
          {[{ id: "home", label: "Home" }, { id: "players", label: "Players" }, { id: "teams", label: "Clubs" }, { id: "merch", label: "Store" }].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveView(nav.id as PageView)}
              className={`transition-colors py-1 ${activeView === nav.id ? "text-[#007A4D] dark:text-[#CCFF00] border-b-2 border-[#007A4D] dark:border-[#CCFF00]" : "text-slate-600 dark:text-gray-400 hover:text-[#007A4D] dark:hover:text-[#CCFF00]"}`}
            >
              {nav.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-4">
          <button onClick={onOpenSearch} className="lg:hidden p-2 text-slate-600 dark:text-gray-300 hover:text-[#007A4D] dark:hover:text-[#CCFF00]">
            <span className="material-symbols-outlined">search</span>
          </button>
          
          {user ? (
            <button onClick={() => setActiveView("user-profile")} aria-label="My profile" className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all">
              <UserAvatar name={user.name} src={user.avatar} className="w-9 h-9 text-xs" />
            </button>
          ) : (
            <button onClick={() => setActiveView("login")} className="px-4 py-2 text-sm font-bold rounded-xl bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-[#0A0A0A] hover:opacity-90 transition-opacity">
              Log in
            </button>
          )}
          
          <button onClick={onOpenCart} className="p-2 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};