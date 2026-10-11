import React from "react";
import { PlayerPhoto } from "../components/PlayerPhoto";
import { Team, Player, PageView } from "../types";
import { PageCarousel } from "../components/PageCarousel";

interface TeamsViewProps {
  teams: Team[];
  players: Player[];
  selectedTeam: Team;
  setSelectedTeam: (team: Team) => void;
  onSelectPlayer: (player: Player) => void;
  setActiveView: (view: PageView) => void;
  onOpenAiAnalysis: (prompt: string, type: "scout" | "match") => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams, players, selectedTeam, setSelectedTeam, onSelectPlayer, setActiveView, onOpenAiAnalysis
}) => {
  const teamPlayers = players.filter((p) => p.club === selectedTeam.name);

  const teamSlides = [
    {
      id: "ts1",
      tag: "Champions League Contenders",
      title: "ROAD TO GLORY",
      subtitle: "Analyze the top formations and club strategies dominating Europe this season.",
      buttonText: "View Tactics",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA",
      onAction: () => window.scrollTo({ top: 800, behavior: 'smooth' })
    },
    {
      id: "ts2",
      tag: "Derby Day",
      title: "RIVALRY RENEWED",
      subtitle: "The biggest match of the calendar is approaching. Get team news and predicted lineups.",
      buttonText: "Read Match Preview",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvGzDoUdxZdXQ9XjoPhLpm5PPRigA5OLCvYgNcFBZPMRsBiiGxybK3nqP0Yi3qN0ag6VaXHwZUB5Lmc7DFESdBM1IVN0wJa9uS3MsER0OKyS_GUZmz2Y_mRpngpzAk9EBiBjEslNWau7N9rIL_UEcvu8Os7Eux2ZMKP_vLpeJalhZSLaL5PCTun_gOrmDBdg99vgJXpVCFZUmwxtA-IPcH-tjlADVaxse4V-oswDvbwPYNvU7y9r8p4_fdnCV7qnk8jnBj_U1OhMsB",
      onAction: () => window.scrollTo({ top: 800, behavior: 'smooth' })
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-fade-in-up">
      <PageCarousel slides={teamSlides} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
        <section>
          <h3 className="font-headline-lg text-2xl text-slate-900 dark:text-white mb-6">Select Club Hub</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`flex-shrink-0 snap-start flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
                  selectedTeam.id === team.id
                    ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg"
                    : "glass-card hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300"
                }`}
              >
                <img src={team.logo} alt={team.shortName} className="w-8 h-8 object-contain bg-white/50 rounded-full p-1" />
                <span className="font-bold whitespace-nowrap">{team.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none flex justify-end">
             <img src={selectedTeam.logo} className="h-[150%] object-contain translate-x-1/4 -translate-y-1/4" alt="" />
          </div>
          <div className="relative z-10">
            <h1 className="font-display-lg text-5xl md:text-7xl text-slate-900 dark:text-white mb-2">{selectedTeam.name}</h1>
            {selectedTeam.slogan ? (
              <p className="font-headline-md text-slate-600 dark:text-gray-300 text-lg mb-8 italic">"{selectedTeam.slogan}"</p>
            ) : (
              <p className="font-headline-md text-slate-500 text-lg mb-8">{selectedTeam.league}</p>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">World Rank</p>
                <p className="font-display-lg text-4xl text-[#007A4D] dark:text-[#CCFF00]">#{selectedTeam.rank}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">UCL Titles</p>
                <p className="font-display-lg text-4xl text-[#007A4D] dark:text-[#CCFF00]">{selectedTeam.uclTitles}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Win Rate</p>
                <p className="font-display-lg text-4xl text-slate-900 dark:text-white">{selectedTeam.winRate}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Established</p>
                <p className="font-display-lg text-4xl text-slate-900 dark:text-white">{selectedTeam.established}</p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
               <button onClick={() => setActiveView("merch")} className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl transition-opacity hover:opacity-80">
                 Shop Official Kits
               </button>
               <button onClick={() => onOpenAiAnalysis(`Analyze ${selectedTeam.name} tactics and formation.`, "scout")} className="glass-card font-bold text-slate-800 dark:text-white px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10">
                 AI Tactical Analysis
               </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="font-headline-lg text-3xl text-slate-900 dark:text-white border-b border-black/5 dark:border-white/5 pb-4">First Team Roster</h3>
          {teamPlayers.length === 0 && <p className="text-slate-500 italic">No squad data for this club yet.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamPlayers.map((player) => (
              <div key={player.id} onClick={() => onSelectPlayer(player)} className="glass-card glass-card-hover rounded-3xl p-6 cursor-pointer flex flex-col items-center text-center group">
                <div className="w-32 mb-4 rounded-full border-2 border-transparent group-hover:border-[#007A4D] dark:group-hover:border-[#CCFF00] transition-colors p-0.5">
                  <PlayerPhoto name={player.name} src={player.image} variant="avatar" className="w-full" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{player.name}</h4>
                <p className="text-sm text-slate-500 font-medium">{player.position}</p>
                <div className="mt-4 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-300">
                  OVR {player.rating}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};