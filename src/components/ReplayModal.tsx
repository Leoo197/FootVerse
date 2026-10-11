import React, { useState } from "react";

interface ReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateAiAnalysis: (prompt: string, type: "scout" | "match") => void;
}

export const ReplayModal: React.FC<ReplayModalProps> = ({
  isOpen,
  onClose,
  onGenerateAiAnalysis,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [angle, setAngle] = useState<"Broadcast" | "Tactical Cam" | "Drone 8K">("Broadcast");
  const [speed, setSpeed] = useState<"1.0x" | "0.5x" | "0.25x">("1.0x");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-transparent max-w-4xl w-full p-2 md:p-4 text-white relative overflow-hidden flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start pb-1">
          <div>
            <span className="bg-[#026e00] dark:bg-[#79ff5b] text-white dark:text-[#081425] px-3 py-0.5 rounded font-label-mono text-[10px] uppercase font-bold tracking-widest">
              PRO REPLAY SIMULATOR • 8K ULTRA-WIDE
            </span>
            <h2 className="font-display-lg text-3xl md:text-4xl text-white uppercase tracking-tight mt-1">
              STRIKE OF THE SEASON • ERLING HAALAND (30-YARD THUNDERBOLT)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group shadow-2xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvGzDoUdxZdXQ9XjoPhLpm5PPRigA5OLCvYgNcFBZPMRsBiiGxybK3nqP0Yi3qN0ag6VaXHwZUB5Lmc7DFESdBM1IVN0wJa9uS3MsER0OKyS_GUZmz2Y_mRpngpzAk9EBiBjEslNWau7N9rIL_UEcvu8Os7Eux2ZMKP_vLpeJalhZSLaL5PCTun_gOrmDBdg99vgJXpVCFZUmwxtA-IPcH-tjlADVaxse4V-oswDvbwPYNvU7y9r8p4_fdnCV7qnk8jnBj_U1OhMsB"
            alt="Replay Highlight"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isPlaying ? "opacity-90" : "opacity-50"
            }`}
          />

          {/* HUD Overlays */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-label-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>ANGLE: {angle.toUpperCase()}</span>
            <span className="text-gray-400">|</span>
            <span>SPEED: {speed}</span>
          </div>

          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-label-mono text-xs text-[#79ff5b]">
            xG IMPACT: 0.04 (SPECTACULAR FINISH)
          </div>

          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all"
            >
              <div className="w-20 h-20 bg-[#026e00] rounded-full flex items-center justify-center shadow-2xl scale-100 hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-5xl text-white">
                  play_arrow
                </span>
              </div>
            </button>
          )}

          {/* Timeline Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer relative group">
              <div className="bg-[#79ff5b] h-full w-3/4 group-hover:bg-[#00ff00] transition-all"></div>
            </div>
            <div className="flex justify-between items-center text-xs font-label-mono text-gray-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white p-1"
                >
                  <span className="material-symbols-outlined text-xl">
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
                <span>00:14 / 00:22</span>
              </div>
              <div className="flex items-center gap-2">
                {(["1.0x", "0.5x", "0.25x"] as const).map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSpeed(sp)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      speed === sp ? "bg-[#79ff5b] text-[#081425]" : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Camera Angles */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-label-mono text-xs text-gray-400 uppercase">Camera View:</span>
            {(["Broadcast", "Tactical Cam", "Drone 8K"] as const).map((cam) => (
              <button
                key={cam}
                onClick={() => setAngle(cam)}
                className={`px-3 py-1.5 rounded-lg text-xs font-headline-md uppercase transition-all ${
                  angle === cam
                    ? "bg-[#026e00] dark:bg-[#79ff5b] text-white dark:text-[#081425] font-bold"
                    : "bg-white/10 hover:bg-white/20 text-gray-300"
                }`}
              >
                {cam}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              onGenerateAiAnalysis(
                "Provide a detailed tactical analysis of Erling Haaland's 30-yard thunderbolt strike against Arsenal, including shot velocity, biomechanics, defender positioning, and goalkeeper reaction time.",
                "match"
              );
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#081425] font-headline-md text-sm rounded-lg flex items-center gap-2 uppercase tracking-wider font-bold transition-all shadow-lg"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>Generate AI Match Breakdown</span>
          </button>
        </div>
      </div>
    </div>
  );
};
