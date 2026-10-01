-- ====================================================================
-- MSAP Alumni Initial Seed Data
-- ====================================================================

-- 1. Initial Financial Registry
INSERT INTO financial_accounts (category, balance_formatted, balance_numeric, status, fiscal_year, display_order)
VALUES
('Fixed Deposits', '₹3,50,000', 350000.00, 'Verified', 'FY 2025–26', 1),
('Savings Account', '₹1,24,350', 124350.00, 'Verified', 'FY 2025–26', 2),
('Membership Corpus', '₹42,000', 42000.00, 'Audited', 'FY 2025–26', 3),
('Event & Cultural Fund', '₹18,500', 18500.00, 'Active', 'FY 2025–26', 4);

-- 2. Initial Stories
INSERT INTO stories (title, source, published_date, image_url, excerpt, is_featured)
VALUES
('93.17%: A Graduation Achievement Remembered', 'AMAND Annual Cultural Programme', '2022', NULL, 'Yuireising Ngalung received the Late Albert Memorial Award for Academic Excellence in 2022 after recording 93.17% in graduation — the highest mark among Manipuri students in Pune that year.', true),
('Academic Excellence, Recognised in 2019', 'Late N. Albert Memorial Award Record', '2019', NULL, 'Tayenjam Sanathoi Singh received the second Late N. Albert Memorial Award for Academic Excellence in 2019 after achieving the highest graduation marks across streams among the Manipuri community in Pune.', false),
('From Alumni Network to Community Action', 'MSAP Alumni Association Report', '2026', NULL, 'In 2026, the Association of MSAP Alumni, Manipur completed seven plantation programmes across the state and planted 2,550 saplings under the theme "Now for Climate".', false),
('1973 → Today: A Student Network That Became a Community', 'MSAP Founding Record', 'Since 1973', NULL, 'Founded in 1973, MSAP began as a platform for Manipuri students in Pune. Over the decades, its activities have grown across academics, sports, culture and community life.', false),
('Where Sport Became a Way to Stay Connected', 'Annual Sports Records', 'Documented history', NULL, 'MSAP has organised annual sports and cultural programmes for decades, including a documented 2014 sports meet with 22 individual and team events.', false);

-- 3. Initial Community Groups
INSERT INTO community_groups (title, group_type, members_count, description, display_order)
VALUES
('Pune Chapter', 'Regional', '120+', 'The original home chapter. Meetups, events, and networking in Pune.', 1),
('Imphal Chapter', 'Regional', '80+', 'Alumni based in Manipur, connected through regular gatherings.', 2),
('Tech Professionals', 'Professional', '45+', 'Software engineers, startup founders, and tech leads.', 3),
('Healthcare Network', 'Professional', '30+', 'Alumni in medicine and healthcare fields.', 4),
('Young Alumni', 'Interest', '60+', 'Recent graduates building careers and networks.', 5),
('Women in Leadership', 'Affinity', '35+', 'Mentorship and leadership development for women alumni.', 6);

-- 4. Seed Super Admin (Password: Admin@123#MSAP)
-- Note: Replace this password in production.
INSERT INTO admins (email, password_hash, full_name, role)
VALUES
('admin@msap.org', '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS', 'MSAP Executive Admin', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;
