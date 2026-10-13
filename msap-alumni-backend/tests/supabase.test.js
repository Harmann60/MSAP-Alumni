import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { supabase, isConfigured } from '../src/config/supabase.js';
import { StoriesService } from '../src/services/storiesService.js';
import { EventsService } from '../src/services/eventsService.js';

describe('Supabase Integration & Fallback Handling', () => {
  test('supabase client configuration state should be correctly evaluated', () => {
    assert.strictEqual(typeof isConfigured, 'boolean', 'isConfigured must be a boolean');
    if (isConfigured) {
      assert.ok(supabase, 'When isConfigured is true, supabase client must be initialized');
      assert.strictEqual(typeof supabase.from, 'function', 'Supabase client must expose .from() method');
    }
  });

  test('storiesService.list() should retrieve stories cleanly without unhandled rejection', async () => {
    const stories = await StoriesService.list();
    assert.ok(Array.isArray(stories), 'Stories result must be an array');
    if (stories.length > 0) {
      const first = stories[0];
      assert.ok(first.title, 'Story item must have a title');
      assert.ok(first.id, 'Story item must have an id');
    }
  });

  test('eventsService.list() should retrieve events cleanly without unhandled rejection', async () => {
    const events = await EventsService.list();
    assert.ok(Array.isArray(events), 'Events result must be an array');
    if (events.length > 0) {
      const first = events[0];
      assert.ok(first.title, 'Event item must have a title');
      assert.ok(first.id, 'Event item must have an id');
    }
  });
});
