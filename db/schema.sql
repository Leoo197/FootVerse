-- =====================================================================
--  FootVerse  |  Database schema (SQLite)
--  23CSE202 Database Management Systems  |  Group 05
--
--  Notation (same as the Database Design Document):
--    PK = Primary Key    FK = Foreign Key    UK = Unique Key
--
--  Design rules applied
--    * 1NF   : no arrays / multi-valued columns -> separate tables
--              (PLAYER_LOAD, PLAYER_HEATMAP, TROPHY_TAG, PRODUCT_SIZE)
--    * 2NF   : weak entities use a composite key (TROPHY, LEGEND)
--    * 3NF   : derived data is NOT stored -> see views.sql
--              (team form, team rank, squad size, order total, user rank)
--              position -> category lives in PLAYER_POSITION
--    * BCNF  : every determinant is a candidate key
--              (USER_ACCOUNT: user_id and email are both candidate keys)
--
--  Order of sections:
--     1. TEAM          2. PLAYER_POSITION   3. PLAYER (+ PLAYER_LOAD, PLAYER_HEATMAP)
--     4. TROPHY (+ TROPHY_TAG)              5. LEGEND
--     6. MATCH_RESULT  7. USER_ACCOUNT      8. PRODUCT (+ PRODUCT_SIZE)
--     9. DISCOUNT     10. ORDERS (+ ORDER_ITEM)
--    11. FOLLOWS      12. FAVORITE_PLAYER   13. SESSION (login)
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- 1. TEAM
--    TEAM(team_id PK, name UK, short_name UK, league, rating, ...)
--    form, world rank and squad size are derived  -> v_team_standing
-- ---------------------------------------------------------------------
CREATE TABLE team (
    team_id           INTEGER PRIMARY KEY,
    name              TEXT    NOT NULL UNIQUE,
    short_name        TEXT    NOT NULL UNIQUE,
    league            TEXT    NOT NULL,
    rating            REAL    NOT NULL CHECK (rating BETWEEN 0 AND 100),
    ucl_titles        INTEGER NOT NULL DEFAULT 0 CHECK (ucl_titles >= 0), -- imported historical statistic, not derived from this sample database
    season_win_rate   INTEGER CHECK (season_win_rate BETWEEN 0 AND 100),   -- imported season statistic, not derived from this sample database
    established_year  INTEGER CHECK (established_year > 1800),
    slogan            TEXT,
    logo_url          TEXT,
    banner_url        TEXT
);

-- ---------------------------------------------------------------------
-- 2. PLAYER_POSITION   (lookup: position -> category)
--    Keeps PLAYER free of the transitive dependency
--    player_id -> position_name -> category   (3NF)
-- ---------------------------------------------------------------------
CREATE TABLE player_position (
    position_name  TEXT PRIMARY KEY,
    category       TEXT NOT NULL CHECK (category IN ('FWD', 'MID', 'DEF', 'GK'))
);

-- ---------------------------------------------------------------------
-- 3. PLAYER
--    PLAYER(player_id PK, name, rating, position_name FK, nationality,
--           last_match, socials, team_id FK, ...)
--    socials is a composite attribute -> instagram_handle, twitter_handle
--    last_match is a denormalised text summary (as in the design document)
--    loadHistory / heatmapData (arrays) -> PLAYER_LOAD / PLAYER_HEATMAP
-- ---------------------------------------------------------------------
CREATE TABLE player (
    player_id           INTEGER PRIMARY KEY,
    name                TEXT    NOT NULL,
    shirt_number        INTEGER NOT NULL CHECK (shirt_number BETWEEN 1 AND 99),
    position_name       TEXT    NOT NULL REFERENCES player_position (position_name)
                                ON UPDATE CASCADE ON DELETE RESTRICT,
    nationality         TEXT    NOT NULL,
    market_value_eur_m  INTEGER NOT NULL CHECK (market_value_eur_m >= 0),   -- millions of euro
    rating              INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 100),
    goals               INTEGER NOT NULL DEFAULT 0 CHECK (goals   >= 0),
    assists             INTEGER NOT NULL DEFAULT 0 CHECK (assists >= 0),
    pass_accuracy       REAL    NOT NULL CHECK (pass_accuracy BETWEEN 0 AND 100),
    sprint_speed        REAL    NOT NULL CHECK (sprint_speed > 0),          -- km/h
    stamina             INTEGER NOT NULL CHECK (stamina       BETWEEN 0 AND 100),
    recovery_rate       INTEGER NOT NULL CHECK (recovery_rate BETWEEN 0 AND 100),
    fitness_level       TEXT    NOT NULL CHECK (fitness_level IN ('Peak', 'Optimal', 'Resting', 'Injured')),
    bio                 TEXT,
    last_match          TEXT,
    instagram_handle    TEXT,
    twitter_handle      TEXT,
    image_url           TEXT,
    team_id             INTEGER NOT NULL REFERENCES team (team_id)
                                ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (team_id, shirt_number)
);
CREATE INDEX idx_player_team ON player (team_id);

