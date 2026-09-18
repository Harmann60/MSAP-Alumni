import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeValue } from '../src/middlewares/xssSanitizer.js';
import { registerAlumniSchema } from '../src/validators/alumniValidator.js';

test('Security: XSS Sanitizer strips malicious script tags', () => {
  const maliciousInput = '<script>alert("Hacked!")</script>John Doe';
  const clean = sanitizeValue(maliciousInput);
  assert.strictEqual(clean, 'John Doe');
  assert.ok(!clean.includes('<script>'));
});

test('Security: XSS Sanitizer strips inline event handlers and evil attributes', () => {
  const maliciousInput = '<img src=x onerror=alert(1)>Jane Doe';
  const clean = sanitizeValue(maliciousInput);
  assert.strictEqual(clean, 'Jane Doe');
  assert.ok(!clean.includes('onerror'));
});

test('Security: XSS Sanitizer handles javascript: pseudo-protocol', () => {
  const maliciousInput = 'javascript:alert("XSS")';
  const clean = sanitizeValue(maliciousInput);
  assert.ok(!clean.includes('javascript:'));
});

test('Security: XSS Sanitizer recursively cleans nested objects', () => {
  const payload = {
    user: {
      name: '<script>alert("nested")</script>Alice',
      details: {
        bio: 'Hello <b onclick="evil()">world</b>',
      },
    },
    tags: ['<script>bad</script>', 'clean-tag'],
  };
  const sanitized = sanitizeValue(payload);
  assert.strictEqual(sanitized.user.name, 'Alice');
  assert.strictEqual(sanitized.user.details.bio, 'Hello world');
  assert.strictEqual(sanitized.tags[0], '');
  assert.strictEqual(sanitized.tags[1], 'clean-tag');
});

test('Validation: Rejects invalid email format', () => {
  const invalidData = {
    fullName: 'Test User',
    email: 'not-an-email',
    batchYear: 2020,
  };
  const result = registerAlumniSchema.safeParse(invalidData);
  assert.strictEqual(result.success, false);
});

test('Validation: Rejects batch year prior to MSAP foundation', () => {
  const invalidData = {
    fullName: 'Old Timer',
    email: 'test@example.com',
    batchYear: 1950, // MSAP alumni range begins 1970
  };
  const result = registerAlumniSchema.safeParse(invalidData);
  assert.strictEqual(result.success, false);
});

test('Anti-Spam: Honeypot field rejects spam bots', () => {
  const botData = {
    fullName: 'Bot User',
    email: 'bot@spam.com',
    batchYear: 2020,
    hp_website: 'https://spam-link.com', // Bot filled the invisible honeypot!
  };
  const result = registerAlumniSchema.safeParse(botData);
  assert.strictEqual(result.success, false);
});

test('Validation: Accepts valid alumni registration payload', () => {
  const validData = {
    fullName: 'Ranjit Singh',
    email: 'ranjit@example.com',
    phone: '+91 98765 43210',
    puneCollege: 'Symbiosis Pune',
    batchYear: 2018,
    currentLocation: 'Bangalore, India',
    profession: 'Senior Software Engineer',
    hp_website: '',
  };
  const result = registerAlumniSchema.safeParse(validData);
  assert.strictEqual(result.success, true);
});
