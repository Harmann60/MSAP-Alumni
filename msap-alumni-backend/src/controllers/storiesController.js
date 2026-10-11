/**
 * @fileoverview Stories controller for the MSAP Alumni API.
 *
 * Handles listing, creation, updating, and deletion of community stories/articles.
 * Admin-only operations are enforced at the route level via RBAC middleware.
 *
 * @module controllers/storiesController
 */

import { StoriesService } from '../services/storiesService.js';
import { AuditService, AUDIT_ACTIONS } from '../services/auditService.js';
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

  static async getById(req, res, next) {
    try {
      const story = await StoriesService.getById(req.params.id);
      return ApiResponse.success(res, story, 'Story retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const adminId = req.user?.id;
      const story = await StoriesService.create(req.body, adminId);

      await AuditService.log({
        action:     AUDIT_ACTIONS.STORY_CREATED,
        entityName: 'stories',
        entityId:   story.id,
        adminId,
        ip:         req.ip,
        details:    { title: story.title },
      });

      return ApiResponse.created(res, story, 'Story published successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const story = await StoriesService.update(req.params.id, req.body);

      await AuditService.log({
        action:     AUDIT_ACTIONS.STORY_UPDATED,
        entityName: 'stories',
        entityId:   req.params.id,
        adminId:    req.user?.id,
        ip:         req.ip,
        details:    { fields: Object.keys(req.body) },
      });

      return ApiResponse.success(res, story, 'Story updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await StoriesService.delete(req.params.id);

      await AuditService.log({
        action:     AUDIT_ACTIONS.STORY_DELETED,
        entityName: 'stories',
        entityId:   req.params.id,
        adminId:    req.user?.id,
        ip:         req.ip,
      });

      return ApiResponse.success(res, null, 'Story deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