-- 3a. PLAYER_LOAD  (was the array loadHistory)   PK(player_id, day_no)
CREATE TABLE player_load (
    player_id  INTEGER NOT NULL REFERENCES player (player_id) ON DELETE CASCADE,
    day_no     INTEGER NOT NULL CHECK (day_no >= 1),
    load_pct   INTEGER NOT NULL CHECK (load_pct BETWEEN 0 AND 100),
    PRIMARY KEY (player_id, day_no)
);

-- 3b. PLAYER_HEATMAP  (was the array heatmapData)   PK(player_id, zone_x, zone_y)
CREATE TABLE player_heatmap (
    player_id  INTEGER NOT NULL REFERENCES player (player_id) ON DELETE CASCADE,
    zone_x     REAL    NOT NULL,
    zone_y     REAL    NOT NULL,
    intensity  REAL    NOT NULL CHECK (intensity BETWEEN 0 AND 100),
    PRIMARY KEY (player_id, zone_x, zone_y)
);

-- ---------------------------------------------------------------------
-- 4. TROPHY   (weak entity of TEAM)
--    Identified by the owner's key + its own partial key:
--    PK (team_id, trophy_no)        FK team_id -> TEAM
-- ---------------------------------------------------------------------
CREATE TABLE trophy (
    team_id      INTEGER NOT NULL REFERENCES team (team_id) ON DELETE CASCADE,
    trophy_no    INTEGER NOT NULL CHECK (trophy_no >= 1),
    year         INTEGER NOT NULL CHECK (year BETWEEN 1850 AND 2100),
    title        TEXT    NOT NULL,
    description  TEXT,
    PRIMARY KEY (team_id, trophy_no)
);

