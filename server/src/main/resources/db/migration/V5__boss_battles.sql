-- ─────────────────────────────────────────────────────────────────────────────
-- V5: Boss Battle System
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS boss_battles (
    id              VARCHAR(36) PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    subject         VARCHAR(100) NOT NULL,
    difficulty      ENUM('EASY','MEDIUM','HARD','LEGENDARY') DEFAULT 'MEDIUM',
    time_limit_mins INT NOT NULL DEFAULT 30,
    total_questions INT NOT NULL DEFAULT 10,
    xp_reward       INT NOT NULL DEFAULT 300,
    coins_reward    INT NOT NULL DEFAULT 100,
    class_id        VARCHAR(36),
    created_by_teacher VARCHAR(36),
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS boss_battle_attempts (
    id              VARCHAR(36) PRIMARY KEY,
    battle_id       VARCHAR(36) NOT NULL,
    student_id      VARCHAR(36) NOT NULL,
    score           INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    status          ENUM('IN_PROGRESS','COMPLETED','ABANDONED') DEFAULT 'IN_PROGRESS',
    xp_awarded      INT DEFAULT 0,
    coins_awarded   INT DEFAULT 0,
    started_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    submitted_at    DATETIME,
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    FOREIGN KEY (battle_id) REFERENCES boss_battles(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Seed 3 sample boss battles
INSERT IGNORE INTO boss_battles
    (id, title, description, subject, difficulty, time_limit_mins, total_questions, xp_reward, coins_reward, is_active, is_deleted, created_by)
VALUES
    ('bb-001', 'Calculus Showdown', 'Prove your mastery of derivatives and integrals in this timed challenge!', 'Mathematics', 'MEDIUM', 30, 5, 300, 100, 1, 0, 'system'),
    ('bb-002', 'Quantum Gauntlet', 'Face the ultimate test of quantum mechanics — only the strongest survive!', 'Physics', 'HARD', 45, 5, 500, 200, 1, 0, 'system'),
    ('bb-003', 'Algebra Warmup', 'A gentle intro battle to warm up your math skills.', 'Mathematics', 'EASY', 20, 5, 150, 50, 1, 0, 'system');
