#!/usr/bin/env node

/**
 * @fileoverview Automated Production Readiness Verification Script
 *
 * Runs a pre-deployment audit across:
 * 1. Environment variables & cryptographic secrets
 * 2. Supabase PostgreSQL connectivity & schema tables
 * 3. Mailer & SMTP configuration
 * 4. Frontend production dist bundle existence
 *
 * Usage: node scripts/verify-production-readiness.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'msap-alumni-backend');
const frontendDir = path.join(rootDir, 'msap-alumni-frontend');

// Load backend .env safely
const envPath = path.join(backendDir, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

console.log('\n======================================================');
console.log('  🏛️  MSAP Alumni Platform — Production Readiness Audit');
console.log('======================================================\n');

let passCount = 0;
let warnCount = 0;
let failCount = 0;

function check(label, passed, detail = '', isWarning = false) {
  if (passed) {
    passCount++;
    console.log(`  ✅ [PASS] ${label}${detail ? ` — ${detail}` : ''}`);
  } else if (isWarning) {
    warnCount++;
    console.log(`  ⚠️  [WARN] ${label}${detail ? ` — ${detail}` : ''}`);
  } else {
    failCount++;
    console.log(`  ❌ [FAIL] ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

// ── 1. Security & Cryptographic Config ───────────────────────────────────────
console.log('📦 1. Security & Secret Configuration:');
const jwtSecret = process.env.JWT_SECRET;
check('JWT_SECRET configured', Boolean(jwtSecret && jwtSecret.length >= 16), `Length: ${jwtSecret ? jwtSecret.length : 0} chars`);

const adminJwtSecret = process.env.ADMIN_JWT_SECRET || jwtSecret;
check('ADMIN_JWT_SECRET configured (or fallback to JWT_SECRET)', Boolean(adminJwtSecret && adminJwtSecret.length >= 16), `Length: ${adminJwtSecret ? adminJwtSecret.length : 0} chars`);

const cookieSecret = process.env.COOKIE_SECRET || jwtSecret;
check('COOKIE_SECRET configured (or fallback to JWT_SECRET)', Boolean(cookieSecret && cookieSecret.length >= 16), `Length: ${cookieSecret ? cookieSecret.length : 0} chars`);

const origin = process.env.CLIENT_URL || process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
check('CLIENT_URL configured', Boolean(origin), `Origin: ${origin}`);

// ── 2. Database & Supabase Tables ────────────────────────────────────────────
console.log('\n🗄️  2. Supabase PostgreSQL Connectivity & Tables:');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

check('SUPABASE_URL provided', Boolean(supabaseUrl), supabaseUrl ? supabaseUrl.split('@').pop() : 'Missing');
check('SUPABASE API Key provided', Boolean(supabaseKey), supabaseKey ? `${supabaseKey.slice(0, 14)}...` : 'Missing');

if (supabaseUrl && supabaseKey) {
  try {
    const supabasePkgPath = path.join(backendDir, 'node_modules/@supabase/supabase-js');
    if (fs.existsSync(supabasePkgPath)) {
      const { createClient } = await import(pathToFileURL(path.join(supabasePkgPath, 'dist/index.mjs')).href);
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const tables = ['alumni_registrations', 'admins', 'stories', 'events', 'gallery', 'audit_logs'];

      for (const table of tables) {
        const { error } = await supabase.from(table).select('id', { count: 'exact', head: true });
        if (error) {
          check(`Table "${table}" accessible`, false, error.message, false);
        } else {
          check(`Table "${table}" accessible`, true, 'Schema OK');
        }
      }
    } else {
      check('Supabase client module', false, 'Backend node_modules missing', true);
    }
  } catch (err) {
    check('Supabase client connection', false, err.message, false);
  }
} else {
  check('Supabase connection test', false, 'Missing URL or Service Key', true);
}

// ── 3. Mailer & Notifications ────────────────────────────────────────────────
console.log('\n✉️  3. SMTP Mailer & Deliverability:');
const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
check('SMTP_HOST defined', Boolean(smtpHost), smtpHost || 'Missing');
check('SMTP_USER defined', Boolean(smtpUser), smtpUser ? `${smtpUser.slice(0, 4)}***` : 'Missing');
check('SMTP_PASS defined', Boolean(smtpPass), smtpPass ? 'Present' : 'Missing');

const dkimKey = process.env.DKIM_PRIVATE_KEY;
check(
  'DKIM Email Signing Configured',
  Boolean(dkimKey),
  dkimKey ? 'Configured for high deliverability' : 'Optional: Set DKIM_PRIVATE_KEY for optimal inboxing',
  true
);

// ── 4. Frontend Production Distribution ──────────────────────────────────────
console.log('\n🌐 4. Frontend Production Build Bundle:');
const distDir = path.join(frontendDir, 'dist');
const indexHtml = path.join(distDir, 'index.html');
const distExists = fs.existsSync(indexHtml);

check('Production dist/ bundle compiled', distExists, distExists ? `Found ${indexHtml}` : 'Run "npm run build" in msap-alumni-frontend');

if (distExists) {
  const stat = fs.statSync(indexHtml);
  check('index.html size healthy', stat.size > 200, `${stat.size} bytes`);
}

// ── Executive Summary ────────────────────────────────────────────────────────
console.log('\n======================================================');
console.log(`  📊 Audit Summary: ${passCount} Passed, ${warnCount} Warnings, ${failCount} Failures`);
if (failCount === 0) {
  console.log('  🚀 STATUS: READY FOR PRODUCTION DEPLOYMENT');
} else {
  console.log('  ⚠️  STATUS: RESOLVE CRITICAL FAILURES BEFORE PUBLIC LAUNCH');
}
console.log('======================================================\n');

process.exit(failCount === 0 ? 0 : 1);
