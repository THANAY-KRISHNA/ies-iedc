-- ==========================================================
-- IES IEDC Database Schema (PostgreSQL DDL)
-- Institution: IES College of Engineering
-- Platform: Innovation and Entrepreneurship Development Centre
-- ==========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & USERS
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id VARCHAR(50) REFERENCES roles(id) ON DELETE RESTRICT,
  avatar_url TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ACADEMIC YEARS & DEPARTMENTS
CREATE TABLE IF NOT EXISTS academic_years (
  id VARCHAR(32) PRIMARY KEY,
  year_name VARCHAR(20) NOT NULL UNIQUE, -- e.g. '2025–26', '2024–25', '2023–24'
  is_current BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(32) PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE, -- 'CE', 'ME', 'CSE', 'EEE', 'ECE', 'R&AI', 'DS', 'S&H'
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(64) PRIMARY KEY,
  academic_year_id VARCHAR(32) NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
  name VARCHAR(150) NOT NULL,
  role_type VARCHAR(50) NOT NULL, -- 'Nodal Officer', 'Assistant Nodal Officer', 'Department Coordinator', 'IEDC Lead', 'Student Lead', etc.
  position VARCHAR(100) NOT NULL,
  department_code VARCHAR(10) REFERENCES departments(code) ON DELETE SET NULL,
  designation VARCHAR(150),
  responsibility TEXT,
  email VARCHAR(150),
  linkedin_url TEXT,
  photo_url TEXT,
  sort_order INTEGER DEFAULT 100,
  status VARCHAR(20) DEFAULT 'Published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_academic_year ON team_members(academic_year_id);
CREATE INDEX idx_team_status ON team_members(status);

-- 4. EVENTS & ACTIVITIES
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  academic_year_id VARCHAR(32) NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
  display_date VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  venue VARCHAR(200) NOT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  organizer VARCHAR(150) DEFAULT 'IES IEDC',
  resource_persons JSONB DEFAULT '[]'::jsonb,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  participants_count INTEGER,
  teams_count INTEGER,
  teams_selected_count INTEGER,
  poster_url TEXT,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  registration_url TEXT,
  status VARCHAR(30) DEFAULT 'Completed', -- 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'
  needs_admin_review BOOLEAN DEFAULT FALSE,
  admin_review_note TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_year ON events(academic_year_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events(category);

-- 5. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  academic_year_id VARCHAR(32) NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
  category VARCHAR(60) NOT NULL,
  recipients TEXT NOT NULL,
  description TEXT NOT NULL,
  date_awarded DATE,
  verification_info TEXT,
  certificate_url TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE, -- Must be explicitly verified by admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. STUDENT IDEAS & PUBLIC SUBMISSIONS
CREATE TABLE IF NOT EXISTS student_ideas (
  id VARCHAR(64) PRIMARY KEY,
  project_name VARCHAR(200) NOT NULL,
  student_name VARCHAR(150) NOT NULL,
  student_email VARCHAR(150) NOT NULL,
  student_phone VARCHAR(30),
  department_code VARCHAR(10) REFERENCES departments(code) ON DELETE SET NULL,
  academic_year_id VARCHAR(32) REFERENCES academic_years(id) ON DELETE SET NULL,
  problem TEXT NOT NULL,
  proposed_solution TEXT NOT NULL,
  technology TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(30) DEFAULT 'New', -- 'New', 'Under Review', 'Contacted', 'Accepted', 'Rejected', 'Developing', 'Completed'
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. STARTUPS
CREATE TABLE IF NOT EXISTS startups (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  founder_team TEXT NOT NULL,
  department_code VARCHAR(10) REFERENCES departments(code) ON DELETE SET NULL,
  academic_year_id VARCHAR(32) REFERENCES academic_years(id) ON DELETE RESTRICT,
  problem_solved TEXT NOT NULL,
  product_service TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  social_media_url TEXT,
  status VARCHAR(30) DEFAULT 'Ideation',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. WORKSHOPS & LEARNING
CREATE TABLE IF NOT EXISTS workshops (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  academic_year_id VARCHAR(32) NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
  display_date VARCHAR(100) NOT NULL,
  venue VARCHAR(200) NOT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  speakers JSONB DEFAULT '[]'::jsonb,
  mentors JSONB DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  topics_covered JSONB DEFAULT '[]'::jsonb,
  registration_url TEXT,
  certificate_provided BOOLEAN DEFAULT TRUE,
  learning_materials_url TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(30) DEFAULT 'Past',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. INNOVATION & RESOURCES
CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(60) NOT NULL, -- 'Project Ideas', 'Startup Guides', 'IPR Resources', 'Business Model Canvas', etc.
  description TEXT NOT NULL,
  author_or_source VARCHAR(150),
  link_url TEXT,
  file_type VARCHAR(20),
  date_added DATE DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. GALLERY ALBUMS & IMAGES
CREATE TABLE IF NOT EXISTS gallery_albums (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  academic_year_id VARCHAR(32) NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
  category VARCHAR(60) NOT NULL,
  cover_image_url TEXT NOT NULL,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id VARCHAR(64) PRIMARY KEY,
  album_id VARCHAR(64) NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. NEWS & ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author VARCHAR(100) NOT NULL,
  publication_date DATE NOT NULL,
  academic_year_id VARCHAR(32) NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
  status VARCHAR(20) DEFAULT 'Draft', -- 'Draft', 'Review', 'Published', 'Archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. JOIN & MEMBERSHIP SUBMISSIONS
CREATE TABLE IF NOT EXISTS join_submissions (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  department_code VARCHAR(10) REFERENCES departments(code) ON DELETE SET NULL,
  semester VARCHAR(10) NOT NULL,
  roll_number VARCHAR(50) NOT NULL,
  interest_areas JSONB DEFAULT '[]'::jsonb,
  previous_experience TEXT,
  why_join TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'New', -- 'New', 'Under Review', 'Accepted', 'Archived'
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. AUDIT ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_name VARCHAR(150) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action VARCHAR(30) NOT NULL, -- 'Created', 'Updated', 'Published', 'Archived', 'Deleted'
  content_type VARCHAR(50) NOT NULL,
  content_id VARCHAR(64) NOT NULL,
  content_summary TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
