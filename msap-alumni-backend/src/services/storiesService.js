/**
 * @fileoverview Stories service for the MSAP Alumni backend.
 *
 * Manages alumni community stories/articles (listing and creation).
 * Falls back to an in-memory seed dataset when Supabase is not configured.
 *
 * @module services/storiesService
 */

import crypto from 'crypto';

import { supabase, isConfigured } from '../config/supabase.js';
import { logger } from '../config/logger.js';

const initialStories = [
  {
    id: '1',
    title: '93.17%: A Graduation Achievement Remembered',
    category: 'Academic',
    source: 'AMAND Annual Cultural Programme',
    published_date: '2022',
    image_url: null,
    excerpt: 'Yuireising Ngalung received the Late Albert Memorial Award for Academic Excellence in 2022 after recording 93.17% in graduation — the highest mark among Manipuri students in Pune that year.',
    is_featured: true,
  },
  {
    id: '2',
    title: 'Academic Excellence, Recognised in 2019',
    category: 'Academic',
    source: 'Late N. Albert Memorial Award Record',
    published_date: '2019',
    image_url: null,
    excerpt: 'Tayenjam Sanathoi Singh received the second Late N. Albert Memorial Award for Academic Excellence in 2019 after achieving the highest graduation marks across streams among the Manipuri community in Pune.',
    is_featured: false,
  },
  {
    id: '3',
    title: 'From Alumni Network to Community Action',
    category: 'Community',
    source: 'MSAP Alumni Association Report',
    published_date: '2026',
    image_url: null,
    excerpt: 'In 2026, the Association of MSAP Alumni, Manipur completed seven plantation programmes across the state and planted 2,550 saplings under the theme "Now for Climate".',
    is_featured: false,
  },
  {
    id: '4',
    title: '1973 → Today: A Student Network That Became a Community',
    category: 'Legacy',
    source: 'MSAP Founding Record',
    published_date: 'Since 1973',
    image_url: null,
    excerpt: 'Founded in 1973, MSAP began as a platform for Manipuri students in Pune. Over the decades, its activities have grown across academics, sports, culture and community life.',
    is_featured: false,
  },
  {
    id: '5',
    title: 'Where Sport Became a Way to Stay Connected',
    category: 'Culture',
    source: 'Annual Sports Records',
    published_date: 'Documented history',
    image_url: null,
    excerpt: 'MSAP has organised annual sports and cultural programmes for decades, including a documented 2014 sports meet with 22 individual and team events.',
    is_featured: false,
  },
];

let mockStories = [...initialStories];

export class StoriesService {
  static async list({ isFeatured }) {
    if (isConfigured && supabase) {
      let query = supabase.from('stories').select('*');
      if (typeof isFeatured === 'boolean') {
        query = query.eq('is_featured', isFeatured);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) {
        logger.warn('Supabase stories query failed (table may not exist), falling back to mock stories', { error: error.message });
        let res = [...mockStories];
        if (typeof isFeatured === 'boolean') {
          res = res.filter((s) => s.is_featured === isFeatured);
        }
        return res;
      }
      return data;
    }

    let res = [...mockStories];
    if (typeof isFeatured === 'boolean') {
      res = res.filter((s) => s.is_featured === isFeatured);
    }
    return res;
  }

  static async create(storyData, adminId) {
    const payload = {
      title: storyData.title,
      source: storyData.source,
      published_date: storyData.publishedDate,
      image_url: storyData.imageUrl,
      excerpt: storyData.excerpt,
      content: storyData.content || null,
      is_featured: Boolean(storyData.isFeatured),
      created_by: adminId || null,
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('stories').insert([payload]).select().single();
      if (error) {
        logger.error('Supabase create story error:', error);
        throw new Error('Failed to create story');
      }
      return data;
    }

    const newStory = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    mockStories.unshift(newStory);
    return newStory;
  }
}
