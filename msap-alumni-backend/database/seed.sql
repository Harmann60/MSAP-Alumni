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

-- 2. Initial Events
INSERT INTO events (title, category, date_display, time_display, location, description, is_featured)
VALUES
('Annual Alumni Meet 2026', 'Community', 'Aug 15, 2026', '10 AM – 6 PM', 'Pune, Maharashtra', 'The yearly gathering of all Pune Manipuri alumni. Reconnect, celebrate, and plan the year ahead.', true),
('Career Networking Night', 'Career', 'Sep 10, 2026', '7 PM – 9 PM', 'Virtual (Zoom)', 'Connect with alumni across industries for mentorship, referrals, and career guidance.', true),
('Yaoshang Cultural Evening', 'Cultural', 'Mar 3, 2026', '5 PM – 10 PM', 'Imphal, Manipur', 'Celebrate the festival of colors with the community through music, dance, and tradition. Families welcome.', false),
('New Alumni Orientation', 'Onboarding', 'Jul 20, 2026', '6 PM – 7:30 PM', 'Online', 'A welcome session for recently registered alumni to learn about the association and how to get involved.', false),
('Holi Celebration', 'Cultural', 'Mar 14, 2026', '11 AM – 3 PM', 'Pune, Maharashtra', 'Join fellow Manipuris in Pune for traditional music, food, and colors.', false),
('Mentorship Program Kickoff', 'Career', 'Oct 5, 2026', '6 PM – 8 PM', 'Hybrid', 'Launch of the annual mentorship program pairing experienced alumni with recent graduates.', false);

-- 3. Initial Stories
INSERT INTO stories (title, source, published_date, image_url, excerpt, is_featured)
VALUES
('93.17%: A Graduation Achievement Remembered', 'AMAND Annual Cultural Programme', '2022', NULL, 'Yuireising Ngalung received the Late Albert Memorial Award for Academic Excellence in 2022 after recording 93.17% in graduation — the highest mark among Manipuri students in Pune that year.', true),
('Academic Excellence, Recognised in 2019', 'Late N. Albert Memorial Award Record', '2019', NULL, 'Tayenjam Sanathoi Singh received the second Late N. Albert Memorial Award for Academic Excellence in 2019 after achieving the highest graduation marks across streams among the Manipuri community in Pune.', false),
('From Alumni Network to Community Action', 'MSAP Alumni Association Report', '2026', NULL, 'In 2026, the Association of MSAP Alumni, Manipur completed seven plantation programmes across the state and planted 2,550 saplings under the theme "Now for Climate".', false),
('1973 → Today: A Student Network That Became a Community', 'MSAP Founding Record', 'Since 1973', NULL, 'Founded in 1973, MSAP began as a platform for Manipuri students in Pune. Over the decades, its activities have grown across academics, sports, culture and community life.', false),
('Where Sport Became a Way to Stay Connected', 'Annual Sports Records', 'Documented history', NULL, 'MSAP has organised annual sports and cultural programmes for decades, including a documented 2014 sports meet with 22 individual and team events.', false);

-- 4. Initial Community Groups
INSERT INTO community_groups (title, group_type, members_count, description, display_order)
VALUES
('Pune Chapter', 'Regional', '120+', 'The original home chapter. Meetups, events, and networking in Pune.', 1),
('Imphal Chapter', 'Regional', '80+', 'Alumni based in Manipur, connected through regular gatherings.', 2),
('Tech Professionals', 'Professional', '45+', 'Software engineers, startup founders, and tech leads.', 3),
('Healthcare Network', 'Professional', '30+', 'Alumni in medicine and healthcare fields.', 4),
('Young Alumni', 'Interest', '60+', 'Recent graduates building careers and networks.', 5),
('Women in Leadership', 'Affinity', '35+', 'Mentorship and leadership development for women alumni.', 6);

-- 5. Seed Super Admin (Password: Admin@123#MSAP)
-- Note: Replace this password in production.
INSERT INTO admins (email, password_hash, full_name, role)
VALUES
('admin@msap.org', '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS', 'MSAP Executive Admin', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;
