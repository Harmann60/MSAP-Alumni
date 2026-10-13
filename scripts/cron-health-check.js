/**
 * MSAP Alumni Automated Health Check & Cron Monitor
 * Used by GitHub Actions scheduled workflow to audit service availability,
 * API response latency, and database connectivity.
 */

import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';

const apiUrl = process.env.API_URL;
const supabaseUrl = process.env.SUPABASE_URL || 'https://uyhjeveenzpgsveqkfpz.supabase.co';
const summaryFile = process.env.GITHUB_STEP_SUMMARY;

function appendSummary(markdown) {
  if (summaryFile) {
    try {
      fs.appendFileSync(summaryFile, `${markdown}\n`);
    } catch {
      // Ignored if file write fails
    }
  }
}

async function request(urlStr, options = {}) {
  const start = Date.now();
  const url = new URL(urlStr);
  const client = url.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    const req = client.request(
      urlStr,
      {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'MSAP-Alumni-Cron-HealthCheck/1.0',
          ...options.headers,
        },
        timeout: 10000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 400,
            status: res.statusCode,
            latencyMs: Date.now() - start,
            body,
            error: null,
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        ok: false,
        status: 0,
        latencyMs: Date.now() - start,
        body: null,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ok: false,
        status: 408,
        latencyMs: Date.now() - start,
        body: null,
        error: 'Connection timed out after 10000ms',
      });
    });

    req.end();
  });
}

async function runHealthCheck() {
  console.log('='.repeat(60));
  console.log(`[${new Date().toISOString()}] Starting MSAP Alumni Cron Health Audit`);
  console.log('='.repeat(60));

  const results = [];

  // 1. Audit Live API if URL configured
  if (apiUrl) {
    const base = apiUrl.replace(/\/+$/, '');
    const healthUrl = `${base}/health`;
    console.log(`\n🔍 Probing Live API: ${healthUrl}`);
    let healthRes = await request(healthUrl);
    if (!healthRes.ok) {
      // Fallback to /api/v1/health
      healthRes = await request(`${base}/api/v1/health`);
    }
    console.log(`   Status:  ${healthRes.status} (${healthRes.latencyMs}ms)`);
    results.push({
      target: 'Backend API Health',
      status: healthRes.status,
      latency: `${healthRes.latencyMs}ms`,
      passed: healthRes.ok,
      note: healthRes.error || (healthRes.ok ? 'Healthy' : 'Unexpected status'),
    });

    const csrfUrl = `${base}/api/v1/auth/csrf-token`;
    console.log(`🔍 Probing CSRF Security: ${csrfUrl}`);
    const csrfRes = await request(csrfUrl);
    console.log(`   Status:  ${csrfRes.status} (${csrfRes.latencyMs}ms)`);
    results.push({
      target: 'CSRF Token Endpoint',
      status: csrfRes.status,
      latency: `${csrfRes.latencyMs}ms`,
      passed: csrfRes.ok,
      note: csrfRes.error || (csrfRes.ok ? 'Token Generated' : 'Unexpected status'),
    });
  } else {
    console.log('\nℹ️  No remote API_URL specified in environment. Auditing remote database infrastructure.');
  }

  // 2. Audit Supabase Gateway Connectivity
  if (supabaseUrl) {
    console.log(`\n🔍 Auditing Supabase Gateway: ${supabaseUrl}`);
    const supaRes = await request(supabaseUrl);
    console.log(`   Status:  ${supaRes.status} (${supaRes.latencyMs}ms)`);
    // Supabase root responds with 200 or 404 depending on gateway, both indicate gateway is up
    const isGatewayUp = supaRes.status > 0 && supaRes.status < 500;
    results.push({
      target: 'Supabase Cloud Gateway',
      status: supaRes.status,
      latency: `${supaRes.latencyMs}ms`,
      passed: isGatewayUp,
      note: isGatewayUp ? 'Gateway reachable & responding' : (supaRes.error || 'Server error'),
    });
  }

  // Summary Table
  console.log('\n--- Health Audit Summary ---');
  console.table(results);

  // GitHub Actions Step Summary
  appendSummary('### 📊 MSAP Alumni Cron Health Audit Report');
  appendSummary(`**Executed at:** \`${new Date().toUTCString()}\`\n`);
  appendSummary('| Check Target | Status Code | Latency | Result | Notes |');
  appendSummary('| :--- | :--- | :--- | :--- | :--- |');
  results.forEach((r) => {
    const icon = r.passed ? '✅ OK' : '⚠️ Warning';
    appendSummary(`| ${r.target} | \`${r.status}\` | ${r.latency} | ${icon} | ${r.note} |`);
  });

  const anyFailed = results.some((r) => !r.passed);
  if (anyFailed && apiUrl) {
    console.error('\n❌ Health check detected critical failures on target API.');
    process.exit(1);
  } else {
    console.log('\n✅ All health checks completed successfully.');
    process.exit(0);
  }
}

runHealthCheck();
