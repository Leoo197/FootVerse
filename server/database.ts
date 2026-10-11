import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Player, Team, Product, MatchResult, UserProfile, Order, CartItem } from "../src/types";

const DB_DIR = path.join(process.cwd(), "db");
const DB_FILE = process.env.FOOTVERSE_DB || path.join(DB_DIR, "footverse.db");
const SCHEMA_VERSION = 3; // 3: snapshot order discount percentages and stricter date constraints

/** A neutral crest used for clubs that have no logo stored. */
const PLACEHOLDER_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 6 90 20v30c0 24-17 38-40 44C27 88 10 74 10 50V20z" fill="#94a3b8"/><circle cx="50" cy="50" r="16" fill="#f8fafc"/></svg>`
  );

/** Opens (and, on first run, creates + seeds) the FootVerse SQLite database. */
export function openDatabase(file: string = DB_FILE): Database.Database {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  let version = db.pragma("user_version", { simple: true }) as number;
  if (version > 0 && version < SCHEMA_VERSION) {
    // An older FootVerse database: keep it as a backup and start from the new schema.
    db.close();
    const backup = file.replace(/\.db$/, `.v${version}.bak.db`);
    fs.renameSync(file, backup);
    for (const ext of ["-wal", "-shm"]) fs.rmSync(file + ext, { force: true });
    console.log(`Old database moved to ${backup}`);
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    version = 0;
  }
  if (version < SCHEMA_VERSION) {
    const run = (name: string) => db.exec(fs.readFileSync(path.join(DB_DIR, name), "utf8"));
    db.transaction(() => {
      run("schema.sql");
      run("views.sql");
      run("seed.sql");
      db.pragma(`user_version = ${SCHEMA_VERSION}`);
    })();
    console.log(`FootVerse database created at ${file}`);
  }
  return db;
}

// ---------------------------------------------------------------------
// Player photos
//   Drop a picture into  public/players/  named after the player, e.g.
//   erling-haaland.png / .jpg / .jpeg / .webp  - it replaces image_url everywhere
//   (cards, circles, profile, search, compare) because they all read the same field.
// ---------------------------------------------------------------------
const PHOTO_EXT = [".png", ".jpg", ".jpeg", ".webp"];
const PHOTO_DIRS = [path.join(process.cwd(), "public", "players"), path.join(process.cwd(), "dist", "players")];

export const photoSlug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Mbappé -> Mbappe
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function playerPhoto(name: string, dbUrl: string | null): string {
  const slug = photoSlug(name);
  for (const dir of PHOTO_DIRS) {
    for (const ext of PHOTO_EXT) {
      try {
        const stat = fs.statSync(path.join(dir, slug + ext));
        return `/players/${slug}${ext}?v=${Math.round(stat.mtimeMs)}`;
      } catch {
        /* not there, try next */
      }
    }
  }
  return dbUrl ?? "";
}

// ---------------------------------------------------------------------
// Row -> API shape mappers
// ---------------------------------------------------------------------
const ORDER_STEP: Record<string, number> = { Processing: 1, Shipped: 2, Transit: 3, Delivered: 4 };
const orderRef = (id: number) => `ORD-${100000 + id}`;

function loadProducts(db: Database.Database): Product[] {
  const rows = db
    .prepare(
      `SELECT p.*, COALESCE(t.name, p.collection) AS team_label
       FROM product p LEFT JOIN team t ON t.team_id = p.team_id
       ORDER BY p.product_id`
    )
    .all() as any[];
  const sizes = db.prepare("SELECT product_id, size FROM product_size ORDER BY product_id, size_order").all() as any[];
  const sizesBy = new Map<number, string[]>();
  for (const s of sizes) sizesBy.set(s.product_id, [...(sizesBy.get(s.product_id) ?? []), s.size]);

  return rows.map((r) => ({
    id: String(r.product_id),
    name: r.name,
    category: r.category,
    team: r.team_label,
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    tag: r.tag ?? undefined,
    image: r.image_url ?? "",
    description: r.description ?? "",
    availableSizes: sizesBy.get(r.product_id) ?? [],
  }));
}