-- 4a. TROPHY_TAG  (was the multi-valued attribute tags)
CREATE TABLE trophy_tag (
    team_id    INTEGER NOT NULL,
    trophy_no  INTEGER NOT NULL,
    tag        TEXT    NOT NULL,
    PRIMARY KEY (team_id, trophy_no, tag),
    FOREIGN KEY (team_id, trophy_no) REFERENCES trophy (team_id, trophy_no) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 5. LEGEND   (weak entity of TEAM)      PK (team_id, legend_no)
-- ---------------------------------------------------------------------
CREATE TABLE legend (
    team_id    INTEGER NOT NULL REFERENCES team (team_id) ON DELETE CASCADE,
    legend_no  INTEGER NOT NULL CHECK (legend_no >= 1),
    name       TEXT    NOT NULL,
    title      TEXT    NOT NULL,
    PRIMARY KEY (team_id, legend_no)
);

-- ---------------------------------------------------------------------
-- 6. MATCH_RESULT
--    MATCH_RESULT(match_id PK, match_date, home_score, away_score, status,
--                 home_team_id FK, away_team_id FK)
--    TEAM and MATCH_RESULT are related M:N through the two FKs
--    (a team plays many matches, a match has exactly two teams).
-- ---------------------------------------------------------------------
CREATE TABLE match_result (
    match_id          INTEGER PRIMARY KEY,
    match_date        TEXT    NOT NULL CHECK (match_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND strftime('%Y-%m-%d', julianday(match_date)) IS NOT NULL AND strftime('%Y-%m-%d', julianday(match_date)) = match_date),
    league            TEXT    NOT NULL,
    home_team_id      INTEGER NOT NULL REFERENCES team (team_id) ON DELETE RESTRICT,
    away_team_id      INTEGER NOT NULL REFERENCES team (team_id) ON DELETE RESTRICT,
    home_score        INTEGER NOT NULL DEFAULT 0 CHECK (home_score >= 0),
    away_score        INTEGER NOT NULL DEFAULT 0 CHECK (away_score >= 0),
    status            TEXT    NOT NULL DEFAULT 'FT' CHECK (status IN ('SCHEDULED', 'LIVE', 'FT')),
    minute            TEXT,                                           -- only while LIVE
    top_performer_id  INTEGER REFERENCES player (player_id) ON DELETE SET NULL,
    CHECK (home_team_id <> away_team_id),
    CHECK ((status = 'LIVE') = (minute IS NOT NULL))
);
CREATE INDEX idx_match_home ON match_result (home_team_id, match_date);
CREATE INDEX idx_match_away ON match_result (away_team_id, match_date);

-- ---------------------------------------------------------------------
-- 7. USER_ACCOUNT
--    USER_ACCOUNT(user_id PK, name, email UK, password_hash, membership, xp, joined_date)
--    Candidate keys: user_id, email, command_id   (BCNF)
--    global rank is derived from xp -> v_user_rank
-- ---------------------------------------------------------------------
CREATE TABLE user_account (
    user_id        INTEGER PRIMARY KEY,
    command_id     TEXT    NOT NULL UNIQUE,
    name           TEXT    NOT NULL,
    email          TEXT    NOT NULL UNIQUE COLLATE NOCASE CHECK (email LIKE '%_@_%.__%'),
    password_hash  TEXT    NOT NULL,                       -- scrypt$salt$hash, never the plain password
    membership     TEXT    NOT NULL DEFAULT 'Standard' CHECK (membership IN ('Standard', 'Pro', 'Elite')),
    xp             INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    avatar_url     TEXT,
    joined_date    TEXT    NOT NULL DEFAULT (date('now'))
                           CHECK (joined_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND strftime('%Y-%m-%d', julianday(joined_date)) IS NOT NULL AND strftime('%Y-%m-%d', julianday(joined_date)) = joined_date)
);

-- ---------------------------------------------------------------------
-- 8. PRODUCT
--    PRODUCT(product_id PK, name, category, price, ...)
--    availSizes (array) -> PRODUCT_SIZE
--    A product belongs either to a club (team_id) or to a brand collection.
-- ---------------------------------------------------------------------
CREATE TABLE product (
    product_id      INTEGER PRIMARY KEY,
    name            TEXT    NOT NULL,
    category        TEXT    NOT NULL CHECK (category IN
                        ('Jerseys', 'Training Gear', 'Accessories', 'Equipment', 'Bundles',
                         'Shoes', 'Shirts', 'Shorts', 'Collectibles')),
    price           REAL    NOT NULL CHECK (price >= 0),
    original_price  REAL    CHECK (original_price IS NULL OR original_price >= price),
    tag             TEXT    CHECK (tag IN ('NEW', 'SALE', 'LIMITED')),
    description     TEXT,
    image_url       TEXT,
    team_id         INTEGER REFERENCES team (team_id) ON DELETE RESTRICT,
    collection      TEXT,
    CHECK (team_id IS NOT NULL OR collection IS NOT NULL)
);
CREATE INDEX idx_product_team ON product (team_id);

-- 8a. PRODUCT_SIZE   PK(product_id, size)
CREATE TABLE product_size (
    product_id  INTEGER NOT NULL REFERENCES product (product_id) ON DELETE CASCADE,
    size        TEXT    NOT NULL,
    size_order  INTEGER NOT NULL,
    PRIMARY KEY (product_id, size)
);

-- ---------------------------------------------------------------------
-- 9. DISCOUNT   (promo codes used at checkout)
-- ---------------------------------------------------------------------
CREATE TABLE discount (
    code     TEXT    PRIMARY KEY CHECK (code = UPPER(code)),
    percent  INTEGER NOT NULL CHECK (percent BETWEEN 1 AND 100)
);

-- ---------------------------------------------------------------------
-- 10. ORDERS
--    ORDERS(order_id PK, order_date, status, user_id FK, ...)
--    total is derived from the order lines -> v_order_total
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    order_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    order_date     TEXT    NOT NULL CHECK (order_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]' AND strftime('%Y-%m-%d', julianday(order_date)) IS NOT NULL AND strftime('%Y-%m-%d', julianday(order_date)) = order_date),
    status         TEXT    NOT NULL DEFAULT 'Processing'
                           CHECK (status IN ('Processing', 'Shipped', 'Transit', 'Delivered')),
    shipping_fee   REAL    NOT NULL DEFAULT 15 CHECK (shipping_fee >= 0),
    discount_code  TEXT    REFERENCES discount (code) ON UPDATE CASCADE ON DELETE SET NULL,
    discount_percent INTEGER NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100), -- snapshot at purchase time
    user_id        INTEGER NOT NULL REFERENCES user_account (user_id) ON DELETE RESTRICT
);
CREATE INDEX idx_orders_user ON orders (user_id, order_date);

