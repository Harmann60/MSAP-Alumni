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
 * @param {object} reg - The updated registration record.
 * @returns {string} Complete HTML document.
 */
function buildStatusUpdateHtml(reg) {
  const isVerified = reg.status === 'VERIFIED';
  const statusColor = isVerified ? '#15803D' : '#DC2626';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${isVerified ? 'Welcome to the MSAP Alumni Society!' : 'Your MSAP Alumni Registration Update'}</title></head>
<body style="margin:0;padding:0;background:#F6F4FA;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F4FA;padding:36px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(26,20,41,0.08);background:#ffffff;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1429 0%,#2D1F47 100%);padding:36px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#C7B8E8;">Manipur Students' Association Pune</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#FAF9FC;letter-spacing:0.02em;">MSAP Alumni Society</h1>
            <p style="margin:6px 0 0;font-size:12px;color:#A99BC2;letter-spacing:0.04em;">Association of MSAP Alumni, Manipur · Est. 1973</p>
          </td>
        </tr>

        <!-- Alert banner -->
        <tr>
          <td style="background:${statusColor};padding:14px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#ffffff;">
              ${isVerified ? '🎉 Congratulations &amp; Welcome to the Society! 🎓' : 'Notice Regarding Alumni Registration'}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:38px 40px;">
            <p style="margin:0 0 14px;font-family:Georgia,serif;font-size:24px;color:#1A1429;">Dear ${reg.full_name},</p>
            ${isVerified
              ? `
                <div style="background:#F0FDF4;border-left:4px solid #16A34A;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                  <p style="margin:0;font-size:16px;font-weight:700;color:#166534;line-height:1.4;">
                    Congratulations! You have been accepted and warmly welcomed into the Manipur Students' Association Pune (MSAP) Alumni Society.
                  </p>
                </div>

                <p style="margin:0 0 18px;font-size:15px;color:#332947;line-height:1.75;">
                  We are delighted to confirm that your alumni registration has been <strong>officially verified and approved</strong>.
                  As an alumnus of Pune and a member of our vibrant community, you are now officially connected to our lifelong network of graduates across batches, colleges, and professions worldwide.
                </p>

                ${reg.admin_notes ? `
                  <div style="background:#FAF5FF;border:1px dashed #C084FC;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7E22CE;">💬 Note from the Association Admin:</p>
                    <p style="margin:0;font-size:14px;color:#581C87;font-style:italic;">"${reg.admin_notes}"</p>
                  </div>
                ` : ''}

                <!-- Membership Summary -->
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7E7394;">Verified Membership Details</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #EAE5F2;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                  ${row('Full Name', reg.full_name)}
                  ${row('Registered Email', `<a href="mailto:${reg.email}" style="color:#7C5CFC;text-decoration:none;">${reg.email}</a>`)}
                  ${row('College / Campus', reg.pune_college || 'Pune Alumnus')}
                  ${row('Batch Year', reg.batch_year ? String(reg.batch_year) : '—')}
                  ${row('Location', reg.current_location || '—')}
                  ${row('Status', '<span style="color:#16A34A;font-weight:700;">Verified Member ✓</span>')}
                </table>

                <!-- CTA Button -->
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                  <tr>
                    <td align="center" style="border-radius:6px;background:linear-gradient(135deg,#7C5CFC 0%,#583B9C 100%);box-shadow:0 4px 14px rgba(124,92,252,0.35);">
                      <a href="${env.CLIENT_URL}/login" target="_blank"
                         style="display:inline-block;padding:14px 32px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FAF9FC;text-decoration:none;">
                        Sign In to Alumni Portal →
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Next steps box -->
                <div style="background:#FAF9FC;border:1px solid #EAE5F2;border-radius:8px;padding:20px 22px;margin-bottom:24px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1A1429;">What you can do as a verified member:</p>
                  <ul style="margin:0;padding-left:18px;font-size:13px;color:#554868;line-height:1.7;">
                    <li><strong>Alumni Directory:</strong> Search and reconnect with classmates and alumni mentors across India and abroad.</li>
                    <li><strong>Reunions &amp; Events:</strong> Receive priority access to the Annual Pune Meet, Yaoshang Festival, and professional webinars.</li>
                    <li><strong>Articles &amp; Stories:</strong> Share your career milestones, read alumnus spotlights, and submit community news.</li>
                    <li><strong>Support &amp; Mentorship:</strong> Guide junior students arriving in Pune for their higher studies.</li>
                  </ul>
                </div>
              `
              : `
                <p style="margin:0 0 16px;font-size:15px;color:#2D253D;line-height:1.75;">
                  Thank you for your interest in joining the MSAP Alumni platform.
                  After careful review by the executive committee, we were unable to verify your alumni registration at this time.
                </p>
                ${reg.admin_notes ? `
                  <div style="background:#FEF2F2;border-left:4px solid #DC2626;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#991B1B;">Admin Explanation:</p>
                    <p style="margin:0;font-size:14px;color:#7F1D1D;">${reg.admin_notes}</p>
                  </div>
                ` : ''}
                <p style="margin:16px 0 0;font-size:14px;color:#554868;line-height:1.7;">
                  If you believe this is an error or would like to submit college ID verification, please reply to this email or write to
                  <a href="mailto:alumni.msap1973@gmail.com" style="color:#7C5CFC;text-decoration:none;font-weight:600;">alumni.msap1973@gmail.com</a>.
                </p>
              `
            }

            <p style="margin:28px 0 4px;font-size:14px;color:#1A1429;font-weight:600;">Warm regards and solidarity,</p>
            <p style="margin:0;font-size:13px;color:#7E7394;">
              <strong>The Executive Council</strong><br>
              Association of MSAP Alumni, Manipur<br>
              Manipur Students' Association Pune
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#EAE5F2;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#7E7394;">
              Manipur Students' Association Pune · Est. 1973 · <a href="${env.CLIENT_URL}" style="color:#7C5CFC;text-decoration:none;">${env.CLIENT_URL}</a>
            </p>
            <p style="margin:0;font-size:11px;color:#9E92B5;">
              Questions? Reach our secretarial team at <a href="mailto:alumni.msap1973@gmail.com" style="color:#7C5CFC;text-decoration:none;">alumni.msap1973@gmail.com</a>
            </p>
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
          "CONGRATULATIONS! WELCOME TO THE MSAP ALUMNI SOCIETY!",
          '-------------------------------------------------------',
          "We are thrilled to inform you that your application to join the Manipur Students' Association Pune (MSAP) Alumni Society has been officially verified and approved!",
          '',
          'As a verified alumnus, you are now officially part of our lifelong global network.',
          registration.admin_notes ? `\nNote from Admin: "${registration.admin_notes}"\n` : '',
          'You can now sign in to your alumni account with your credentials at:',
          `${env.CLIENT_URL}/login`,
          '',
          'Membership Privileges:',
          '- Access the Alumni Directory and connect with fellow Pune graduates',
          '- Priority invites to the Annual Alumni Meet, Yaoshang cultural festival, and reunions',
          '- Read and share career stories, insights, and mentorship opportunities',
          '',
          'Warm regards and solidarity,',
          'The Executive Council',
          "Manipur Students' Association Pune (MSAP) Alumni Society",
        ].join('\n')
      : [
          `Dear ${registration.full_name},`,
          '',
          'Thank you for your interest in the MSAP Alumni platform.',
          'After review by the executive committee, we were unable to verify your alumni registration at this time.',
          registration.admin_notes ? `\nNote from admin: ${registration.admin_notes}\n` : '',
          'If you believe this is an error or have additional college documents, please reach out to us at alumni.msap1973@gmail.com.',
          '',
          '— The MSAP Alumni Team',
          "Manipur Students' Association Pune",
        ].join('\n');

    await sendMail({
      to: registration.email,
      subject: isVerified
        ? `🎉 Congratulations! Welcome to the MSAP Alumni Society — ${registration.full_name}`
        : `[MSAP Alumni] Update on your registration`,
      html: buildStatusUpdateHtml(registration),
      text: textContent,
    });
    logger.info(`Applicant decision email sent to ${registration.email} [${registration.status}]`);
  } catch (err) {
    logger.error('Failed to send status-update email to applicant', { error: err.message });
  }
}

