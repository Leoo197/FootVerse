import React, { useState } from "react";
import { PlayerPhoto } from "./PlayerPhoto";
import { Player } from "../types";

interface PlayerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  defaultPlayer1?: Player;
}

export const PlayerCompareModal: React.FC<PlayerCompareModalProps> = ({
  isOpen,
  onClose,
  players,
  defaultPlayer1,
}) => {
  const [p1Id, setP1Id] = useState<string>(defaultPlayer1 ? defaultPlayer1.id : players[0]?.id || "p1");
  const [p2Id, setP2Id] = useState<string>(players[1]?.id || "p2");

  if (!isOpen) return null;

  const player1 = players.find((p) => p.id === p1Id) || players[0];
  const player2 = players.find((p) => p.id === p2Id) || players[1] || players[0];

  const compareStats = [
    { label: "Overall Rating", v1: player1.rating, v2: player2.rating, max: 100 },
    { label: "Season Goals", v1: player1.goals, v2: player2.goals, max: 40 },
    { label: "Assists", v1: player1.assists, v2: player2.assists, max: 20 },
    { label: "Pass Accuracy (%)", v1: player1.passAccuracy, v2: player2.passAccuracy, max: 100 },
    { label: "Sprint Speed (km/h)", v1: player1.sprintSpeed, v2: player2.sprintSpeed, max: 40 },
    { label: "Stamina (%)", v1: player1.stamina, v2: player2.stamina, max: 100 },
    { label: "Recovery Rate (%)", v1: player1.recoveryRate, v2: player2.recoveryRate, max: 100 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#081425] border border-black/10 dark:border-white/10 rounded-2xl max-w-4xl w-full p-6 text-gray-900 dark:text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#026e00] dark:text-[#79ff5b] text-2xl">
              compare_arrows
            </span>
            <h2 className="font-headline-lg text-2xl md:text-3xl uppercase">
              Head-To-Head Tactical Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-500"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Player Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Player 1 Card Selector */}
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 flex flex-col items-center text-center">
            <select
              value={p1Id}
              onChange={(e) => setP1Id(e.target.value)}
              className="w-full bg-white dark:bg-[#040e1f] border border-black/10 dark:border-white/10 rounded-lg p-2 font-headline-md text-base text-gray-900 dark:text-white mb-3 focus:outline-none"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.club})
                </option>
              ))}
            </select>
            <PlayerPhoto name={player1.name} src={player1.image} variant="avatar" className="w-24 mb-2" />
            <h3 className="font-headline-lg text-xl text-gray-900 dark:text-white">
              {player1.name}
            </h3>
            <p className="text-xs font-label-mono text-[#026e00] dark:text-[#79ff5b] uppercase font-bold">
              {player1.position} • {player1.club}
            </p>
          </div>

          {/* Player 2 Card Selector */}
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/10 dark:border-white/10 flex flex-col items-center text-center">
            <select
              value={p2Id}
              onChange={(e) => setP2Id(e.target.value)}
              className="w-full bg-white dark:bg-[#040e1f] border border-black/10 dark:border-white/10 rounded-lg p-2 font-headline-md text-base text-gray-900 dark:text-white mb-3 focus:outline-none"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.club})
                </option>
              ))}
            </select>
            <PlayerPhoto name={player2.name} src={player2.image} variant="avatar" className="w-24 mb-2" />
            <h3 className="font-headline-lg text-xl text-gray-900 dark:text-white">
              {player2.name}
            </h3>
            <p className="text-xs font-label-mono text-[#026e00] dark:text-[#79ff5b] uppercase font-bold">
              {player2.position} • {player2.club}
            </p>
          </div>
        </div>

        {/* Comparative Bars */}
        <div className="space-y-4 bg-black/5 dark:bg-white/5 p-6 rounded-xl border border-black/10 dark:border-white/10">
          {compareStats.map((stat, idx) => {
            const p1Pct = Math.min(100, (Number(stat.v1) / stat.max) * 100);
            const p2Pct = Math.min(100, (Number(stat.v2) / stat.max) * 100);
            const p1Wins = Number(stat.v1) >= Number(stat.v2);

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-label-mono text-gray-600 dark:text-gray-300">
                  <span
                    className={`font-bold ${
                      p1Wins ? "text-[#026e00] dark:text-[#79ff5b]" : "text-gray-500"
                    }`}
                  >
                    {stat.v1}
                  </span>
                  <span className="uppercase font-headline-md text-sm text-gray-900 dark:text-white">
                    {stat.label}
                  </span>
                  <span
                    className={`font-bold ${
                      !p1Wins ? "text-[#026e00] dark:text-[#79ff5b]" : "text-gray-500"
                    }`}
                  >
                    {stat.v2}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                  {/* Left Player Bar (aligned right) */}
                  <div className="flex justify-end bg-transparent">
                    <div
                      style={{ width: `${p1Pct}%` }}
                      className={`h-full rounded-l-full transition-all duration-500 ${
                        p1Wins
                          ? "bg-[#026e00] dark:bg-[#79ff5b]"
                          : "bg-gray-400 dark:bg-gray-600"
                      }`}
                    />
                  </div>

                  {/* Right Player Bar (aligned left) */}
                  <div className="flex justify-start bg-transparent">
                    <div
                      style={{ width: `${p2Pct}%` }}
                      className={`h-full rounded-r-full transition-all duration-500 ${
                        !p1Wins
                          ? "bg-[#026e00] dark:bg-[#79ff5b]"
                          : "bg-gray-400 dark:bg-gray-600"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
