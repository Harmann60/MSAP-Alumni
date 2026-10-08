/**
 * @fileoverview Audit logging service for the MSAP Alumni backend.
 *
 * Writes a tamper-evident event record to the `audit_logs` table for every
 * significant admin action (status changes, deletions, content mutations).
 *
 * Falls back gracefully when Supabase is not configured (local dev):
 * events are logged to the Winston logger at INFO level instead.
 *
 * @module services/auditService
 */

import crypto from 'crypto';
import { supabase, isConfigured } from '../config/supabase.js';
import { logger } from '../config/logger.js';

// ─── Audit event name constants ────────────────────────────────────────────────

export const AUDIT_ACTIONS = {
  // Alumni
  ALUMNI_REGISTERED:      'ALUMNI_REGISTERED',
  ALUMNI_STATUS_UPDATED:  'ALUMNI_STATUS_UPDATED',
  ALUMNI_DELETED:         'ALUMNI_DELETED',
  ALUMNI_PROFILE_UPDATED: 'ALUMNI_PROFILE_UPDATED',
  // Auth
  ADMIN_LOGIN:            'ADMIN_LOGIN',
  ADMIN_LOGIN_FAILED:     'ADMIN_LOGIN_FAILED',
  ALUMNI_LOGIN:           'ALUMNI_LOGIN',
  PASSWORD_SET:           'PASSWORD_SET',
  LOGOUT:                 'LOGOUT',
  // Content
  EVENT_CREATED:          'EVENT_CREATED',
  EVENT_UPDATED:          'EVENT_UPDATED',
  EVENT_DELETED:          'EVENT_DELETED',
  STORY_CREATED:          'STORY_CREATED',
  STORY_UPDATED:          'STORY_UPDATED',
  STORY_DELETED:          'STORY_DELETED',
  GALLERY_ITEM_CREATED:   'GALLERY_ITEM_CREATED',
  GALLERY_ITEM_UPDATED:   'GALLERY_ITEM_UPDATED',
  GALLERY_ITEM_DELETED:   'GALLERY_ITEM_DELETED',
  IMAGE_UPLOADED:         'IMAGE_UPLOADED',
};

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Static audit log service.
 *
 * Usage:
 * ```js
 * import { AuditService, AUDIT_ACTIONS } from './auditService.js';
 *
 * await AuditService.log({
 *   action:     AUDIT_ACTIONS.ALUMNI_STATUS_UPDATED,
 *   entityName: 'alumni_registrations',
 *   entityId:   alumniId,
 *   adminId:    req.user?.id,
 *   ip:         req.ip,
 *   details:    { oldStatus, newStatus, adminNotes },
 * });
 * ```
 */
export class AuditService {
  /**
   * Hash an IP address (SHA-256) before storing — keeps raw IPs off disk.
   *
   * @param {string | undefined | null} ip
   * @returns {string | null}
   */
  static hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash('sha256').update(String(ip)).digest('hex');
  }

  /**
   * Write a single audit event.
   *
   * This method is intentionally fire-and-forget safe: audit failures
   * are logged as warnings but never propagate to crash the primary operation.
   *
   * @param {object}      params
   * @param {string}      params.action     - One of AUDIT_ACTIONS constants.
   * @param {string}      params.entityName - DB table name, e.g. 'alumni_registrations'.
   * @param {string}      [params.entityId] - UUID of the affected record.
   * @param {string}      [params.adminId]  - UUID of the acting admin/user.
   * @param {string}      [params.ip]       - Raw IP (will be hashed before storage).
   * @param {object}      [params.details]  - Freeform JSONB — sanitize before passing.
   * @returns {Promise<void>}
   */
  static async log({ action, entityName, entityId = null, adminId = null, ip = null, details = null }) {
    const record = {
      action,
      entity_name:  entityName,
      entity_id:    entityId  || null,
      admin_id:     adminId   || null,
      ip_hash:      this.hashIp(ip),
      details:      details   || null,
    };

    if (isConfigured && supabase) {
      try {
        const { error } = await supabase.from('audit_logs').insert([record]);
        if (error) {
          // Audit failure must NOT break the primary operation — only warn.
          logger.warn('Failed to write audit log to Supabase', {
            error: error.message,
            record,
          });
        }
      } catch (err) {
        logger.warn('Unexpected error writing audit log', { error: err.message, record });
      }
    } else {
      // Local dev fallback: emit to Winston at INFO level
      logger.info('[AUDIT]', record);
    }
  }
}
