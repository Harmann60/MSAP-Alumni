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
  {
    id: '1',
    date_display: 'Aug 15, 2026',
    time_display: '10:00 AM – 6:00 PM IST',
    title: '51st Annual MSAP Alumni Meet & Cultural Reunion 2026',
    location: 'Symbiosis Vishwabhavan Auditorium, SB Road, Pune',
    category: 'Flagship',
    description: 'The premier annual gathering of all Manipur students and alumni across Pune universities and colleges. Featuring keynote addresses by distinguished alumni, traditional cultural performances, felicitation of achievers, interactive batch reunions, and community lunch.',
    is_featured: true,
    registration_link: 'https://msap.org/events/annual-meet-2026',
  },
  {
    id: '2',
    date_display: 'Sep 10, 2026',
    time_display: '7:00 PM – 9:00 PM IST',
    title: 'Global Career Networking & Tech Mentorship Night',
    location: 'Virtual (Zoom / Google Meet)',
    category: 'Career',
    description: 'Connect with seasoned MSAP alumni leaders across tech, finance, civil services, design, and academia. Tailored breakout rooms for resume reviews, referral discussions, and career transitions.',
    is_featured: true,
    registration_link: 'https://msap.org/events/career-night',
  },
  {
    id: '3',
    date_display: 'Mar 03, 2026',
    time_display: '4:00 PM – 10:00 PM IST',
    title: 'Yaoshang Cultural Festival & Alumni Thabal Chongba',
    location: 'Classic Grande Lawn, Imphal & Pune Chapter Venue',
    category: 'Cultural',
    description: "Celebrate Manipur's vibrant spring festival of colors, music, and dance. Featuring traditional Thabal Chongba, indigenous delicacies, folk music performances, and inter-batch social mixer. Families and friends warmly welcome.",
    is_featured: true,
    registration_link: 'https://msap.org/events/yaoshang-2026',
  },
  {
    id: '4',
    date_display: 'Jul 20, 2026',
    time_display: '6:00 PM – 8:00 PM IST',
    title: 'New Alumni & Fresh Graduates Pune Welcome 2026',
    location: 'FC Road Cultural Hub, Pune & Hybrid Online',
    category: 'Onboarding',
    description: 'An orientation and warm reception for newly graduated students arriving in or transitioning from Pune. Meet senior alumni, learn about city housing, job networks, and getting involved in MSAP initiatives.',
    is_featured: false,
    registration_link: 'https://msap.org/events/new-graduates',
  },
  {
    id: '5',
    date_display: 'Mar 14, 2026',
    time_display: '11:00 AM – 4:00 PM IST',
    title: 'Pune Manipuri Spring Meet & Sports Gala',
    location: 'SP College Ground, Pune',
    category: 'Community',
    description: 'A fun-filled outdoor day of community football, badminton tournament, indigenous games, and potluck picnic celebrating brotherhood and wellness.',
    is_featured: false,
    registration_link: 'https://msap.org/events/spring-meet',
  },
  {
    id: '6',
    date_display: 'Oct 05, 2026',
    time_display: '6:00 PM – 8:30 PM IST',
    title: 'MSAP Alumni Mentorship & Placement Drive 2026',
    location: 'Hybrid (Pune University Hall & Virtual)',
    category: 'Career',
    description: 'Connecting graduating college students with senior alumni for mock technical interviews, HR guidance, and direct corporate recruitment pipelines.',
    is_featured: false,
    registration_link: 'https://msap.org/events/mentorship-drive',
  },
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

      // If the events table in Supabase was created but has 0 rows, auto-seed it once
      if (Array.isArray(data) && data.length === 0 && !category && typeof isFeatured !== 'boolean') {
        try {
          const toInsert = initialEvents.map(({ id: _id, ...rest }) => rest);
          const { data: seeded, error: seedErr } = await supabase.from('events').insert(toInsert).select();
          if (!seedErr && seeded && seeded.length > 0) {
            logger.info(`Auto-seeded ${seeded.length} initial events into Supabase`);
            return seeded;
          }
        } catch (seedErr) {
          logger.warn('Auto-seed events failed, using mock data:', { error: seedErr.message });
          return [...mockEvents];
        }
      }

      return data;
    }

    // In-memory fallback
    let res = [...mockEvents];
    if (category && category !== 'All') {
      res = res.filter((e) => (e.category || '').toLowerCase() === category.toLowerCase());
    }
    if (typeof isFeatured === 'boolean') {
      res = res.filter((e) => Boolean(e.is_featured ?? e.isFeatured) === isFeatured);
    }
    return res;
  }

  /**
   * Creates a new event record.
   *
   * @param {object}  eventData                      - Event payload from the request body.
   * @param {string}  [adminId]                      - UUID of the creating admin.
   * @returns {Promise<object>} The created event record.
   */
  static async create(eventData, adminId) {
    const payload = {
      title: (eventData.title || '').trim(),
      category: eventData.category || 'General',
      date_display: (eventData.dateDisplay || eventData.date_display || 'TBD').trim(),
      time_display: (eventData.timeDisplay || eventData.time_display || 'TBD').trim(),
      location: (eventData.location || '').trim(),
      description: (eventData.description || '').trim(),
      is_featured: Boolean(eventData.isFeatured ?? eventData.is_featured ?? false),
      registration_link: (eventData.registrationLink || eventData.registration_link || '').trim() || null,
      created_by: adminId || null,
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('events').insert([payload]).select().single();
      if (!error && data) {
        return data;
      }
      logger.warn('Supabase create event failed (table may be missing from schema), using in-memory store', {
        error: error?.message,
        code: error?.code,
      });
    }

    const newEvent = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockEvents.unshift(newEvent);
    return newEvent;
  }

  /**
   * Updates an existing event by its ID.
   *
   * @param {string} id - Event UUID.
   * @param {object} eventData - Fields to update.
   * @returns {Promise<object>} The updated event record.
   */
  static async update(id, eventData) {
    const payload = {};
    if (eventData.title !== undefined) payload.title = eventData.title.trim();
    if (eventData.category !== undefined) payload.category = eventData.category;
    if (eventData.dateDisplay !== undefined) payload.date_display = eventData.dateDisplay;
    if (eventData.date_display !== undefined) payload.date_display = eventData.date_display;
    if (eventData.timeDisplay !== undefined) payload.time_display = eventData.timeDisplay;
    if (eventData.time_display !== undefined) payload.time_display = eventData.time_display;
    if (eventData.location !== undefined) payload.location = eventData.location.trim();
    if (eventData.description !== undefined) payload.description = eventData.description.trim();
    if (eventData.isFeatured !== undefined) payload.is_featured = Boolean(eventData.isFeatured);
    if (eventData.is_featured !== undefined) payload.is_featured = Boolean(eventData.is_featured);
    if (eventData.registrationLink !== undefined) payload.registration_link = eventData.registrationLink || null;
    if (eventData.registration_link !== undefined) payload.registration_link = eventData.registration_link || null;
    payload.updated_at = new Date().toISOString();

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().maybeSingle();
      if (!error && data) {
        return data;
      }
      logger.warn('Supabase update event failed, updating in-memory store', { error: error?.message });
    }

    const idx = mockEvents.findIndex((e) => String(e.id) === String(id));
    if (idx !== -1) {
      mockEvents[idx] = { ...mockEvents[idx], ...payload };
      return mockEvents[idx];
    }
    return { id, ...payload };
  }

  /**
   * Deletes an event by its ID.
   *
   * @param {string} id - Event UUID.
   * @returns {Promise<boolean>} True if deleted.
   */
  static async delete(id) {
    if (isConfigured && supabase) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) {
        const idx = mockEvents.findIndex((e) => String(e.id) === String(id));
        if (idx !== -1) mockEvents.splice(idx, 1);
        return true;
      }
      logger.warn('Supabase delete event failed, removing from in-memory store', { error: error?.message });
    }

    const idx = mockEvents.findIndex((e) => String(e.id) === String(id));
    if (idx !== -1) mockEvents.splice(idx, 1);
    return true;
  }
}
