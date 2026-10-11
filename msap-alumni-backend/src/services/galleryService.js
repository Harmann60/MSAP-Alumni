/**
 * @fileoverview Gallery service for the MSAP Alumni backend.
 *
 * Manages photo gallery items (listing, creation, deletion).
 * Supports both static Vercel URLs (e.g., hosted on frontend) and dynamic
 * uploads stored in Supabase Storage.
 *
 * @module services/galleryService
 */

import crypto from 'crypto';
import { supabase, isConfigured } from '../config/supabase.js';
import { logger } from '../config/logger.js';
import { StorageService } from './storageService.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

const initialGallery = [];

let mockGallery = [];

export class GalleryService {
  /**
   * List gallery items with optional category filtering.
   */
  static async list({ category } = {}) {
    if (isConfigured && supabase) {
      let query = supabase.from('gallery').select('*');
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      const { data, error } = await query
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        logger.warn('Supabase gallery query failed (table may not exist yet), returning mock gallery', {
          error: error.message,
        });
        let res = [...mockGallery];
        if (category && category !== 'All') {
          res = res.filter((item) => item.category.toLowerCase() === category.toLowerCase());
        }
        return res;
      }
      // Merge Supabase data with mock seed gallery to retain legacy items
      let merged = Array.isArray(data) ? [...data] : [];
      const existingIds = new Set(merged.map((g) => g.id));
      mockGallery.forEach((g) => {
        if (!existingIds.has(g.id)) merged.push(g);
      });
      if (category && category !== 'All') {
        merged = merged.filter((g) => g.category.toLowerCase() === category.toLowerCase());
      }
      // Sort by display_order then newest first
      merged.sort((a, b) => {
        if (a.display_order !== b.display_order) return a.display_order - b.display_order;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      return merged;
    }

    if (!isConfigured || !supabase) {
    return [];
  }
  return [];
  }

  /**
   * Create a new gallery entry.
   */
  static async create(itemData, adminId) {
    const payload = {
      title: itemData.title || 'Untitled',
      caption: itemData.caption || '',
      image_url: itemData.imageUrl,
      source_type: itemData.sourceType || 'SUPABASE', // 'VERCEL', 'SUPABASE', 'EXTERNAL'
      category: itemData.category || 'General',
      display_order: Number(itemData.displayOrder) || 0,
      created_by: adminId || null,
    };

    if (!payload.image_url) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'image_url is required');
    }

    if (isConfigured && supabase) {
      let { data, error } = await supabase.from('gallery').insert([payload]).select().single();
      if (error && error.code === '23503' && payload.created_by) {
        payload.created_by = null;
        const retry = await supabase.from('gallery').insert([payload]).select().single();
        data = retry.data;
        error = retry.error;
      }
      if (error) {
        logger.error('Supabase create gallery error:', error);
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          `Database error: ${error.message || 'Failed to save gallery item'}`
        );
      }
      return data;
    }

    const newItem = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockGallery.unshift(newItem);
    return newItem;
  }

  /**
   * Update an existing gallery entry.
   */
  static async update(id, itemData) {
    const payload = {};
    if (itemData.title !== undefined) payload.title = itemData.title;
    if (itemData.caption !== undefined) payload.caption = itemData.caption;
    if (itemData.imageUrl !== undefined) payload.image_url = itemData.imageUrl;
    if (itemData.sourceType !== undefined) payload.source_type = itemData.sourceType;
    if (itemData.category !== undefined) payload.category = itemData.category;
    if (itemData.displayOrder !== undefined) payload.display_order = Number(itemData.displayOrder) || 0;
    payload.updated_at = new Date().toISOString();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('gallery')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        logger.error('Supabase update gallery error:', error);
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update gallery item');
      }
      return data;
    }

    const idx = mockGallery.findIndex((g) => g.id === id);
    if (idx === -1) throw new ApiError(HttpStatus.NOT_FOUND, 'Gallery item not found');
    mockGallery[idx] = { ...mockGallery[idx], ...payload };
    return mockGallery[idx];
  }

  /**
   * Delete a gallery entry.
   */
  static async delete(id) {
    if (isConfigured && supabase) {
      // First get the item to check if it's on Supabase Storage so we can delete the image file
      const { data: item } = await supabase.from('gallery').select('*').eq('id', id).single();
      if (item && item.source_type === 'SUPABASE' && item.image_url) {
        await StorageService.deleteImageByUrl(item.image_url);
      }

      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) {
        logger.error('Supabase delete gallery error:', error);
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete gallery item');
      }
      return true;
    }

    const idx = mockGallery.findIndex((g) => g.id === id);
    if (idx === -1) throw new ApiError(HttpStatus.NOT_FOUND, 'Gallery item not found');
    mockGallery.splice(idx, 1);
    return true;
  }
}
