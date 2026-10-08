import { Router } from 'express';
import { uploadMiddleware } from '../middlewares/upload.js';
import { StorageService } from '../services/storageService.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { ROLES } from '../constants/roles.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { BadRequestError } from '../utils/apiError.js';
import { AuditService, AUDIT_ACTIONS } from '../services/auditService.js';
import { uploadLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

/**
 * Whitelisted upload folders — prevents path traversal attacks.
 * A client supplying any other folder value will receive 400.
 */
const ALLOWED_UPLOAD_FOLDERS = new Set(['stories', 'gallery', 'general']);

/**
 * POST /upload
 * Protected route: Uploads single image to Supabase Storage.
 * Query param or body: `folder` ('stories' | 'gallery' | 'general')
 */
router.post(
  '/',
  uploadLimiter,
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  uploadMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const rawFolder = req.query.folder || req.body?.folder || 'general';

      // Sanitize folder: lowercase, strip non-alphanumeric (except hyphens)
      const sanitizedFolder = String(rawFolder).toLowerCase().replace(/[^a-z0-9\-]/g, '');

      // Enforce whitelist
      if (!ALLOWED_UPLOAD_FOLDERS.has(sanitizedFolder)) {
        return next(new BadRequestError(
          `Invalid upload folder. Allowed values: ${[...ALLOWED_UPLOAD_FOLDERS].join(', ')}`
        ));
      }

      const publicUrl = await StorageService.uploadImage(req.file, sanitizedFolder);

      // Write audit log
      await AuditService.log({
        action:     AUDIT_ACTIONS.IMAGE_UPLOADED,
        entityName: 'storage',
        adminId:    req.user?.id,
        ip:         req.ip,
        details:    { folder: sanitizedFolder, mimeType: req.file?.mimetype },
      });

      return ApiResponse.created(res, { url: publicUrl }, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
);

export default router;
