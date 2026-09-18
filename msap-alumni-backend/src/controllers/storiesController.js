/**
 * @fileoverview Stories controller for the MSAP Alumni API.
 *
 * Handles listing and creation of community stories/articles.
 * Admin-only creation is enforced at the route level via RBAC middleware.
 *
 * @module controllers/storiesController
 */

import { StoriesService } from '../services/storiesService.js';

import { ApiResponse } from '../utils/apiResponse.js';

export class StoriesController {
  static async list(req, res, next) {
    try {
      const { featured } = req.query;
      const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
      const stories = await StoriesService.list({ isFeatured });
      return ApiResponse.success(res, stories, 'Stories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const adminId = req.user?.id;
      const story = await StoriesService.create(req.body, adminId);
      return ApiResponse.created(res, story, 'Story published successfully');
    } catch (error) {
      next(error);
    }
  }
}
