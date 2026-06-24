-- ==========================================
-- DDL Gamification Extension (Tables 20 to 28)
-- ==========================================

-- 20. Houses Table
CREATE TABLE IF NOT EXISTS houses (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color_hex VARCHAR(10) NOT NULL,
  total_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 21. Student Gamification Profile Table
CREATE TABLE IF NOT EXISTS student_gamification (
  user_id VARCHAR(36) PRIMARY KEY,
  level INT DEFAULT 1,
  xp_total INT DEFAULT 0,
  xp_next_level INT DEFAULT 1000,
  current_streak INT DEFAULT 0,
  house_id VARCHAR(36),
  streak_last_activity TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE SET NULL
);

-- 22. Student Learning Pets Table
CREATE TABLE IF NOT EXISTS student_pets (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  pet_type VARCHAR(50) NOT NULL,
  evolution_stage VARCHAR(50) DEFAULT 'BABY',
  pet_xp INT DEFAULT 0,
  nickname VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 23. Quests Table (Extends Assignments)
CREATE TABLE IF NOT EXISTS quests (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  reward_xp INT DEFAULT 100,
  quest_data_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 24. Quest Submissions Table
CREATE TABLE IF NOT EXISTS quests_submissions (
  id VARCHAR(36) PRIMARY KEY,
  quest_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  submission_url VARCHAR(512),
  completed_steps_json TEXT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_graded BOOLEAN DEFAULT FALSE,
  grade_assigned VARCHAR(5),
  marks_obtained INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 25. Boss Battles Table
CREATE TABLE IF NOT EXISTS boss_battles (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  time_limit_seconds INT DEFAULT 1800,
  reward_xp INT DEFAULT 300,
  difficulty VARCHAR(50) DEFAULT 'MEDIUM',
  questions_pool_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 26. Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  icon_name VARCHAR(100) NOT NULL,
  reward_xp INT DEFAULT 200,
  requirements_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 27. Student Badges Table
CREATE TABLE IF NOT EXISTS student_badges (
  student_id VARCHAR(36),
  badge_id VARCHAR(36),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, badge_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- 28. Student Knowledge Map Table
CREATE TABLE IF NOT EXISTS student_knowledge_map (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  subtopic VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'LEARNING',
  score_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_subtopic (student_id, subject, topic, subtopic)
);

-- ==========================================
-- Seeds (Gamification Data)
-- ==========================================

-- Seed Houses
INSERT INTO houses (id, name, color_hex, total_points, created_by) VALUES
('house-red', 'Red House', '#EF4444', 1250, 'admin'),
('house-blue', 'Blue House', '#3B82F6', 1100, 'admin'),
('house-green', 'Green House', '#10B981', 950, 'admin'),
('house-yellow', 'Yellow House', '#F59E0B', 800, 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Student Gamification
INSERT INTO student_gamification (user_id, level, xp_total, xp_next_level, current_streak, house_id, streak_last_activity, created_by) VALUES
('user-student-1', 18, 18450, 20000, 15, 'house-red', '2026-06-23 18:00:00', 'admin')
ON DUPLICATE KEY UPDATE level=VALUES(level), xp_total=VALUES(xp_total);

-- Seed Student Pets
INSERT INTO student_pets (id, student_id, pet_type, evolution_stage, pet_xp, nickname, created_by) VALUES
('pet-1', 'user-student-1', 'DRAGON', 'ADVANCED', 450, 'Ignis', 'admin')
ON DUPLICATE KEY UPDATE nickname=VALUES(nickname), evolution_stage=VALUES(evolution_stage);

-- Seed Badges
INSERT INTO badges (id, name, description, icon_name, reward_xp, requirements_json, created_by) VALUES
('badge-math', 'Math Hero', 'Complete 5 calculus challenges', 'Calculator', 200, '{"quests_completed": 5}', 'admin'),
('badge-science', 'Science Explorer', 'Watch 3 physics lectures', 'Compass', 200, '{"lectures_watched": 3}', 'admin'),
('badge-coding', 'Coding Star', 'Complete programming tasks', 'Code', 300, '{"coding_challenges": 1}', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Student Badges
INSERT IGNORE INTO student_badges (student_id, badge_id, unlocked_at) VALUES
('user-student-1', 'badge-math', '2026-06-20 10:00:00'),
('user-student-1', 'badge-science', '2026-06-22 14:00:00');

-- Seed Quests
INSERT INTO quests (id, class_id, title, description, reward_xp, quest_data_json, created_by) VALUES
('quest-math-1', 'class-math', 'Calculus Quest 1', 'Solve exercises 1-10 on page 42.', 150, '{"steps":["Read limits chapter","Solve exercise 1","Verify derivative definition"]}', 'user-teacher-1'),
('quest-science-1', 'class-science', 'Quantum Physics Quest', 'Write a 2-page essay on double-slit experiment.', 200, '{"steps":["Research wave-particle duality","Write outline","Submit draft"]}', 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Quest Submissions
INSERT INTO quests_submissions (id, quest_id, student_id, submission_url, completed_steps_json, completed_at, is_graded, grade_assigned, marks_obtained, feedback, created_by) VALUES
('quest-sub-1', 'quest-math-1', 'user-student-1', 'https://github.com/lucas/calculus-1', '["Read limits chapter","Solve exercise 1","Verify derivative definition"]', '2026-06-23 14:30:00', TRUE, 'A', 95, 'Great work on derivatives!', 'user-teacher-1')
ON DUPLICATE KEY UPDATE grade_assigned=VALUES(grade_assigned);

-- Seed Boss Battles
INSERT INTO boss_battles (id, class_id, title, time_limit_seconds, reward_xp, difficulty, questions_pool_json, created_by) VALUES
('boss-math-1', 'class-math', 'Calculus Boss Battle', 1800, 300, 'MEDIUM', '{"questions":[{"id":"q1","text":"Solve d/dx(x^2)"},{"id":"q2","text":"Solve d/dx(sin(x))"}]}', 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Student Knowledge Map
INSERT INTO student_knowledge_map (id, student_id, subject, topic, subtopic, status, score_percentage, created_by) VALUES
('map-1', 'user-student-1', 'Mathematics', 'Calculus', 'Limits', 'MASTERED', 95.00, 'admin'),
('map-2', 'user-student-1', 'Mathematics', 'Calculus', 'Derivatives', 'LEARNING', 70.00, 'admin'),
('map-3', 'user-student-1', 'Science', 'Quantum Mechanics', 'Double Slit', 'WEAK', 40.00, 'admin')
ON DUPLICATE KEY UPDATE status=VALUES(status);
