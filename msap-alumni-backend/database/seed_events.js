/**
 * @fileoverview Seeds the Supabase `events` table with core MSAP Alumni events.
 */

import { supabase, isConfigured } from '../src/config/supabase.js';

const seedEvents = [
  {
    title: '51st Annual MSAP Alumni Meet & Cultural Reunion 2026',
    category: 'Flagship',
    date_display: 'Aug 15, 2026',
    time_display: '10:00 AM – 6:00 PM IST',
    location: 'Symbiosis Vishwabhavan Auditorium, SB Road, Pune',
    description: 'The premier annual gathering of all Manipur students and alumni across Pune universities and colleges. Featuring keynote addresses by distinguished alumni, traditional cultural performances, felicitation of achievers, interactive batch reunions, and community lunch.',
    is_featured: true,
    registration_link: 'https://msap.org/events/annual-meet-2026',
  },
  {
    title: 'Global Career Networking & Tech Mentorship Night',
    category: 'Career',
    date_display: 'Sep 10, 2026',
    time_display: '7:00 PM – 9:00 PM IST',
    location: 'Virtual (Zoom / Google Meet)',
    description: 'Connect with seasoned MSAP alumni leaders across tech, finance, civil services, design, and academia. Tailored breakout rooms for resume reviews, referral discussions, and career transitions.',
    is_featured: true,
    registration_link: 'https://msap.org/events/career-night',
  },
  {
    title: 'Yaoshang Cultural Festival & Alumni Thabal Chongba',
    category: 'Cultural',
    date_display: 'Mar 03, 2026',
    time_display: '4:00 PM – 10:00 PM IST',
    location: 'Classic Grande Lawn, Imphal & Pune Chapter Venue',
    description: "Celebrate Manipur's vibrant spring festival of colors, music, and dance. Featuring traditional Thabal Chongba, indigenous delicacies, folk music performances, and inter-batch social mixer. Families and friends warmly welcome.",
    is_featured: true,
    registration_link: 'https://msap.org/events/yaoshang-2026',
  },
  {
    title: 'New Alumni & Fresh Graduates Pune Welcome 2026',
    category: 'Onboarding',
    date_display: 'Jul 20, 2026',
    time_display: '6:00 PM – 8:00 PM IST',
    location: 'FC Road Cultural Hub, Pune & Hybrid Online',
    description: 'An orientation and warm reception for newly graduated students arriving in or transitioning from Pune. Meet senior alumni, learn about city housing, job networks, and getting involved in MSAP initiatives.',
    is_featured: false,
    registration_link: 'https://msap.org/events/new-graduates',
  },
  {
    title: 'Pune Manipuri Spring Meet & Sports Gala',
    category: 'Community',
    date_display: 'Mar 14, 2026',
    time_display: '11:00 AM – 4:00 PM IST',
    location: 'SP College Ground, Pune',
    description: 'A fun-filled outdoor day of community football, badminton tournament, indigenous games, and potluck picnic celebrating brotherhood and wellness.',
    is_featured: false,
    registration_link: 'https://msap.org/events/spring-meet',
  },
  {
    title: 'MSAP Alumni Mentorship & Placement Drive 2026',
    category: 'Career',
    date_display: 'Oct 05, 2026',
    time_display: '6:00 PM – 8:30 PM IST',
    location: 'Hybrid (Pune University Hall & Virtual)',
    description: 'Connecting graduating college students with senior alumni for mock technical interviews, HR guidance, and direct corporate recruitment pipelines.',
    is_featured: false,
    registration_link: 'https://msap.org/events/mentorship-drive',
  },
];

async function seed() {
  if (!isConfigured || !supabase) {
    console.error('Supabase client is not configured.');
    process.exit(1);
  }

  // Check if events already exist
  const { data: existing, error: checkError } = await supabase.from('events').select('id, title');
  if (checkError) {
    console.error('Failed to query events table:', checkError.message);
    process.exit(1);
  }

  console.log(`Current rows in events table: ${existing ? existing.length : 0}`);

  if (existing && existing.length > 0) {
    console.log('Events table already contains data. Skipping re-seed or adding missing.');
  }

  const { data, error } = await supabase.from('events').insert(seedEvents).select();
  if (error) {
    console.error('Failed to insert events:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data ? data.length : 0} events into Supabase.`);
  process.exit(0);
}

seed();
