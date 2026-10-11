import React, { useRef } from "react";
import { PlayerPhoto } from "../components/PlayerPhoto";
import { Player, Product } from "../types";
import { PageCarousel } from "../components/PageCarousel";

interface PlayersViewProps {
  players: Player[];
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  products: Product[];
  onOpenCompare: () => void;
  onOpenAiAnalysis: (prompt: string, type: "scout" | "match") => void;
  onAddToCart: (product: Product) => void;
}

export const PlayersView: React.FC<PlayersViewProps> = ({
  players, selectedPlayer, setSelectedPlayer, products, onOpenCompare, onOpenAiAnalysis, onAddToCart
}) => {
  const topRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' });

  const handleSelectPlayer = (p: Player) => {
    setSelectedPlayer(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playerSlides = [
    {
      id: "ps1",
      tag: "Rising Stars",
      title: "THE NEXT GENERATION",
      subtitle: "Discover the young talent making waves across European leagues this season.",
      buttonText: "Scout Talent",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-Wmkxt2VkMboRyujrMjcjX7EKbdF_z-aSgiL-pGna_yeiH1--rvJOSc_ObXuEyp8Ome8PaGQxwhBxBY12dIBpvH6mpnENyVIhX1DBkOAYv8PRWFjTtMwjnKk6PRqeJADxtDXLbbg_1A5kAoVhjHH6fgGTnhnXF3gCkiZ-AA15lwwueSUdRch0HZhWCOYnOkws_Z6GX2JyNW36crB4Jkv98ELXIvgCSTco3m2XXP2a54aBIyRYFKTS-LMnkXO95-y1NaL8OujlTNtV",
      onAction: () => window.scrollTo({ top: 800, behavior: 'smooth' })
    },
    {
      id: "ps2",
      tag: "Golden Boot Race",
      title: "RACE TO THE TOP",
      subtitle: "Track the elite strikers battling it out for the ultimate goalscoring prize.",
      buttonText: "View Leaders",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjQu_Kkwto9EgKgWXP21wA-WtfZsL4RDeu08jpuD-Sbuhy1d-LaSwZhfqT0WSZQOhF2da7tJA9y3AEOy6UF1j28X1vPGC-D0WOLlMQtLiIZpzS33i1HWwUBZBjOa7F1j179swazWzJwdB-gbK1-nI87OYfYQXAdGaP1VO3j7oEYP4hhRV5571M2fLI3JtJgXSdTMc2PkwKPS_UsgHXqmVnyuBxjWUNeyttFwU339S71WO7ERMfTQg_MYk8s_1CDOc3WkM2LLlMf_q5",
      onAction: () => window.scrollTo({ top: 800, behavior: 'smooth' })
    }
  ];

  if (!selectedPlayer) {
    const starOfTheWeek = players[0];
    const trending = players.slice(1, 4);

    return (
      <div className="space-y-12 pb-20 animate-fade-in-up">
        
        <PageCarousel slides={playerSlides} />

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div onClick={() => handleSelectPlayer(starOfTheWeek)} className="lg:col-span-2 glass-card glass-card-hover rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 cursor-pointer relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 bg-[#007A4D]/20 dark:bg-[#CCFF00]/20 w-64 h-64 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex-1 space-y-4 relative z-10">
                <span className="inline-block px-3 py-1 bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black text-xs font-bold rounded uppercase">Star of the Week</span>
                <h2 className="font-display-lg text-5xl md:text-6xl text-slate-900 dark:text-white leading-none">{starOfTheWeek.name}</h2>
                <p className="text-slate-600 dark:text-gray-300 font-medium text-lg">{starOfTheWeek.lastMatch}</p>
              </div>
              <PlayerPhoto name={starOfTheWeek.name} src={starOfTheWeek.image} variant="box" className="w-48 relative z-10 shadow-lg" zoomOnHover />
            </div>
            
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Trending Now</h3>
              {trending.map(p => (
                <div key={p.id} onClick={() => handleSelectPlayer(p)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                  <PlayerPhoto name={p.name} src={p.image} variant="avatar" className="w-12" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h4>
                    <p className="text-xs text-slate-500">{p.club}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-headline-lg text-3xl text-slate-900 dark:text-white">All Players Directory</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {players.map(p => (
                <div key={p.id} onClick={() => handleSelectPlayer(p)} className="glass-card glass-card-hover rounded-3xl p-5 cursor-pointer group text-center flex flex-col items-center">
                  <PlayerPhoto name={p.name} src={p.image} variant="box" className="w-full mb-4" zoomOnHover />
                  <h4 className="font-bold text-slate-900 dark:text-white truncate w-full">{p.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{p.club}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DOSSIER VIEW
  const similarAthletes = players.filter(p => p.positionCategory === selectedPlayer.positionCategory && p.id !== selectedPlayer.id);
  const playerMerch = products.filter(prod => prod.team === selectedPlayer.club || prod.team === "FootVerse Command");

  const dossierSlides = [
    { id: "dossier-1", tag: "Player Spotlight", title: selectedPlayer.name, subtitle: `${selectedPlayer.club} • ${selectedPlayer.position}. Dive into form, season numbers, recent performances and related gear.`, buttonText: "View Player Data", image: selectedPlayer.image, onAction: () => window.scrollTo({ top: 750, behavior: "smooth" }) },
    { id: "dossier-2", tag: "Performance Focus", title: "FORM & IMPACT", subtitle: "Compare this player's output with other elite performers from the same position.", buttonText: "Compare Players", image: selectedPlayer.image, onAction: () => onOpenCompare() }
  ];

  return (
    <div ref={topRef} className="space-y-12 pb-20 max-w-[1440px] mx-auto px-4 md:px-8 animate-fade-in-up pt-8">
      <PageCarousel slides={dossierSlides} />
      
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button onClick={() => setSelectedPlayer(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Directory
        </button>
        <div className="flex gap-3">
          <button onClick={onOpenCompare} className="px-4 py-2 glass-card text-slate-700 dark:text-white font-headline-md text-sm rounded-xl flex items-center gap-2 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-lg">compare_arrows</span> Compare
          </button>
          <button onClick={() => onOpenAiAnalysis(`Generate scout report for ${selectedPlayer.name}`, "scout")} className="px-4 py-2 bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-[#0A0F16] font-headline-md text-sm rounded-xl flex items-center gap-2 shadow-sm transition-colors hover:opacity-90">
            <span className="material-symbols-outlined text-lg">auto_awesome</span> AI Scout Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 glass-card rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <span className="absolute top-6 left-6 text-sm font-bold text-slate-400">OVR {selectedPlayer.rating}</span>
          <div className="w-56 mb-6 relative">
            <div className="absolute inset-0 bg-[#007A4D]/10 dark:bg-[#CCFF00]/10 rounded-full blur-3xl"></div>
            <PlayerPhoto name={selectedPlayer.name} src={selectedPlayer.image} variant="box" className="w-full relative z-10 shadow-lg" />
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl text-slate-900 dark:text-white mb-2">{selectedPlayer.name}</h1>
          <p className="font-medium text-slate-600 dark:text-gray-300 text-lg mb-6">{selectedPlayer.position} • {selectedPlayer.club}</p>
          
          {selectedPlayer.socials && (
            <div className="flex gap-4 mb-4">
              {selectedPlayer.socials.instagram && (
                <span className="flex items-center gap-1 text-sm font-semibold text-pink-600 dark:text-pink-400">
                   <span className="material-symbols-outlined text-base">photo_camera</span> {selectedPlayer.socials.instagram}
                </span>
              )}
              {selectedPlayer.socials.twitter && (
                <span className="flex items-center gap-1 text-sm font-semibold text-blue-500">
                   <span className="material-symbols-outlined text-base">tag</span> {selectedPlayer.socials.twitter}
                </span>
              )}
            </div>
          )}
          
          <p className="text-sm text-slate-500 italic max-w-sm">"{selectedPlayer.bio || 'Elite professional athlete.'}"</p>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#007A4D]/10 dark:bg-[#CCFF00]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#007A4D] dark:text-[#CCFF00]">sports_score</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Last Match Performance</p>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedPlayer.lastMatch || "Data Unavailable"}</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-center text-center">
              <p className="text-slate-500 font-semibold text-sm mb-2">Market Value</p>
              <h4 className="font-display-lg text-[#007A4D] dark:text-[#CCFF00] text-4xl md:text-5xl">{selectedPlayer.marketValue}</h4>
            </div>
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-center text-center">
              <p className="text-slate-500 font-semibold text-sm mb-2">Season Goals</p>
              <h4 className="font-display-lg text-[#007A4D] dark:text-[#CCFF00] text-4xl md:text-5xl">{selectedPlayer.goals}</h4>
            </div>
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-center text-center">
              <p className="text-slate-500 font-semibold text-sm mb-2">Pass Accuracy</p>
              <h4 className="font-display-lg text-slate-900 dark:text-white text-4xl md:text-5xl">{selectedPlayer.passAccuracy}%</h4>
            </div>
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-center text-center">
              <p className="text-slate-500 font-semibold text-sm mb-2">Sprint Speed</p>
              <h4 className="font-display-lg text-slate-900 dark:text-white text-4xl md:text-5xl">{selectedPlayer.sprintSpeed} <span className="text-xl">km/h</span></h4>
            </div>
          </div>
        </div>
      </div>

      {/* Moved Similar Athletes to the Middle with exact 4-item widths and arrow controls */}
      <section className="pt-8 space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
          <h3 className="font-headline-lg text-3xl text-slate-900 dark:text-white">Similar Athletes</h3>
          <div className="flex gap-2">
            <button onClick={scrollLeft} className="p-2 rounded-full glass-card hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button onClick={scrollRight} className="p-2 rounded-full glass-card hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        
        {similarAthletes.length > 0 ? (
          <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar snap-x scroll-smooth">
            {similarAthletes.map((p) => (
              <div 
                key={p.id} 
                onClick={() => handleSelectPlayer(p)} 
                // Set explicitly to width 25% minus gaps to fit exactly 4 large cards on screen
                className="flex-none w-[calc(25%-1.125rem)] min-w-[240px] snap-start cursor-pointer group p-6 rounded-3xl text-center glass-card hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                <div className="w-[150px] mx-auto mb-4 rounded-full border-2 border-transparent group-hover:border-[#007A4D] dark:group-hover:border-[#CCFF00] transition-colors p-1">
                  <PlayerPhoto name={p.name} src={p.image} variant="avatar" className="w-full" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">{p.name}</h4>
                <p className="text-sm text-slate-500 font-medium">{p.club}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No similar athletes found in this category.</p>
        )}
      </section>

      {/* Merch now at the bottom */}
      {playerMerch.length > 0 && (
        <section className="pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
          <h3 className="font-headline-lg text-2xl text-slate-900 dark:text-white">Shop Their Gear</h3>
          <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar snap-x">
            {playerMerch.map(prod => (
              <div key={prod.id} className="min-w-[220px] max-w-[220px] snap-start glass-card p-4 rounded-3xl text-center group cursor-pointer">
                <img src={prod.image} className="h-32 w-full object-contain mix-blend-multiply dark:mix-blend-normal mb-3 group-hover:scale-105 transition-transform" alt={prod.name} />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{prod.name}</h4>
                <p className="font-bold text-[#007A4D] dark:text-[#CCFF00] mt-1">${prod.price}</p>
                <button onClick={() => onAddToCart(prod)} className="mt-3 w-full py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-80">Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};