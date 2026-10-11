import React, { useState, useEffect } from "react";
import { PlayerPhoto } from "./PlayerPhoto";
import { Player, Team, Product } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  teams: Team[];
  products: Product[];
  onSelectPlayer: (player: Player) => void;
  onSelectTeam: (team: Team) => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen, onClose, players, teams, products, onSelectPlayer, onSelectTeam, onSelectProduct
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayerClick = (player: Player) => {
    onSelectPlayer(player);
    onClose();
  };

  const handleTeamClick = (team: Team) => {
    onSelectTeam(team);
    onClose();
  };

  const handleProductClick = (prod: Product) => {
    onSelectProduct(prod);
    onClose();
  };

  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.club.toLowerCase().includes(query.toLowerCase()));
  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const filteredProducts = products.filter(pr => pr.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-start justify-center pt-24 px-4 transition-opacity">
      <div onClick={(e) => e.stopPropagation()} className="glass-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, clubs, or gear..."
            className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 focus:border-[#007A4D] dark:focus:border-[#CCFF00] font-body-lg text-xl py-3 pl-14 pr-12 text-slate-900 dark:text-white focus:outline-none transition-colors"
          />
        </div>

        {!query && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500 font-medium">Trending:</span>
            {["Haaland", "Real Madrid", "Jersey", "Mbappé", "Boots"].map((tag) => (
              <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-1.5 glass-card hover:bg-[#007A4D]/10 dark:hover:bg-[#CCFF00]/10 rounded-full text-sm text-slate-700 dark:text-gray-200 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
          {filteredPlayers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Athletes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPlayers.map((player) => (
                  <div key={player.id} onClick={() => handlePlayerClick(player)} className="flex items-center gap-3 p-3 glass-card glass-card-hover rounded-xl cursor-pointer">
                    <PlayerPhoto name={player.name} src={player.image} variant="avatar" className="w-12" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{player.name}</p>
                      <p className="text-xs text-slate-500">{player.club} • {player.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTeams.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Clubs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTeams.map((team) => (
                  <div key={team.id} onClick={() => handleTeamClick(team)} className="flex items-center gap-3 p-3 glass-card glass-card-hover rounded-xl cursor-pointer">
                    <img src={team.logo} alt={team.name} referrerPolicy="no-referrer" className="w-12 h-12 object-contain p-1 bg-white rounded-lg" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{team.name}</p>
                      <p className="text-xs text-slate-500">{team.league}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Store Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} onClick={() => handleProductClick(prod)} className="flex items-center gap-3 p-3 glass-card glass-card-hover rounded-xl cursor-pointer">
                    <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{prod.name}</p>
                      <p className="text-sm text-[#007A4D] dark:text-[#CCFF00] font-bold">${prod.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPlayers.length === 0 && filteredTeams.length === 0 && filteredProducts.length === 0 && query && (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p>No results found for "{query}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};