-- 10a. ORDER_ITEM  (relationship ORDERS M:N PRODUCT)   PK(order_id, line_no)
--      unit_price is the price paid at purchase time, so later price changes
--      never rewrite past orders.
CREATE TABLE order_item (
    order_id       INTEGER NOT NULL REFERENCES orders (order_id) ON DELETE CASCADE,
    line_no        INTEGER NOT NULL CHECK (line_no >= 1),
    product_id     INTEGER NOT NULL REFERENCES product (product_id) ON DELETE RESTRICT,
    size           TEXT    NOT NULL,
    quantity       INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 99),
    unit_price     REAL    NOT NULL CHECK (unit_price >= 0),
    customization  TEXT,
    PRIMARY KEY (order_id, line_no),
    FOREIGN KEY (product_id, size) REFERENCES product_size (product_id, size)
);
CREATE INDEX idx_order_item_product ON order_item (product_id);

-- ---------------------------------------------------------------------
-- 11. FOLLOWS   (USER_ACCOUNT M:N TEAM)       PK(team_id, user_id)
-- ---------------------------------------------------------------------
CREATE TABLE follows (
    team_id  INTEGER NOT NULL REFERENCES team (team_id)         ON DELETE CASCADE,
    user_id  INTEGER NOT NULL REFERENCES user_account (user_id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);
CREATE INDEX idx_follows_user ON follows (user_id);

-- ---------------------------------------------------------------------
-- 12. FAVORITE_PLAYER   (USER_ACCOUNT M:N PLAYER)   PK(user_id, player_id)
-- ---------------------------------------------------------------------
CREATE TABLE favorite_player (
    user_id    INTEGER NOT NULL REFERENCES user_account (user_id) ON DELETE CASCADE,
    player_id  INTEGER NOT NULL REFERENCES player (player_id)     ON DELETE CASCADE,
    PRIMARY KEY (user_id, player_id)
);
CREATE INDEX idx_favorite_player_player ON favorite_player (player_id);

-- ---------------------------------------------------------------------
-- 13. SESSION   (a logged-in browser)               PK(token_hash)
--     Only the SHA-256 of the random cookie token is stored, so a leaked
--     database cannot be used to hijack a session.
-- ---------------------------------------------------------------------
CREATE TABLE session (
    token_hash  TEXT    PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES user_account (user_id) ON DELETE CASCADE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    expires_at  TEXT    NOT NULL
);
CREATE INDEX idx_session_user ON session (user_id);
