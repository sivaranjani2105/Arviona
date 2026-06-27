-- ─────────────────────────────────────────────────────────────────────────────
-- V8: Weekly Reports + Engagement Logs
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS weekly_reports (
    id              VARCHAR(36) PRIMARY KEY,
    student_id      VARCHAR(36) NOT NULL,
    student_name    VARCHAR(200),
    teacher_id      VARCHAR(36) NOT NULL,
    teacher_name    VARCHAR(200),
    teacher_notes   TEXT,
    strengths       TEXT,
    weak_topics     TEXT,
    xp_this_week    INT DEFAULT 0,
    sent_to_parent  TINYINT(1) DEFAULT 0,
    sent_at         DATETIME,
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    INDEX idx_wr_teacher (teacher_id),
    INDEX idx_wr_student (student_id)
);

-- Real engagement log for teacher heatmap (replaces Math.random() on frontend)
CREATE TABLE IF NOT EXISTS engagement_logs (
    id              VARCHAR(36) PRIMARY KEY,
    student_id      VARCHAR(36) NOT NULL,
    action_type     VARCHAR(100) NOT NULL COMMENT 'e.g. QUEST_START, BOSS_BATTLE, AI_TUTOR, LOGIN',
    duration_secs   INT DEFAULT 0,
    day_of_week     TINYINT COMMENT '1=Monday..7=Sunday',
    hour_of_day     TINYINT COMMENT '0-23',
    logged_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    INDEX idx_eng_student_day (student_id, day_of_week),
    FOREIGN KEY (student_id) REFERENCES users(id)
);
