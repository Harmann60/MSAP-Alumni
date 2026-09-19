const STORIES_ARCHIVE_ROOT =
  'https://pqfsbbdexjshvqskmbfu.supabase.co/storage/v1/object/public/MSAP%20Photos/Stories';

const JUBILEE_ARCHIVE =
  'https://pqfsbbdexjshvqskmbfu.supabase.co/storage/v1/object/public/MSAP%20Photos/50th%20Golden%20Jubilee/SaveClip.App_655587142_18090688793142807_5674009504128084954_n.jpg';

const SPORTS_MEET_ARCHIVE =
  'https://pqfsbbdexjshvqskmbfu.supabase.co/storage/v1/object/public/MSAP%20Photos/seasonal%20sports%20meet%202024/SaveClip.App_624082157_18011345444668354_6669835014232952593_n.jpg';

export const ALUMNI_STORIES = [
  {
    id: 'yuireising-ngalung',
    category: 'Academic',
    kicker: 'Academic Achievement',
    year: '2022',
    title: '93.17%: A Graduation Achievement Remembered',
    excerpt:
      'In 2022, Yuireising Ngalung received the Late Albert Memorial Award for Academic Excellence after recording 93.17% in graduation — the highest mark among Manipuri students in Pune that year.',
    body: [
      'The Late Albert Memorial Award for Academic Excellence recognises outstanding results among Manipuri students studying in Pune. In 2022, Yuireising Ngalung received the award after recording 93.17% in graduation — the highest mark among Manipuri students in Pune that year.',
      'The achievement was documented in reporting on the AMAND annual cultural programme in 2022, which recorded both the result and the recognition.',
      'The award belongs to a longer tradition of academic recognition within this student community: in 2019, Tayenjam Sanathoi Singh received the second Late N. Albert Memorial Award for Academic Excellence for the highest graduation mark across streams.',
    ],
    person: 'Yuireising Ngalung',
    achievement:
      'Late Albert Memorial Award for Academic Excellence — 93.17% in graduation, the highest mark among Manipuri students in Pune in 2022',
    facts: [
      'Award: Late Albert Memorial Award for Academic Excellence',
      'Year: 2022',
      'Result: 93.17% in graduation — the highest mark among Manipuri students in Pune in 2022',
      'Documented in: reporting on the AMAND annual cultural programme, 2022',
    ],
    image: `${STORIES_ARCHIVE_ROOT}/Featured.jpg`,
    imageCaption: 'Photograph taken October 2022 · AMAND annual cultural programme',
    source: 'Documented in reporting on the AMAND annual cultural programme · 2022',
    sourceUrl: null,
    verified: true,
  },
  {
    id: 'tayenjam-sanathoi',
    category: 'Academic',
    kicker: 'Academic Achievement',
    year: '2019',
    title: 'Academic Excellence, Recognised in 2019',
    excerpt:
      'Tayenjam Sanathoi Singh received the second Late N. Albert Memorial Award for Academic Excellence in 2019 after achieving the highest graduation marks across streams among the Manipuri community in Pune.',
    body: [
      'In 2019, Tayenjam Sanathoi Singh received the second Late N. Albert Memorial Award for Academic Excellence, given for the highest graduation mark across all streams among the Manipuri student community in Pune.',
      'The recognition continues a documented tradition of academic awards within the community — a line seen again in 2022, when Yuireising Ngalung received the Late Albert Memorial Award for Academic Excellence after scoring 93.17%.',
    ],
    person: 'Tayenjam Sanathoi Singh',
    achievement:
      'Second Late N. Albert Memorial Award for Academic Excellence — highest graduation mark across streams',
    facts: [
      'Award: second Late N. Albert Memorial Award for Academic Excellence',
      'Year: 2019',
      'Result: highest graduation mark across all streams among the Manipuri community in Pune',
    ],
    image: `${STORIES_ARCHIVE_ROOT}/Academic.jpg`,
    imageCaption: 'Photograph taken October 2019',
    source: 'Documented record of the Late N. Albert Memorial Award · 2019',
    sourceUrl: null,
    verified: true,
  },
  {
    id: 'from-alumni-network-to-community-action',
    category: 'Community',
    kicker: 'Community / Impact',
    year: '2026',
    title: 'From Alumni Network to Community Action',
    excerpt:
      'In 2026, the Association of MSAP Alumni, Manipur carried its alumni spirit into environmental action, completing seven plantation programmes across the state and planting 2,550 saplings with government departments, local organisations and community volunteers.',
    body: [
      'In 2026, the Association of MSAP Alumni, Manipur conducted a year-long tree plantation drive under the theme “Now for Climate”.',
      'The campaign comprised seven plantation programmes across Manipur. The final programme was held at Koirengei Maibakhun on 26 August 2026.',
      'Across the seven locations, 2,550 saplings were planted. The initiative brought together the Central Forest Division of the Department of Forest, Government of Manipur, alongside local organisations and community participants.',
    ],
    person: 'Association of MSAP Alumni, Manipur',
    achievement:
      '2,550 saplings planted across seven plantation programmes in Manipur, 2026',
    facts: [
      'Organiser: Association of MSAP Alumni, Manipur',
      'Year: 2026 — theme “Now for Climate”',
      'Scale: seven plantation programmes across Manipur',
      'Total: 2,550 saplings planted',
      'Final programme: Koirengei Maibakhun, 26 August 2026',
      'Partners: Central Forest Division, Department of Forest, Government of Manipur; local organisations; community participants',
    ],
    image: `${STORIES_ARCHIVE_ROOT}/Community.jpg`,
    imageCaption: 'Photograph taken 26 August 2026 · Koirengei Maibakhun',
    source: 'Documented in MSAP Alumni Association reporting · 2026',
    sourceUrl: null,
    verified: true,
  },
  {
    id: '1973-to-today',
    category: 'Legacy',
    kicker: 'Legacy',
    year: 'Since 1973',
    title: '1973 → Today: A Student Network That Became a Community',
    excerpt:
      'Founded in 1973, MSAP began as a platform for Manipuri students in Pune. Over the decades, its activities have grown across academics, sports, culture and community life — connecting generations of students who came to Pune to study.',
    body: [
      'MSAP was formed in 1973 as a common platform for students from Manipur studying in and around Pune.',
      'Its documented activities have grown across academic support, sports, cultural programmes, community gatherings and student welfare — connecting generations of students who came to Pune to study.',
      'That platform continues today as an alumni network: in 2026, the Association of MSAP Alumni, Manipur carried the same community spirit into environmental action through its “Now for Climate” plantation drive.',
    ],
    person: 'MSAP — founded 1973',
    achievement: 'A functioning student and alumni network in and around Pune since 1973',
    facts: [
      'Founded: 1973',
      'Purpose: a common platform for students from Manipur studying in and around Pune',
      'Documented activities: academic support, sports, cultural programmes, community gatherings, student welfare',
    ],
    image: JUBILEE_ARCHIVE,
    imageCaption: 'Archival photograph — 50th Golden Jubilee',
    source: 'Documented founding record of MSAP · 1973',
    sourceUrl: null,
    verified: true,
  },
  {
    id: 'sports-and-culture',
    category: 'Culture',
    kicker: 'Culture / Community',
    year: 'Documented history',
    title: 'Where Sport Became a Way to Stay Connected',
    excerpt:
      "For generations of Manipuri students in Pune, MSAP's sports and cultural gatherings became more than annual events — they created a place to meet, compete, celebrate and stay connected away from home.",
    body: [
      'Sport and culture have run through MSAP for decades. The organisation has organised annual sports and cultural programmes that bring Manipuri students and their families together in Pune.',
      'A documented 2014 annual sports meet brought students from different Manipuri communities in Pune together and included 22 individual and team events.',
      'These gatherings gave students a place to meet, compete, celebrate and stay connected away from home — a role they continue to play today.',
    ],
    person: 'MSAP — sports and cultural programmes',
    achievement:
      'Decades of annual sports and cultural programmes; a documented 2014 sports meet with 22 individual and team events',
    facts: [
      'Activity: annual sports and cultural programmes for decades',
      '2014: documented annual sports meet — 22 individual and team events, with students from different Manipuri communities in Pune',
      'Also conducted: cultural gatherings involving Manipuri students and families in Pune',
    ],
    image: SPORTS_MEET_ARCHIVE,
    imageCaption: 'Archival photograph — MSAP sports meet',
    source:
      'Documented annual sports and cultural programme records, including the 2014 sports meet',
    sourceUrl: null,
    verified: true,
  },
];

export function getStory(id) {
  return ALUMNI_STORIES.find((story) => story.id === id) || null;
}