function loadPlayers(db: Database.Database): Player[] {
  const rows = db
    .prepare(
      `SELECT p.*, pos.category, t.name AS club, t.logo_url AS club_logo, r.global_rank
       FROM player p
       JOIN player_position pos ON pos.position_name = p.position_name
       JOIN team t              ON t.team_id = p.team_id
       JOIN v_player_ranking r  ON r.player_id = p.player_id
       ORDER BY r.global_rank, p.name`
    )
    .all() as any[];
  const load = db.prepare("SELECT player_id, load_pct FROM player_load ORDER BY player_id, day_no").all() as any[];
  const heat = db.prepare("SELECT player_id, zone_x AS x, zone_y AS y, intensity FROM player_heatmap").all() as any[];
  const loadBy = new Map<number, number[]>();
  for (const l of load) loadBy.set(l.player_id, [...(loadBy.get(l.player_id) ?? []), l.load_pct]);
  const heatBy = new Map<number, { x: number; y: number; intensity: number }[]>();
  for (const h of heat) heatBy.set(h.player_id, [...(heatBy.get(h.player_id) ?? []), { x: h.x, y: h.y, intensity: h.intensity }]);

  return rows.map((r) => ({
    id: String(r.player_id),
    name: r.name,
    number: r.shirt_number,
    rank: r.global_rank,
    position: r.position_name,
    positionCategory: r.category,
    club: r.club,
    clubLogo: r.club_logo ?? PLACEHOLDER_LOGO,
    nationality: r.nationality,
    marketValue: `€${r.market_value_eur_m}M`,
    rating: r.rating,
    goals: r.goals,
    assists: r.assists,
    passAccuracy: r.pass_accuracy,
    sprintSpeed: r.sprint_speed,
    stamina: r.stamina,
    recoveryRate: r.recovery_rate,
    fitnessLevel: r.fitness_level,
    image: playerPhoto(r.name, r.image_url),
    loadHistory: loadBy.get(r.player_id) ?? [],
    heatmapData: heatBy.get(r.player_id),
    bio: r.bio ?? undefined,
    lastMatch: r.last_match ?? undefined,
    socials: { instagram: r.instagram_handle ?? undefined, twitter: r.twitter_handle ?? undefined },
  }));
}

function loadTeams(db: Database.Database): Team[] {
  const rows = db
    .prepare(
      `SELECT t.*, s.world_rank, s.squad_count, s.form
       FROM team t JOIN v_team_standing s ON s.team_id = t.team_id
       ORDER BY s.world_rank, t.name`
    )
    .all() as any[];
  const trophies = db.prepare("SELECT * FROM trophy ORDER BY team_id, trophy_no").all() as any[];
  const tags = db.prepare("SELECT * FROM trophy_tag ORDER BY team_id, trophy_no, tag").all() as any[];
  const legends = db.prepare("SELECT * FROM legend ORDER BY team_id, legend_no").all() as any[];

  return rows.map((r) => ({
    id: String(r.team_id),
    name: r.name,
    shortName: r.short_name,
    rank: r.world_rank,
    rating: r.rating,
    league: r.league,
    uclTitles: r.ucl_titles,
    winRate: r.season_win_rate ?? 0,
    logo: r.logo_url ?? PLACEHOLDER_LOGO,
    banner: r.banner_url ?? "",
    form: r.form.split("") as Team["form"],
    established: r.established_year ? String(r.established_year) : "",
    slogan: r.slogan ?? undefined,
    timeline: trophies
      .filter((t) => t.team_id === r.team_id)
      .map((t) => {
        const own = tags.filter((g) => g.team_id === t.team_id && g.trophy_no === t.trophy_no).map((g) => g.tag);
        return { year: String(t.year), title: t.title, description: t.description ?? "", tags: own.length ? own : undefined };
      }),
    legends: legends.filter((l) => l.team_id === r.team_id).map((l) => ({ name: l.name, title: l.title })),
    squadCount: r.squad_count,
  }));
}

function loadMatches(db: Database.Database): MatchResult[] {
  const rows = db
    .prepare(
      `SELECT m.*, h.short_name AS home, a.short_name AS away, p.name AS top_name, p.image_url AS top_image
       FROM match_result m
       JOIN team h ON h.team_id = m.home_team_id
       JOIN team a ON a.team_id = m.away_team_id
       LEFT JOIN player p ON p.player_id = m.top_performer_id
       ORDER BY m.match_date DESC, m.match_id DESC`
    )
    .all() as any[];
  return rows.map((r) => ({
    id: String(r.match_id),
    date: r.match_date,
    homeTeam: r.home,
    awayTeam: r.away,
    homeScore: r.home_score,
    awayScore: r.away_score,
    league: r.league,
    topPerformer: { name: r.top_name ?? "", avatar: r.top_name ? playerPhoto(r.top_name, r.top_image) : "" },
    status: r.status === "LIVE" ? "LIVE" : "FT",
    minute: r.minute ?? undefined,
  }));
}

function loadOrders(db: Database.Database, userId: number, products: Product[]): Order[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const orders = db
    .prepare(
      `SELECT o.order_id, o.order_date, o.status, t.total
       FROM orders o JOIN v_order_total t ON t.order_id = o.order_id
       WHERE o.user_id = ? ORDER BY o.order_date DESC, o.order_id DESC`
    )
    .all(userId) as any[];
  const itemStmt = db.prepare("SELECT * FROM order_item WHERE order_id = ? ORDER BY line_no");

  return orders.map((o) => ({
    id: orderRef(o.order_id),
    date: o.order_date,
    status: o.status,
    total: o.total,
    trackingStep: ORDER_STEP[o.status] ?? 1,
    items: (itemStmt.all(o.order_id) as any[]).map(
      (i): CartItem => ({
        // show the price that was actually paid, not today's catalogue price
        product: { ...byId.get(String(i.product_id))!, price: i.unit_price },
        quantity: i.quantity,
        selectedSize: i.size,
        customizationText: i.customization ?? "",
      })
    ),
  }));
}

