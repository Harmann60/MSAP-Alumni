-- ====================================================================
-- MSAP Alumni Database Schema for Supabase (PostgreSQL)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running (safe order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS community_groups CASCADE;
DROP TABLE IF EXISTS financial_accounts CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS alumni_registrations CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- 3. Admins / Staff Accounts Table
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

-- 4. Alumni Registrations Table (With Review Workflow)
CREATE TABLE alumni_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(30),
    pune_college VARCHAR(150),
    batch_year INTEGER CHECK (batch_year >= 1970 AND batch_year <= 2100),
    current_location VARCHAR(150),
    profession VARCHAR(200),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_alumni_reg_status ON alumni_registrations(status);
CREATE INDEX idx_alumni_reg_email ON alumni_registrations(email);

-- 5. Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Community', 'Career', 'Cultural', 'Onboarding'
    date_display VARCHAR(50) NOT NULL, -- e.g. "Aug 15, 2026"
    time_display VARCHAR(50) NOT NULL, -- e.g. "10 AM – 6 PM"
    event_timestamp TIMESTAMPTZ,
    location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    registration_link VARCHAR(500),
    created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_featured ON events(is_featured);

-- 6. Stories Table
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    published_date VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_stories_featured ON stories(is_featured);

-- 7. Financial Transparency Records Table
CREATE TABLE financial_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL, -- 'Fixed Deposits', 'Savings Account', etc.
    balance_formatted VARCHAR(50) NOT NULL, -- '₹3,50,000'
    balance_numeric NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'Verified',
    fiscal_year VARCHAR(30) NOT NULL DEFAULT 'FY 2025–26',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Community Groups Table
CREATE TABLE community_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    group_type VARCHAR(50) NOT NULL, -- 'Regional', 'Professional', 'Interest', 'Affinity'
    members_count VARCHAR(20) NOT NULL, -- '120+'
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Audit Logs Table (Tracks security & admin events)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published events, stories, accounts, groups
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Read Stories" ON stories FOR SELECT USING (true);
CREATE POLICY "Public Read Accounts" ON financial_accounts FOR SELECT USING (true);
CREATE POLICY "Public Read Community Groups" ON community_groups FOR SELECT USING (is_active = true);

-- Public can insert new alumni registration submissions
CREATE POLICY "Public Insert Alumni Registration" ON alumni_registrations FOR INSERT WITH CHECK (status = 'PENDING');

-- Service role / backend server has full bypass access when using SUPABASE_SERVICE_ROLE_KEY
