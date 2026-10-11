import React, { useState, useEffect } from "react";

interface AiTacticalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  initialType?: "scout" | "match";
}

export const AiTacticalModal: React.FC<AiTacticalModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = "Analyze current top players performance, tactical trends, and transfer fitness.",
  initialType = "scout",
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [type, setType] = useState<"scout" | "match">(initialType);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialType) setType(initialType);
  }, [initialPrompt, initialType]);

  const handleGenerate = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setIsLoading(true);
    setError("");
    setAnalysisText("");

    try {
      const res = await fetch("/api/ai/tactical-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          query: q,
          context: { timestamp: new Date().toISOString() },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to retrieve AI analysis.");
      }

      setAnalysisText(data.text);
    } catch (err: any) {
      setError(err.message || "Error connecting to AI Command Engine.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !analysisText && !isLoading && initialPrompt) {
      handleGenerate(initialPrompt);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#081425] border border-black/10 dark:border-white/10 rounded-2xl max-w-3xl w-full p-6 text-gray-900 dark:text-white shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-3xl animate-pulse">
              auto_awesome
            </span>
            <div>
              <h2 className="font-headline-lg text-2xl uppercase leading-tight">
                PRO COMMAND AI TACTICAL ENGINE
              </h2>
              <p className="text-xs font-label-mono text-gray-500 dark:text-gray-400">
                Powered by Gemini 3.6 Flash Server Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-500"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Input & Preset Prompt Selection */}
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setType("scout")}
              className={`px-3 py-1 rounded-lg text-xs font-headline-md uppercase ${
                type === "scout"
                  ? "bg-[#026e00] dark:bg-[#79ff5b] text-white dark:text-[#081425] font-bold"
                  : "bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300"
              }`}
            >
              Scout Report
            </button>
            <button
              onClick={() => setType("match")}
              className={`px-3 py-1 rounded-lg text-xs font-headline-md uppercase ${
                type === "match"
                  ? "bg-[#026e00] dark:bg-[#79ff5b] text-white dark:text-[#081425] font-bold"
                  : "bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300"
              }`}
            >
              Match Analysis
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask for scout report, transfer value, or match tactics..."
              className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#026e00] dark:focus:border-[#79ff5b]"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#026e00] dark:bg-[#79ff5b] text-white dark:text-[#081425] font-headline-md text-sm rounded-xl uppercase font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">
                  refresh
                </span>
              ) : (
                <span className="material-symbols-outlined text-lg">send</span>
              )}
              <span>Analyze</span>
            </button>
          </div>
        </div>

        {/* Response Container */}
        <div className="flex-1 overflow-y-auto bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-black/5 dark:border-white/10 font-body-md text-sm leading-relaxed whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 space-y-3">
              <span className="material-symbols-outlined text-4xl text-amber-500 animate-spin">
                auto_awesome
              </span>
              <p className="font-headline-md text-lg text-gray-800 dark:text-gray-200 uppercase">
                Generating Tactical Breakdown...
              </p>
              <p className="text-xs font-label-mono">
                Generating text from the provided query and context...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-label-mono">
              <strong>Engine Alert:</strong> {error}
            </div>
          ) : analysisText ? (
            <div className="text-gray-800 dark:text-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10 text-xs font-label-mono text-gray-500">
                <span>STATUS: AI-GENERATED • NOT INDEPENDENTLY VERIFIED</span>
                <span>CONFIDENCE: NOT MEASURED</span>
              </div>
              <p>{analysisText}</p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Select or type a query to generate AI-written football analysis. Results are not independently verified.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
