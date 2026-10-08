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
('From Pune to Silicon Valley: One Alumni''s 30-Year Journey', 'MSAP Alumni Report', 'June 2026', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop', 'How a small group of Manipuri students in Pune went on to lead careers across the globe — and what brought them back.', true),
('The Golden Jubilee: 200 Alumni, One Auditorium', 'Alumni Magazine', 'September 2025', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop', 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to mark half a century of community.', false),
('Keeping Yaoshang Alive 1,200 km from Home', 'Community Spotlight', 'March 2026', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop', 'Every March, Manipuris in Pune gather to light the Yaoshang — and prove that culture travels with people.', false),
('50 New Members in One Month: The Registration Drive', 'MSAP Report', 'April 2026', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop', 'The registration drive for new alumni members exceeded expectations this spring.', false),
('The Mentorship Program: Alumni Guiding Graduates', 'Community Spotlight', 'March 2026', 'https://images.unsplash.com/photo-1531538606174-e1ed98e5ef2e?w=800&h=500&fit=crop', 'Experienced alumni are pairing with recent graduates for career guidance and professional development.', false),
('From Yaoshang to Sangai: Cultural Identity in Pune', 'Alumni Magazine', 'February 2026', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop', 'How Pune''s Manipuri community preserves cultural identity across generations.', false);

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
