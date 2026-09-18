/**
 * @fileoverview Quick test script to verify Nodemailer and send an admin alert email.
 *
 * Usage:
 *   node scripts/test-email.js
 */

import { sendNewRegistrationAlert } from '../src/services/emailService.js';
import { env } from '../src/config/env.js';

console.log('---------------------------------------------------------');
console.log('📧 Testing MSAP Alumni Email System');
console.log('---------------------------------------------------------');
console.log(`To (NOTIFY_EMAIL): ${env.NOTIFY_EMAIL}`);
console.log(`SMTP Host:         ${env.SMTP_HOST || '(not set)'}`);
console.log(`SMTP User:         ${env.SMTP_USER || '(not set)'}`);
console.log(`Admin URL:         ${env.ADMIN_URL}`);
console.log('---------------------------------------------------------\n');

const mockApplicant = {
  full_name: 'Test Alumni Applicant',
  email: 'test.alumni@example.com',
  phone: '+91 98765 43210',
  pune_college: 'Fergusson College Pune',
  batch_year: 2020,
  current_location: 'Pune, Maharashtra',
  profession: 'Full Stack Engineer',
  created_at: new Date().toISOString(),
};

console.log('Sending sample new registration alert to admin...');

sendNewRegistrationAlert(mockApplicant)
  .then(() => {
    console.log('\n✅ Triggered sendNewRegistrationAlert successfully!');
    console.log('Check your terminal output or drainbadenergy@gmail.com inbox.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error triggering email:', err);
    process.exit(1);
  });
