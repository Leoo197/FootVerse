import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { openDatabase, loadBootstrap, loadUserProfile, placeOrder, OrderError } from "./server/database";
import { AuthError, SESSION_COOKIE, SESSION_MAX_AGE, signUp, logIn, createSession, userIdFromToken, destroySession, readCookie } from "./server/auth";

dotenv.config({ path: ".env.local" }); // GEMINI_API_KEY lives here

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === "production" || /[\\/]dist[\\/]server\.cjs$/.test(process.argv[1] ?? "");

  app.use(express.json({ limit: "10mb" }));

  // SQL database (created and seeded from db/*.sql on first run)
  const db = openDatabase();

  /** The logged-in fan for this request (from the session cookie), or null for a guest. */
  const sessionToken = (req: express.Request) => readCookie(req.headers.cookie, SESSION_COOKIE);
  const currentUserId = (req: express.Request) => userIdFromToken(db, sessionToken(req));
  const setSessionCookie = (req: express.Request, res: express.Response, token: string | null) => {
    const secure = req.secure || req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
    res.setHeader(
      "Set-Cookie",
      token
        ? `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}${secure}`
        : `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`
    );
  };
  const authFailure = (res: express.Response, error: any) => {
    if (error instanceof AuthError) return res.status(error.status).json({ error: error.message });
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  };

  // API Routes: accounts
  app.post("/api/auth/signup", (req, res) => {
    try {
      const userId = signUp(db, req.body ?? {});
      setSessionCookie(req, res, createSession(db, userId));
      res.status(201).json({ user: loadUserProfile(db, userId) });
    } catch (error) {
      authFailure(res, error);
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const userId = logIn(db, req.body ?? {}, req.ip || "unknown");
      setSessionCookie(req, res, createSession(db, userId));
      res.json({ user: loadUserProfile(db, userId) });
    } catch (error) {
      authFailure(res, error);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    destroySession(db, sessionToken(req));
    setSessionCookie(req, res, null);
    res.json({ ok: true });
  });

  // Initialize Gemini AI lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "FootVerse" });
  });

  // API Route: everything the UI needs on first load (players, clubs, store, user, ...)
  app.get("/api/bootstrap", (req, res) => {
    try {
      res.json(loadBootstrap(db, currentUserId(req)));
    } catch (error: any) {
      console.error("Bootstrap error:", error);
      res.status(500).json({ error: "Failed to load FootVerse data." });
    }
  });

  // API Route: place an order (prices are read from the database, not trusted from the client)
  app.post("/api/orders", (req, res) => {
    try {
      const userId = currentUserId(req);
      if (userId === null) return res.status(401).json({ error: "Please log in to place an order." });
      const { items, discountCode } = req.body ?? {};
      const result = placeOrder(db, {
        userId,
        discountCode,
        items: Array.isArray(items)
          ? items.map((i: any) => i && typeof i === "object" ? ({ productId: Number(i.productId), size: typeof i.size === "string" ? i.size : "", quantity: Number(i.quantity), customization: i.customization }) : ({ productId: Number.NaN, size: "", quantity: Number.NaN }))
          : [],
      });
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof OrderError) return res.status(400).json({ error: error.message });
      console.error("Order error:", error);
      res.status(500).json({ error: "Could not place the order." });
    }
  });

  // API Route: AI Tactical & Scout Analysis. Requires a session and limits usage per IP.
  const aiAttempts = new Map<string, { count: number; resetAt: number }>();
  app.post("/api/ai/tactical-analysis", async (req, res) => {
    if (currentUserId(req) === null) return res.status(401).json({ success: false, error: "Please log in to use AI analysis." });
    const now = Date.now();
    const key = req.ip || "unknown";
    const previous = aiAttempts.get(key);
    if (!previous || previous.resetAt <= now) aiAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    else if (previous.count >= 10) return res.status(429).json({ success: false, error: "AI request limit reached. Please try again later." });
    else previous.count += 1;
    try {
      const { type, query, context } = req.body ?? {};
      const queryText = typeof query === "string" ? query.trim().slice(0, 1000) : "";
      const contextText = JSON.stringify(context && typeof context === "object" ? context : {}).slice(0, 5000);
      const ai = getGeminiClient();

      let systemInstruction = "You are FootVerse's Pro Command AI Tactical Engine. Provide sharp, high-intensity, expert football tactical breakdown, scout reports, and performance insights in structured markdown.";

      if (type === "scout") {
        systemInstruction += " Focus on player attributes, speed, strengths, transfer valuation, and tactical fit.";
      } else if (type === "match") {
        systemInstruction += " Focus on key match moments, xG metrics, formation shifts, and pitch heatmap dynamics.";
      }

      const prompt = `User Query: ${queryText || "Analyze current squad performance and tactical options"}\nContext: ${contextText}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate tactical analysis. Check the server configuration and try again.",
      });
    }
  });

  // Return a safe JSON error for malformed request bodies rather than Express HTML stack traces.
  app.use((error: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error?.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON request body." });
    if (res.headersSent) return next(error);
    console.error("Unhandled request error:", error);
    return res.status(500).json({ error: "Internal server error." });
  });

  // Vite middleware or static server
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FootVerse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
