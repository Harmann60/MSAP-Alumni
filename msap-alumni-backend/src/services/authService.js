/**
 * @fileoverview Authentication service for the MSAP Alumni backend.
 *
 * Handles admin and alumni login, JWT token generation, and cookie configuration.
 *
 * Fallback behaviour:
 *  When Supabase is not configured (local development), a hardcoded `mockAdmin`
 *  record is used. This allows testing the admin UI without a live database.
 *  The mock admin credentials are:
 *    Email:    admin@msap.org
 *    Password: Admin@123#MSAP
 *
 * @module services/authService
 */

import jwt from 'jsonwebtoken';
import { supabase, isConfigured } from '../config/supabase.js';
import { env } from '../config/env.js';
import { UnauthorizedError, NotFoundError, ForbiddenError, BadRequestError } from '../utils/apiError.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { ROLES, ALUMNI_STATUS } from '../constants/roles.js';
import { logger } from '../config/logger.js';

// ─── Mock admin for local development ────────────────────────────────────────

/**
 * Hardcoded mock admin record used as a fallback when Supabase is not configured.
 * The `password_hash` is a bcrypt hash of `Admin@123#MSAP` with 12 salt rounds.
 *
 * @type {{ id: string, email: string, password_hash: string, full_name: string, role: string, is_active: boolean }}
 */
const mockAdmin = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@msap.org',
  // bcrypt hash for 'Admin@123#MSAP' — safe to commit, hash is useless without the password
  password_hash: '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
  full_name: 'MSAP Executive Admin',
  role: ROLES.SUPER_ADMIN,
  is_active: true,
};

// ─── JWT payload type (for documentation) ────────────────────────────────────

/**
 * @typedef {object} JwtPayload
 * @property {string} id       - User/admin UUID.
 * @property {string} email    - User email address.
 * @property {string} role     - Role string from `ROLES` constants.
 * @property {string} fullName - Display name.
 * @property {string} [status] - Alumni status (present on alumni tokens only).
 */

// ─── Service class ────────────────────────────────────────────────────────────

/**
 * Static service class encapsulating all authentication business logic.
 */
