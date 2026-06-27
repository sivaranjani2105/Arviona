-- ─────────────────────────────────────────────────────────────────────────────
-- V6: Admin / School Configuration System
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gamification_config (
    id          VARCHAR(36) PRIMARY KEY,
    action_key  VARCHAR(100) NOT NULL UNIQUE,
    label       VARCHAR(200) NOT NULL,
    xp_value    INT NOT NULL DEFAULT 0,
    coins_value INT NOT NULL DEFAULT 0,
    is_deleted  TINYINT(1) NOT NULL DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by  VARCHAR(100),
    updated_by  VARCHAR(100)
);

-- Default XP values per action (configurable per school by admin)
INSERT IGNORE INTO gamification_config
    (id, action_key, label, xp_value, coins_value, is_deleted, created_by)
VALUES
    (UUID(), 'watch_lecture',       'Watch a Video Lecture',         20, 5,   0, 'system'),
    (UUID(), 'complete_quiz',       'Complete a Quiz',               50, 15,  0, 'system'),
    (UUID(), 'submit_quest',        'Submit a Quest',                75, 20,  0, 'system'),
    (UUID(), 'win_boss_battle',     'Win a Boss Battle',            300, 100, 0, 'system'),
    (UUID(), 'ai_tutor_session',    'AI Tutor Session',              10, 3,   0, 'system'),
    (UUID(), 'daily_streak_3',      '3-Day Streak Bonus',            50, 20,  0, 'system'),
    (UUID(), 'daily_streak_7',      '7-Day Streak Bonus',           100, 40,  0, 'system'),
    (UUID(), 'daily_streak_30',     '30-Day Streak Bonus',          500, 200, 0, 'system'),
    (UUID(), 'complete_daily_mission', 'Complete All Daily Missions', 200, 50, 0, 'system'),
    (UUID(), 'upload_assignment',   'Upload an Assignment',          30, 10,  0, 'system'),
    (UUID(), 'invite_parent',       'Link a Parent Account',         25, 10,  0, 'system');

-- Admin roles (super admin can manage multiple schools)
INSERT IGNORE INTO roles (id, name) VALUES
    (UUID(), 'ROLE_ADMIN'),
    (UUID(), 'ROLE_SUPER_ADMIN');
