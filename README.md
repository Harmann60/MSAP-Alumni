# MSAP Alumni Platform

> The official digital portal of the **Manipur Students' Association Pune (MSAP)** alumni community, established in 1973.

A modern, production-grade web application featuring public community pages, an alumni onboarding & verification workflow, interactive alumni authentication (with Google Sign-In and password setup), and a comprehensive Admin Dashboard with real-time directory management and automated Nodemailer email notifications.

---

## 🚀 Key Features

### 🏛️ Public Portal
- **Alumni Self-Registration**: Structured application form capturing alumni details (Pune college, batch year, profession, location, contact information, and optional initial password).
- **Transparency & Accounts**: Published financial summary reports and audited account statements for organizational integrity.
- **Community Chapters**: Regional chapters (Pune, Imphal, etc.) and professional circles (Tech, Healthcare, Women in Leadership).
- **Stories & Events**: Featured stories, career spotlights, and upcoming community gatherings.
- **Photo Gallery**: Featured album carousel and browsable event albums (e.g., Patriots Day 2026).

### 🎓 Alumni Portal
- **Secure Authentication**: Alumni sign-in supporting both standard email/password and **"Continue with Google"** OAuth.
- **Application Status Enforcement**:
  - Unregistered emails are guided to submit an application.
  - Pending applications display a review status notice ("Submissions reviewed within 3–5 days").
  - Approved alumni can set or update their account password and log in seamlessly.

### 🛡️ Admin Portal (`/admin`)
- **Real-Time Registration Queue**: Instant filtering across `All`, `Pending Review`, `Verified Alumni`, and `Rejected` submissions.
- **Live Counter Badges**: Synchronized metric badges tracking application volume and verification rates.
- **Automated Nodemailer Notifications**:
  - New submissions trigger an immediate alert email to the NGO administration.
  - Admin approval sends a verification confirmation email with a direct sign-in link.
  - Admin rejection sends a polite decision update containing any custom feedback/notes entered by the admin.
- **Editable Alumni Directory**: Admins can edit member details (name, email, phone, college, batch year, location, profession, notes) directly with inline editing.
- **Permanent Removal**: Safe one-click deletion permanently removes unwanted or test records from both Supabase PostgreSQL and the admin view.

---

## 🛠️ Architecture & Tech Stack

```
MSAP-Alumni-main/
├── msap-alumni-backend/    # Node.js + Express API + Supabase PostgreSQL + Nodemailer
│   ├── database/           # SQL schemas, RLS policies, and seed scripts
│   ├── src/
│   │   ├── config/         # Environment parsing (Zod), logger (Winston), mailer
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Security headers (Helmet), CORS, rate limiters, auth, RBAC
│   │   ├── routes/         # Express API routers
│   │   ├── services/       # Core business logic & database services
│   │   └── validators/     # Zod schema validators
│   └── tests/              # Automated test suite (Security, Email, Auth)
│
└── msap-alumni-frontend/   # React 18 + Vite SPA + Tailwind CSS
    └── src/
        ├── components/     # UI components (Navbar, Footer, Modals)
        ├── pages/          # Public, Alumni & Admin views
        └── services/       # API client & auth handlers
```

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6
- **Backend**: Node.js (ESM), Express 4, Zod, Nodemailer, Bcrypt, JsonWebToken, Helmet, Winston
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) & UUID keys (with dev in-memory fallback)

---

## ⚙️ Quick Start / Local Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Harmann60/MSAP-Alumni.git
cd MSAP-Alumni
```

### 2. Backend Setup
```bash
cd msap-alumni-backend
npm install
cp .env.example .env
```
Edit `.env` with your credentials:
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` *(or leave blank to run with local dev in-memory store)*
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` *(Gmail App Password for Nodemailer)*
- `JWT_SECRET` *(random string for session signing)*

Run the database schema in your Supabase SQL Editor:
- Copy and run `database/schema.users-only.sql` (or `database/schema.sql` for all modules).

Start the backend:
```bash
npm run dev
# Server runs at http://localhost:5000
```

Run backend tests:
```bash
npm test
# Runs 22 unit & integration tests (Security, Mailer, Auth)
```

### 3. Frontend Setup
In a new terminal:
```bash
cd msap-alumni-frontend
npm install
cp .env.example .env
npm run dev
# Web app runs at http://localhost:5173
```

---

## 🔐 Default Admin Credentials (Local Dev)
- **Email**: `admin@msap.org`
- **Password**: `Admin@123#MSAP`
- **Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## 🧪 Security & Quality
- **XSS Sanitization**: Strips dangerous scripts and malicious event attributes recursively from inputs.
- **Honeypot Bot Protection**: Hidden honeypot traps spam bots on self-registration forms.
- **Rate Limiting**: Tiered limits on API endpoints, auth routes, and registrations.
- **Secret Scanning**: Scans for accidental credential leaks before commits (`npm run scan`).

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
