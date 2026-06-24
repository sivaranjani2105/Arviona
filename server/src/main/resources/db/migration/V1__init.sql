-- ==========================================
-- DDL Schema Initialization (Tables 1 to 19)
-- ==========================================

-- 1. Institutions Table (Multi-Tenancy Root)
CREATE TABLE IF NOT EXISTS institutions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255)
);

-- 3. Roles Table
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255)
);

-- 4. Role Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id VARCHAR(36),
  permission_id VARCHAR(36),
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 5. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  institution_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  INDEX idx_user_email (email)
);

-- 6. User Roles Mapping
CREATE TABLE IF NOT EXISTS user_roles (
  user_id VARCHAR(36),
  role_id VARCHAR(36),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 7. Parents-Students Linkage Table
CREATE TABLE IF NOT EXISTS parent_student_links (
  parent_id VARCHAR(36),
  student_id VARCHAR(36),
  PRIMARY KEY (parent_id, student_id),
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Classes
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(36) PRIMARY KEY,
  institution_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  teacher_id VARCHAR(36),
  schedule_days VARCHAR(50),
  schedule_time VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  student_id VARCHAR(36),
  class_id VARCHAR(36),
  PRIMARY KEY (student_id, class_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 10. File Storage Metadata
CREATE TABLE IF NOT EXISTS files (
  id VARCHAR(36) PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path VARCHAR(512) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 11. Lectures
CREATE TABLE IF NOT EXISTS lectures (
  id VARCHAR(36) PRIMARY KEY,
  institution_id VARCHAR(36) NOT NULL,
  class_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  file_id VARCHAR(36),
  recorded_date DATE NOT NULL,
  duration_mins INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);

-- 12. Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(36) PRIMARY KEY,
  institution_id VARCHAR(36) NOT NULL,
  class_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  total_marks INT DEFAULT 100,
  attachment_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (attachment_id) REFERENCES files(id) ON DELETE SET NULL
);

-- 13. Submissions
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(36) PRIMARY KEY,
  institution_id VARCHAR(36) NOT NULL,
  assignment_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  file_id VARCHAR(36),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  grade VARCHAR(5),
  marks_obtained INT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);

-- 14. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(36) PRIMARY KEY,
  class_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('PRESENT', 'ABSENT', 'LATE', 'LEAVE') NOT NULL,
  remarks VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 15. Gradebook Table
CREATE TABLE IF NOT EXISTS grades (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  class_id VARCHAR(36) NOT NULL,
  assessment_name VARCHAR(150) NOT NULL,
  marks DECIMAL(5,2) NOT NULL,
  total_marks DECIMAL(5,2) NOT NULL,
  grade VARCHAR(5),
  remarks VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 16. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 17. Conversation Participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id VARCHAR(36),
  user_id VARCHAR(36),
  PRIMARY KEY (conversation_id, user_id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 18. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  sender_id VARCHAR(36) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 19. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- Seeds (Baseline Data)
-- ==========================================

-- Seed Institution
INSERT INTO institutions (id, name, created_by)
VALUES ('inst-1', 'Arviona International School', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Permissions
INSERT INTO permissions (id, name, description) VALUES
('perm-1', 'ASSIGNMENT_WRITE', 'Allows creating and editing assignments'),
('perm-2', 'ASSIGNMENT_READ', 'Allows viewing assignments'),
('perm-3', 'GRADE_WRITE', 'Allows entering and updating grades'),
('perm-4', 'GRADE_READ', 'Allows viewing grades'),
('perm-5', 'ATTENDANCE_WRITE', 'Allows logging class attendance'),
('perm-6', 'ATTENDANCE_READ', 'Allows viewing attendance records'),
('perm-7', 'LECTURE_WRITE', 'Allows uploading recorded lectures'),
('perm-8', 'LECTURE_READ', 'Allows viewing/downloading lectures')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Roles
INSERT INTO roles (id, name, description) VALUES
('role-student', 'ROLE_STUDENT', 'Academic Student Persona'),
('role-teacher', 'ROLE_TEACHER', 'Academic Teacher Persona'),
('role-parent', 'ROLE_PARENT', 'Student Guardian Persona'),
('role-admin', 'ROLE_ADMIN', 'System Administrator')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Map Permissions to Roles
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('role-teacher', 'perm-1'),
('role-teacher', 'perm-2'),
('role-teacher', 'perm-3'),
('role-teacher', 'perm-4'),
('role-teacher', 'perm-5'),
('role-teacher', 'perm-6'),
('role-teacher', 'perm-7'),
('role-teacher', 'perm-8'),
('role-student', 'perm-2'),
('role-student', 'perm-4'),
('role-student', 'perm-6'),
('role-student', 'perm-8'),
('role-parent', 'perm-2'),
('role-parent', 'perm-4'),
('role-parent', 'perm-6'),
('role-parent', 'perm-8');

-- Seed Users
-- Password is 'password' (bcrypt: $2b$12$f0g6PhaLThhspSrBitXOPe6WNff.EVZMK7Bpzd.fJlz0t52Xm6H.2)
INSERT INTO users (id, institution_id, name, email, password_hash, created_by) VALUES
('user-student-1', 'inst-1', 'Lucas Miller', 'student@arviona.com', '$2b$12$f0g6PhaLThhspSrBitXOPe6WNff.EVZMK7Bpzd.fJlz0t52Xm6H.2', 'admin'),
('user-teacher-1', 'inst-1', 'Sarah Connor', 'teacher@arviona.com', '$2b$12$f0g6PhaLThhspSrBitXOPe6WNff.EVZMK7Bpzd.fJlz0t52Xm6H.2', 'admin'),
('user-parent-1', 'inst-1', 'John Miller', 'parent@arviona.com', '$2b$12$f0g6PhaLThhspSrBitXOPe6WNff.EVZMK7Bpzd.fJlz0t52Xm6H.2', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Map Users to Roles
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
('user-student-1', 'role-student'),
('user-teacher-1', 'role-teacher'),
('user-parent-1', 'role-parent');

-- Link Parent to Student
INSERT IGNORE INTO parent_student_links (parent_id, student_id) VALUES
('user-parent-1', 'user-student-1');

-- Seed Classes
INSERT INTO classes (id, institution_id, name, teacher_id, schedule_days, schedule_time, created_by) VALUES
('class-math', 'inst-1', 'Advanced Mathematics', 'user-teacher-1', 'Mon,Wed,Fri', '09:00 AM', 'admin'),
('class-science', 'inst-1', 'Physics & Chemistry', 'user-teacher-1', 'Tue,Thu', '11:00 AM', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Enroll Student in Classes
INSERT IGNORE INTO enrollments (student_id, class_id) VALUES
('user-student-1', 'class-math'),
('user-student-1', 'class-science');

-- Seed Lectures
INSERT INTO lectures (id, institution_id, class_id, title, file_id, recorded_date, duration_mins, created_by) VALUES
('lec-1', 'inst-1', 'class-math', 'Introduction to Calculus', NULL, '2026-06-20', 45, 'user-teacher-1'),
('lec-2', 'inst-1', 'class-science', 'Quantum Mechanics Basics', NULL, '2026-06-22', 60, 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Assignments
INSERT INTO assignments (id, institution_id, class_id, title, description, due_date, total_marks, created_by) VALUES
('assign-1', 'inst-1', 'class-math', 'Calculus Assignment 1', 'Solve exercises 1-10 on page 42.', '2026-07-10 23:59:59', 100, 'user-teacher-1'),
('assign-2', 'inst-1', 'class-science', 'Quantum Physics Quiz', 'Write a 2-page essay on double-slit experiment.', '2026-07-15 23:59:59', 50, 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Submissions
INSERT INTO submissions (id, institution_id, assignment_id, student_id, file_id, submitted_at, grade, marks_obtained, feedback, created_by) VALUES
('sub-1', 'inst-1', 'assign-1', 'user-student-1', NULL, '2026-06-23 14:30:00', 'A', 95, 'Great work on derivatives!', 'user-teacher-1')
ON DUPLICATE KEY UPDATE grade=VALUES(grade), marks_obtained=VALUES(marks_obtained);

-- Seed Attendance
INSERT INTO attendance (id, class_id, student_id, attendance_date, status, remarks, created_by) VALUES
('att-1', 'class-math', 'user-student-1', '2026-06-22', 'PRESENT', 'On time', 'user-teacher-1'),
('att-2', 'class-science', 'user-student-1', '2026-06-23', 'LATE', 'Traffic delay', 'user-teacher-1')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Seed Grades
INSERT INTO grades (id, student_id, class_id, assessment_name, marks, total_marks, grade, remarks, created_by) VALUES
('grade-1', 'user-student-1', 'class-math', 'Midterm Calculus', 88.50, 100.00, 'B+', 'Good effort', 'user-teacher-1'),
('grade-2', 'user-student-1', 'class-science', 'Lab Report 1', 48.00, 50.00, 'A', 'Perfect experiment notes', 'user-teacher-1')
ON DUPLICATE KEY UPDATE marks=VALUES(marks), grade=VALUES(grade);

-- Seed Conversations
INSERT INTO conversations (id, name, created_by) VALUES
('conv-1', 'Sarah & Lucas', 'user-teacher-1'),
('conv-2', 'Sarah & John (Parent)', 'user-teacher-1')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Conversation Participants
INSERT IGNORE INTO conversation_participants (conversation_id, user_id) VALUES
('conv-1', 'user-teacher-1'),
('conv-1', 'user-student-1'),
('conv-2', 'user-teacher-1'),
('conv-2', 'user-parent-1');

-- Seed Messages
INSERT INTO messages (id, conversation_id, sender_id, message, created_by) VALUES
('msg-1', 'conv-1', 'user-teacher-1', 'Hello Lucas, do you have any questions on the calculus assignment?', 'user-teacher-1'),
('msg-2', 'conv-1', 'user-student-1', 'Yes Mrs. Sarah, I am working on question 5, will ask tomorrow.', 'user-student-1'),
('msg-3', 'conv-2', 'user-teacher-1', 'Hello Mr. John, Lucas has been doing very well in calculus class.', 'user-teacher-1'),
('msg-4', 'conv-2', 'user-parent-1', 'Thank you Sarah, glad to hear that.', 'user-parent-1')
ON DUPLICATE KEY UPDATE message=VALUES(message);

-- Seed Notifications
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_by) VALUES
('notif-1', 'user-student-1', 'New Assignment', 'Calculus Assignment 1 has been posted.', 'ASSIGNMENT_DUE', FALSE, 'user-teacher-1'),
('notif-2', 'user-parent-1', 'Attendance Alert', 'Lucas was marked LATE for Physics class.', 'ATTENDANCE_ALERT', FALSE, 'user-teacher-1')
ON DUPLICATE KEY UPDATE title=VALUES(title);
