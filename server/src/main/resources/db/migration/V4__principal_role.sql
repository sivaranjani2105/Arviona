-- =======================================================
-- DDL & DML for Principal Role & User (Flyway V4)
-- =======================================================

-- Seed ROLE_PRINCIPAL
INSERT INTO roles (id, name, description) VALUES
('role-principal', 'ROLE_PRINCIPAL', 'School Principal/Administrator Persona')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed principal user
-- Password is 'password' (bcrypt: $2b$12$f0g6PhaLThhspSrBitXOPe6WNff.EVZMK7Bpzd.fJlz0t52Xm6H.2)
INSERT INTO users (id, institution_id, name, email, password_hash, created_by) VALUES
('user-principal-1', 'inst-1', 'Principal Skinner', 'principal@arviona.com', '$2b$12$f0g6PhaLThhspSrBitXOPe6WNff.EVZMK7Bpzd.fJlz0t52Xm6H.2', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Map principal user to ROLE_PRINCIPAL
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
('user-principal-1', 'role-principal');
