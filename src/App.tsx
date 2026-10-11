import React, { useState, useEffect, useCallback } from "react";
import { BootstrapData, fetchBootstrap, submitOrder, login as apiLogin, signup as apiSignup, logout as apiLogout } from "./data/api";
import { PageView, Player, Team, Product, CartItem, Order, UserProfile } from "./types";

import { TopNavbar } from "./components/TopNavbar";
import { SideNavbar } from "./components/SideNavbar";
import { SearchModal } from "./components/SearchModal";
import { CartDrawer } from "./components/CartDrawer";
import { ReplayModal } from "./components/ReplayModal";
import { PlayerCompareModal } from "./components/PlayerCompareModal";
import { AiTacticalModal } from "./components/AiTacticalModal";

import { HomeView } from "./views/HomeView";
import { PlayersView } from "./views/PlayersView";
import { TeamsView } from "./views/TeamsView";
import { MerchStoreView } from "./views/MerchStoreView";
import { CheckoutView } from "./views/CheckoutView";
import { UserProfileView } from "./views/UserProfileView";
import { LoginView } from "./views/LoginView";
import { LiveMatchView } from "./views/LiveMatchView";
import { LandingView } from "./views/LandingView";

type Theme = "dark" | "light";

function readSavedTheme(): Theme {
  try {
    return localStorage.getItem("footverse_theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(() => {
    setLoadError("");
    fetchBootstrap().then(setData).catch((e: Error) => setLoadError(e.message || "Could not reach the FootVerse server."));
  }, []);
  useEffect(load, [load]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white">FootVerse</h1>
        {loadError ? (
          <>
            <p className="text-slate-600 dark:text-slate-300 max-w-md">{loadError}</p>
            <button onClick={load} className="px-6 py-3 rounded-xl bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black font-bold">Try again</button>
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading the command center…</p>
        )}
      </div>
    );
  }
  return <AppContent data={data} />;
}

