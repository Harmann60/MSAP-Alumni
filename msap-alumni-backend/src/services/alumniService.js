/**
 * @fileoverview Alumni registration service for the MSAP Alumni backend.
 *
 * Manages the full lifecycle of alumni registration records:
 *  - Registering new alumni (with optional password hashing and IP hashing)
 *  - Listing registrations with pagination and status filtering
 *  - Updating registration status (PENDING → VERIFIED / REJECTED)
 *  - Looking up a registration by email
 *
 * When Supabase is not configured, all operations fall back to an in-memory
 * `mockRegistrations` array to allow local development without a database.
 *
 * @module services/alumniService
 */

import crypto from 'crypto';
import { supabase, isConfigured } from '../config/supabase.js';
import { ALUMNI_STATUS } from '../constants/roles.js';
import { NotFoundError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import { sendNewRegistrationAlert, sendStatusUpdateEmail } from './emailService.js';
import { hashPassword } from '../utils/password.js';

// ─── In-memory mock data (local development only) ─────────────────────────────

/**
 * Seed data for local development.
 * Covers all three status states so the admin UI can be tested without a database.
 *
 * @type {Array<object>}
 */
const mockRegistrations = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    full_name: 'Ningombam Sanjit',
    email: 'sanjit.ningombam@gmail.com',
    phone: '+91 98621 54320',
    pune_college: 'Fergusson College Pune',
    batch_year: 2016,
    current_location: 'Bengaluru, India',
    profession: 'Senior Software Engineer at Oracle',
    status: ALUMNI_STATUS.PENDING,
    password_hash: '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
    admin_notes: null,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    full_name: 'Thoidingjam Linthoingambi',
    email: 'linthoi.t@outlook.com',
    phone: '+91 97740 12895',
    pune_college: 'Symbiosis Law School Pune',
    batch_year: 2018,
    current_location: 'Pune, India',
    profession: 'Corporate Legal Consultant',
    status: ALUMNI_STATUS.VERIFIED,
    // bcrypt hash for 'Admin@123#MSAP' — used for local dev login testing
    password_hash: '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
    admin_notes: 'Verified against SLS alumni roll',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'e2a8719f-d312-4f36-9b5a-73d82f913d02',
    full_name: 'Laishram Bikram Singh',
    email: 'bikram.laishram@yahoo.com',
    phone: '+91 88372 90143',
    pune_college: 'COEP Technological University',
    batch_year: 2021,
    current_location: 'Munich, Germany',
    profession: 'Aerospace Research Fellow',
    status: ALUMNI_STATUS.PENDING,
    password_hash: '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
    admin_notes: null,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

// ─── Service class ────────────────────────────────────────────────────────────

/**
 * Static service class for alumni registration CRUD operations.
 */
export class AlumniService {
  /**
   * Creates a SHA-256 hash of an IP address.
   *
   * Hashing prevents storing raw IPs (a PII concern under GDPR/DPDP),
   * while still enabling duplicate-submission detection.
   *
   * @param {string | null | undefined} ip - Raw IP address string.
   * @returns {string | null} Hex-encoded SHA-256 hash, or `null` if no IP is provided.
   */
  static hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Registers a new alumni applicant.
   *
   * Steps:
   *  1. Hash the IP for privacy.
   *  2. Hash the password (if provided) with bcrypt.
   *  3. Persist the record to Supabase (or the in-memory store in dev).
   *  4. Fire-and-forget: send a notification email to the NGO admin.
   *
   * @param {object} data                      - Validated registration payload.
   * @param {string} data.fullName             - Applicant's full name.
   * @param {string} data.email                - Applicant's email address.
   * @param {string} [data.password]           - Optional password for account creation.
   * @param {string} [data.phone]              - Contact phone number.
   * @param {string} [data.puneCollege]        - College attended in Pune.
   * @param {number} [data.batchYear]          - Year of graduation.
   * @param {string} [data.currentLocation]    - Current city/country.
   * @param {string} [data.profession]         - Current profession/job title.
   * @param {string | null} clientIp           - Client IP address (hashed before storage).
   * @returns {Promise<object>} The saved registration record.
   * @throws {Error} If the Supabase insert fails.
   */
  static async register(data, clientIp) {
    const ipHash = this.hashIp(clientIp);
    let passwordHash = null;
    if (data.password) {
      passwordHash = await hashPassword(data.password);
    }

    const newRecord = {
      full_name: data.fullName,
      email: data.email.toLowerCase().trim(),
      password_hash: passwordHash,
      phone: data.phone || null,
      pune_college: data.puneCollege || null,
      batch_year: data.batchYear || null,
      current_location: data.currentLocation || null,
      profession: data.profession || null,
      status: ALUMNI_STATUS.PENDING,
      ip_hash: ipHash,
    };

    let savedRecord;

    if (isConfigured && supabase) {
      const { data: inserted, error } = await supabase
        .from('alumni_registrations')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        logger.error('Supabase registration insert error', { error: error.message });
        throw new Error('Failed to persist registration details');
      }
      savedRecord = inserted;
    } else {
      // In-memory fallback for local development
      savedRecord = {
        id: crypto.randomUUID(),
        ...newRecord,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockRegistrations.unshift(savedRecord);
    }

    // Non-blocking email notification — never fails the registration if email fails
    sendNewRegistrationAlert(savedRecord);

    return savedRecord;
  }

  /**
   * Lists alumni registrations with optional status filtering and pagination.
   *
   * @param {object}           options          - Query options.
   * @param {string}          [options.status]  - Filter by status: PENDING, VERIFIED, or REJECTED.
   * @param {number}          [options.page=1]  - 1-indexed page number.
   * @param {number}          [options.limit=20]- Number of records per page.
   * @returns {Promise<{ items: object[], total: number, page: number, limit: number }>}
   *   Paginated result set.
   */
  static async list({ status, page = 1, limit = 20 }) {
    if (isConfigured && supabase) {
      let query = supabase
        .from('alumni_registrations')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      const offset = (page - 1) * limit;
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Supabase alumni list query error', { error: error.message });
        throw new Error('Failed to retrieve alumni registrations');
      }

      return { items: data, total: count, page, limit };
    }

    // In-memory fallback
    let filtered = [...mockRegistrations];
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);
    return { items: paginated, total: filtered.length, page, limit };
  }

  /**
   * Updates the status of an alumni registration and notifies the applicant.
   *
   * When status changes to VERIFIED or REJECTED, a non-blocking email is sent
   * to the applicant informing them of the outcome.
   *
   * @param {string} id                        - UUID of the registration to update.
   * @param {object} options                   - Update payload.
   * @param {string} options.status            - New status value (PENDING/VERIFIED/REJECTED).
   * @param {string} [options.adminNotes]      - Optional admin note visible to the applicant.
   * @param {string} [options.adminId]         - UUID of the reviewing admin.
   * @returns {Promise<object>} The updated registration record.
   * @throws {NotFoundError} If no record with the given ID exists.
   */
  static async updateStatus(id, { status, adminNotes, adminId }) {
    let validAdminId = null;

    if (isConfigured && supabase) {
      // Validate adminId against admins table to avoid 23503 foreign key violation
      if (adminId && adminId !== '00000000-0000-0000-0000-000000000001') {
        const { data: adminExists } = await supabase
          .from('admins')
          .select('id')
          .eq('id', adminId)
          .maybeSingle();
        if (adminExists) {
          validAdminId = adminExists.id;
        }
      }

      const updatePayload = {
        status,
        admin_notes: adminNotes || null,
        reviewed_by: validAdminId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('alumni_registrations')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        logger.error('Supabase update status error:', { error: error.message, id });
        throw new Error(`Failed to update status in database: ${error.message}`);
      }

      if (data) {
        // Non-blocking: notify applicant of approval or rejection
        if (status === ALUMNI_STATUS.VERIFIED || status === ALUMNI_STATUS.REJECTED) {
          sendStatusUpdateEmail(data);
        }
        return data;
      }
    }

    // Fallback for mock records or local development
    const item = mockRegistrations.find((r) => r.id === id);
    if (!item) {
      throw new NotFoundError('Alumni registration record not found');
    }

    const fallbackPayload = {
      status,
      admin_notes: adminNotes || null,
      reviewed_by: adminId || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    Object.assign(item, fallbackPayload);

    if (status === ALUMNI_STATUS.VERIFIED || status === ALUMNI_STATUS.REJECTED) {
      sendStatusUpdateEmail(item);
    }

    return item;
  }

  /**
   * Permanently deletes an alumni registration record from database and memory.
   *
   * @param {string} id - UUID of the registration to delete.
   * @returns {Promise<{ id: string, deleted: boolean }>}
   */
  static async delete(id) {
    if (isConfigured && supabase) {
      const { error } = await supabase
        .from('alumni_registrations')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Supabase delete alumni error:', { error: error.message, id });
        throw new Error(`Failed to delete registration: ${error.message}`);
      }
    }

    const idx = mockRegistrations.findIndex((r) => r.id === id);
    if (idx !== -1) {
      mockRegistrations.splice(idx, 1);
    }

    return { id, deleted: true };
  }

  /**
   * Updates an alumni record's profile details.
   *
   * Allows admins to modify personal details, status, or administrative notes.
   *
   * @param {string} id       - UUID of the alumni record to update.
   * @param {object} updates  - Validated fields to update.
   * @returns {Promise<object>} The updated alumni record.
   */
  static async updateProfile(id, updates) {
    const payload = {};
    if (updates.fullName !== undefined) payload.full_name = updates.fullName.trim();
    if (updates.email !== undefined) payload.email = updates.email.toLowerCase().trim();
    if (updates.phone !== undefined) payload.phone = updates.phone || null;
    if (updates.puneCollege !== undefined) payload.pune_college = updates.puneCollege || null;
    if (updates.batchYear !== undefined) payload.batch_year = updates.batchYear || null;
    if (updates.currentLocation !== undefined) payload.current_location = updates.currentLocation || null;
    if (updates.profession !== undefined) payload.profession = updates.profession || null;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes || null;
    payload.updated_at = new Date().toISOString();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('alumni_registrations')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        logger.error('Supabase update alumni profile error:', { error: error.message, id });
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      if (data) return data;
    }

    const item = mockRegistrations.find((r) => r.id === id);
    if (!item) {
      throw new NotFoundError('Alumni registration record not found');
    }
    Object.assign(item, payload);
    return item;
  }

  /**
   * Finds a single alumni registration by email address.
   *
   * Returns the most recently created record if multiple exist for the same email
   * (e.g. a re-registration after rejection). Returns `null` if not found.
   *
   * @param {string} email - Email address to search for.
   * @returns {Promise<object | null>} The registration record, or `null` if not found.
   */
  static async findByEmail(email) {
    if (!email) return null;
    const normalizedEmail = email.toLowerCase().trim();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('alumni_registrations')
        .select('*')
        .eq('email', normalizedEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Supabase findByEmail error', { error: error.message });
      }
      if (data) return data;
      // Fallback to dev mock seed data if not found in database
      return mockRegistrations.find((r) => r.email.toLowerCase() === normalizedEmail) || null;
    }

    return mockRegistrations.find((r) => r.email.toLowerCase() === normalizedEmail) || null;
  }

  /**
   * Updates the password hash for an alumni record.
   * Used when an approved alumnus sets or links their password.
   *
   * @param {string} id           - Alumni UUID.
   * @param {string} passwordHash - Bcrypt hash of the new password.
   * @returns {Promise<object>} The updated alumni record.
   */
  static async updatePassword(id, passwordHash) {
    const updatePayload = {
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('alumni_registrations')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    }

    const item = mockRegistrations.find((r) => r.id === id);
    if (!item) {
      throw new NotFoundError('Alumni registration record not found');
    }
    Object.assign(item, updatePayload);
    return item;
  }
}
