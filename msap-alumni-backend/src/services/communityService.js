/**
 * @fileoverview Community groups service for the MSAP Alumni backend.
 *
 * Retrieves community/chapter group listings. Falls back to in-memory seed
 * data when Supabase is not configured for local development.
 *
 * @module services/communityService
 */

import { supabase, isConfigured } from '../config/supabase.js';

import { logger } from '../config/logger.js';

const initialGroups = [
  { id: '1', title: 'Pune Chapter', group_type: 'Regional', members_count: '120+', description: 'The original home chapter. Meetups, events, and networking in Pune.' },
  { id: '2', title: 'Imphal Chapter', group_type: 'Regional', members_count: '80+', description: 'Alumni based in Manipur, connected through regular gatherings.' },
  { id: '3', title: 'Tech Professionals', group_type: 'Professional', members_count: '45+', description: 'Software engineers, startup founders, and tech leads.' },
  { id: '4', title: 'Healthcare Network', group_type: 'Professional', members_count: '30+', description: 'Alumni in medicine and healthcare fields.' },
  { id: '5', title: 'Young Alumni', group_type: 'Interest', members_count: '60+', description: 'Recent graduates building careers and networks.' },
  { id: '6', title: 'Women in Leadership', group_type: 'Affinity', members_count: '35+', description: 'Mentorship and leadership development for women alumni.' },
];

export class CommunityService {
  static async list() {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        logger.warn('Supabase community groups query failed (table may not exist), falling back to mock groups', { error: error.message });
        return initialGroups;
      }
      return data;
    }

    return initialGroups;
  }
}