function AppContent({ data }: { data: BootstrapData }) {
  const { players, teams, products, discounts } = data;
  /** Guests see the intro page first (once per browser session); logged-in fans go straight home. */
  const [activeView, setActiveView] = useState<PageView>(() => {
    const wantsLogin = new URLSearchParams(window.location.search).get("view") === "login";
    if (wantsLogin) window.history.replaceState(null, "", window.location.pathname);
    if (data.user) return "home";
    if (wantsLogin) return "login";
    try {
      if (sessionStorage.getItem("footverse_intro_seen") === "1") return "home";
    } catch { /* storage unavailable */ }
    return "landing";
  });
  useEffect(() => {
    if (activeView !== "landing") {
      try { sessionStorage.setItem("footverse_intro_seen", "1"); } catch { /* storage unavailable */ }
    }
  }, [activeView]);

  const [theme, setTheme] = useState<Theme>(readSavedTheme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("footverse_theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [user, setUser] = useState<UserProfile | null>(data.user);
  /** Where to go after logging in (e.g. back to checkout). */
  const [afterLogin, setAfterLogin] = useState<PageView | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<string>("");

  /** Page navigation: always starts at the top, and the Players tab always opens the directory. */
  const navigate = (view: PageView) => {
    // Profile and checkout need an account: send guests to the login page first.
    if (!user && (view === "user-profile" || view === "checkout")) {
      setAfterLogin(view);
      view = "login";
    } else if (view !== "login") {
      setAfterLogin(null);
    }
    if (view === "players") setSelectedPlayer(null);
    setActiveView(view);
    window.scrollTo({ top: 0 });
  };

  const finishAuth = (u: UserProfile) => {
    setUser(u);
    const next = afterLogin ?? "home";
    setAfterLogin(null);
    setActiveView(next);
    window.scrollTo({ top: 0 });
  };
  const handleLogin = async (email: string, password: string) => finishAuth(await apiLogin(email, password));
  const handleSignup = async (name: string, email: string, password: string) => finishAuth(await apiSignup(name, email, password));
  const handleLogout = async () => {
    try { await apiLogout(); } catch { /* cookie is cleared on the next load anyway */ }
    setUser(null);
    setAfterLogin(null);
    setActiveView("home");
    window.scrollTo({ top: 0 });
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalPrompt, setAiModalPrompt] = useState("");
  const [aiModalType, setAiModalType] = useState<"scout" | "match">("scout");

  const handleAddToCart = (product: Product, selectedSize?: string, customText?: string) => {
    const size = selectedSize || (product.availableSizes ? product.availableSizes[0] : "Standard");
    const custom = customText || "";
    setCart((prev) => {
      const idx = prev.findIndex((ci) => ci.product.id === product.id && ci.selectedSize === size && (ci.customizationText || "") === custom);
      if (idx > -1) return prev.map((ci, i) => (i === idx ? { ...ci, quantity: Math.min(99, ci.quantity + 1) } : ci));
      return [...prev, { product, quantity: 1, selectedSize: size, customizationText: custom }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (idx: number, delta: number) => {
    setCart((prev) =>
      prev.flatMap((ci, i) => {
        if (i !== idx) return [ci];
        const quantity = Math.min(99, ci.quantity + delta);
        return quantity > 0 ? [{ ...ci, quantity }] : [];
      })
    );
  };

  const handleRemoveFromCart = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const handleApplyDiscount = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const match = discounts.find((d) => d.code === normalized);
    setAppliedCode(match ? match.code : "");
    setAppliedDiscount(match ? match.percent / 100 : 0);
    return Boolean(match);
  };

  /** Saves the order in the SQL database, then updates the fan's orders, XP and rank. */
  const handlePlaceOrder = async (): Promise<Order> => {
    const { order, xp, rank } = await submitOrder(cart, appliedCode);
    setUser((prev) => (prev ? { ...prev, orders: [order, ...prev.orders], xp, rank } : prev));
    setAppliedDiscount(0);
    setAppliedCode("");
    setDiscountCode("");
    return order;
  };

  const openAiAnalysis = (prompt: string, type: "scout" | "match" = "scout") => {
    setAiModalPrompt(prompt);
    setAiModalType(type);
    setIsAiModalOpen(true);
  };

  const navigateToPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setActiveView("players");
    window.scrollTo({ top: 0 });
  };

  const navigateToTeam = (team: Team) => {
    setSelectedTeam(team);
    navigate("teams");
  };

  if (activeView === "landing") return <LandingView onLogin={() => navigate("login")} />;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#007A4D] selection:text-white dark:selection:bg-[#CCFF00] dark:selection:text-[#0A0A0A]">
      <TopNavbar
        activeView={activeView}
        setActiveView={navigate}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSideNav={() => setIsSideNavOpen(true)}
        user={user}
      />

      <SideNavbar
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        activeView={activeView}
        setActiveView={navigate}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAiAnalysis={(p) => openAiAnalysis(p, "scout")}
      />

      <main className="flex-1 pt-24 pb-16">
        {activeView === "home" && <HomeView players={players} setActiveView={navigate} onSelectPlayer={navigateToPlayer} onOpenReplay={() => setIsReplayOpen(true)} products={products} onAddToCart={handleAddToCart} />}
        {activeView === "players" && <PlayersView players={players} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} products={products} onOpenCompare={() => setIsCompareOpen(true)} onOpenAiAnalysis={openAiAnalysis} onAddToCart={handleAddToCart} />}
        {activeView === "teams" && <TeamsView teams={teams} players={players} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} onSelectPlayer={navigateToPlayer} setActiveView={navigate} onOpenAiAnalysis={openAiAnalysis} />}
        {activeView === "merch" && <MerchStoreView products={products} onAddToCart={handleAddToCart} setActiveView={navigate} />}
        {activeView === "checkout" && <CheckoutView cart={cart} appliedDiscount={appliedDiscount} onPlaceOrder={handlePlaceOrder} setActiveView={navigate} clearCart={() => setCart([])} />}
        {activeView === "user-profile" && user && <UserProfileView user={user} onLogout={handleLogout} allPlayers={players} allTeams={teams} onSelectPlayer={navigateToPlayer} onSelectTeam={navigateToTeam} setActiveView={navigate} />}
        {activeView === "live-match" && <LiveMatchView setActiveView={navigate} />}
        {activeView === "login" && <LoginView setActiveView={navigate} onLogin={handleLogin} onSignup={handleSignup} notice={afterLogin === "checkout" ? "Log in or create an account to complete your order." : afterLogin === "user-profile" ? "Log in to see your profile." : undefined} />}
      </main>

      <footer className="w-full glass-card !border-x-0 !border-b-0 py-12 text-center mt-auto">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="font-sans font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white mb-4">FootVerse</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            The elite football command ecosystem. Live stats, player performance analytics, and official club merchandise.
          </p>
          <div className="flex justify-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button className="hover:text-[#007A4D] dark:hover:text-[#CCFF00]">Privacy Policy</button>
            <button className="hover:text-[#007A4D] dark:hover:text-[#CCFF00]">Terms of Service</button>
            <button className="hover:text-[#007A4D] dark:hover:text-[#CCFF00]">Contact Support</button>
          </div>
          <p className="text-xs text-slate-400 mt-8">© 2026 FootVerse Command. All rights reserved.</p>
        </div>
      </footer>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} players={players} teams={teams} products={products} onSelectPlayer={navigateToPlayer} onSelectTeam={navigateToTeam} onSelectProduct={() => navigate("merch")} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateCartQty} onRemoveItem={handleRemoveFromCart} onCheckout={() => { setIsCartOpen(false); navigate("checkout"); }} discountCode={discountCode} setDiscountCode={setDiscountCode} appliedCode={appliedCode} appliedDiscount={appliedDiscount} onApplyDiscount={handleApplyDiscount} />
      <ReplayModal isOpen={isReplayOpen} onClose={() => setIsReplayOpen(false)} onGenerateAiAnalysis={openAiAnalysis} />
      {selectedPlayer && <PlayerCompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} players={players} defaultPlayer1={selectedPlayer} />}
      <AiTacticalModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} initialPrompt={aiModalPrompt} initialType={aiModalType} />
    </div>
  );
}