-- FootVerse | Example queries (run against db/footverse.db)

-- Q1. Clubs with derived rank, squad size and form (view + window function)
SELECT t.name, s.world_rank, s.squad_count, s.form
FROM team t JOIN v_team_standing s USING (team_id) ORDER BY s.world_rank;

-- Q2. Squad of a club with position category (3-table join)
SELECT p.name, p.shirt_number, p.position_name, pos.category, p.rating
FROM player p JOIN player_position pos USING (position_name) JOIN team t USING (team_id)
WHERE t.short_name = 'RMA' ORDER BY pos.category, p.shirt_number;

-- Q3. Average rating per position category (aggregate)
SELECT pos.category, COUNT(*) AS players, ROUND(AVG(p.rating),1) AS avg_rating
FROM player p JOIN player_position pos USING (position_name)
GROUP BY pos.category ORDER BY avg_rating DESC;

-- Q4. Order totals calculated from lines (replaces derived column ORDERS.total)
SELECT o.order_id, u.name, o.status, t.subtotal, t.discount_amount, t.shipping_fee, t.total
FROM orders o JOIN user_account u USING (user_id) JOIN v_order_total t USING (order_id);

-- Q5. Best selling products
SELECT pr.name, SUM(oi.quantity) AS units_sold, SUM(oi.quantity*oi.unit_price) AS revenue
FROM order_item oi JOIN product pr USING (product_id)
GROUP BY pr.product_id ORDER BY units_sold DESC;

-- Q6. Match results with team names (two FKs to TEAM)
SELECT m.match_date, h.short_name AS home, m.home_score, m.away_score, a.short_name AS away, m.status
FROM match_result m JOIN team h ON h.team_id=m.home_team_id JOIN team a ON a.team_id=m.away_team_id
ORDER BY m.match_date DESC;

-- Q7. Trophy cabinet with tags (weak entity + multi-valued attribute)
SELECT t.name, tr.year, tr.title, group_concat(tg.tag, ', ') AS tags
FROM trophy tr JOIN team t USING (team_id)
LEFT JOIN trophy_tag tg ON tg.team_id=tr.team_id AND tg.trophy_no=tr.trophy_no
GROUP BY tr.team_id, tr.trophy_no;

-- Q8. Fan leaderboard
SELECT r.global_rank, u.name, u.membership, u.xp
FROM v_user_rank r JOIN user_account u USING (user_id) ORDER BY r.global_rank;