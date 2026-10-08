/**
 * @fileoverview Storage upload service for Supabase Storage.
 *
 * Handles uploading binary image buffers to Supabase Storage bucket ('msap-media')
 * and generating publicly accessible CDN URLs.
 *
 * @module services/storageService
 */

import crypto from 'crypto';
import path from 'path';
import { supabase, isConfigured } from '../config/supabase.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

const BUCKET_NAME = 'msap-media';

export class StorageService {
  /**
   * Upload an image buffer to Supabase Storage.
   *
   * @param {Object} file - Multer file object with buffer, mimetype, originalname.
   * @param {string} folder - Folder prefix (e.g. 'stories', 'gallery').
   * @returns {Promise<string>} Public URL of the uploaded image.
   */
  static async uploadImage(file, folder = 'general') {
    if (!file || !file.buffer) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'No image file provided');
    }

    if (!isConfigured || !supabase) {
      logger.warn('Supabase not configured for storage upload; returning base64 data URI');
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    }

    // Extract and sanitize the file extension — prevent path traversal via originalname.
    // Allow only alphanumeric characters in extensions (e.g. '.jpg', '.png', '.webp').
    const rawExt = path.extname(file.originalname).toLowerCase();
    const ext = /^\.[a-z0-9]{1,10}$/.test(rawExt) ? rawExt : '.jpg';
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const filePath = `${folder}/${uniqueSuffix}${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      logger.error('Supabase storage upload error:', { error: error.message, filePath });
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Failed to upload image to storage: ${error.message}`
      );
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  /**
   * Delete an image from Supabase Storage by its public URL.
   *
   * @param {string} publicUrl
   */
  static async deleteImageByUrl(publicUrl) {
    if (!publicUrl || !isConfigured || !supabase) return;

    try {
      // Extract the relative path within the bucket
      const bucketMarker = `/${BUCKET_NAME}/`;
      const idx = publicUrl.indexOf(bucketMarker);
      if (idx !== -1) {
        const filePath = publicUrl.substring(idx + bucketMarker.length);
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
        if (error) {
          logger.warn('Failed to delete image from Supabase storage:', { error: error.message, filePath });
        }
      }
    } catch (err) {
      logger.warn('Error during image deletion from storage:', { error: err.message });
    }
  }
}
