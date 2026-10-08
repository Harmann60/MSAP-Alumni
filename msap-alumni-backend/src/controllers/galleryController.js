/**
 * @fileoverview Gallery controller for the MSAP Alumni API.
 *
 * Handles fetching gallery photos and admin creation / deletion.
 *
 * @module controllers/galleryController
 */

import { GalleryService } from '../services/galleryService.js';
import { AuditService, AUDIT_ACTIONS } from '../services/auditService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class GalleryController {
  static async list(req, res, next) {
    try {
      const { category } = req.query;
      const items = await GalleryService.list({ category });
      return ApiResponse.success(res, items, 'Gallery items retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const adminId = req.user?.id;
      const item = await GalleryService.create(req.body, adminId);

      await AuditService.log({
        action:     AUDIT_ACTIONS.GALLERY_ITEM_CREATED,
        entityName: 'gallery',
        entityId:   item.id,
        adminId,
        ip:         req.ip,
        details:    { title: item.title, category: item.category },
      });

      return ApiResponse.created(res, item, 'Gallery item created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const item = await GalleryService.update(req.params.id, req.body);

      await AuditService.log({
        action:     AUDIT_ACTIONS.GALLERY_ITEM_UPDATED,
        entityName: 'gallery',
        entityId:   req.params.id,
        adminId:    req.user?.id,
        ip:         req.ip,
        details:    { fields: Object.keys(req.body) },
      });

      return ApiResponse.success(res, item, 'Gallery item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await GalleryService.delete(req.params.id);

      await AuditService.log({
        action:     AUDIT_ACTIONS.GALLERY_ITEM_DELETED,
        entityName: 'gallery',
        entityId:   req.params.id,
        adminId:    req.user?.id,
        ip:         req.ip,
      });

      return ApiResponse.success(res, null, 'Gallery item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
