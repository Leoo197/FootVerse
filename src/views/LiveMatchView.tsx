// src/views/LiveMatchView.tsx
import React, { useState } from "react";
import { PageCarousel } from "../components/PageCarousel";
import { PageView } from "../types";

interface LiveMatchViewProps {
  setActiveView: (view: PageView) => void;
}

export const LiveMatchView: React.FC<LiveMatchViewProps> = ({ setActiveView }) => {
  const [activeTab, setActiveTab] = useState<"stream" | "stats" | "lineups" | "commentary">("stream");
  const [comments, setComments] = useState([
    { time: "89'", text: "Yellow card issued for tactical foul in midfield.", team: "MCI" },
    { time: "85'", text: "Incredible save by the goalkeeper to deny a 30-yard curler!", team: "ARS" },
    { time: "74'", text: "GOAL! Erling Haaland slots it home into the bottom corner with power.", team: "MCI" },
    { time: "60'", text: "Substitution: Fresh legs brought on to pressure the flanks.", team: "ARS" },
    { time: "45'", text: "Second half underway. Intensity remains sky high.", team: "GEN" }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([{ time: "LIVE", text: newComment, team: "YOU" }, ...comments]);
    setNewComment("");
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in-up">
      <PageCarousel slides={[
        { id: "match-1", tag: "Match Center Demo", title: "EXPLORE THE MATCH CENTER DEMO", subtitle: "Explore a static sample of match panels and locally entered fan comments. No live stream or live data feed is connected.", buttonText: "Explore Demo", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80", onAction: () => window.scrollTo({ top: 650, behavior: "smooth" }) },
        { id: "match-2", tag: "Match Intelligence", title: "READ THE GAME", subtitle: "Break down possession, shots, formations and key moments as they happen.", buttonText: "View Match Stats", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvGzDoUdxZdXQ9XjoPhLpm5PPRigA5OLCvYgNcFBZPMRsBiiGxybK3nqP0Yi3qN0ag6VaXHwZUB5Lmc7DFESdBM1IVN0wJa9uS3MsER0OKyS_GUZmz2Y_mRpngpzAk9EBiBjEslNWau7N9rIL_UEcvu8Os7Eux2ZMKP_vLpeJalhZSLaL5PCTun_gOrmDBdg99vgJXpVCFZUmwxtA-IPcH-tjlADVaxse4V-oswDvbwPYNvU7y9r8p4_fdnCV7qnk8jnBj_U1OhMsB", onAction: () => window.scrollTo({ top: 950, behavior: "smooth" }) }
      ]} />
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Top Header info */}
      <div className="flex items-center justify-between">
        <button onClick={() => setActiveView("home")} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Return Home
        </button>
        <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-full animate-pulse flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white"></span> SAMPLE MATCH • STATIC DATA
        </span>
      </div>

      {/* Main Stream Player Box */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-60 scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white">
              <span className="font-bold text-lg">Manchester City</span>
              <span className="text-2xl font-black text-[#CCFF00]">2 - 1</span>
              <span className="font-bold text-lg">Arsenal</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-black/60 transition-colors">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button className="w-20 h-20 rounded-full bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">play_arrow</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-white z-10 text-sm font-medium">
            <span>Sample Match Visual</span>
            <span>Illustrative UI • No live stream</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 px-6">
          {[{ id: "stream", label: "Live Feed" }, { id: "stats", label: "Match Stats" }, { id: "lineups", label: "Lineups" }, { id: "commentary", label: "Fan Chatter" }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${
                activeTab === tab.id 
                  ? "border-[#007A4D] dark:border-[#CCFF00] text-[#007A4D] dark:text-[#CCFF00]" 
                  : "border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "stream" || activeTab === "commentary" ? (
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <h3 className="font-headline-md text-2xl text-slate-900 dark:text-white">Sample Commentary & Fan Chat</h3>
              
              <form onSubmit={handleAddComment} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Add a demo comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-white/60 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#007A4D] dark:focus:border-[#CCFF00]"
                />
                <button type="submit" className="bg-[#007A4D] dark:bg-[#CCFF00] text-white dark:text-black font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity">
                  Post
                </button>
              </form>

              <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5">
                    <span className="font-mono font-bold text-xs px-2 py-1 bg-[#007A4D]/10 dark:bg-[#CCFF00]/10 text-[#007A4D] dark:text-[#CCFF00] rounded">{c.time}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.text}</p>
                      <span className="text-xs text-slate-500">{c.team} Team Feed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "stats" ? (
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="font-headline-md text-2xl text-slate-900 dark:text-white">Match Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1 text-slate-900 dark:text-white">
                    <span>58%</span><span>Possession</span><span>42%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#007A4D] dark:bg-[#CCFF00] h-full" style={{ width: '58%' }} />
                    <div className="bg-slate-400 h-full flex-1" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1 text-slate-900 dark:text-white">
                    <span>7</span><span>Shots on Target</span><span>4</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#007A4D] dark:bg-[#CCFF00] h-full" style={{ width: '64%' }} />
                    <div className="bg-slate-400 h-full flex-1" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1 text-slate-900 dark:text-white">
                    <span>6</span><span>Corner Kicks</span><span>3</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#007A4D] dark:bg-[#CCFF00] h-full" style={{ width: '66%' }} />
                    <div className="bg-slate-400 h-full flex-1" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="font-headline-md text-2xl text-slate-900 dark:text-white">Starting XI Formations</h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#007A4D] dark:text-[#CCFF00]">Manchester City (4-3-3)</h4>
                  <ul className="space-y-1 text-slate-700 dark:text-gray-300">
                    <li>Ederson (GK)</li>
                    <li>Walker, Dias, Akanji, Gvardiol</li>
                    <li>Rodri, De Bruyne, Silva</li>
                    <li>Foden, Haaland, Doku</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-red-500">Arsenal (4-2-3-1)</h4>
                  <ul className="space-y-1 text-slate-700 dark:text-gray-300">
                    <li>Raya (GK)</li>
                    <li>White, Saliba, Gabriel, Timber</li>
                    <li>Partey, Rice</li>
                    <li>Saka, Ødegaard, Martinelli</li>
                    <li>Havertz</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-headline-md text-xl text-slate-900 dark:text-white">Match Overview</h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Stadium:</span>
                <span className="font-bold text-slate-900 dark:text-white">Etihad Stadium</span>
              </div>
              <div className="flex justify-between">
                <span>Referee:</span>
                <span className="font-bold text-slate-900 dark:text-white">Michael Oliver</span>
              </div>
              <div className="flex justify-between">
                <span>Weather:</span>
                <span className="font-bold text-slate-900 dark:text-white">Clear 14°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};