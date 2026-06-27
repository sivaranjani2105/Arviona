-- ─────────────────────────────────────────────────────────────────────────────
-- V7: Schema additions for teacher notes, store item enhancements, and
--     notification userId column
-- ─────────────────────────────────────────────────────────────────────────────

-- Add columns to files table for teacher notes feature
ALTER TABLE files
    ADD COLUMN IF NOT EXISTS original_name  VARCHAR(255),
    ADD COLUMN IF NOT EXISTS mime_type      VARCHAR(100),
    ADD COLUMN IF NOT EXISTS description    TEXT,
    ADD COLUMN IF NOT EXISTS student_id     VARCHAR(36),
    ADD COLUMN IF NOT EXISTS uploaded_by    VARCHAR(36);

-- Add icon_emoji column to store_items if not already present
ALTER TABLE store_items
    ADD COLUMN IF NOT EXISTS icon_emoji     VARCHAR(10);

-- Widen created_by / updated_by columns that were previously 50 chars
ALTER TABLE files         MODIFY COLUMN created_by VARCHAR(100), MODIFY COLUMN updated_by VARCHAR(100);
ALTER TABLE store_items   MODIFY COLUMN created_by VARCHAR(100), MODIFY COLUMN updated_by VARCHAR(100);
ALTER TABLE notifications MODIFY COLUMN created_by VARCHAR(100), MODIFY COLUMN updated_by VARCHAR(100);
