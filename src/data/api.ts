import { Player, Team, Product, MatchResult, UserProfile, Order, CartItem } from "../types";

export interface Discount { code: string; percent: number }

export interface BootstrapData {
  players: Player[];
  teams: Team[];
  products: Product[];
  matches: MatchResult[];
  discounts: Discount[];
  /** null when nobody is logged in */
  user: UserProfile | null;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
  return body as T;
}

/** Loads players, clubs, store, matches and the signed-in fan from the SQL database. */
export const fetchBootstrap = () => request<BootstrapData>("/api/bootstrap");

/** Stores a new order; the server prices it from the database and returns the saved order. */
export const submitOrder = (items: CartItem[], discountCode: string) =>
  request<{ order: Order; xp: number; rank: string }>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      discountCode: discountCode || undefined,
      items: items.map((i) => ({
        productId: i.product.id,
        size: i.selectedSize,
        quantity: i.quantity,
        customization: i.customizationText || undefined,
      })),
    }),
  });

/** Create an account; the server logs the new fan in straight away. */
export const signup = (name: string, email: string, password: string) =>
  request<{ user: UserProfile }>("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then((r) => r.user);

export const login = (email: string, password: string) =>
  request<{ user: UserProfile }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.user);

export const logout = () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
