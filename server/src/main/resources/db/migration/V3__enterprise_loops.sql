-- =======================================================
-- DDL Enterprise Loops Extension (Tables 29 to 34)
-- =======================================================

-- 1. Alter student_gamification to add coins_balance
ALTER TABLE student_gamification ADD COLUMN coins_balance INT DEFAULT 0;

-- 2. Alter quests to support Quest Chains
ALTER TABLE quests ADD COLUMN parent_quest_id VARCHAR(36) NULL;
ALTER TABLE quests ADD COLUMN chain_name VARCHAR(100) NULL;
ALTER TABLE quests ADD CONSTRAINT fk_quests_parent FOREIGN KEY (parent_quest_id) REFERENCES quests(id) ON DELETE SET NULL;

-- 3. Store Items Table
CREATE TABLE IF NOT EXISTS store_items (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price_coins INT NOT NULL,
  details_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. Student Inventory Table
CREATE TABLE IF NOT EXISTS student_inventory (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  is_equipped BOOLEAN DEFAULT FALSE NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES store_items(id) ON DELETE CASCADE
);

-- 5. Student Daily Journeys Table
CREATE TABLE IF NOT EXISTS student_daily_journeys (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  journey_date DATE NOT NULL,
  mission_1_completed BOOLEAN DEFAULT FALSE NOT NULL,
  mission_2_completed BOOLEAN DEFAULT FALSE NOT NULL,
  mission_3_completed BOOLEAN DEFAULT FALSE NOT NULL,
  daily_bonus_claimed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_date (student_id, journey_date)
);

-- 6. School Events Table
CREATE TABLE IF NOT EXISTS school_events (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  duration_days INT NOT NULL,
  reward_xp INT DEFAULT 0,
  reward_coins INT DEFAULT 0,
  badge_id VARCHAR(36) NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE SET NULL
);

-- 7. Parent Engagement Challenges Table
CREATE TABLE IF NOT EXISTS parent_engagement_challenges (
  id VARCHAR(36) PRIMARY KEY,
  parent_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  description VARCHAR(255) NOT NULL,
  reward_xp INT DEFAULT 100,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Classroom Collaboration Table
CREATE TABLE IF NOT EXISTS class_collaborations (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  target_xp INT NOT NULL,
  current_xp INT DEFAULT 0,
  reward_xp INT DEFAULT 200,
  reward_coins INT DEFAULT 50,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- =======================================================
-- Seeds (Enterprise Loop Data)
-- =======================================================

-- Update seed user to have default coins
UPDATE student_gamification SET coins_balance = 450 WHERE user_id = 'user-student-1';

-- Seed Store Items
INSERT INTO store_items (id, name, type, price_coins, details_json, created_by) VALUES
('item-frame-neon', 'Neon Cyber Frame', 'AVATAR_FRAME', 150, '{"borderColor":"#818CF8","glow":true}', 'admin'),
('item-theme-retro', 'Retro Arcade Theme', 'THEME', 300, '{"primaryColor":"#F43F5E","bgColor":"#0F172A"}', 'admin'),
('item-booster-2x', '2x Daily XP Booster', 'BOOSTER', 200, '{"multiplier":2.0,"durationHours":24}', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Quest Chains (Calculus Chain)
INSERT INTO quests (id, class_id, title, description, reward_xp, quest_data_json, parent_quest_id, chain_name, created_by) VALUES
('quest-math-2', 'class-math', 'Calculus Chain Part 2: Derivatives', 'Solve derivatives challenges on page 50.', 200, '{"steps":["Derivatives worksheet","Differentiate sin(x)","Verify power rule"]}', 'quest-math-1', 'Calculus Kingdom', 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed School Events (Active)
INSERT INTO school_events (id, name, description, duration_days, reward_xp, reward_coins, badge_id, active, start_date, created_by) VALUES
('event-science-week', 'Science Innovation Week', 'Compete with your peers globally in science topics to earn the Special Badge and XP!', 7, 500, 100, 'badge-science', TRUE, '2026-06-25', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Classroom Collaborations
INSERT INTO class_collaborations (id, class_id, title, target_xp, current_xp, reward_xp, reward_coins, active, created_by) VALUES
('collab-math-1', 'class-math', 'Algebra Master Challenge', 1000, 750, 200, 50, TRUE, 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Parent Engagement Challenges
INSERT INTO parent_engagement_challenges (id, parent_id, student_id, description, reward_xp, is_completed, created_by) VALUES
('challenge-parent-1', 'user-parent-1', 'user-student-1', 'Review Calculus limits chapter with your child for 15 minutes.', 150, FALSE, 'admin')
ON DUPLICATE KEY UPDATE description=VALUES(description);
