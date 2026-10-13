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
import { ALUMNI_STATUS, ROLES } from '../constants/roles.js';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import { sendNewRegistrationAlert, sendStatusUpdateEmail } from './emailService.js';
import { hashPassword } from '../utils/password.js';

const mockAdmins = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@msap.org',
    full_name: 'MSAP Executive Admin',
    role: 'SUPER_ADMIN',
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
];

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

    const email = data.email.toLowerCase().trim();

    const newRecord = {
      full_name: data.fullName,
      email,
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
      // 1. Proactively check if an application with this email already exists
      const { data: existing, error: queryError } = await supabase
        .from('alumni_registrations')
        .select('id, email, status, full_name')
        .eq('email', email)
        .maybeSingle();

      if (queryError) {
        logger.warn('Failed to check existing alumni registration by email', { error: queryError.message });
      }

      if (existing) {
        if (existing.status === ALUMNI_STATUS.VERIFIED) {
          throw new ConflictError(
            'An alumni account with this email address is already registered and verified. Please sign in instead.'
          );
        } else if (existing.status === ALUMNI_STATUS.PENDING) {
          throw new ConflictError(
            'A registration application with this email address has already been submitted and is currently pending verification by our administrator.'
          );
        } else if (existing.status === ALUMNI_STATUS.REJECTED) {
          throw new ConflictError(
            'A previous registration application with this email was reviewed. Please contact the administrator for assistance.'
          );
        } else {
          throw new ConflictError(
            'An alumni registration with this email address already exists.'
          );
        }
      }

      // 2. Insert new record
      const { data: inserted, error } = await supabase
        .from('alumni_registrations')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        logger.error('Supabase registration insert error', { error: error.message, code: error.code });
        if (
          error.code === '23505' ||
          error.message?.includes('duplicate key') ||
          error.message?.includes('alumni_registrations_email_key')
        ) {
          throw new ConflictError(
            'An alumni registration with this email address has already been submitted.'
          );
        }
        throw new Error('Failed to persist registration details');
      }
      savedRecord = inserted;
    } else {
      // In-memory fallback for local development
      const existing = mockRegistrations.find(
        (r) => r.email.toLowerCase() === email
      );
      if (existing) {
        if (existing.status === ALUMNI_STATUS.VERIFIED) {
          throw new ConflictError(
            'An alumni account with this email address is already registered and verified. Please sign in instead.'
          );
        } else if (existing.status === ALUMNI_STATUS.PENDING) {
          throw new ConflictError(
            'A registration application with this email address has already been submitted and is currently pending verification by our administrator.'
          );
        } else {
          throw new ConflictError(
            'An alumni registration with this email address already exists.'
          );
        }
      }

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
   * Automatically stores and verifies a new user authenticated via Google OAuth.
   *
   * @param {object} data - User details from Google OAuth.
   * @param {string} data.fullName - User's full name.
   * @param {string} data.email - User's verified Google email.
   * @returns {Promise<object>} The persisted alumni record.
   */
  static async createVerified(data) {
    const newRecord = {
      full_name: data.fullName || data.email.split('@')[0],
      email: data.email.toLowerCase().trim(),
      pune_college: data.puneCollege || 'Pune Alumni (Google Verified)',
      batch_year: data.batchYear || new Date().getFullYear(),
      current_location: data.currentLocation || 'Verified Alumnus',
      profession: data.profession || 'Alumnus',
      status: ALUMNI_STATUS.VERIFIED,
      admin_notes: 'Automatically verified via Google Sign-In',
    };

    if (isConfigured && supabase) {
      const { data: inserted, error } = await supabase
        .from('alumni_registrations')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        logger.error('Supabase createVerified error', { error: error.message });
        throw new Error('Failed to persist Google alumni profile');
      }
      return inserted;
    }

    const saved = {
      id: crypto.randomUUID(),
      ...newRecord,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockRegistrations.unshift(saved);
    return saved;
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
  /**
   * Lists alumni registrations with optional search, college, decade filtering and pagination.
   *
   * @param {object}           options              - Query options.
   * @param {string}          [options.status]      - Filter by status: PENDING, VERIFIED, or REJECTED.
   * @param {string}          [options.search]      - Search term across name, email, college, profession, location.
   * @param {string}          [options.puneCollege] - Filter by Pune college name substring.
   * @param {number|string}   [options.batchDecade] - Filter by batch decade start year (e.g. 1990).
   * @param {number|string}   [options.batchYear]   - Filter by specific batch year.
   * @param {number}          [options.page=1]      - 1-indexed page number.
   * @param {number}          [options.limit=20]    - Number of records per page.
   * @returns {Promise<{ items: object[], total: number, page: number, limit: number }>}
   */
  static async list({ status, search, puneCollege, batchDecade, batchYear, page = 1, limit = 20 }) {
    if (isConfigured && supabase) {
      let query = supabase
        .from('alumni_registrations')
        .select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }
      if (puneCollege) {
        query = query.ilike('pune_college', `%${puneCollege}%`);
      }
      if (batchYear) {
        query = query.eq('batch_year', Number(batchYear));
      }
      if (batchDecade) {
        const decadeStart = Number(batchDecade);
        query = query.gte('batch_year', decadeStart).lte('batch_year', decadeStart + 9);
      }
      if (search && search.trim()) {
        const term = search.trim();
        query = query.or(
          `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,pune_college.ilike.%${term}%,profession.ilike.%${term}%,current_location.ilike.%${term}%`
        );
      }

      const offset = (page - 1) * limit;
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Supabase alumni list query error', { error: error.message });
        throw new Error('Failed to retrieve alumni registrations');
      }

      return { items: data || [], total: count || 0, page, limit };
    }

    // In-memory fallback
    let filtered = [...mockRegistrations];
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }
    if (puneCollege) {
      filtered = filtered.filter((item) =>
        item.pune_college?.toLowerCase().includes(puneCollege.toLowerCase())
      );
    }
    if (batchYear) {
      filtered = filtered.filter((item) => Number(item.batch_year) === Number(batchYear));
    }
    if (batchDecade) {
      const decadeStart = Number(batchDecade);
      filtered = filtered.filter(
        (item) => Number(item.batch_year) >= decadeStart && Number(item.batch_year) <= decadeStart + 9
      );
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item.pune_college?.toLowerCase().includes(q) ||
          item.profession?.toLowerCase().includes(q) ||
          item.current_location?.toLowerCase().includes(q)
      );
    }
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);
    return { items: paginated, total: filtered.length, page, limit };
  }

  /**
   * Generates a UTF-8 RFC-4180 CSV string of alumni registrations for export.
   *
   * @param {object} options - Filter options matching list().
   * @returns {Promise<string>}
   */
  static async exportCSV(options = {}) {
    const { items } = await this.list({ ...options, page: 1, limit: 5000 });
    const headers = [
      'Full Name',
      'Email Address',
      'Phone Number',
      'Pune College / Institution',
      'Batch Year',
      'Current Location',
      'Profession / Designation',
      'Status',
      'Admin Notes',
      'Registered Date',
      'Reviewed At',
    ];

    const escape = (val) => {
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = items.map((r) => [
      escape(r.full_name),
      escape(r.email),
      escape(r.phone),
      escape(r.pune_college),
      escape(r.batch_year),
      escape(r.current_location),
      escape(r.profession),
      escape(r.status),
      escape(r.admin_notes),
      escape(r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : ''),
      escape(r.reviewed_at ? new Date(r.reviewed_at).toISOString().split('T')[0] : ''),
    ]);

    return '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
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
  static async updateStatus(id, { status, adminNotes, adminId, expectedStatus, lastKnownUpdatedAt }) {
    let validAdminId = null;

    if (isConfigured && supabase) {
      // 1. Concurrency Check: Verify record exists and has not been updated concurrently
      const { data: current, error: getErr } = await supabase
        .from('alumni_registrations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (current) {
        if (expectedStatus && current.status !== expectedStatus) {
          throw new ConflictError(
            `Conflict detected: This application has already been updated to ${current.status} by another administrator.`
          );
        }

      if (lastKnownUpdatedAt) {
        const currentUpdatedTime = new Date(current.updated_at || current.created_at || 0).getTime();
        const clientKnownTime = new Date(lastKnownUpdatedAt).getTime();
        if (!isNaN(currentUpdatedTime) && !isNaN(clientKnownTime) && currentUpdatedTime > clientKnownTime + 1000) {
          throw new ConflictError(
            'Conflict detected: This applicant record was modified by another administrator. Please refresh the list before proceeding.'
          );
        }
      }

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
        // Notify applicant of approval or rejection
        if (status === ALUMNI_STATUS.VERIFIED || status === ALUMNI_STATUS.REJECTED) {
          await sendStatusUpdateEmail(data);
        }
        return data;
      }
    }
  }

    // Fallback for mock records or local development
    const item = mockRegistrations.find((r) => r.id === id);
    if (!item) {
      throw new NotFoundError('Alumni registration record not found');
    }

    if (expectedStatus && item.status !== expectedStatus) {
      throw new ConflictError(
        `Conflict detected: This application has already been updated to ${item.status} by another administrator.`
      );
    }

    if (lastKnownUpdatedAt) {
      const currentUpdatedTime = new Date(item.updated_at || item.created_at || 0).getTime();
      const clientKnownTime = new Date(lastKnownUpdatedAt).getTime();
      if (!isNaN(currentUpdatedTime) && !isNaN(clientKnownTime) && currentUpdatedTime > clientKnownTime + 1000) {
        throw new ConflictError(
          'Conflict detected: This applicant record was modified by another administrator. Please refresh the list before proceeding.'
        );
      }
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
      await sendStatusUpdateEmail(item);
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
    if (updates.status !== undefined) {
      payload.status = updates.status;
      if (updates.status === ALUMNI_STATUS.VERIFIED) {
        payload.reviewed_at = new Date().toISOString();
      }
    }
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
      if (data) {
        if (updates.status === ALUMNI_STATUS.VERIFIED || updates.status === ALUMNI_STATUS.REJECTED) {
          await sendStatusUpdateEmail(data);
        }
        return data;
      }
    }

    const item = mockRegistrations.find((r) => r.id === id);
    if (!item) {
      throw new NotFoundError('Alumni registration record not found');
    }
    Object.assign(item, payload);
    if (updates.status === ALUMNI_STATUS.VERIFIED || updates.status === ALUMNI_STATUS.REJECTED) {
      await sendStatusUpdateEmail(item);
    }
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

  /**
   * Retrieves all staff and editorial team members from the admins table.
   *
   * @returns {Promise<Array<object>>} List of staff records with their roles and status.
   */
  static async listTeam() {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, full_name, role, is_active, last_login_at, created_at, updated_at')
        .order('created_at', { ascending: true });

      if (error) {
        logger.error('Supabase listTeam query error:', { error: error.message });
        throw new Error('Failed to retrieve team members');
      }

      return data.map((admin) => ({
        ...admin,
        displayRole: admin.role === 'MODERATOR' ? 'Content Manager' : admin.role.replace('_', ' '),
      }));
    }

    return mockAdmins.map((admin) => ({
      ...admin,
      displayRole: admin.role === 'MODERATOR' ? 'Content Manager' : admin.role.replace('_', ' '),
    }));
  }

  /**
   * Assigns an editorial role (Content Manager / MODERATOR) to a registered alumnus.
   *
   * Requirements:
   *  1. Alumnus must exist in alumni_registrations.
   *  2. Alumnus must not be REJECTED.
   *  3. Creates or updates a record in the `admins` table with role = 'MODERATOR'
   *     and copies their password_hash so they can sign in seamlessly.
   *
   * @param {object} params
   * @param {string} params.email   - Email of the registered alumnus.
   * @param {string} [params.role]  - Target role (default 'CONTENT_MANAGER' / 'MODERATOR').
   * @param {string} [params.adminId]- UUID of admin executing the assignment.
   * @returns {Promise<object>} The assigned staff record.
   */
  static async assignRole({ email, role = ROLES.CONTENT_MANAGER, adminId }) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const alumnus = await this.findByEmail(normalizedEmail);

    if (!alumnus) {
      throw new NotFoundError(
        `No registered alumni found for "${normalizedEmail}". The member must register their alumni profile on the website before receiving an editorial role.`
      );
    }

    if (alumnus.status === ALUMNI_STATUS.REJECTED) {
      throw new BadRequestError(
        'Cannot assign an editorial role to a rejected application. Please verify and approve the member first.'
      );
    }

    // Role in database table is constrained to 'SUPER_ADMIN', 'ADMIN', 'MODERATOR'
    const dbRole = 'MODERATOR';

    if (isConfigured && supabase) {
      // Check if admin already exists
      const { data: existingAdmin, error: queryErr } = await supabase
        .from('admins')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (queryErr) {
        logger.error('Supabase query error checking admin for role assignment:', queryErr);
      }

      let resultAdmin;
      if (existingAdmin) {
        // Reactivate or update role
        const { data: updated, error: updateErr } = await supabase
          .from('admins')
          .update({
            role: dbRole,
            full_name: alumnus.full_name,
            password_hash: alumnus.password_hash || existingAdmin.password_hash,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingAdmin.id)
          .select()
          .single();

        if (updateErr) {
          logger.error('Failed to update admin role in Supabase:', updateErr);
          throw new Error('Failed to update team member role');
        }
        resultAdmin = updated;
      } else {
        // Insert new admin row for content manager
        const newAdminRecord = {
          email: normalizedEmail,
          full_name: alumnus.full_name,
          role: dbRole,
          password_hash: alumnus.password_hash || '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('admins')
          .insert([newAdminRecord])
          .select()
          .single();

        if (insertErr) {
          logger.error('Failed to insert new admin in Supabase:', insertErr);
          throw new Error('Failed to assign editorial role');
        }
        resultAdmin = inserted;
      }

      // Also ensure alumnus record is verified if pending
      if (alumnus.status === ALUMNI_STATUS.PENDING) {
        await supabase
          .from('alumni_registrations')
          .update({
            status: ALUMNI_STATUS.VERIFIED,
            admin_notes: (alumnus.admin_notes ? `${alumnus.admin_notes} | ` : '') + 'Verified as Content Manager',
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', alumnus.id);
      }

      return {
        id: resultAdmin.id,
        email: resultAdmin.email,
        fullName: resultAdmin.full_name,
        role: resultAdmin.role,
        is_active: resultAdmin.is_active,
      };
    }

    // Mock fallback
    let existingMock = mockAdmins.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (existingMock) {
      existingMock.role = dbRole;
      existingMock.is_active = true;
      existingMock.updated_at = new Date().toISOString();
      if (alumnus.password_hash) existingMock.password_hash = alumnus.password_hash;
    } else {
      existingMock = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        full_name: alumnus.full_name,
        role: dbRole,
        password_hash: alumnus.password_hash || '$2b$12$4lNCXLOibuRwjRx6wzVdf.t.cj2Z9QWaMHSEA5cGyMMYahjAqtMzS',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockAdmins.push(existingMock);
    }

    if (alumnus.status === ALUMNI_STATUS.PENDING) {
      alumnus.status = ALUMNI_STATUS.VERIFIED;
      alumnus.admin_notes = (alumnus.admin_notes ? `${alumnus.admin_notes} | ` : '') + 'Verified as Content Manager';
    }

    return {
      id: existingMock.id,
      email: existingMock.email,
      fullName: existingMock.full_name,
      role: existingMock.role,
      is_active: existingMock.is_active,
    };
  }

  /**
   * Revokes staff/editorial role for an email.
   *
   * @param {object} params
   * @param {string} params.email - Staff email to revoke.
   * @returns {Promise<object>} Status of revocation.
   */
  static async revokeRole({ email }) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (normalizedEmail === 'admin@msap.org') {
      throw new BadRequestError('Cannot revoke Super Administrator access.');
    }

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('admins')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('email', normalizedEmail)
        .select()
        .maybeSingle();

      if (error) {
        logger.error('Failed to revoke role in Supabase:', error);
        throw new Error('Failed to revoke role in database');
      }

      if (!data) {
        throw new NotFoundError(`No staff record found for "${normalizedEmail}"`);
      }

      return { email: normalizedEmail, is_active: false, revoked: true };
    }

    const mock = mockAdmins.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (!mock) throw new NotFoundError(`No staff record found for "${normalizedEmail}"`);
    mock.is_active = false;
    return { email: normalizedEmail, is_active: false, revoked: true };
  }
}