function loadUser(db: Database.Database, userId: number, products: Product[]): UserProfile {
  const u = db
    .prepare(`SELECT u.*, r.global_rank FROM user_account u JOIN v_user_rank r ON r.user_id = u.user_id WHERE u.user_id = ?`)
    .get(userId) as any;
  if (!u) throw new Error(`User ${userId} not found`);
  const favPlayers = db.prepare("SELECT player_id FROM favorite_player WHERE user_id = ? ORDER BY player_id").all(userId) as any[];
  const favTeams = db.prepare("SELECT team_id FROM follows WHERE user_id = ? ORDER BY team_id").all(userId) as any[];
  return {
    id: String(u.user_id),
    name: u.name,
    email: u.email,
    commandId: u.command_id,
    rank: `#${u.global_rank} Global`,
    xp: u.xp,
    joined: u.joined_date,
    membership: `${u.membership} Membership`,
    avatar: u.avatar_url ?? "",
    favoritePlayerIds: favPlayers.map((r) => String(r.player_id)),
    favoriteTeamIds: favTeams.map((r) => String(r.team_id)),
    orders: loadOrders(db, userId, products),
  };
}

/** Everything the front-end needs on first load, in one round trip. */
export function loadBootstrap(db: Database.Database, userId: number | null) {
  const products = loadProducts(db);
  return {
    players: loadPlayers(db),
    teams: loadTeams(db),
    products,
    matches: loadMatches(db),
    discounts: db.prepare("SELECT code, percent FROM discount ORDER BY code").all() as { code: string; percent: number }[],
    user: userId === null ? null : loadUser(db, userId, products),
  };
}

/** The profile of one logged-in fan (used after login / sign up). */
export function loadUserProfile(db: Database.Database, userId: number): UserProfile {
  return loadUser(db, userId, loadProducts(db));
}

// ---------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------
export interface OrderRequest {
  userId: number;
  discountCode?: string;
  items: { productId: number; size: string; quantity: number; customization?: string }[];
}

export class OrderError extends Error {}

const XP_PER_ORDER = 250;
const SHIPPING_FEE = 15;

/** Creates an order and its lines in one transaction; prices come from the database, never the client. */
export function placeOrder(db: Database.Database, req: OrderRequest) {
  if (!Array.isArray(req.items) || req.items.length === 0) throw new OrderError("Your cart is empty.");

  const code = req.discountCode?.trim().toUpperCase() || null;
  const discount = code ? (db.prepare("SELECT percent FROM discount WHERE code = ?").get(code) as { percent: number } | undefined) : undefined;
  if (code && !discount) throw new OrderError(`Unknown discount code "${code}".`);
  if (!db.prepare("SELECT 1 FROM user_account WHERE user_id = ?").get(req.userId)) throw new OrderError("Unknown user.");

  const getProduct = db.prepare("SELECT price FROM product WHERE product_id = ?");
  const sizeOk = db.prepare("SELECT 1 FROM product_size WHERE product_id = ? AND size = ?");

  const orderId = db.transaction(() => {
    const info = db
      .prepare("INSERT INTO orders (order_date, status, shipping_fee, discount_code, discount_percent, user_id) VALUES (date('now'), 'Processing', ?, ?, ?, ?)")
      .run(SHIPPING_FEE, code, discount?.percent ?? 0, req.userId);
    const id = Number(info.lastInsertRowid);
    const insertItem = db.prepare(
      "INSERT INTO order_item (order_id, line_no, product_id, size, quantity, unit_price, customization) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    req.items.forEach((item, i) => {
      const product = getProduct.get(item.productId) as { price: number } | undefined;
      if (!product) throw new OrderError(`Product ${item.productId} does not exist.`);
      if (!sizeOk.get(item.productId, item.size)) throw new OrderError(`Size "${item.size}" is not available for product ${item.productId}.`);
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw new OrderError("Quantity must be between 1 and 99.");
      if (item.customization !== undefined && typeof item.customization !== "string") throw new OrderError("Invalid customization text.");
      const customization = item.customization?.trim() || "";
      if (customization.length > 80) throw new OrderError("Customization must be 80 characters or fewer.");
      insertItem.run(id, i + 1, item.productId, item.size, item.quantity, product.price, customization || null);
    });
    db.prepare("UPDATE user_account SET xp = xp + ? WHERE user_id = ?").run(XP_PER_ORDER, req.userId);
    return id;
  })();

  const user = loadUser(db, req.userId, loadProducts(db));
  return { order: user.orders.find((o) => o.id === orderRef(orderId))!, xp: user.xp, rank: user.rank };
}