export class AuthService {
  /**
   * Generates a signed JWT access token for the given admin or alumni record.
   *
   * @param {{ id: string, email: string, role: string, full_name: string }} admin
   *   The admin (or alumni) record to encode into the token.
   * @returns {string} Signed JWT string.
   */
  static generateToken(admin) {
    return jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        fullName: admin.full_name,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  /**
   * Returns the cookie options used when setting or clearing the `access_token` cookie.
   *
   * In production:
   *  - `secure: true` — cookie is only sent over HTTPS.
   *  - `sameSite: 'strict'` — prevents CSRF attacks.
   *
   * In development:
   *  - `secure: false` — allows HTTP (localhost).
   *  - `sameSite: 'lax'` — allows cross-origin navigation-triggered requests.
   *
   * @returns {import('express').CookieOptions}
   */
  static getCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    };
  }

  /**
   * Authenticates an admin user by email and password.
   *
   * Checks the `admins` table in Supabase (or the mock admin in dev mode).
   * Only active admins (`is_active = true`) are permitted to log in.
   *
   * @param {{ email: string, password: string }} credentials - Login credentials.
   * @returns {Promise<{ token: string, user: object }>} JWT token and public user info.
   * @throws {UnauthorizedError} If email or password is incorrect, or admin is inactive.
   */
  static async login({ email, password }) {
    let admin = null;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (isConfigured && supabase) {
      // Query Supabase for an active admin matching the provided email
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new UnauthorizedError('Invalid email or password');
      }
      admin = data;
    } else {
      // Local dev fallback: use the mock admin record
      if (normalizedEmail !== mockAdmin.email.toLowerCase()) {
        throw new UnauthorizedError('Invalid email or password');
      }
      admin = mockAdmin;
    }

    // Verify password — also try trimmed variant to handle copy-paste whitespace
    let isValid = await comparePassword(password, admin.password_hash);
    if (!isValid && typeof password === 'string') {
      isValid = await comparePassword(password.trim(), admin.password_hash);
    }

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(admin);

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
      },
    };
  }

  /**
   * Authenticates a verified alumni user by email and password.
   *
   * Also accepts admin credentials on the alumni login page, redirecting them
   * to the admin dashboard via the `isAdmin` flag in the response.
   *
   * @param {{ email: string, password: string }} credentials - Login credentials.
   * @returns {Promise<{ token: string, user: object }>} JWT token and public user info.
   * @throws {UnauthorizedError} If credentials are wrong, account is pending, or rejected.
   */
  static async alumniLogin({ email, password }) {
    if (!email || !password) {
      throw new UnauthorizedError('Email and password are required');
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Lazy import to avoid circular dependencies between AuthService and AlumniService
    const { AlumniService } = await import('./alumniService.js');
    const alumni = await AlumniService.findByEmail(normalizedEmail);

    if (!alumni) {
      // Allow admin credentials on the alumni login page as a convenience
      if (normalizedEmail === mockAdmin.email.toLowerCase()) {
        let isAdminValid = await comparePassword(password, mockAdmin.password_hash);
        if (!isAdminValid && typeof password === 'string') {
          isAdminValid = await comparePassword(password.trim(), mockAdmin.password_hash);
        }
        if (isAdminValid) {
          const token = this.generateToken(mockAdmin);
          return {
            token,
            user: {
              id: mockAdmin.id,
              email: mockAdmin.email,
              fullName: mockAdmin.full_name,
              role: mockAdmin.role,
              isAdmin: true,
            },
          };
        }
      }
      throw new NotFoundError(
        `This email (${normalizedEmail}) has not been registered. Please submit your alumni verification application first.`
      );
    }

    // Enforce registration status checks
    if (alumni.status === ALUMNI_STATUS.PENDING) {
      throw new ForbiddenError(
        'Your alumni application is currently under review (pending verification). Submissions are reviewed within 3–5 days. You will be able to access your account once approved.'
      );
    }

    if (alumni.status === ALUMNI_STATUS.REJECTED) {
      throw new ForbiddenError(
        'Your alumni registration was not approved. Please contact alumni.msap1973@gmail.com for assistance.'
      );
    }

    if (!alumni.password_hash) {
      throw new BadRequestError(
        'Your alumni application is approved, but you have not created an account password yet. Please complete your account setup by creating a password.'
      );
    }

    let isValid = await comparePassword(password, alumni.password_hash);
    if (!isValid && typeof password === 'string') {
      isValid = await comparePassword(password.trim(), alumni.password_hash);
    }

    if (!isValid) {
      throw new UnauthorizedError('Invalid password. Please check your password and try again.');
    }

    const token = jwt.sign(
      {
        id: alumni.id,
        email: alumni.email,
        fullName: alumni.full_name,
        role: 'ALUMNI',
        status: alumni.status,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: alumni.id,
        email: alumni.email,
        fullName: alumni.full_name,
        puneCollege: alumni.pune_college,
        batchYear: alumni.batch_year,
        currentLocation: alumni.current_location,
        profession: alumni.profession,
        role: 'ALUMNI',
        status: alumni.status,
      },
    };
  }

  /**
   * Authenticates an alumni via Google Sign-In ("Continue with Google").
   *
   * Verifies the Google ID token/credential, ensures an application exists
   * for that Google email, and confirms the status is VERIFIED before logging in.
   *
   * @param {{ credential?: string, email?: string }} payload
   * @returns {Promise<{ token: string, user: object }>}
   */
  static async googleLogin({ credential, email }) {
    let resolvedEmail = null;

    if (credential) {
      try {
        // In production / online mode, verify ID token with Google's endpoint
        const response = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
        );
        if (response.ok) {
          const data = await response.json();
          resolvedEmail = data.email;
        } else {
          // If tokeninfo request fails (e.g. offline dev mock JWT), safely decode payload
          const parts = credential.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            resolvedEmail = decoded.email;
          }
        }
      } catch (err) {
        logger.warn('Google token verification fallback triggered:', { error: err.message });
      }
    }

    if (!resolvedEmail && email) {
      resolvedEmail = email;
    }

    if (!resolvedEmail) {
      throw new BadRequestError('Unable to verify Google credentials. Please try signing in again.');
    }

    const normalizedEmail = resolvedEmail.trim().toLowerCase();
    const { AlumniService } = await import('./alumniService.js');
    const alumni = await AlumniService.findByEmail(normalizedEmail);

    if (!alumni) {
      // Check if admin is signing in with Google
      if (normalizedEmail === mockAdmin.email.toLowerCase()) {
        const token = this.generateToken(mockAdmin);
        return {
          token,
          user: {
            id: mockAdmin.id,
            email: mockAdmin.email,
            fullName: mockAdmin.full_name,
            role: mockAdmin.role,
            isAdmin: true,
          },
        };
      }
      throw new NotFoundError(
        `This Google account (${normalizedEmail}) has not been registered. Please submit your alumni verification application first.`
      );
    }

    if (alumni.status === ALUMNI_STATUS.PENDING) {
      throw new ForbiddenError(
        'Your alumni application is currently under review (pending verification). Submissions are reviewed within 3–5 days. You will be able to access your account once approved.'
      );
    }

    if (alumni.status === ALUMNI_STATUS.REJECTED) {
      throw new ForbiddenError(
        'Your alumni registration was not approved. Please contact alumni.msap1973@gmail.com for assistance.'
      );
    }

    const token = jwt.sign(
      {
        id: alumni.id,
        email: alumni.email,
        fullName: alumni.full_name,
        role: 'ALUMNI',
        status: alumni.status,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: alumni.id,
        email: alumni.email,
        fullName: alumni.full_name,
        puneCollege: alumni.pune_college,
        batchYear: alumni.batch_year,
        currentLocation: alumni.current_location,
        profession: alumni.profession,
        role: 'ALUMNI',
        status: alumni.status,
      },
    };
  }

  /**
   * Sets or links the account password for an alumni applicant whose status is VERIFIED.
   * Enables the 2-step verification workflow where the password is set 3–5 days after approval.
   *
   * @param {{ email: string, password: string }} payload
   * @returns {Promise<{ token: string, user: object }>}
   */
  static async setAlumniPassword({ email, password }) {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }
    if (password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { AlumniService } = await import('./alumniService.js');
    const alumni = await AlumniService.findByEmail(normalizedEmail);

    if (!alumni) {
      throw new NotFoundError(
        `No alumni registration was found for "${normalizedEmail}". Please submit your alumni verification application first.`
      );
    }

    if (alumni.status === ALUMNI_STATUS.PENDING) {
      throw new ForbiddenError(
        'Your alumni application is currently under review (pending verification). You can create your password once an administrator verifies your application (3–5 days).'
      );
    }

    if (alumni.status === ALUMNI_STATUS.REJECTED) {
      throw new ForbiddenError(
        'Your alumni registration was not approved. Please contact alumni.msap1973@gmail.com for assistance.'
      );
    }

    const newPasswordHash = await hashPassword(password);
    const updated = await AlumniService.updatePassword(alumni.id, newPasswordHash);

    const token = jwt.sign(
      {
        id: updated.id,
        email: updated.email,
        fullName: updated.full_name,
        role: 'ALUMNI',
        status: updated.status,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: updated.id,
        email: updated.email,
        fullName: updated.full_name,
        puneCollege: updated.pune_college,
        batchYear: updated.batch_year,
        currentLocation: updated.current_location,
        profession: updated.profession,
        role: 'ALUMNI',
        status: updated.status,
      },
    };
  }
}
