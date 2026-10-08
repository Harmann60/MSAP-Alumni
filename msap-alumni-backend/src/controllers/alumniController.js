/**
 * @fileoverview Alumni registrations controller for the MSAP Alumni API.
 *
 * Exposes endpoints for public alumni self-registration and admin management
 * (listing, status updates). Includes honeypot bot-detection and delegates
 * all persistence to `AlumniService`.
 *
 * @module controllers/alumniController
 */

import { AlumniService } from '../services/alumniService.js';
import { AuditService, AUDIT_ACTIONS } from '../services/auditService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { BadRequestError } from '../utils/apiError.js';

export class AlumniController {
  static async register(req, res, next) {
    try {
      // Honeypot check: If the hidden honeypot field is filled, silently reject or fail safe
      if (req.body.hp_website && req.body.hp_website.length > 0) {
        // Drop spam silently
        return ApiResponse.success(
          res,
          null,
          'Registration received. Thank you for your submission.'
        );
      }

      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const result = await AlumniService.register(req.body, clientIp);

      // Audit the new registration
      await AuditService.log({
        action:     AUDIT_ACTIONS.ALUMNI_REGISTERED,
        entityName: 'alumni_registrations',
        entityId:   result.id,
        ip:         req.ip,
        details:    { email: result.email, fullName: result.full_name },
      });

      return ApiResponse.created(
        res,
        {
          id: result.id,
          fullName: result.full_name,
          email: result.email,
          status: result.status,
        },
        'Registration submitted successfully. Pending admin verification within 3–5 days.'
      );
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const result = await AlumniService.list({
        status,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      return ApiResponse.success(res, result, 'Alumni registrations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const adminId = req.user?.id;

      const updated = await AlumniService.updateStatus(id, {
        status,
        adminNotes,
        adminId,
      });

      // Audit the status change
      await AuditService.log({
        action:     AUDIT_ACTIONS.ALUMNI_STATUS_UPDATED,
        entityName: 'alumni_registrations',
        entityId:   id,
        adminId,
        ip:         req.ip,
        details:    { newStatus: status, adminNotes: adminNotes || null },
      });

      return ApiResponse.success(res, updated, `Alumni status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AlumniService.delete(id);

      // Audit the deletion
      await AuditService.log({
        action:     AUDIT_ACTIONS.ALUMNI_DELETED,
        entityName: 'alumni_registrations',
        entityId:   id,
        adminId:    req.user?.id,
        ip:         req.ip,
      });

      return ApiResponse.success(res, result, 'Alumni registration deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AlumniService.updateProfile(id, req.body);

      // Audit the profile update
      await AuditService.log({
        action:     AUDIT_ACTIONS.ALUMNI_PROFILE_UPDATED,
        entityName: 'alumni_registrations',
        entityId:   id,
        adminId:    req.user?.id,
        ip:         req.ip,
        details:    { fields: Object.keys(req.body) },
      });

      return ApiResponse.success(res, result, 'Alumni profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