/**
 * Builds the full HTML body for a password reset email.
 *
 * @param {object} alumni    - Alumni user record.
 * @param {string} resetLink - Complete URL to reset password.
 * @returns {string} Complete HTML document.
 */
function buildPasswordResetHtml(alumni, resetLink) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Reset Your Password — MSAP Alumni</title></head>
<body style="margin:0;padding:0;background:#F6F4FA;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F6F4FA;padding:36px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(26,20,41,0.08);background:#ffffff;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1429 0%,#2D1F47 100%);padding:36px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#C7B8E8;">Manipur Students' Association Pune</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#FAF9FC;">MSAP Alumni Portal</h1>
          </td>
        </tr>

        <!-- Alert banner -->
        <tr>
          <td style="background:#7C5CFC;padding:12px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#ffffff;">
              🔐 Password Reset Request
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;color:#1A1429;">Dear ${alumni.full_name || 'Alumnus'},</p>
            <p style="margin:0 0 18px;font-size:15px;color:#332947;line-height:1.75;">
              We received a request to reset the password for your MSAP Alumni account associated with <strong>${alumni.email}</strong>.
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#554868;line-height:1.7;">
              To choose a new password and regain access to your account, click the button below:
            </p>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td align="center" style="border-radius:6px;background:linear-gradient(135deg,#7C5CFC 0%,#583B9C 100%);box-shadow:0 4px 14px rgba(124,92,252,0.35);">
                  <a href="${resetLink}" target="_blank"
                     style="display:inline-block;padding:14px 32px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FAF9FC;text-decoration:none;">
                    Reset Your Password →
                  </a>
                </td>
              </tr>
            </table>

            <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
              <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">
                ⏱ <strong>Security Notice:</strong> This reset link is single-use and will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your account remains completely secure.
              </p>
            </div>

            <p style="margin:0;font-size:12px;color:#7E7394;line-height:1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color:#7C5CFC;word-break:break-all;">${resetLink}</a>
            </p>

            <p style="margin:28px 0 0;font-size:13px;color:#7E7394;">
              — The MSAP Alumni Support Team<br>
              <a href="mailto:alumni.msap1973@gmail.com" style="color:#7C5CFC;text-decoration:none;">alumni.msap1973@gmail.com</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#EAE5F2;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#7E7394;">
              Manipur Students' Association Pune · Est. 1973 · <a href="${env.CLIENT_URL}" style="color:#7C5CFC;text-decoration:none;">${env.CLIENT_URL}</a>
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
 * Sends a password reset email to a verified alumni user.
 *
 * @param {object} alumni    - Alumni user record.
 * @param {string} resetLink - Complete URL to reset password.
 * @returns {Promise<void>}
 */
