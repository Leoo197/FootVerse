# FootVerse database (SQLite)

Created automatically from these files on first server start (`db/footverse.db`). `npm run db:reset` rebuilds it.

| File | Purpose |
|---|---|
| `schema.sql` | Tables, keys, constraints, indexes (numbered like the design doc) |
| `views.sql` | Derived data: team form/rank/squad size, order total, user & player rank |
| `seed.sql` | Sample data |
| `queries.sql` | Example queries for demos |

PK = primary key, FK = foreign key, UK = unique key.

## Relational schema
1. TEAM(team_id PK, name UK, short_name UK, league, rating, ucl_titles, season_win_rate, established_year, slogan, logo_url, banner_url) — `form` derived (v_team_standing)
2. PLAYER_POSITION(position_name PK, category)
3. PLAYER(player_id PK, name, shirt_number, position_name FK, nationality, market_value_eur_m, rating, goals, assists, pass_accuracy, sprint_speed, stamina, recovery_rate, fitness_level, bio, last_match, instagram_handle, twitter_handle, image_url, team_id FK)
   - PLAYER_LOAD(player_id PK/FK, day_no PK, load_pct)
   - PLAYER_HEATMAP(player_id PK/FK, zone_x PK, zone_y PK, intensity)
4. TROPHY(team_id PK/FK, trophy_no PK, year, title, description) — weak entity; TROPHY_TAG(team_id, trophy_no, tag) PK/FK
5. LEGEND(team_id PK/FK, legend_no PK, name, title) — weak entity
6. MATCH_RESULT(match_id PK, match_date, league, home_team_id FK, away_team_id FK, home_score, away_score, status, minute, top_performer_id FK)
7. USER_ACCOUNT(user_id PK, command_id UK, name, email UK, password_hash, membership, xp, avatar_url, joined_date)
   `password_hash` = scrypt with a random salt (the plain password is never stored).
8. PRODUCT(product_id PK, name, category, price, original_price, tag, description, image_url, team_id FK, collection) — PRODUCT_SIZE(product_id PK/FK, size PK, size_order)
9. DISCOUNT(code PK, percent)
10. ORDERS(order_id PK, order_date, status, shipping_fee, discount_code FK, user_id FK) — `total` derived (v_order_total); ORDER_ITEM(order_id PK/FK, line_no PK, product_id FK, size, quantity, unit_price, customization)
11. FOLLOWS(team_id PK/FK, user_id PK/FK)
12. FAVORITE_PLAYER(user_id PK/FK, player_id PK/FK)
13. SESSION(token_hash PK, user_id FK, created_at, expires_at) — a logged-in browser; only the SHA-256 of the cookie token is stored

## Normalization
- **1NF:** arrays (loadHistory, heatmapData, availSizes, tags) → own tables; `socials` → two columns
- **2NF:** weak entities TROPHY/LEGEND use composite key (team_id, no)
- **3NF:** derived form/total/ranks not stored (views); position→category in PLAYER_POSITION
- **BCNF:** USER_ACCOUNT determinants user_id, email, command_id are all candidate keys

## Design-document consistency
`DBMS_Design.docx` section 3.3 documents the current 18-table relational schema and its keys. `schema.sql` is the executable source of truth; if the schema changes, update the design document and this README together. Opponent clubs (Bayern, Chelsea, Man United, Atlético, Dortmund) are extra TEAM rows with placeholder ratings so foreign keys stay valid.

## Login
Demo accounts (seed.sql) all use the password `footverse123`, e.g. `manager@footverse.com`. New fans sign up on the Login page; the account is a new USER_ACCOUNT row (membership Standard, 0 XP) and a SESSION row is created on login. Orders can only be placed by a logged-in fan.

## Player photos
Put `public/players/<player-name>.png|jpg|webp` (see `public/players/README.txt`); it overrides `player.image_url` everywhere in the app.


Order totals use `orders.discount_percent` as a purchase-time snapshot. Editing or deleting a discount code later does not change historical order totals. Date columns validate both ISO shape and real calendar dates.
