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
      const { status, search, puneCollege, batchDecade, batchYear, page, limit } = req.query;
      const result = await AlumniService.list({
        status,
        search,
        puneCollege,
        batchDecade,
        batchYear,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      return ApiResponse.success(res, result, 'Alumni registrations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async exportCSV(req, res, next) {
    try {
      const { status, search, puneCollege, batchDecade, batchYear } = req.query;
      const csvString = await AlumniService.exportCSV({
        status,
        search,
        puneCollege,
        batchDecade,
        batchYear,
      });
      const dateStr = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="msap_alumni_roster_${dateStr}.csv"`);
      return res.status(200).send(csvString);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, adminNotes, expectedStatus, lastKnownUpdatedAt } = req.body;
      const adminId = req.user?.id;

      const updated = await AlumniService.updateStatus(id, {
        status,
        adminNotes,
        adminId,
        expectedStatus,
        lastKnownUpdatedAt,
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

  static async listTeam(req, res, next) {
    try {
      const team = await AlumniService.listTeam();
      return ApiResponse.success(res, team, 'Editorial and staff team retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async assignRole(req, res, next) {
    try {
      const { email, role } = req.body;
      const adminId = req.user?.id;
      const result = await AlumniService.assignRole({ email, role, adminId });

      await AuditService.log({
        action:     AUDIT_ACTIONS.ROLE_ASSIGNED,
        entityName: 'admins',
        entityId:   result.id,
        adminId,
        ip:         req.ip,
        details:    { email: result.email, role: result.role },
      });

      return ApiResponse.success(
        res,
        result,
        `Assigned ${result.role === 'MODERATOR' ? 'Content Manager' : result.role} role to ${result.email}`
      );
    } catch (error) {
      next(error);
    }
  }

  static async revokeRole(req, res, next) {
    try {
      const { email } = req.body;
      const adminId = req.user?.id;
      const result = await AlumniService.revokeRole({ email, adminId });

      await AuditService.log({
        action:     AUDIT_ACTIONS.ROLE_REVOKED,
        entityName: 'admins',
        adminId,
        ip:         req.ip,
        details:    { email },
      });

      return ApiResponse.success(res, result, `Editorial role revoked for ${email}`);
    } catch (error) {
      next(error);
    }
  }
}

