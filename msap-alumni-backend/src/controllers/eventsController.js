import { EventsService } from '../services/eventsService.js';
import { AuditService, AUDIT_ACTIONS } from '../services/auditService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class EventsController {
  static async list(req, res, next) {
    try {
      const { category, featured } = req.query;
      const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
      const events = await EventsService.list({ category, isFeatured });
      return ApiResponse.success(res, events, 'Events retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const adminId = req.user?.id;
      const event = await EventsService.create(req.body, adminId);

      await AuditService.log({
        action:     AUDIT_ACTIONS.EVENT_CREATED,
        entityName: 'events',
        entityId:   event.id,
        adminId,
        ip:         req.ip,
        details:    { title: event.title },
      });

      return ApiResponse.created(res, event, 'Event created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const event = await EventsService.update(id, req.body);

      await AuditService.log({
        action:     AUDIT_ACTIONS.EVENT_UPDATED,
        entityName: 'events',
        entityId:   id,
        adminId:    req.user?.id,
        ip:         req.ip,
        details:    { fields: Object.keys(req.body) },
      });

      return ApiResponse.success(res, event, 'Event updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await EventsService.delete(id);

      await AuditService.log({
        action:     AUDIT_ACTIONS.EVENT_DELETED,
        entityName: 'events',
        entityId:   id,
        adminId:    req.user?.id,
        ip:         req.ip,
      });

      return ApiResponse.success(res, null, 'Event deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

