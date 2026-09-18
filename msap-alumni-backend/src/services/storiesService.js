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
  { id: '1', title: 'From Pune to Silicon Valley: One Alumni\'s 30-Year Journey', source: 'MSAP Alumni Report', published_date: 'June 2026', image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop', excerpt: 'How a small group of Manipuri students in Pune went on to lead careers across the globe — and what brought them back.', is_featured: true },
  { id: '2', title: 'The Golden Jubilee: 200 Alumni, One Auditorium', source: 'Alumni Magazine', published_date: 'September 2025', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop', excerpt: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to mark half a century of community.', is_featured: false },
  { id: '3', title: 'Keeping Yaoshang Alive 1,200 km from Home', source: 'Community Spotlight', published_date: 'March 2026', image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop', excerpt: 'Every March, Manipuris in Pune gather to light the Yaoshang — and prove that culture travels with people.', is_featured: false },
  { id: '4', title: '50 New Members in One Month: The Registration Drive', source: 'MSAP Report', published_date: 'April 2026', image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop', excerpt: 'The registration drive for new alumni members exceeded expectations this spring.', is_featured: false },
  { id: '5', title: 'The Mentorship Program: Alumni Guiding Graduates', source: 'Community Spotlight', published_date: 'March 2026', image_url: 'https://images.unsplash.com/photo-1531538606174-e1ed98e5ef2e?w=800&h=500&fit=crop', excerpt: 'Experienced alumni are pairing with recent graduates for career guidance and professional development.', is_featured: false },
  { id: '6', title: 'From Yaoshang to Sangai: Cultural Identity in Pune', source: 'Alumni Magazine', published_date: 'February 2026', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop', excerpt: 'How Pune\'s Manipuri community preserves cultural identity across generations.', is_featured: false },
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
