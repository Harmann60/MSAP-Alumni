/**
 * @fileoverview Multer configuration for handling image uploads.
 *
 * Configures memory storage with image file filtering (JPEG, PNG, WebP, GIF)
 * and a 5 MB maximum file size limit.
 *
 * @module middlewares/upload
 */

import multer from 'multer';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HttpStatus.BAD_REQUEST,
        'Invalid file type. Only JPG, PNG, WEBP, and GIF images are allowed.'
      ),
      false
    );
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
