# FootVerse
React 19 + Vite + Tailwind v4 front-end, Express + SQLite (better-sqlite3) back-end, and optional Gemini AI scout reports. Checkout is a database-backed academic demo; it does not process real payments or collect shipping information.

## Run
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` only if you want to use AI analysis. AI analysis requires a logged-in account and is rate-limited.
3. `npm run dev` -> http://localhost:3000
4. Log in with the seeded demo account `manager@footverse.com` / `footverse123`, or sign up. Change demo credentials before any deployment beyond a local classroom demonstration.

The SQL database is created and seeded on first start (see `db/README.md`). `npm run db:reset` rebuilds it.

Player photos: drop `erling-haaland.png` etc. into `public/players/` (names listed in `public/players/README.txt`). They appear in the card boxes and in all circles.

Intro page: `public/intro.html` (the Blue Lock merch scroll page) opens first for guests, once per browser session. Its "Login Now" button and the footer "Login" link open the login / sign-up page. Open `http://localhost:3000/?view=login` to skip it.

## Production build

Run `npm run build`, then `npm start`. The built server automatically serves `dist/` when launched from `dist/server.cjs`.

## Project limitations

This is an academic demo. Checkout records orders locally but does not process real payments or store shipping details. AI output is generated text and is not independently verified. Account security settings, saved payment methods, and editable favourites are not implemented as interactive features.

## Submission packaging

Do not include `node_modules/`, `.env.local`, `db/footverse.db`, `db/footverse.db-wal`, or `db/footverse.db-shm` in a submission ZIP. The database is rebuilt from `db/schema.sql`, `db/views.sql`, and `db/seed.sql` on first launch.

## Database design document

See `DBMS_Design.docx` for the updated ER diagram, all 18 relations, key relationships, normalization notes, and demo limitations. `FINAL_AUDIT_NOTES.md` lists fixes and verification results.
