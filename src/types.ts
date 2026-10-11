export type PageView = "home" | "players" | "teams" | "merch" | "checkout" | "user-profile" | "login" | "live-match" | "landing";

export interface Player {
  id: string;
  name: string;
  number: number;
  rank: number;
  position: string;
  positionCategory: "FWD" | "MID" | "DEF" | "GK";
  club: string;
  clubLogo: string;
  nationality: string;
  marketValue: string;
  rating: number;
  goals: number;
  assists: number;
  passAccuracy: number;
  sprintSpeed: number;
  interceptions?: number;
  chancesCreated?: number;
  stamina: number;
  recoveryRate: number;
  fitnessLevel: string;
  image: string;
  loadHistory: number[];
  heatmapData?: { x: number; y: number; intensity: number }[];
  bio?: string;
  lastMatch?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
  };
}

export interface Trophy { year: string; title: string; description: string; tags?: string[]; }
export interface Team { id: string; name: string; shortName: string; rank: number; rating: number; league: string; uclTitles: number; winRate: number; logo: string; banner: string; form: ("W" | "D" | "L")[]; established: string; slogan?: string; timeline: Trophy[]; legends: { name: string; title: string }[]; squadCount: number; }
export interface Product { id: string; name: string; category: "Jerseys" | "Training Gear" | "Accessories" | "Equipment" | "Bundles" | "Shoes" | "Shirts" | "Shorts" | "Collectibles"; team: string; price: number; originalPrice?: number; tag?: "NEW" | "SALE" | "LIMITED"; image: string; description: string; availableSizes?: string[]; }
export interface CartItem { product: Product; quantity: number; selectedSize: string; customizationText?: string; }
export interface Order { id: string; date: string; status: "Shipped" | "Transit" | "Delivered" | "Processing"; items: CartItem[]; total: number; trackingStep: number; }
export interface MatchResult { id: string; date: string; /* ISO yyyy-mm-dd */ homeTeam: string; awayTeam: string; homeScore: number; awayScore: number; league: string; topPerformer: { name: string; avatar: string; }; highlightsUrl?: string; status: "FT" | "LIVE"; minute?: string; }
export interface UserProfile { id: string; name: string; email: string; commandId: string; rank: string; xp: number; joined: string; membership: string; avatar: string; favoritePlayerIds: string[]; favoriteTeamIds: string[]; orders: Order[]; }