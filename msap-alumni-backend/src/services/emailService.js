/**
 * @fileoverview Email delivery service for the MSAP Alumni platform.
 *
 * Provides two public functions:
 *  1. `sendNewRegistrationAlert` — notifies the NGO admin of a new pending registration.
 *  2. `sendStatusUpdateEmail`    — notifies the applicant of their approval or rejection.
 *
 * Both functions are **non-blocking** (fire-and-forget): they log errors but never
 * throw, so a transient email failure will never cause a registration to fail.
 *
 * HTML emails use table-based layouts for maximum email client compatibility.
 * A plain-text fallback is included for accessibility and spam-filter friendliness.
 *
 * @module services/emailService
 */

import { sendMail } from '../config/mailer.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

// ─── HTML helper utilities ─────────────────────────────────────────────────────

/**
 * Renders a single labelled row for the registration details table in the email.
 *
 * @param {string}           label - Column header text (e.g. "Email", "College").
 * @param {string|undefined} value - Cell value. Returns an empty string if falsy.
 * @returns {string} An HTML `<tr>` string, or `''` if value is empty.
 */
function row(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 16px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#7E7394;width:140px;vertical-align:top;border-bottom:1px solid #EAE5F2;">${label}</td>
      <td style="padding:10px 16px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;color:#1A1429;border-bottom:1px solid #EAE5F2;">${value}</td>
    </tr>`;
}

// ─── Email template builders ───────────────────────────────────────────────────

/**
 * Builds the full HTML body for a new-registration admin notification email.
 *
 * @param {object}          reg              - The registration record from the database.
 * @param {string}          reg.full_name    - Applicant's full name.
 * @param {string}          reg.email        - Applicant's email address.
 * @param {string}         [reg.phone]       - Applicant's phone number.
 * @param {string}         [reg.pune_college]- College attended in Pune.
 * @param {number}         [reg.batch_year]  - Graduation year.
 * @param {string}         [reg.current_location] - Current city/country.
 * @param {string}         [reg.profession]  - Current profession.
 * @param {string}         [reg.created_at]  - ISO timestamp of submission.
 * @returns {string} Complete HTML document as a string.
 */
function buildNewRegistrationHtml(reg) {
  const submittedAt = new Date(reg.created_at || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>New Alumni Registration — MSAP</title></head>
<body style="margin:0;padding:0;background:#FAF9FC;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9FC;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1A1429;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#9E92B5;">Manipur Students' Association Pune</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#FAF9FC;line-height:1.2;">MSAP Alumni</h1>
          </td>
        </tr>

        <!-- Alert banner -->
        <tr>
          <td style="background:#7C5CFC;padding:14px 40px;">
            <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FAF9FC;">🔔 New Registration Pending Your Review</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#1A1429;">${reg.full_name}</p>
            <p style="margin:0 0 28px;font-size:13px;color:#7E7394;">has submitted an alumni registration and is awaiting your verification.</p>

            <!-- Details table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #EAE5F2;border-radius:4px;overflow:hidden;margin-bottom:28px;">
              ${row('Email', `<a href="mailto:${reg.email}" style="color:#7C5CFC;text-decoration:none;">${reg.email}</a>`)}
              ${row('Phone', reg.phone)}
              ${row('College', reg.pune_college)}
              ${row('Batch Year', reg.batch_year)}
              ${row('Location', reg.current_location)}
              ${row('Profession', reg.profession)}
              ${row('Submitted', submittedAt)}
            </table>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:2px;background:#1A1429;">
                  <a href="${env.ADMIN_URL}" target="_blank"
                     style="display:inline-block;padding:14px 28px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FAF9FC;text-decoration:none;">
                    Review Registration →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:28px 0 0;font-size:12px;color:#7E7394;line-height:1.7;">
              If the button doesn't work, copy this link into your browser:<br>
              <a href="${env.ADMIN_URL}" style="color:#7C5CFC;">${env.ADMIN_URL}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#EAE5F2;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#7E7394;">
              This is an automated notification from the MSAP Alumni platform.<br>
              For help, contact <a href="mailto:alumni.msap1973@gmail.com" style="color:#7C5CFC;text-decoration:none;">alumni.msap1973@gmail.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Builds the full HTML body for an applicant status-update notification email.
 *
 * @param {object}  reg              - The updated registration record.
 * @param {string}  reg.full_name    - Applicant's full name.
 * @param {string}  reg.status       - New status: `'VERIFIED'` or `'REJECTED'`.
 * @param {string} [reg.admin_notes] - Optional admin note to include in rejected emails.
 * @returns {string} Complete HTML document as a string.
 */
function buildStatusUpdateHtml(reg) {
  const isVerified = reg.status === 'VERIFIED';
  const statusColor = isVerified ? '#16A34A' : '#DC2626';
  const statusWord = isVerified ? 'Approved ✓' : 'Not Approved';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Your MSAP Alumni Registration Update</title></head>
<body style="margin:0;padding:0;background:#FAF9FC;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9FC;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#1A1429;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#9E92B5;">Manipur Students' Association Pune</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#FAF9FC;">MSAP Alumni</h1>
          </td>
        </tr>
        <tr>
          <td style="background:${statusColor};padding:14px 40px;">
            <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FAF9FC;">Registration ${statusWord}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;color:#1A1429;">Dear ${reg.full_name},</p>
            ${isVerified
              ? `<p style="margin:0 0 16px;font-size:15px;color:#2D253D;line-height:1.7;">
                  We're delighted to confirm that your MSAP Alumni registration has been <strong>verified and approved</strong>.
                  You can now sign in to your account with your credentials to access the alumni directory and network:
                 </p>
                 <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                   <tr>
                     <td style="border-radius:2px;background:#1A1429;">
                       <a href="${env.CLIENT_URL}/login" target="_blank"
                          style="display:inline-block;padding:12px 26px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FAF9FC;text-decoration:none;">
                         Sign In to Alumni Account →
                       </a>
                     </td>
                   </tr>
                 </table>`
              : `<p style="margin:0 0 16px;font-size:15px;color:#2D253D;line-height:1.7;">
                  After review, we were unable to verify your alumni status at this time.
                  ${reg.admin_notes ? `<br><br><strong>Note from admin:</strong> ${reg.admin_notes}` : ''}
                  <br><br>If you believe this is an error, please reply to this email or contact us at
                  <a href="mailto:alumni.msap1973@gmail.com" style="color:#7C5CFC;">alumni.msap1973@gmail.com</a>.
                 </p>`
            }
            <p style="margin:24px 0 0;font-size:13px;color:#7E7394;">— The MSAP Alumni Team</p>
          </td>
        </tr>
        <tr>
          <td style="background:#EAE5F2;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#7E7394;">Manipur Students' Association Pune · <a href="mailto:alumni.msap1973@gmail.com" style="color:#7C5CFC;text-decoration:none;">alumni.msap1973@gmail.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Public service functions ─────────────────────────────────────────────────

/**
 * Sends an admin notification email when a new alumni registration is submitted.
 *
 * This function is **non-blocking**: it catches and logs any send errors but
 * never re-throws them. A failed email must never cause a registration to fail.
 *
 * @param {object} registration - The newly created registration record.
 * @returns {Promise<void>}
 */
export async function sendNewRegistrationAlert(registration) {
  try {
    await sendMail({
      to: env.NOTIFY_EMAIL,
      subject: `[MSAP Alumni] New Registration — ${registration.full_name}`,
      html: buildNewRegistrationHtml(registration),
      text: [
        'New MSAP Alumni Registration Pending Review',
        '---',
        `Name:       ${registration.full_name}`,
        `Email:      ${registration.email}`,
        `Phone:      ${registration.phone || '—'}`,
        `College:    ${registration.pune_college || '—'}`,
        `Batch:      ${registration.batch_year || '—'}`,
        `Location:   ${registration.current_location || '—'}`,
        `Profession: ${registration.profession || '—'}`,
        '---',
        `Review at: ${env.ADMIN_URL}`,
      ].join('\n'),
    });
  } catch (err) {
    // Non-fatal — the registration was already saved; log and continue.
    logger.error('Failed to send new-registration alert email', { error: err.message });
  }
}

/**
 * Sends a status-update notification email to the alumni applicant.
 *
 * Called after an admin approves or rejects a registration. This function is
 * **non-blocking**: errors are logged but not re-thrown.
 *
 * No email is sent if the registration does not have an email address.
 *
 * @param {object} registration         - The updated registration record.
 * @param {string} [registration.email] - Applicant's email address.
 * @param {string} registration.status  - New status (VERIFIED or REJECTED).
 * @returns {Promise<void>}
 */
export async function sendStatusUpdateEmail(registration) {
  if (!registration.email) return;
  try {
    const isVerified = registration.status === 'VERIFIED';
    const textContent = isVerified
      ? [
          `Dear ${registration.full_name},`,
          '',
          "We're delighted to confirm that your MSAP Alumni registration has been verified and approved!",
          '',
          'You can now sign in to your account with your credentials to access the alumni directory and network:',
          `${env.CLIENT_URL}/login`,
          '',
          '— The MSAP Alumni Team',
          "Manipur Students' Association Pune",
        ].join('\n')
      : [
          `Dear ${registration.full_name},`,
          '',
          'Thank you for your interest in the MSAP Alumni platform.',
          'After review, we were unable to verify your alumni registration at this time.',
          registration.admin_notes ? `\nNote from admin: ${registration.admin_notes}\n` : '',
          'If you believe this is an error, please reach out to us at alumni.msap1973@gmail.com.',
          '',
          '— The MSAP Alumni Team',
          "Manipur Students' Association Pune",
        ].join('\n');

    await sendMail({
      to: registration.email,
      subject: isVerified
        ? '[MSAP Alumni] Your registration has been approved!'
        : '[MSAP Alumni] Update on your registration',
      html: buildStatusUpdateHtml(registration),
      text: textContent,
    });
    logger.info(`Applicant decision email sent to ${registration.email} [${registration.status}]`);
  } catch (err) {
    logger.error('Failed to send status-update email to applicant', { error: err.message });
  }
}