export async function sendPasswordResetEmail(alumni, resetLink) {
  if (!alumni?.email) return;
  try {
    await sendMail({
      to: alumni.email,
      subject: `🔐 Reset Your Password — MSAP Alumni`,
      html: buildPasswordResetHtml(alumni, resetLink),
      text: [
        `Dear ${alumni.full_name || 'Alumnus'},`,
        '',
        'We received a request to reset the password for your MSAP Alumni account.',
        '',
        'To set a new password, open this link in your browser (expires in 1 hour):',
        resetLink,
        '',
        'If you did not request this, please ignore this email. Your account remains safe.',
        '',
        '— The MSAP Alumni Team',
        "Manipur Students' Association Pune",
      ].join('\n'),
    });
    logger.info(`Password reset email sent to ${alumni.email}`);
  } catch (err) {
    logger.error('Failed to send password-reset email', { error: err.message });
  }
}

/**
 * Sends a security confirmation email after a password was successfully changed.
 *
 * @param {object} alumni - Alumni user record.
 * @returns {Promise<void>}
 */
export async function sendPasswordChangedAlert(alumni) {
  if (!alumni?.email) return;
  try {
    await sendMail({
      to: alumni.email,
      subject: `Security Alert: Your MSAP Alumni Password Was Changed`,
      html: `
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;padding:24px;color:#1A1429;">
          <h2 style="color:#1A1429;">Password Changed Successfully</h2>
          <p>Dear ${alumni.full_name || 'Alumnus'},</p>
          <p>This is a confirmation that the password for your MSAP Alumni account (<strong>${alumni.email}</strong>) was just successfully updated.</p>
          <p>If you made this change, no further action is required.</p>
          <p style="color:#DC2626;font-weight:bold;">If you did NOT make this change, please contact us immediately at <a href="mailto:alumni.msap1973@gmail.com">alumni.msap1973@gmail.com</a>.</p>
          <br>
          <p>— The MSAP Alumni Team</p>
        </div>
      `,
      text: [
        `Dear ${alumni.full_name || 'Alumnus'},`,
        '',
        'This is a confirmation that your MSAP Alumni account password was just changed.',
        'If you made this change, no action is needed.',
        'If you did NOT make this change, contact alumni.msap1973@gmail.com immediately.',
        '',
        '— The MSAP Alumni Team',
      ].join('\n'),
    });
  } catch (err) {
    logger.error('Failed to send password-changed alert email', { error: err.message });
  }
}

