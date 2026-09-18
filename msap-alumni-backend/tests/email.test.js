/**
 * @fileoverview Nodemailer integrity and email service tests.
 *
 * Tests verify:
 *  1. sendMail returns a mock object in test mode (EMAIL_TEST_MODE=true)
 *  2. sendNewRegistrationAlert does not throw on failure
 *  3. sendStatusUpdateEmail handles missing email gracefully
 *  4. DKIM configuration flags reflect environment variables correctly
 *
 * These tests run in test mode (EMAIL_TEST_MODE=true) so no real emails
 * are sent. They are safe to run in any environment.
 *
 * @module tests/email.test
 */

// Set test mode before any module imports so mailer picks it up
process.env.EMAIL_TEST_MODE = 'true';
process.env.NODE_ENV = 'test';

import test from 'node:test';
import assert from 'node:assert/strict';

// ─── sendMail — test mode ─────────────────────────────────────────────────────

test('Mailer: sendMail returns testMode object when EMAIL_TEST_MODE=true', async () => {
  const { sendMail } = await import('../src/config/mailer.js');

  const result = await sendMail({
    to: 'test@example.com',
    subject: 'Test Subject',
    html: '<p>Test</p>',
  });

  assert.ok(result.testMode === true, 'Expected testMode flag to be true');
  assert.ok(typeof result.messageId === 'string', 'Expected a messageId string');
  assert.ok(result.messageId.includes('@msap.local'), 'Expected messageId to have test domain');
});

// ─── isDkimConfigured flag ────────────────────────────────────────────────────

test('Mailer: isDkimConfigured is false when DKIM env vars are not set', async () => {
  // DKIM vars are not set in test environment
  const { isDkimConfigured } = await import('../src/config/mailer.js');
  assert.strictEqual(isDkimConfigured, false);
});

// ─── sendNewRegistrationAlert ─────────────────────────────────────────────────

test('Email Service: sendNewRegistrationAlert does not throw on any input', async () => {
  const { sendNewRegistrationAlert } = await import('../src/services/emailService.js');

  // Should not throw even with minimal data
  await assert.doesNotReject(
    () => sendNewRegistrationAlert({
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+91 98765 43210',
      pune_college: 'Test College',
      batch_year: 2020,
      current_location: 'Pune, India',
      profession: 'Software Engineer',
      created_at: new Date().toISOString(),
    }),
    'sendNewRegistrationAlert should not throw'
  );
});

test('Email Service: sendNewRegistrationAlert does not throw with minimal registration data', async () => {
  const { sendNewRegistrationAlert } = await import('../src/services/emailService.js');

  await assert.doesNotReject(
    () => sendNewRegistrationAlert({
      full_name: 'Minimal User',
      email: 'minimal@example.com',
    }),
    'sendNewRegistrationAlert should handle minimal data without throwing'
  );
});

// ─── sendStatusUpdateEmail ────────────────────────────────────────────────────

test('Email Service: sendStatusUpdateEmail does not throw when email is missing', async () => {
  const { sendStatusUpdateEmail } = await import('../src/services/emailService.js');

  // Should return early without throwing when email is missing
  await assert.doesNotReject(
    () => sendStatusUpdateEmail({ full_name: 'No Email User', status: 'VERIFIED' }),
    'sendStatusUpdateEmail should handle missing email gracefully'
  );
});

test('Email Service: sendStatusUpdateEmail does not throw for VERIFIED status', async () => {
  const { sendStatusUpdateEmail } = await import('../src/services/emailService.js');

  await assert.doesNotReject(
    () => sendStatusUpdateEmail({
      full_name: 'Verified User',
      email: 'verified@example.com',
      status: 'VERIFIED',
    }),
    'sendStatusUpdateEmail should not throw for VERIFIED status'
  );
});

test('Email Service: sendStatusUpdateEmail does not throw for REJECTED status with notes', async () => {
  const { sendStatusUpdateEmail } = await import('../src/services/emailService.js');

  await assert.doesNotReject(
    () => sendStatusUpdateEmail({
      full_name: 'Rejected User',
      email: 'rejected@example.com',
      status: 'REJECTED',
      admin_notes: 'Could not verify alumni status from provided information.',
    }),
    'sendStatusUpdateEmail should not throw for REJECTED status with notes'
  );
});
