-- ==========================================================
-- IES IEDC Seed Data (PostgreSQL)
-- Verified Institutional Records
-- ==========================================================

-- Roles
INSERT INTO roles (id, name, description) VALUES
  ('role_super', 'Super Admin', 'Full system access and administrator management'),
  ('role_content', 'Content Admin', 'Manage events, workshops, news, resources, and gallery'),
  ('role_team', 'Team Admin', 'Manage team members and academic-year team archives'),
  ('role_achieve', 'Achievement Admin', 'Verify and manage student and institutional achievements')
ON CONFLICT (id) DO NOTHING;

-- Academic Years
INSERT INTO academic_years (id, year_name, is_current, notes) VALUES
  ('ay_25_26', '2025–26', TRUE, 'Current Academic Year - Recruitment in progress'),
  ('ay_24_25', '2024–25', FALSE, 'Previous Academic Year'),
  ('ay_23_24', '2023–24', FALSE, 'Archived Academic Year')
ON CONFLICT (id) DO NOTHING;

-- Departments
INSERT INTO departments (id, code, name) VALUES
  ('dept_ce', 'CE', 'Civil Engineering'),
  ('dept_me', 'ME', 'Mechanical Engineering'),
  ('dept_cse', 'CSE', 'Computer Science & Engineering'),
  ('dept_eee', 'EEE', 'Electrical & Electronics Engineering'),
  ('dept_ece', 'ECE', 'Electronics & Communication Engineering'),
  ('dept_rai', 'R&AI', 'Robotics & Artificial Intelligence'),
  ('dept_ds', 'DS', 'Data Science'),
  ('dept_sh', 'S&H', 'Science & Humanities')
ON CONFLICT (id) DO NOTHING;

-- Activity log initial seed
INSERT INTO activity_logs (id, user_name, user_role, action, content_type, content_id, content_summary, timestamp) VALUES
  ('log_init', 'System Initializer', 'Super Admin', 'Created', 'Database', 'system', 'System seeded with verified institutional IEDC records from 2016-present', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
