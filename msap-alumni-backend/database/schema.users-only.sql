-- ====================================================================
-- MSAP Alumni — Minimal Database Schema (User Information Only)
-- ====================================================================
-- This schema satisfies the registration wireframe (Page 6 - Register):
-- Stores only user registration submissions and the admin accounts needed
-- to review, verify, and manage alumni onboardings.
--
-- Tables:
--   1. admins                — Administrative users who review submissions
--   2. alumni_registrations  — Alumni directory submissions
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing user tables if re-running (safe order)
DROP TABLE IF EXISTS alumni_registrations CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- 3. Admins Table
-- Used for administrator authentication to review and approve registrations.
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) DEFAULT 'ADMIN' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'MODERATOR')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Alumni Registrations Table (Directly mapped to Wireframe Page 6)
-- Wireframe fields:
--   - Full name *        -> full_name
--   - Email *            -> email
--   - Phone              -> phone
--   - Pune college       -> pune_college
--   - Batch year         -> batch_year
--   - Current location   -> current_location
--   - Profession         -> profession
CREATE TABLE alumni_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Bcrypt hash (12 rounds), populated during registration or linked upon admin verification
    phone VARCHAR(30),
    pune_college VARCHAR(150),
    batch_year INTEGER CHECK (batch_year >= 1970 AND batch_year <= 2100),
    current_location VARCHAR(150),
    profession VARCHAR(200),
    -- Onboarding Review Workflow ("Your submission is reviewed within 3-5 days")
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_alumni_reg_status ON alumni_registrations(status);
CREATE INDEX idx_alumni_reg_email ON alumni_registrations(email);
CREATE INDEX idx_alumni_reg_created_at ON alumni_registrations(created_at DESC);

-- 5. Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_registrations ENABLE ROW LEVEL SECURITY;

-- Allow prospective alumni (public) to submit onboarding applications with PENDING status
CREATE POLICY "Public Insert Alumni Registration"
    ON alumni_registrations
    FOR INSERT
    WITH CHECK (status = 'PENDING');

-- Note: The backend Express server connects using the SUPABASE_SERVICE_ROLE_KEY,
-- which automatically bypasses RLS safely to query, review, and approve registrations.

-- 6. Initial Super Admin Seed (Email: admin@msap.org | Password: Admin@123#MSAP)
-- IMPORTANT: Change this password after first login in production!
INSERT INTO admins (email, password_hash, full_name, role)
VALUES (
    'admin@msap.org',
    '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
    'MSAP Executive Admin',
    'SUPER_ADMIN'
)
ON CONFLICT (email) DO NOTHING;
