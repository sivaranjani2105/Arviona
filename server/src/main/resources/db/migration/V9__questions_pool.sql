-- ─────────────────────────────────────────────────────────────────────────────
-- V9: Real Database Questions Pool
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
    id              VARCHAR(36) PRIMARY KEY,
    subject         VARCHAR(100) NOT NULL,
    difficulty      VARCHAR(50) NOT NULL,
    text            TEXT NOT NULL,
    options         VARCHAR(1024) NOT NULL COMMENT 'Semicolon-separated list of MCQ options',
    correct_answer  VARCHAR(255) NOT NULL,
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100)
);

-- Seed Mathematics Questions
INSERT IGNORE INTO questions (id, subject, difficulty, text, options, correct_answer, created_by) VALUES
('q-m1', 'Mathematics', 'EASY', 'What is 12 × 8?', '96;94;98;88', '96', 'system'),
('q-m2', 'Mathematics', 'EASY', 'Solve: x + 7 = 15', '7;8;6;9', '8', 'system'),
('q-m3', 'Mathematics', 'EASY', 'What is the square root of 144?', '12;14;16;10', '12', 'system'),
('q-m4', 'Mathematics', 'MEDIUM', 'Find the derivative of x³', '3x²;x²;3x;2x³', '3x²', 'system'),
('q-m5', 'Mathematics', 'MEDIUM', 'Integrate 2x dx', 'x²+C;2x²+C;x+C;2+C', 'x²+C', 'system'),
('q-m6', 'Mathematics', 'MEDIUM', 'Solve: 2x - 3 = 11', '7;6;8;9', '7', 'system'),
('q-m7', 'Mathematics', 'HARD', 'Solve: d/dx[sin(x²)]', '2x·cos(x²);cos(x²);2sin(x);cos(2x)', '2x·cos(x²)', 'system'),
('q-m8', 'Mathematics', 'HARD', 'What is the limit of (sin x)/x as x approaches 0?', '0;1;undefined;infinity', '1', 'system');

-- Seed Physics Questions
INSERT IGNORE INTO questions (id, subject, difficulty, text, options, correct_answer, created_by) VALUES
('q-p1', 'Physics', 'EASY', 'What is the SI unit of Force?', 'Newton;Joule;Watt;Pascal', 'Newton', 'system'),
('q-p2', 'Physics', 'EASY', 'Speed of light in vacuum is approximately?', '3×10⁸ m/s;3×10⁶ m/s;3×10¹⁰ m/s;3×10⁴ m/s', '3×10⁸ m/s', 'system'),
('q-p3', 'Physics', 'EASY', 'What determines the pitch of a sound wave?', 'Amplitude;Wavelength;Frequency;Speed', 'Frequency', 'system'),
('q-p4', 'Physics', 'MEDIUM', 'State Newton\'s 2nd Law', 'F=ma;F=mv;E=mc²;P=mv', 'F=ma', 'system'),
('q-p5', 'Physics', 'MEDIUM', 'What is the formula for kinetic energy?', 'mgh;mv;½mv²;ma', '½mv²', 'system'),
('q-p6', 'Physics', 'HARD', 'What is the Heisenberg Uncertainty Principle?', 'Δx·Δp ≥ ℏ/2;E=hf;F=ma;PV=nRT', 'Δx·Δp ≥ ℏ/2', 'system'),
('q-p7', 'Physics', 'HARD', 'Photoelectric effect threshold frequency depends on?', 'Work function;Intensity;Speed;Temperature', 'Work function', 'system');

-- Seed Chemistry Questions
INSERT IGNORE INTO questions (id, subject, difficulty, text, options, correct_answer, created_by) VALUES
('q-c1', 'Chemistry', 'EASY', 'What is the chemical symbol for Gold?', 'Au;Ag;Fe;Gd', 'Au', 'system'),
('q-c2', 'Chemistry', 'EASY', 'What is the pH of pure water?', '7;5;8;6', '7', 'system'),
('q-c3', 'Chemistry', 'EASY', 'What is the molecular formula for Ozone?', 'O₃;O₂;H₂O;CO₂', 'O₃', 'system'),
('q-c4', 'Chemistry', 'MEDIUM', 'Avogadro\'s number is approximately?', '6.022×10²³;6.022×10²⁰;6.022×10²⁶;3.14×10²³', '6.022×10²³', 'system'),
('q-c5', 'Chemistry', 'MEDIUM', 'What is the gas law formula?', 'PV=nRT;P=F/A;F=ma;E=mc²', 'PV=nRT', 'system');
