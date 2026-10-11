-- =====================================================================
--  FootVerse  |  Views for derived data (SQLite)
--
--  The design document removes derived attributes from the base tables
--  (TEAM.form, ORDERS.total, ...) and calculates them on demand.
--  These views are that calculation, so the numbers can never go stale.
-- =====================================================================

-- ---------------------------------------------------------------------
-- v_team_result : one row per (team, finished match) with W / D / L
-- ---------------------------------------------------------------------
CREATE VIEW v_team_result AS
SELECT home_team_id AS team_id, match_id, match_date,
       CASE WHEN home_score > away_score THEN 'W'
            WHEN home_score < away_score THEN 'L' ELSE 'D' END AS result
FROM   match_result
WHERE  status = 'FT'
UNION ALL
SELECT away_team_id, match_id, match_date,
       CASE WHEN away_score > home_score THEN 'W'
            WHEN away_score < home_score THEN 'L' ELSE 'D' END
FROM   match_result
WHERE  status = 'FT';

-- ---------------------------------------------------------------------
-- v_team_form : last five finished results, oldest -> newest ("WWDWW")
--               replaces the derived attribute TEAM.form
-- ---------------------------------------------------------------------
CREATE VIEW v_team_form AS
WITH ranked AS (
    SELECT team_id, match_id, match_date, result,
           ROW_NUMBER() OVER (PARTITION BY team_id
                              ORDER BY match_date DESC, match_id DESC) AS recency
    FROM   v_team_result
)
SELECT team_id,
       group_concat(result, '' ORDER BY match_date, match_id) AS form
FROM   ranked
WHERE  recency <= 5
GROUP  BY team_id;

-- ---------------------------------------------------------------------
-- v_team_standing : world rank (by rating), squad size and form per team
-- ---------------------------------------------------------------------
CREATE VIEW v_team_standing AS
SELECT t.team_id,
       RANK() OVER (ORDER BY t.rating DESC)                         AS world_rank,
       (SELECT COUNT(*) FROM player p WHERE p.team_id = t.team_id)  AS squad_count,
       COALESCE(f.form, '')                                         AS form
FROM   team t
LEFT   JOIN v_team_form f ON f.team_id = t.team_id;

-- ---------------------------------------------------------------------
-- v_player_ranking : global player rank by rating
-- ---------------------------------------------------------------------
CREATE VIEW v_player_ranking AS
SELECT player_id,
       RANK() OVER (ORDER BY rating DESC) AS global_rank
FROM   player;

-- ---------------------------------------------------------------------
-- v_order_total : subtotal, discount and grand total of every order
--                 replaces the derived attribute ORDERS.total
-- ---------------------------------------------------------------------
CREATE VIEW v_order_total AS
SELECT o.order_id,
       o.user_id,
       ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0), 2)                              AS subtotal,
       ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0) * o.discount_percent / 100.0, 2) AS discount_amount,
       o.shipping_fee,
       ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0) * (1 - o.discount_percent / 100.0)
             + CASE WHEN COUNT(oi.order_id) > 0 THEN o.shipping_fee ELSE 0 END, 2)           AS total
FROM   orders o
LEFT   JOIN order_item oi ON oi.order_id = o.order_id
GROUP  BY o.order_id;

-- ---------------------------------------------------------------------
-- v_user_rank : global rank of every user by xp
-- ---------------------------------------------------------------------
CREATE VIEW v_user_rank AS
SELECT user_id,
       RANK() OVER (ORDER BY xp DESC) AS global_rank
FROM   user_account;
