-- =====================================================================
--  FootVerse  |  Seed data (SQLite)
--  Load order follows the foreign keys: parents first, children last.
-- =====================================================================

-- 1. TEAM  (4 club hubs + the 5 clubs they play against / supply players from)
INSERT INTO team (team_id, name, short_name, league, rating, ucl_titles, season_win_rate, established_year, slogan, logo_url, banner_url) VALUES
    (1, 'Manchester City', 'MCI', 'Premier League', 92.4, 1, 78, 1880, 'Superbia in Proelio', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsdXUFU6RDs7DqavjBRylSzH9YcgkxlSwdmMr7TRdvMdFqGJ3sw5LIx20RFW9tHgR4q8Zrd3Aa6bD5HoiHgAKFdhBFmxaV8bDVMAWgrWDJYupFrosWrYLyT60AkJLv5um7THNDKytopI1Qsvet7n9pNMfjCeetqylYin-phJSt_y4yyBWjQ46VdEg-Hlkqhkp3Qa54wimlbY6Stf6kOikZA7W1r8Ln-Im9WxqLQE4bTHOXvIvg4SKAgoPR_fYFJxA5t7woK3sXskCK', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA'),
    (2, 'Real Madrid', 'RMA', 'La Liga', 91.8, 15, 72, 1902, 'Hala Madrid y nada más', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1jsorxHSgFBWX9perPSWrZ9FvlcV2rCZJo-O4z6Azb1ZWW9yh0JHn0plVeDYqoEea7bFCQ9Tc1Bl83aZi9ZN1KIchT0PXYhECGaGuy1n9Cw-ZSDZuca3s1Kwa9_un1iTro93dd6TPnu3eAjNHBdaZDh1_Ftj4-oPtlQkiAsvINxA27y5qi9QjW_Ul2YHGFmwt4DiK9fzCixYsmZF0mAluBLnECjzzvUz6A_p5dVnE6gASSCtPP03jCN55vouR9S9Br9dsA99anwKR', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA'),
    (3, 'Liverpool FC', 'LIV', 'Premier League', 90.5, 6, 68, 1892, 'You''ll Never Walk Alone', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAlRyyk74du_I8dNB_xb5n-DXCuil6dftAV9nhw1RtZaOuDeie5CcsXD89XN7ch13Aiw0NbDHz4kfqhokrGpekRlSBCscCFZyDRtpvzvnITVYpXsYG0BOIICN-HwGNdNvzuTACOtS4FweSoVjurJzX5TMTISV5vJTH5YUQ672soMrEg_7MqNDI56uKcrguBqjQjq_ldSM9o3ndngrZzOvaxU6EvUwpCPXXIs3IVvZFHLPTqWYf-YwMgidNeIPltj0owE7XusqBxzaJ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA'),
    (4, 'Arsenal', 'ARS', 'Premier League', 89.9, 0, 65, 1886, 'Victoria Concordia Crescit', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsdXUFU6RDs7DqavjBRylSzH9YcgkxlSwdmMr7TRdvMdFqGJ3sw5LIx20RFW9tHgR4q8Zrd3Aa6bD5HoiHgAKFdhBFmxaV8bDVMAWgrWDJYupFrosWrYLyT60AkJLv5um7THNDKytopI1Qsvet7n9pNMfjCeetqylYin-phJSt_y4yyBWjQ46VdEg-Hlkqhkp3Qa54wimlbY6Stf6kOikZA7W1r8Ln-Im9WxqLQE4bTHOXvIvg4SKAgoPR_fYFJxA5t7woK3sXskCK', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK1ip5-kograX4IaAsTTxbCg7M3hq_PdsrfqzPSEo0p3Ce88YaNdZyi1q1cHVOJCs4KuFhbIKjUITxkyINN9Whn1CNQ0RKllyOWb-sxWFFV7XgiSAoz0gZ2HxdtBGbvZqJ79VeM4JLO3R-rKZIG3bG_rwGPGO8qjX0s24wV15OV-sV8dQlZ1McExiV-OkU5TTteL4OGQ3unWGtsGTD7xcm-VMKhX-5HOPHu7Eh5h2ksmqPYgslnwJFlqfK-4NX5fAOu9s3q5eJQ2tA'),
    (5, 'Bayern Munich', 'BAY', 'Bundesliga', 89.2, 6, 70, 1900, 'Mia san mia', NULL, NULL),
    (6, 'Chelsea', 'CHE', 'Premier League', 85.7, 2, 58, 1905, NULL, NULL, NULL),
    (7, 'Manchester United', 'MUN', 'Premier League', 84.9, 3, 55, 1878, NULL, NULL, NULL),
    (8, 'Atlético Madrid', 'ATM', 'La Liga', 86.3, 0, 60, 1903, NULL, NULL, NULL),
    (9, 'Borussia Dortmund', 'DOR', 'Bundesliga', 84.1, 1, 54, 1909, NULL, NULL, NULL);

-- 2. PLAYER_POSITION
INSERT INTO player_position (position_name, category) VALUES
    ('Center Back', 'DEF'),
    ('Center Forward', 'FWD'),
    ('Left Winger', 'FWD'),
    ('Right Winger', 'FWD'),
    ('Striker', 'FWD'),
    ('Goalkeeper', 'GK'),
    ('Midfielder', 'MID');

-- 3. PLAYER
INSERT INTO player (player_id, name, shirt_number, position_name, nationality, market_value_eur_m, rating, goals, assists, pass_accuracy, sprint_speed, stamina, recovery_rate, fitness_level, bio, last_match, instagram_handle, twitter_handle, image_url, team_id) VALUES
    (1, 'KYLIAN MBAPPÉ', 9, 'Striker', 'France', 180, 93, 38, 14, 86.2, 37.2, 96, 88, 'Peak', 'Unmatched explosive pace, clinical finishing, and high threat on counter-attacks.', 'RMA 3 - 0 ATM (2 Goals, 1 Assist)', '@k.mbappe', '@KMbappe', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB99DnUsOzCZYcrXdx6QwebiPzfvp4ilp_zMFRFbQs9smT5gN0Zd4Cl5IqOVA220n13W6F3W7YW_MaTfJf5yln8lBx3YWEGwlPFLmoQ6of6V_irstf7_eSyzkc7aporMW4Lrk1mVOyaIFedHIcHSFXAG29_ukFEu5NiYsOcSkTei0UFccRWhdSZtgT-gNwSS4ZHrux3ryIBHIRg54HvLsSIsfeBWB5Bzp0ZEdNrhIEd3T-4lakNWkX9mNnlQ5f3rrOutqBiJRVfWQjI', 2),
    (2, 'JUDE BELLINGHAM', 5, 'Midfielder', 'England', 180, 91, 23, 11, 91, 33.8, 92, 85, 'Optimal', 'Box-to-box midfield dominant force with exceptional late runs into the penalty box.', 'RMA 3 - 0 ATM (90 mins played, 92% pass accuracy)', '@judebellingham', '@BellinghamJude', 'https://lh3.googleusercontent.com/aida-public/AB6AXuClHVuvRIQOozSWI0UK4NfZXF1mizMtlYGxEINv3Gk8h_EGDpcNn2p0g-J8q9GshGMJYQlAAcI9wI0JhzIwqknqb-BtiKNRYPcjYdEdrEZjNg108CnS0JXyCh551GNfT_6UD07UEUkKAvzLg8H9SNvCiJDZxNXsU_ze0txBwaY8eNKYg2GQhgh4PYZLwSX1TmnOvu2h69jXa_8CMbgcTfiL2QMfYZBK2uaHfhN0_yU1A7wDGt5YANOGuR-N6HtFJf_jPcCphZl9lGBP', 2),
    (3, 'MOHAMED SALAH', 11, 'Right Winger', 'Egypt', 85, 90, 25, 15, 84.5, 34.6, 89, 80, 'Optimal', 'The Egyptian King, renowned for devastating cutting-in curling strikes.', 'LIV 1 - 1 CHE (1 Assist)', '@mosalah', '@MoSalah', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgUxbEsUNqSOZHL5MiHCfK8XEqVo8boePM6a1ekudEe2DSu4ocy-OIefKITBH36WJNdxQsLvMaS7eN14VrMv5yus7QZrhsGWBz8i0HrnpWAxSg0g1tHRkfWaoNgpZdVWp_FxRnSMzzWjwNEJmczD37XILP8lLynD5SqHY6QZZUYYcxK8UefB7OLluLiLLYUeg98Y4NIOiVfQkj_lslQhl_hmh-5mcz4DeedBqU1JhnGrzR9lq3HviJ73Zt-pDEG1LJkZdqNZMGTivh', 3),
    (4, 'ERLING HAALAND', 9, 'Center Forward', 'Norway', 180, 92, 32, 12, 88.4, 36.2, 94, 81, 'Peak', 'Pure goalscoring cyborg with insane physical presence.', 'MCI 2 - 1 ARS (1 Goal)', '@erling.haaland', '@ErlingHaaland', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjQu_Kkwto9EgKgWXP21wA-WtfZsL4RDeu08jpuD-Sbuhy1d-LaSwZhfqT0WSZQOhF2da7tJA9y3AEOy6UF1j28X1vPGC-D0WOLlMQtLiIZpzS33i1HWwUBZBjOa7F1j179swazWzJwdB-gbK1-nI87OYfYQXAdGaP1VO3j7oEYP4hhRV5571M2fLI3JtJgXSdTMc2PkwKPS_UsgHXqmVnyuBxjWUNeyttFwU339S71WO7ERMfTQg_MYk8s_1CDOc3WkM2LLlMf_q5', 1),
    (5, 'VINÍCIUS JR.', 7, 'Left Winger', 'Brazil', 150, 90, 22, 18, 81.2, 36.8, 91, 85, 'Peak', 'Electric dribbler with flair, devastating pace, and clutch finishing.', 'RMA 3 - 0 ATM (1 Goal)', '@vinijr', '@vinijr', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Wmkxt2VkMboRyujrMjcjX7EKbdF_z-aSgiL-pGna_yeiH1--rvJOSc_ObXuEyp8Ome8PaGQxwhBxBY12dIBpvH6mpnENyVIhX1DBkOAYv8PRWFjTtMwjnKk6PRqeJADxtDXLbbg_1A5kAoVhjHH6fgGTnhnXF3gCkiZ-AA15lwwueSUdRch0HZhWCOYnOkws_Z6GX2JyNW36crB4Jkv98ELXIvgCSTco3m2XXP2a54aBIyRYFKTS-LMnkXO95-y1NaL8OujlTNtV', 2),
    (6, 'KEVIN DE BRUYNE', 17, 'Midfielder', 'Belgium', 80, 91, 10, 25, 93.5, 29.5, 85, 75, 'Resting', 'The ultimate playmaker. Vision and passing range unmatched in world football.', 'MCI 2 - 1 ARS (2 Assists)', '@kevindebruyne', '@KevinDeBruyne', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxEoO3A510XDiPRepQ8RMQWRdcpa-2pG0GFl_BP2WlEJifIzLwU3AHF-HHz8iwED-HC0v1SniVjo0Sh7dCEPWw6nf6DkUAvTtxJrpNIUuAQCDENETjMwpiDisiCBNM881a3iR0lx8iWEVc8oGSAIKJndZdNNk536lFiM0X7zcf85MdtZLtRvaSRvdjp_XTYr4gqhtWoht4ZpJpsPp6cS-TRfzKN1xhLeHTv0CfOkJJTB2U_WeKOKpQ5253-9MjBrCXcSWZVIlM16X_', 1),
    (7, 'HARRY KANE', 9, 'Striker', 'England', 110, 90, 36, 10, 83, 30.1, 88, 82, 'Optimal', 'Complete forward. Elite finishing, holding up play, and dropping deep to assist.', 'BAY 4 - 0 DOR (2 Goals)', '@harrykane', '@HKane', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgUxbEsUNqSOZHL5MiHCfK8XEqVo8boePM6a1ekudEe2DSu4ocy-OIefKITBH36WJNdxQsLvMaS7eN14VrMv5yus7QZrhsGWBz8i0HrnpWAxSg0g1tHRkfWaoNgpZdVWp_FxRnSMzzWjwNEJmczD37XILP8lLynD5SqHY6QZZUYYcxK8UefB7OLluLiLLYUeg98Y4NIOiVfQkj_lslQhl_hmh-5mcz4DeedBqU1JhnGrzR9lq3HviJ73Zt-pDEG1LJkZdqNZMGTivh', 5),
    (8, 'THIBAUT COURTOIS', 1, 'Goalkeeper', 'Belgium', 45, 90, 0, 0, 88, 24.1, 70, 90, 'Peak', 'A wall in goal. Unbelievable reflexes and aerial command.', 'RMA 3 - 0 ATM (Clean Sheet, 6 Saves)', '@thibautcourtois', '@thibautcourtois', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO9nQXK1M-Xn7Y_x8hkijW5V7NcYOCKXFZuHfvDArGtfhT_E9jzd3jRhCwh5Dz_txEAuOsTDVDJ6f2UHRJw7NtGYzQO75OQ9f3gpo0om3kIhp6tis9Mk9JLaWQHx_cHCkMGhqpeeHolm7Cf8F2fiQjhSQE31aG35stMzi7QxAMafnfj96qA7hWasZ1kbub7wMDGhpdGwFm_5tTkgYLF-z_HONLbIBo_rIlohx1mzapviEt1fcvQEz0Mc4OpUEwftfYfDqbq8WOZtdZ', 2),
    (9, 'VIRGIL VAN DIJK', 4, 'Center Back', 'Netherlands', 50, 89, 3, 2, 90.5, 31.8, 86, 85, 'Optimal', 'Colossal central defender. Calm, commanding, and unbeatable in the air.', 'LIV 1 - 1 CHE (4 Clearances, 95% pass accuracy)', '@virgilvandijk', '@VirgilvDijk', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgUxbEsUNqSOZHL5MiHCfK8XEqVo8boePM6a1ekudEe2DSu4ocy-OIefKITBH36WJNdxQsLvMaS7eN14VrMv5yus7QZrhsGWBz8i0HrnpWAxSg0g1tHRkfWaoNgpZdVWp_FxRnSMzzWjwNEJmczD37XILP8lLynD5SqHY6QZZUYYcxK8UefB7OLluLiLLYUeg98Y4NIOiVfQkj_lslQhl_hmh-5mcz4DeedBqU1JhnGrzR9lq3HviJ73Zt-pDEG1LJkZdqNZMGTivh', 3),
    (10, 'BUKAYO SAKA', 7, 'Right Winger', 'England', 130, 88, 16, 14, 84.1, 34.5, 89, 83, 'Peak', 'Starboy. Dynamic, direct, and increasingly clinical in front of goal.', 'MCI 2 - 1 ARS (1 Assist)', '@bukayosaka87', '@BukayoSaka87', 'https://lh3.googleusercontent.com/aida-public/AB6AXuClHVuvRIQOozSWI0UK4NfZXF1mizMtlYGxEINv3Gk8h_EGDpcNn2p0g-J8q9GshGMJYQlAAcI9wI0JhzIwqknqb-BtiKNRYPcjYdEdrEZjNg108CnS0JXyCh551GNfT_6UD07UEUkKAvzLg8H9SNvCiJDZxNXsU_ze0txBwaY8eNKYg2GQhgh4PYZLwSX1TmnOvu2h69jXa_8CMbgcTfiL2QMfYZBK2uaHfhN0_yU1A7wDGt5YANOGuR-N6HtFJf_jPcCphZl9lGBP', 4);

-- 3a. PLAYER_LOAD
INSERT INTO player_load (player_id, day_no, load_pct) VALUES
    (1, 1, 40),
    (1, 2, 65),
    (1, 3, 85),
    (1, 4, 50),
    (1, 5, 95),
    (1, 6, 70),
    (1, 7, 80),
    (2, 1, 50),
    (2, 2, 70),
    (2, 3, 60),
    (2, 4, 80),
    (2, 5, 90),
    (2, 6, 65),
    (2, 7, 75),
    (3, 1, 45),
    (3, 2, 80),
    (3, 3, 75),
    (3, 4, 60),
    (3, 5, 85),
    (3, 6, 90),
    (3, 7, 70),
    (4, 1, 40),
    (4, 2, 65),
    (4, 3, 85),
    (4, 4, 50),
    (4, 5, 95),
    (4, 6, 70),
    (4, 7, 80),
    (5, 1, 40),
    (5, 2, 70),
    (5, 3, 85),
    (5, 4, 60),
    (5, 5, 90),
    (5, 6, 80),
    (5, 7, 75),
    (6, 1, 20),
    (6, 2, 40),
    (6, 3, 60),
    (6, 4, 50),
    (6, 5, 45),
    (6, 6, 30),
    (6, 7, 40),
    (7, 1, 50),
    (7, 2, 60),
    (7, 3, 70),
    (7, 4, 75),
    (7, 5, 80),
    (7, 6, 85),
    (7, 7, 90),
    (8, 1, 20),
    (8, 2, 30),
    (8, 3, 40),
    (8, 4, 35),
    (8, 5, 25),
    (8, 6, 30),
    (8, 7, 20),
    (9, 1, 40),
    (9, 2, 50),
    (9, 3, 60),
    (9, 4, 65),
    (9, 5, 70),
    (9, 6, 75),
    (9, 7, 80),
    (10, 1, 50),
    (10, 2, 60),
    (10, 3, 75),
    (10, 4, 80),
    (10, 5, 85),
    (10, 6, 90),
    (10, 7, 88);

-- 3b. PLAYER_HEATMAP  (no heat-map data captured yet)

-- 4. TROPHY
INSERT INTO trophy (team_id, trophy_no, year, title, description) VALUES
    (1, 1, 2023, 'The Historic Treble', 'Secured the Premier League, FA Cup, and first-ever UEFA Champions League trophy.'),
    (2, 1, 2024, '15th Champions League', 'Crown of European football extended at Wembley Stadium.');

-- 4a. TROPHY_TAG
INSERT INTO trophy_tag (team_id, trophy_no, tag) VALUES
    (1, 1, 'UCL'),
    (1, 1, 'EPL'),
    (1, 1, 'FA CUP');

-- 5. LEGEND
INSERT INTO legend (team_id, legend_no, name, title) VALUES
    (1, 1, 'David Silva', '''El Mago'' - 436 Appearances'),
    (1, 2, 'Sergio Agüero', 'All-Time Record Goalscorer'),
    (2, 1, 'Cristiano Ronaldo', '450 Goals in 438 Games');

-- 6. MATCH_RESULT
INSERT INTO match_result (match_id, match_date, league, home_team_id, away_team_id, home_score, away_score, status, minute, top_performer_id) VALUES
    (1, '2026-08-24', 'Premier League', 1, 7, 3, 1, 'FT', NULL, NULL),
    (2, '2026-08-31', 'Premier League', 6, 1, 0, 2, 'FT', NULL, NULL),
    (3, '2026-09-14', 'Champions League', 1, 9, 1, 1, 'FT', NULL, NULL),
    (4, '2026-09-21', 'Champions League', 5, 1, 1, 2, 'FT', NULL, NULL),
    (5, '2026-09-28', 'Champions League', 1, 8, 3, 0, 'FT', NULL, NULL),
    (6, '2026-08-25', 'Champions League', 2, 9, 2, 0, 'FT', NULL, NULL),
    (7, '2026-09-01', 'Champions League', 5, 2, 0, 1, 'FT', NULL, NULL),
    (8, '2026-09-15', 'Champions League', 2, 7, 2, 1, 'FT', NULL, NULL),
    (9, '2026-09-22', 'Champions League', 6, 2, 2, 0, 'FT', NULL, NULL),
    (10, '2026-09-29', 'La Liga', 2, 8, 3, 0, 'FT', NULL, NULL),
    (11, '2026-08-27', 'Champions League', 3, 8, 2, 0, 'FT', NULL, NULL),
    (12, '2026-09-03', 'Premier League', 7, 3, 1, 1, 'FT', NULL, NULL),
    (13, '2026-09-16', 'Champions League', 3, 5, 3, 1, 'FT', NULL, NULL),
    (14, '2026-09-23', 'Champions League', 9, 3, 0, 1, 'FT', NULL, NULL),
    (15, '2026-09-30', 'Premier League', 3, 6, 1, 1, 'FT', NULL, NULL),
    (16, '2026-08-28', 'Champions League', 8, 4, 1, 0, 'FT', NULL, NULL),
    (17, '2026-09-04', 'Premier League', 4, 7, 2, 0, 'FT', NULL, NULL),
    (18, '2026-09-17', 'Premier League', 6, 4, 1, 3, 'FT', NULL, NULL),
    (19, '2026-09-24', 'Champions League', 4, 5, 1, 1, 'FT', NULL, NULL),
    (20, '2026-10-01', 'Champions League', 4, 9, 2, 1, 'FT', NULL, NULL),
    (21, '2026-10-02', 'Premier League', 7, 6, 3, 1, 'FT', NULL, NULL),
    (22, '2026-10-03', 'Bundesliga', 5, 9, 4, 0, 'FT', NULL, NULL),
    (23, '2026-10-04', 'Premier League', 1, 4, 2, 1, 'LIVE', '88''', 4);

-- 7. USER_ACCOUNT
INSERT INTO user_account (user_id, command_id, name, email, password_hash, membership, xp, avatar_url, joined_date) VALUES
    (1, 'CMD-884920', 'MARCUS R. COMMAND', 'manager@footverse.com', 'scrypt$90fe8ea1dd70e1095e1a009a92dad167$af8e1c0f18f316e80d77beb6a162fb91957faf87dd6d38376aef77d5c7e2d112005ebe4b597797f919a313b28e49a6845a096d2a107b1ac79ad996e881c9e184', 'Elite', 1250, NULL, '2023-08-15'),
    (2, 'CMD-771204', 'AARAV MENON', 'aarav.menon@example.com', 'scrypt$fb197449e1137e50aa3765db81024772$055f8d80f4ec31d003361a4792c6383a8721e8df11b365f9dbe516bab3d2cf3507bec90f9c4f8e4a8945c0d8dbbc9e4eca25e201e563a5d4d449ca9d4e860092', 'Elite', 4820, NULL, '2024-02-03'),
    (3, 'CMD-662918', 'SOFIA MARTINS', 'sofia.martins@example.com', 'scrypt$90f3776d8fdf957bbbf9b667d7d580d4$3f33c33fbd203c6e1cd3e6a201e12a0b60f364f2458be429aab649d7b24183079172e72b6e17e58eb2610dbf382d7c60f56649f2eff63d0d1e8d753df2065b74', 'Pro', 3310, NULL, '2024-06-21'),
    (4, 'CMD-553107', 'LIAM O''CONNOR', 'liam.oconnor@example.com', 'scrypt$474d62a33fa89e0dc417a1d1199f1d04$0a90170e1b4461a4199f93260fc10bc25a0ed1719d19f87952cc391b29cd6e8f57c67e6fcecf2b3054cf8cd6fdca2e929a3927b2d02de8ec5ac7df632d424eb8', 'Pro', 2105, NULL, '2025-01-09');

-- Demo logins: manager@footverse.com / footverse123 (all four accounts use the same demo password)

-- 8. PRODUCT   (team_id for club merchandise, collection for brand lines)
INSERT INTO product (product_id, name, category, price, original_price, tag, description, image_url, team_id, collection) VALUES
    (1, 'Elite Home Jersey 24/25', 'Jerseys', 120, NULL, 'NEW', 'Engineered with Pro-Vapor sweat-wicking micro-mesh.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfxEKpy1siYL1Ovagwu6tCGSFSGnKpX4Gp83i3QUxpHcPo2w8c7l-UKXG3RBhDtfsRS9cQtmQvCit4Ict75DU_0AvlU-yh2yr9_7VH4hCQ5aR2GqGN6Ta7A9yDTZoVIoSHJbyiqBbiKNXRADxT_U44hqe6yuCoM-a5LsxWO3eE2DUHHDwas_7cKHROwDQk6aKigrbIZniZu4r8AEQJDjLwr-KmP2wc0Al-RhNtdH4EcAEJG9miT0VW1YEGmL6OB1-tMg2SHUZPckMP', 1, NULL),
    (2, 'Match Pro Ball - Stealth', 'Equipment', 165, NULL, 'LIMITED', 'Official match pro ball with aerodynamically textured surface panels.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0aeemSO7YUFHio_98CjFh87VGs4MjGVpbTr_riyBDPc4WTmjXbXrrguSQnUHqqtOX3D5hEbwZzLTmvHymxilIZ2_MCqB7b41xY6kEXa4KzmzPRnSDHahQTZeDi3T2ZiptIDHSdg1Ufu6kfj2kjRg528n1tuqpd_DeMCFsdtxc3h5ms9n6IRil86_PrPYEnesfPiQ4I1sSCfHAdfGjlPVxofic0ITUcv4KCvW9oKtWCK73kVUx4tOvnXUrEAmvG0KEsdDQvDC7-BzZ', NULL, 'Official FIFA Pro Edition'),
    (3, 'Tech-Flex Hoodie', 'Training Gear', 64.5, NULL, 'NEW', 'Breathable thermal fleece construction with water-repellent finish.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlsGGPtm3AE7vc2zlkCHPZfbSb6GEjLFjG8DuFOdlJM5lgg5px_eOFNgfn5Bp5zQHSKf1Juv8GU_3a7ESrCz0iJ7BcPKInc-gW8_sGV-iSBZFEimkrs5aHwz6oOfIPWJijGrItPsxQLGHS4KdplRomHOvILfFLk1rFekKad0bYoMFxaSH-O-w0ZCFQxgeb9EracTb_vi2CrgvqdnHAkY4OX2o6yMVtAUh0s_0ntpaPiue6M9H_v9xupjw1NkYwzESyOYbtg47nkrlh', NULL, 'FootVerse Command'),
    (4, 'Velocity Elite Boots', 'Shoes', 220, NULL, 'SALE', 'Ultra-light carbon fiber soleplate with chevron stud placement.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_XPSRhIxOP1zn2MFRNFtw6XIgG_cwbg47O8DnKv6EwAJ8zKBBQto603-FvwjmIyeHkOBhfcYBlhohRPaDXYI7_hEd3pj-GSFLKBvAKHoqP2ya3RGdpgT9cD_FAPempzAoDppshLAh1Q12hEpiVe8CfyNeTujNHaCGoKcQvt6Y8iiAwIX82doYfFg7oixo_q84RoinLfbWiAhHQiCI4Y_NL72ZxRmoZGQ1yWGQvn7qq7_bHYR7Ol5pzH66I7blKTWRKnrUUSkOvgtv', NULL, 'Pro Speed Series'),
    (7, 'Official Command Keychain', 'Accessories', 12, NULL, 'NEW', 'Solid metal keychain featuring the elite command crest.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGVF7xS78vzXSz7zMroQ8tCFllqgTO_DYpDc0wvlR_X37_gkA-faStrfvOPQ6DFcwKKSf-gDll3P9GOCGtS8ltc4CG0BrCJBbOEUu1lcvsgAXdygrK3eNZgGVSHmps0kYsLVpm-_9uTSfeReDjKTQSUGb6wwmd2JE8TGSWzisV60oZZkilwBf-AvmkL2cYzntHTQ39GTonwyF57yWWonu8QB0pWhu5ajpfHRwnQIrxIXBhxsl5ceS_0WdEcO4La_L84snwfbOgIDOU', NULL, 'FootVerse'),
    (8, 'Haaland Mascot Plushie', 'Collectibles', 28, NULL, NULL, 'Soft, high-quality plush collectible.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjQu_Kkwto9EgKgWXP21wA-WtfZsL4RDeu08jpuD-Sbuhy1d-LaSwZhfqT0WSZQOhF2da7tJA9y3AEOy6UF1j28X1vPGC-D0WOLlMQtLiIZpzS33i1HWwUBZBjOa7F1j179swazWzJwdB-gbK1-nI87OYfYQXAdGaP1VO3j7oEYP4hhRV5571M2fLI3JtJgXSdTMc2PkwKPS_UsgHXqmVnyuBxjWUNeyttFwU339S71WO7ERMfTQg_MYk8s_1CDOc3WkM2LLlMf_q5', 1, NULL),
    (10, 'Real Madrid Away Jersey', 'Jerseys', 125, NULL, NULL, 'Authentic away colors.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfxEKpy1siYL1Ovagwu6tCGSFSGnKpX4Gp83i3QUxpHcPo2w8c7l-UKXG3RBhDtfsRS9cQtmQvCit4Ict75DU_0AvlU-yh2yr9_7VH4hCQ5aR2GqGN6Ta7A9yDTZoVIoSHJbyiqBbiKNXRADxT_U44hqe6yuCoM-a5LsxWO3eE2DUHHDwas_7cKHROwDQk6aKigrbIZniZu4r8AEQJDjLwr-KmP2wc0Al-RhNtdH4EcAEJG9miT0VW1YEGmL6OB1-tMg2SHUZPckMP', 2, NULL),
    (11, 'Liverpool Training Top', 'Training Gear', 55, NULL, NULL, 'Official Melwood training kit.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlsGGPtm3AE7vc2zlkCHPZfbSb6GEjLFjG8DuFOdlJM5lgg5px_eOFNgfn5Bp5zQHSKf1Juv8GU_3a7ESrCz0iJ7BcPKInc-gW8_sGV-iSBZFEimkrs5aHwz6oOfIPWJijGrItPsxQLGHS4KdplRomHOvILfFLk1rFekKad0bYoMFxaSH-O-w0ZCFQxgeb9EracTb_vi2CrgvqdnHAkY4OX2o6yMVtAUh0s_0ntpaPiue6M9H_v9xupjw1NkYwzESyOYbtg47nkrlh', 3, NULL);

-- 8a. PRODUCT_SIZE
INSERT INTO product_size (product_id, size, size_order) VALUES
    (1, 'S', 1),
    (1, 'M', 2),
    (1, 'L', 3),
    (1, 'XL', 4),
    (1, 'XXL', 5),
    (2, 'Size 5', 1),
    (3, 'S', 1),
    (3, 'M', 2),
    (3, 'L', 3),
    (3, 'XL', 4),
    (4, '8.0', 1),
    (4, '9.0', 2),
    (4, '10.0', 3),
    (4, '11.0', 4),
    (4, '12.0', 5),
    (7, 'One Size', 1),
    (8, 'One Size', 1),
    (10, 'M', 1),
    (10, 'L', 2),
    (10, 'XL', 3),
    (11, 'S', 1),
    (11, 'M', 2),
    (11, 'L', 3);

-- 9. DISCOUNT
INSERT INTO discount (code, percent) VALUES
    ('PRO10', 10),
    ('FIFA20', 20);

-- 10. ORDERS
INSERT INTO orders (order_id, order_date, status, shipping_fee, discount_code, discount_percent, user_id) VALUES
    (1, '2026-09-10', 'Delivered', 15, 'PRO10', 10, 2),
    (2, '2026-09-28', 'Shipped', 15, NULL, 0, 3);

-- 10a. ORDER_ITEM
INSERT INTO order_item (order_id, line_no, product_id, size, quantity, unit_price, customization) VALUES
    (1, 1, 1, 'L', 1, 120, 'HAALAND 9'),
    (1, 2, 7, 'One Size', 2, 12, NULL),
    (2, 1, 4, '10.0', 1, 220, NULL);

-- 11. FOLLOWS
INSERT INTO follows (team_id, user_id) VALUES
    (1, 1),
    (2, 1),
    (1, 2),
    (2, 2),
    (3, 3),
    (4, 4);

-- 12. FAVORITE_PLAYER
INSERT INTO favorite_player (user_id, player_id) VALUES
    (1, 1),
    (1, 2),
    (1, 4),
    (2, 1),
    (2, 4),
    (3, 3);

