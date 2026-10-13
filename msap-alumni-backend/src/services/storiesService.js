/**
 * @fileoverview Stories service for the MSAP Alumni backend.
 *
 * Manages alumni community stories/articles (listing, creation, updating, deletion).
 * Falls back to an in-memory seed dataset when Supabase is not configured.
 *
 * @module services/storiesService
 */

import crypto from 'crypto';

import { supabase, isConfigured } from '../config/supabase.js';
import { logger } from '../config/logger.js';
import { ApiError, ConflictError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const initialStories = [];
let mockStories = [];

export class StoriesService {
  static async list({ isFeatured } = {}) {
    if (isConfigured && supabase) {
      let query = supabase.from('stories').select('*');
      if (typeof isFeatured === 'boolean') {
        query = query.eq('is_featured', isFeatured);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) {
        logger.warn('Supabase stories query failed, falling back to mock stories', { error: error.message });
        let res = [...mockStories];
        if (typeof isFeatured === 'boolean') {
          res = res.filter((s) => s.is_featured === isFeatured);
        }
        return res;
      }
      // Merge Supabase data with mock seed data to keep legacy items visible
      let merged = Array.isArray(data) ? [...data] : [];
      const existingIds = new Set(merged.map((s) => s.id));
      mockStories.forEach((s) => {
        if (!existingIds.has(s.id)) merged.push(s);
      });
      if (typeof isFeatured === 'boolean') {
        merged = merged.filter((s) => s.is_featured === isFeatured);
      }
      merged.sort((a, b) => {
        const aDate = new Date(a.updated_at || a.created_at || a.published_date || 0);
        const bDate = new Date(b.updated_at || b.created_at || b.published_date || 0);
        return bDate - aDate;
      });
      return merged;
    }

    if (!isConfigured || !supabase) {
        return [];
      }
      return [];
  }


  static async getById(id) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('stories').select('*').eq('id', id).single();
      if (error) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Story not found');
      }
      return data;
    }

    const story = mockStories.find((s) => s.id === id);
    if (!story) throw new ApiError(HttpStatus.NOT_FOUND, 'Story not found');
    return story;
  }

  static async create(storyData, adminId) {
    const payload = {
      title: storyData.title,
      source: storyData.source || 'MSAP News',
      category: storyData.category || 'Spotlight',
      published_date: storyData.publishedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      image_url: storyData.imageUrl || '',
      excerpt: storyData.excerpt || '',
      content: storyData.content || null,
      is_featured: Boolean(storyData.isFeatured),
      created_by: adminId || null,
    };

    if (isConfigured && supabase) {
      let { data, error } = await supabase.from('stories').insert([payload]).select().single();
      // If foreign key constraint on created_by fails (e.g. mock admin ID), retry with created_by: null
      if (error && error.code === '23503' && payload.created_by) {
        payload.created_by = null;
        const retry = await supabase.from('stories').insert([payload]).select().single();
        data = retry.data;
        error = retry.error;
      }
      if (error) {
        logger.error('Supabase create story error:', error);
        throw new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          `Database error: ${error.message || 'Failed to create story'}`
        );
      }
      return data;
    }

    const newStory = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockStories.unshift(newStory);
    return newStory;
  }

  static async update(id, storyData) {
    // Optimistic Concurrency Check: Prevent race conditions and silent overwrites
    if (storyData.lastKnownUpdatedAt) {
      try {
        const current = await this.getById(id);
        if (current) {
          const currentUpdatedTime = new Date(current.updated_at || current.created_at || 0).getTime();
          const clientKnownTime = new Date(storyData.lastKnownUpdatedAt).getTime();
          if (!isNaN(currentUpdatedTime) && !isNaN(clientKnownTime) && currentUpdatedTime > clientKnownTime + 1000) {
            throw new ConflictError(
              'Conflict detected: This article was modified by another editor while you were working on it. Please reload the latest version to prevent overwriting their changes.'
            );
          }
        }
      } catch (err) {
        if (err instanceof ConflictError) throw err;
        // If not found or transient error, proceed with standard handling
      }
    }

    const payload = {};
    if (storyData.title !== undefined) payload.title = storyData.title;
    if (storyData.source !== undefined) payload.source = storyData.source;
    if (storyData.category !== undefined) payload.category = storyData.category;
    if (storyData.publishedDate !== undefined) payload.published_date = storyData.publishedDate;
    if (storyData.imageUrl !== undefined) payload.image_url = storyData.imageUrl;
    if (storyData.excerpt !== undefined) payload.excerpt = storyData.excerpt;
    if (storyData.content !== undefined) payload.content = storyData.content;
    if (storyData.isFeatured !== undefined) payload.is_featured = Boolean(storyData.isFeatured);
    payload.updated_at = new Date().toISOString();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('stories')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        logger.error('Supabase update story error:', error);
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to update story');
      }
      return data;
    }

    const idx = mockStories.findIndex((s) => s.id === id);
    if (idx === -1) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Story not found');
    mockStories[idx] = { ...mockStories[idx], ...payload };
    return mockStories[idx];
  }

  static async delete(id) {
    if (isConfigured && supabase) {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) {
        logger.error('Supabase delete story error:', error);
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to delete story');
      }
      return true;
    }

    const idx = mockStories.findIndex((s) => s.id === id);
    if (idx === -1) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Story not found');
    mockStories.splice(idx, 1);
    return true;
  }
}
