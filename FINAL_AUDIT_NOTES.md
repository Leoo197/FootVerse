# FootVerse — Final cleanup and verification notes

## Fixes applied

- Added `orders.discount_percent` to snapshot the discount percentage used at purchase time. Historical order totals no longer change when a discount's current percentage changes or its code is deleted.
- Updated checkout to submit the code that was actually applied, rather than whatever text happens to remain in the discount input. Invalid codes clear the applied discount and show feedback.
- Added calendar-validity checks for `match_date`, `order_date`, and `joined_date`, in addition to the ISO date shape check.
- Changed the product-to-team delete rule to `RESTRICT` so deleting a team cannot trigger a conflicting `SET NULL`/`CHECK` constraint failure.
- Added indexes for user lookups in `follows` and player lookups in `favorite_player`.
- Bumped the schema version to 3. On startup, an older database is backed up and a new database is seeded from the SQL files.
- Added server-side validation for order quantity and customization text, and safer handling of malformed order item objects.
- Rejected non-string signup values instead of coercing arbitrary objects into account names; malformed cookie escapes no longer crash cookie parsing.
- Protected the AI endpoint with login requirement, a per-IP request limit, bounded query/context text, and generic client-facing errors.
- Added JSON error handling for malformed request bodies and made production static serving work when launching the built `dist/server.cjs` entry point without relying on shell-specific environment assignment.
- Made checkout clearly identify itself as a demo; removed unused shipping/card fields so users are not prompted to enter sensitive information that is not processed. Added an explicit button after successful order creation instead of an unconditional delayed redirect.
- Removed the invented AI confidence percentage and clarified that generated analysis is not independently verified.
- Replaced fake account-security/payment-method details with honest demo limitations and relabeled the match centre as sample/static UI rather than a live stream.
- Updated README/database documentation and added `DBMS_Design.docx` with the ER diagram and the current 18-table schema.

## Verification performed in this environment

- `npm run lint` — PASS (`tsc --noEmit`).
- SQLite schema, views, and seed scripts — PASS using SQLite 3.46.1.
- All statements in `db/queries.sql` — PASS.
- `PRAGMA integrity_check` — `ok`.
- `PRAGMA foreign_key_check` — no violations.
- Impossible calendar dates in all three date fields — rejected.
- Historical total after changing `PRO10` from 10% to 50% — unchanged at 144.60 for the seeded order.
- Team deletion when products reference the team — rejected by the explicit foreign-key rule.

## Remaining verification limits

- `npm run build` could not be completed in this Linux audit environment because the installed dependency tree is missing the Rollup platform binary `@rollup/rollup-linux-x64-gnu`. The TypeScript check passes, but a full build should be run after `npm install` on the target machine.
- The browser UI was not automated in this environment.
- Gemini API calls require a valid `GEMINI_API_KEY` and were not verified end-to-end.
- Payment processing, shipping-data collection, editable favorites, 2FA, and a real live match feed are intentionally not claimed as implemented features.

## Windows verification steps

From the extracted project folder, run:

```powershell
npm install
npm run lint
npm run build
npm start
```

Open `http://localhost:3000`. For the optional AI feature, copy `.env.example` to `.env.local` and configure `GEMINI_API_KEY`. Do not use real payment data; checkout is a local academic demo.

## Follow-up after the independent re-audit

- Expanded section 3.5 in `DBMS_Design.docx` with explicit functional dependencies, candidate-key closure examples, and a stepwise 1NF/2NF/3NF/BCNF discussion tied to the implemented schema.
- Corrected `db/README.md` so it no longer says the design document has only nine relations or asks the team to update section 3.3.
- Adjusted the session-cookie `Secure` flag to be enabled for HTTPS requests (direct HTTPS or an HTTPS reverse-proxy header) rather than forcing it on plain-HTTP localhost. Test login in the actual browser and deployment setup before submission.

## Checks run for this follow-up package

- Recreated the database from `schema.sql`, `views.sql`, and `seed.sql` using Python SQLite: passed.
- `PRAGMA integrity_check`: `ok`.
- `PRAGMA foreign_key_check`: zero violations.
- Schema contains 18 tables and 6 views.
- All 8 statements in `queries.sql` executed successfully in Python SQLite.
- The independent re-audit report states that `npm run lint` and `npm run build` passed under Node 22 in its environment. My attempt to rerun npm installation in this environment timed out and left an incomplete dependency install, which was removed; therefore I am not claiming a fresh local build result for this follow-up package.
- Browser click-through testing, Safari cookie behavior, real Gemini API calls, and concurrent-user behavior remain unverified.
