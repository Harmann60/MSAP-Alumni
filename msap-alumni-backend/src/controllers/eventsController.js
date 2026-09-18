import { EventsService } from '../services/eventsService.js';
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
      return ApiResponse.created(res, event, 'Event created successfully');
    } catch (error) {
      next(error);
    }
  }
}
