import crypto from "crypto";
import type Database from "better-sqlite3";

export class AuthError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export const SESSION_COOKIE = "fv_session";
const SESSION_DAYS = 30;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // seconds

// ---------------------------------------------------------------------
// Passwords: scrypt with a random salt, stored as  scrypt$<salt>$<hash>
// ---------------------------------------------------------------------
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

const DUMMY_HASH = hashPassword("not-a-real-password"); // keeps login timing equal for unknown emails

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

// ---------------------------------------------------------------------
// Sessions: random token in an HttpOnly cookie, only its SHA-256 is stored
// ---------------------------------------------------------------------
const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

export function createSession(db: Database.Database, userId: number): string {
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("DELETE FROM session WHERE expires_at < datetime('now')").run(); // tidy expired rows
  db.prepare("INSERT INTO session (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', ?))").run(
    sha256(token),
    userId,
    `+${SESSION_DAYS} days`
  );
  return token;
}

export function userIdFromToken(db: Database.Database, token: string | undefined): number | null {
  if (!token) return null;
  const row = db
    .prepare("SELECT user_id FROM session WHERE token_hash = ? AND expires_at > datetime('now')")
    .get(sha256(token)) as { user_id: number } | undefined;
  return row?.user_id ?? null;
}

export function destroySession(db: Database.Database, token: string | undefined) {
  if (token) db.prepare("DELETE FROM session WHERE token_hash = ?").run(sha256(token));
}

export function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch { return undefined; }
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------
// Sign up / log in
// ---------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function signUp(db: Database.Database, input: { name?: string; email?: string; password?: string }): number {
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (name.length < 2 || name.length > 60) throw new AuthError("Enter your name (2 to 60 characters).");
  if (!EMAIL_RE.test(email)) throw new AuthError("Enter a valid email address.");
  if (password.length < 8) throw new AuthError("Password must be at least 8 characters.");
  if (password.length > 200) throw new AuthError("Password is too long.");
  if (db.prepare("SELECT 1 FROM user_account WHERE email = ?").get(email)) {
    throw new AuthError("An account with this email already exists. Try logging in.", 409);
  }

  const passwordHash = hashPassword(password);
  const nextCommandId = () => `CMD-${crypto.randomInt(100000, 1000000)}`;
  const exists = db.prepare("SELECT 1 FROM user_account WHERE command_id = ?");
  let commandId = nextCommandId();
  while (exists.get(commandId)) commandId = nextCommandId();

  const info = db
    .prepare("INSERT INTO user_account (command_id, name, email, password_hash) VALUES (?, ?, ?, ?)")
    .run(commandId, name.toUpperCase(), email, passwordHash);
  return Number(info.lastInsertRowid);
}

// Simple in-memory throttle: 10 failed attempts per email+IP per 15 minutes
const failures = new Map<string, { count: number; since: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

export function logIn(db: Database.Database, input: { email?: string; password?: string }, ip: string): number {
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");
  const key = `${ip}|${email}`;

  const f = failures.get(key);
  if (f && Date.now() - f.since < WINDOW_MS && f.count >= MAX_FAILURES) {
    throw new AuthError("Too many attempts. Please wait a few minutes and try again.", 429);
  }

  const row = db.prepare("SELECT user_id, password_hash FROM user_account WHERE email = ?").get(email) as
    | { user_id: number; password_hash: string }
    | undefined;
  const ok = verifyPassword(password, row?.password_hash ?? DUMMY_HASH) && !!row;

  if (!ok) {
    const fresh = !f || Date.now() - f.since >= WINDOW_MS;
    failures.set(key, { count: fresh ? 1 : f!.count + 1, since: fresh ? Date.now() : f!.since });
    throw new AuthError("Incorrect email or password.", 401);
  }
  failures.delete(key);
  return row!.user_id;
}
