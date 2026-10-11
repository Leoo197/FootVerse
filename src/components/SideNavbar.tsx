import React from "react";
import { PageView, UserProfile } from "../types";
import { UserAvatar } from "./UserAvatar";

interface SideNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: PageView;
  setActiveView: (view: PageView) => void;
  user: UserProfile | null;
  onLogout: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  onOpenAiAnalysis: (prompt: string) => void;
}

export const SideNavbar: React.FC<SideNavbarProps> = ({
  isOpen, onClose, activeView, setActiveView, user, onLogout, theme, toggleTheme, onOpenAiAnalysis
}) => {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 left-0 h-full w-80 glass-card bg-white/80 dark:bg-[#0A0A0A]/90 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
          <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">FootVerse</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User Quick Info */}
        {user ? (
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => { setActiveView("user-profile"); onClose(); }}>
            <UserAvatar name={user.name} src={user.avatar} className="w-12 h-12 border-2 border-[#007A4D] dark:border-[#CCFF00]" />
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white leading-tight truncate">{user.name}</p>
              <p className="text-xs font-semibold text-[#007A4D] dark:text-[#CCFF00] mt-1">{user.xp} XP • {user.rank}</p>
            </div>
          </div>
        ) : (
          <div className="p-6 border-b border-slate-200 dark:border-white/10 space-y-3">
            <p className="text-sm text-slate-600 dark:text-gray-300">Log in to save orders and track your XP.</p>
            <button onClick={() => { setActiveView("login"); onClose(); }} className="w-full py-3 rounded-2xl font-bold bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-[#0A0A0A] hover:opacity-90 transition-opacity">
              Log in / Sign up
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {[
            { id: "home", icon: "home", label: "Command Home" },
            { id: "players", icon: "group", label: "Players Directory" },
            { id: "teams", icon: "sports_soccer", label: "Clubs Hub" },
            { id: "merch", icon: "shopping_bag", label: "Pro Store" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => { setActiveView(nav.id as PageView); onClose(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeView === nav.id 
                  ? "bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black shadow-md" 
                  : "text-slate-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">{nav.icon}</span>
              {nav.label}
            </button>
          ))}

          <div className="pt-6 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-4">AI Tools</p>
          </div>
          <button 
            onClick={() => { onOpenAiAnalysis("Generate a weekly summary of top performing athletes."); onClose(); }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-slate-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400">auto_awesome</span>
            Weekly Scout Report
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-white/10 space-y-3">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl glass-card hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold transition-colors">
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-[#CCFF00]' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 bg-black rounded-full transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
          {user && (
            <button onClick={() => { onLogout(); onClose(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors">
              <span className="material-symbols-outlined">logout</span>
              Log out
            </button>
          )}
        </div>
      </aside>
    </>
  );
};