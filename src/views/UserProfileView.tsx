import React, { useState } from "react";
import { UserProfile, Player, Team, PageView } from "../types";
import { PlayerPhoto } from "../components/PlayerPhoto";
import { UserAvatar } from "../components/UserAvatar";

interface UserProfileViewProps {
  user: UserProfile;
  allPlayers: Player[];
  allTeams: Team[];
  onSelectPlayer: (player: Player) => void;
  onSelectTeam: (team: Team) => void;
  setActiveView: (view: PageView) => void;
  onLogout: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user, allPlayers, allTeams, onSelectPlayer, onSelectTeam, setActiveView, onLogout,
}) => {
  const [activeFavTab, setActiveFavTab] = useState<"players" | "teams">("players");

  const favPlayers = allPlayers.filter((p) => user.favoritePlayerIds.includes(p.id));
  const favTeams = allTeams.filter((t) => user.favoriteTeamIds.includes(t.id));


  return (
    <div className="space-y-8 pb-16 animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
      
      <section className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#007A4D]/20 p-1 flex-shrink-0">
          <UserAvatar name={user.name} src={user.avatar} className="w-full h-full text-4xl" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="font-display-lg text-4xl md:text-5xl text-slate-900 dark:text-white leading-none">
            {user.name}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            <span>ID: {user.commandId}</span>
            <span>Joined {new Date(user.joined + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            <span>{user.membership}</span>
            <span className="text-[#007A4D] dark:text-[#CCFF00] font-bold">{user.xp} XP</span>
          </div>
        </div>
        <button onClick={onLogout} className="px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-300 dark:border-white/15 text-slate-700 dark:text-white hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">logout</span> Log out
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          <section className="glass-card p-6 rounded-3xl space-y-6">
            <h2 className="font-headline-md text-2xl text-slate-900 dark:text-white">Recent Purchases</h2>
            {user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-white/30 dark:bg-black/20 flex gap-4 border border-white/40 dark:border-white/5">
                    <img src={order.items[0]?.product.image} alt="Product" className="w-16 h-16 rounded-xl object-cover mix-blend-multiply dark:mix-blend-normal" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{order.items[0]?.product.name}</h3>
                      <p className="text-sm text-slate-500">Status: {order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No recent purchases found.</p>
            )}
          </section>

          <section className="glass-card p-6 rounded-3xl space-y-4">
            <h2 className="font-headline-md text-2xl text-slate-900 dark:text-white">Account Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 glass-card rounded-2xl text-left opacity-75">
                <p className="font-bold text-slate-900 dark:text-white">Security & 2FA</p>
                <p className="text-sm text-slate-500">Not available in this academic demo.</p>
              </div>
              <div className="p-4 glass-card rounded-2xl text-left opacity-75">
                <p className="font-bold text-slate-900 dark:text-white">Payment Methods</p>
                <p className="text-sm text-slate-500">No payment methods are stored.</p>
              </div>
            </div>
          </section>

        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h2 className="font-headline-md text-2xl text-slate-900 dark:text-white">Favorites</h2>
            
            <div className="flex gap-4 border-b border-black/5 dark:border-white/5 pb-2">
              <button onClick={() => setActiveFavTab("players")} className={`text-sm font-bold ${activeFavTab === "players" ? "text-[#007A4D] dark:text-[#CCFF00]" : "text-slate-500"}`}>Athletes</button>
              <button onClick={() => setActiveFavTab("teams")} className={`text-sm font-bold ${activeFavTab === "teams" ? "text-[#007A4D] dark:text-[#CCFF00]" : "text-slate-500"}`}>Clubs</button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-2">
              {activeFavTab === "players" ? favPlayers.map((p) => (
                <div key={p.id} onClick={() => { onSelectPlayer(p); }} className="p-3 bg-white/40 dark:bg-black/20 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <PlayerPhoto name={p.name} src={p.image} variant="avatar" className="w-10" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</p>
                </div>
              )) : favTeams.map((t) => (
                <div key={t.id} onClick={() => { onSelectTeam(t); setActiveView("teams"); }} className="p-3 bg-white/40 dark:bg-black/20 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <img src={t.logo} alt={t.name} className="w-10 h-10 object-contain p-1 rounded-lg" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
};