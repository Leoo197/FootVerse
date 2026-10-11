// src/views/HomeView.tsx - Updated with Watch Live Match triggers
import React from "react";
import { PlayerPhoto } from "../components/PlayerPhoto";
import { Player, PageView, Product } from "../types";
import { PageCarousel } from "../components/PageCarousel";

interface HomeViewProps {
  players: Player[];
  products: Product[];
  setActiveView: (view: PageView) => void;
  onSelectPlayer: (player: Player) => void;
  onOpenReplay: () => void;
  onAddToCart: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  players, products, setActiveView, onSelectPlayer, onOpenReplay, onAddToCart
}) => {
  const topMbappe = players.find((p) => p.name.includes("MBAPP")) || players[0];
  const topBellingham = players.find((p) => p.name.includes("BELLINGHAM")) || players[1];
  const topSalah = players.find((p) => p.name.includes("SALAH")) || players[2];

  const homeSlides = [
    {
      id: "slide1",
      tag: "Weekly Drop • Store Exclusive",
      title: "TOP MERCH OF THE WEEK",
      subtitle: "Fresh kits, boots, scarves and fan gear picked from this week's hottest FootVerse drops.",
      buttonText: "Shop Top Merch",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA",
      onAction: () => setActiveView("merch")
    },
    {
      id: "slide2",
      tag: "Inside Access • Exclusive",
      title: "PLAYER INTERVIEW",
      subtitle: "Jude Bellingham talks goals, pressure, leadership and the mindset behind his biggest performances.",
      buttonText: "Read Interview",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClHVuvRIQOozSWI0UK4NfZXF1mizMtlYGxEINv3Gk8h_EGDpcNn2p0g-J8q9GshGMJYQlAAcI9wI0JhzIwqknqb-BtiKNRYPcjYdEdrEZjNg108CnS0JXyCh551GNfT_6UD07UEUkKAvzLg8H9SNvCiJDZxNXsU_ze0txBwaY8eNKYg2GQhgh4PYZLwSX1TmnOvu2h69jXa_8CMbgcTfiL2QMfYZBK2uaHfhN0_yU1A7wDGt5YANOGuR-N6HtFJf_jPcCphZl9lGBP",
      onAction: () => setActiveView("players")
    },
    {
      id: "slide3",
      tag: "Weekly Rankings • Clubs",
      title: "TOP CLUBS OF THE WEEK",
      subtitle: "See which clubs are rising, which systems are dominating and who owns the week's best form.",
      buttonText: "Explore Clubs",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1jsorxHSgFBWX9perPSWrZ9FvlcV2rCZJo-O4z6Azb1ZWW9yh0JHn0plVeDYqoEea7bFCQ9Tc1Bl83aZi9ZN1KIchT0PXYhECGaGuy1n9Cw-ZSDZuca3s1Kwa9_un1iTro93dd6TPnu3eAjNHBdaZDh1_Ftj4-oPtlQkiAsvINxA27y5qi9QjW_Ul2YHGFmwt4DiK9fzCixYsmZF0mAluBLnECjzzvUz6A_p5dVnE6gASSCtPP03jCN55vouR9S9Br9dsA99anwKR",
      onAction: () => setActiveView("teams")
    },
    {
      id: "slide4",
      tag: "Match Center Demo",
      title: "WATCH THE LATEST MATCH",
      subtitle: "Explore the sample Manchester City vs Arsenal match-center interface. Live streaming and real-time match data are not connected.",
      buttonText: "Watch Latest Match",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80",
      onAction: () => setActiveView("live-match")
    }
  ];

  return (
    <div className="space-y-20 overflow-hidden pb-12">
      <PageCarousel slides={homeSlides} />

      {/* Quick Watch Live Banner */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div onClick={() => setActiveView("live-match")} className="glass-card glass-card-hover rounded-3xl p-8 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-red-500/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">live_tv</span>
            </div>
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">MATCH CENTER DEMO</span>
              <h3 className="font-headline-lg text-3xl text-slate-900 dark:text-white">Manchester City vs Arsenal (Sample Match)</h3>
              <p className="text-sm text-slate-500">Explore the sample match interface and demo chat.</p>
            </div>
          </div>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-8 py-4 rounded-2xl shadow-md hover:opacity-90">
            Explore Match Demo &rarr;
          </button>
        </div>
      </section>

      {/* Trending Products Slider */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline-lg text-3xl md:text-4xl text-slate-900 dark:text-white">Up To 50% Off & Trending Merch</h3>
          <button onClick={() => setActiveView("merch")} className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x">
          {products.map((prod) => (
            <div key={prod.id} className="min-w-[260px] max-w-[260px] snap-start glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group">
              <div className="h-40 relative flex items-center justify-center mb-4 bg-white/40 dark:bg-black/20 rounded-2xl">
                <img src={prod.image} alt={prod.name} className="h-32 object-contain group-hover:scale-110 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal" />
                {prod.tag && (
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded uppercase ${prod.tag === 'SALE' ? 'bg-red-500 text-white' : 'bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-[#0A0A0A]'}`}>
                    {prod.tag}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{prod.team}</p>
                  <h4 className="font-semibold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2">{prod.name}</h4>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-lg text-[#007A4D] dark:text-[#CCFF00]">${prod.price.toFixed(2)} {prod.originalPrice && <span className="text-sm text-slate-400 line-through ml-1">${prod.originalPrice.toFixed(2)}</span>}</p>
                  <button onClick={() => onAddToCart(prod)} className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-[#007A4D] dark:hover:bg-[#CCFF00] hover:text-white dark:hover:text-black transition-colors">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Star Athletes Slider */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 pb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline-lg text-3xl md:text-4xl text-slate-900 dark:text-white">Star Athletes</h3>
          <button onClick={() => setActiveView("players")} className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            View Directory <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x">
          {players.map((player) => (
            <div key={player.id} onClick={() => onSelectPlayer(player)} className="min-w-[280px] max-w-[280px] snap-start glass-card glass-card-hover rounded-3xl p-6 cursor-pointer group">
              <div className="flex justify-between items-start z-10 mb-2">
                <span className="text-xs font-bold text-slate-400">OVR {player.rating}</span>
                <span className="material-symbols-outlined text-[#007A4D] dark:text-[#CCFF00] text-sm">trending_up</span>
              </div>
              <PlayerPhoto name={player.name} src={player.image} variant="box" className="w-full" zoomOnHover />
              <div className="text-center mt-4 border-t border-slate-200 dark:border-white/10 pt-4">
                <h4 className="font-bold text-xl text-slate-900 dark:text-white truncate">{player.name}</h4>
                <p className="text-sm text-slate-500 font-medium">{player.club}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};