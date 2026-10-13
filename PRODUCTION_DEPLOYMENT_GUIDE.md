# MSAP Alumni Platform — Production Deployment Guide 🚀

This document provides a turnkey guide for deploying the **Association of MSAP Alumni, Manipur** platform to production.

---

## 📋 Pre-Flight Audit Verification

Before deploying, run the automated readiness script in your terminal:
```bash
node scripts/verify-production-readiness.js
```
This tests:
1. Environment variables & cryptographic secrets
2. Supabase PostgreSQL live table access (`alumni_registrations`, `admins`, `stories`, `events`, `gallery`, `audit_logs`)
3. SMTP email transport readiness
4. Frontend production distribution build validity

---

## 1. Hosting Architecture Overview

```mermaid
graph LR
    Client[Browser / Alumni & Admins] -->|HTTPS| Frontend[Vercel / Netlify / Custom Domain]
    Frontend -->|API Proxy / HTTPS| Backend[Node.js + Express API]
    Backend -->|PostgreSQL Protocol| Supabase[Supabase PostgreSQL & Storage]
    Backend -->|SMTP (Port 587)| Gmail[Gmail SMTP / Custom Mailer]
```

* **Frontend:** Static Single-Page Application (Vite + React) deployed on Vercel, Netlify, Cloudflare Pages, or static file hosting.
* **Backend:** Node.js Express server on Render, Railway, DigitalOcean App Platform, Fly.io, or an Ubuntu VPS (with PM2 & Nginx).
* **Database & Assets:** Supabase PostgreSQL database + Supabase Storage bucket for media.

---

## 2. Frontend Deployment (e.g. Vercel / Netlify)

1. **Root Directory:** `msap-alumni-frontend`
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Environment Variables:**
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.org/api/v1
   ```
5. **SPA Redirect Rule:**
   For Vercel, create `vercel.json` in `msap-alumni-frontend/`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
   For Netlify, create `_redirects` in `msap-alumni-frontend/public/`:
   ```
   /*    /index.html   200
   ```

---

## 3. Backend Deployment (e.g. Render / Railway / Ubuntu VPS)

1. **Root Directory:** `msap-alumni-backend`
2. **Build Command:** `npm ci`
3. **Start Command:** `npm start` (or `node src/server.js`)
4. **Production Environment Variables:**

| Variable | Value Description | Example / Note |
|---|---|---|
| `PORT` | Listening Port | `5000` or assigned by host |
| `NODE_ENV` | Environment mode | `production` |
| `CLIENT_URL` | Allowed frontend origin for CORS & cookies | `https://alumni.msap.org` |
| `SUPABASE_URL` | Project URL from Supabase dashboard | `https://uyhjeveenzpgsveqkfpz.supabase.co` |
| `SUPABASE_SECRET_KEY` | Supabase Service Role Key (bypasses RLS for server) | `sb_secret_...` |
| `JWT_SECRET` | 32+ character random string for token signing | e.g. `openssl rand -hex 32` |
| `ADMIN_JWT_SECRET` | Separate secret for admin tokens (optional) | Fallback to `JWT_SECRET` |
| `COOKIE_SECRET` | Secret for signing secure HTTP-only cookies | e.g. `openssl rand -hex 32` |
| `SMTP_HOST` | Mail server host | `smtp.gmail.com` |
| `SMTP_PORT` | STARTTLS port | `587` |
| `SMTP_USER` | Sending email address | `drainbadenergy@gmail.com` |
| `SMTP_PASS` | Gmail App Password (16 chars, no spaces) | `utas pfba mnwl jxqi` |
| `SMTP_FROM` | Sender Name & Address | `MSAP Alumni <drainbadenergy@gmail.com>` |
| `NOTIFY_EMAIL` | Admin email to receive new application alerts | `drainbadenergy@gmail.com` |
| `ADMIN_URL` | URL included in admin alert emails | `https://alumni.msap.org/admin` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID for alumni sign-in | `503389848507-...apps.googleusercontent.com` |

---

## 4. Supabase Database Configuration & Backups

1. **Schema Check:** Ensure tables `alumni_registrations`, `admins`, `stories`, `events`, `gallery`, `audit_logs` exist (verified by our script).
2. **Backups:** Supabase enables automated daily backups on Pro plans. For free tiers, schedule pg_dump backups or export using GitHub Actions.
3. **Initial Super Admin Account:**
   Ensure at least one record in `admins` table has `role = 'SUPER_ADMIN'` with your email address.

---

## 5. Security & Deliverability Checklist

- [x] **Rate Limiting:** Enabled (auth endpoints restricted, general API capped at 200 req/15min).
- [x] **XSS Sanitization & Honeypot:** Enabled on all user submissions.
- [x] **RBAC Isolation:** Editorial staff restricted from accessing membership applications.
- [x] **Optimistic Concurrency (HTTP 409):** Prevents concurrent editors from silent overwrites.
- [x] **Zero Profile Pictures:** Strictly text/initials monograms implemented.
- [x] **Single Lifetime Tier (₹3,000):** Implemented across landing page and registration form.
- [x] **CSV Export:** Admins can export verified rolls for reunions & voting records.
- [ ] *(Optional)* **DKIM Record:** Add TXT record `msap._domainkey.yourdomain.org` with DKIM key for 100% inbox placement without spam flagging.
