/**
 * @fileoverview Events service for the MSAP Alumni backend.
 *
 * Manages community events (listing and creation). Falls back to an in-memory
 * seed dataset when Supabase is not configured for local development.
 *
 * @module services/eventsService
 */

import crypto from 'crypto';
import { supabase, isConfigured } from '../config/supabase.js';
import { logger } from '../config/logger.js';

const initialEvents = [
  { id: '1', date_display: 'Aug 15, 2026', time_display: '10 AM – 6 PM', title: 'Annual Alumni Meet 2026', location: 'Pune, Maharashtra', category: 'Community', description: 'The yearly gathering of all Pune Manipuri alumni. Reconnect, celebrate, and plan the year ahead.', is_featured: true },
  { id: '2', date_display: 'Sep 10, 2026', time_display: '7 PM – 9 PM', title: 'Career Networking Night', location: 'Virtual (Zoom)', category: 'Career', description: 'Connect with alumni across industries for mentorship, referrals, and career guidance.', is_featured: true },
  { id: '3', date_display: 'Mar 3, 2026', time_display: '5 PM – 10 PM', title: 'Yaoshang Cultural Evening', location: 'Imphal, Manipur', category: 'Cultural', description: 'Celebrate the festival of colors with the community through music, dance, and tradition. Families welcome.', is_featured: false },
  { id: '4', date_display: 'Jul 20, 2026', time_display: '6 PM – 7:30 PM', title: 'New Alumni Orientation', location: 'Online', category: 'Onboarding', description: 'A welcome session for recently registered alumni to learn about the association and how to get involved.', is_featured: false },
  { id: '5', date_display: 'Mar 14, 2026', time_display: '11 AM – 3 PM', title: 'Holi Celebration', location: 'Pune, Maharashtra', category: 'Cultural', description: 'Join fellow Manipuris in Pune for traditional music, food, and colors.', is_featured: false },
  { id: '6', date_display: 'Oct 5, 2026', time: '6 PM – 8 PM', title: 'Mentorship Program Kickoff', location: 'Hybrid', category: 'Career', description: 'Launch of the annual mentorship program pairing experienced alumni with recent graduates.', is_featured: false },
];

/** @type {Array<object>} Mutable in-memory event list for local development. */
let mockEvents = [...initialEvents];


/**
 * Static service class for events CRUD operations.
 */
export class EventsService {
  /**
   * Lists all events, optionally filtered by category and/or featured status.
   *
   * @param {object}          options               - Query filters.
   * @param {string}         [options.category]      - Filter by event category (case-insensitive).
   * @param {boolean}        [options.isFeatured]    - Filter by featured flag.
   * @returns {Promise<object[]>} Array of event records.
   */
  static async list({ category, isFeatured }) {
    if (isConfigured && supabase) {
      let query = supabase.from('events').select('*');
      if (category) {
        query = query.eq('category', category);
      }
      if (typeof isFeatured === 'boolean') {
        query = query.eq('is_featured', isFeatured);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) {
        logger.warn('Supabase events query failed (table may not exist), falling back to mock events', { error: error.message });
        let res = [...mockEvents];
        if (category) {
          res = res.filter((e) => e.category.toLowerCase() === category.toLowerCase());
        }
        if (typeof isFeatured === 'boolean') {
          res = res.filter((e) => e.is_featured === isFeatured);
        }
        return res;
      }
      return data;
    }

    // In-memory fallback
    let res = [...mockEvents];
    if (category) {
      res = res.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
    if (typeof isFeatured === 'boolean') {
      res = res.filter((e) => e.is_featured === isFeatured);
    }
    return res;
  }

  /**
   * Creates a new event record.
   *
   * @param {object}  eventData                      - Event payload from the request body.
   * @param {string}  eventData.title                - Event title.
   * @param {string}  eventData.category             - Event category.
   * @param {string}  eventData.dateDisplay          - Human-readable date string.
   * @param {string}  eventData.timeDisplay          - Human-readable time range string.
   * @param {string}  eventData.location             - Venue or 'Virtual'.
   * @param {string}  eventData.description          - Event description.
   * @param {boolean} [eventData.isFeatured]         - Whether to feature this event.
   * @param {string}  [eventData.registrationLink]   - External registration URL.
   * @param {string}  [adminId]                      - UUID of the creating admin.
   * @returns {Promise<object>} The created event record.
   */
  static async create(eventData, adminId) {
    const payload = {
      title: eventData.title,
      category: eventData.category,
      date_display: eventData.dateDisplay,
      time_display: eventData.timeDisplay,
      location: eventData.location,
      description: eventData.description,
      is_featured: Boolean(eventData.isFeatured),
      registration_link: eventData.registrationLink || null,
      created_by: adminId || null,
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('events').insert([payload]).select().single();
      if (error) {
        logger.error('Supabase create event error:', error);
        throw new Error('Failed to create event');
      }
      return data;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    mockEvents.unshift(newEvent);
    return newEvent;
  }
}
