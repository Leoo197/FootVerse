import React from "react";
import { MatchResult } from "../types";

interface LiveTickerProps {
  matchResults: MatchResult[];
  onSelectMatch: (match: MatchResult) => void;
}

/** Legacy ticker intentionally disabled: FootVerse now uses contextual hero carousels. */
export const LiveTicker: React.FC<LiveTickerProps> = () => null;
