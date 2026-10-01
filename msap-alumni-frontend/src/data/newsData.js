const FACEBOOK_URL = 'https://www.facebook.com/share/1Jco7CPBqJ/?mibextid=wwXIfr';

const NEWS_ARCHIVE_ROOT =
  'https://pqfsbbdexjshvqskmbfu.supabase.co/storage/v1/object/public/MSAP%20Photos/Stories';

const TREE_PROGRAMME_7_IMAGE = `${NEWS_ARCHIVE_ROOT}/Community.jpg`;

export const NEWS_CAMPAIGNS = {
  'tree-plantation-2026': {
    id: 'tree-plantation-2026',
    name: 'Tree Plantation Drive 2026',
    kicker: 'Environment campaign',
    tagline: 'Seven programmes. Seven locations. One community effort.',
    description:
      'In 2026, the Association of MSAP Alumni, Manipur organised tree plantation programmes at seven locations across the state.',
    total: '2,550 saplings planted across the seven programmes.',
    sourceNote: 'Campaign figure as documented on the official MSAP Alumni Facebook page.',
  },
};

export const NEWS_DATA = [
  {
    id: 'tree-plantation-1st-programme',
    slug: 'tree-plantation-1st-programme',
    title: 'Tree Plantation Drive — 1st Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · 31 MAY 2026',
    dateDisplay: '31 May 2026',
    dateExact: true,
    sortKey: '2026-05-31',
    year: 2026,
    location: null,
    excerpt:
      'The first programme of the Tree Plantation Drive 2026 by the Association of MSAP Alumni, Manipur, held on 31 May 2026.',
    content: [
      'The 1st Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held on 31 May 2026.',
      'It was the opening programme of the association’s seven-location plantation campaign across Manipur.',
      'Venue and participant details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'tree-plantation-2nd-programme',
    slug: 'tree-plantation-2nd-programme',
    title: 'Tree Plantation Drive — 2nd Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · JUNE 2026',
    dateDisplay: 'June 2026',
    dateExact: false,
    sortKey: '2026-06',
    year: 2026,
    location: null,
    excerpt:
      'The second programme of the Tree Plantation Drive 2026 by the Association of MSAP Alumni, Manipur, held in June 2026.',
    content: [
      'The 2nd Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held in June 2026.',
      'The exact date, venue and participants are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'tree-plantation-3rd-programme',
    slug: 'tree-plantation-3rd-programme',
    title: 'Tree Plantation Drive — 3rd Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · 5 JULY 2026',
    dateDisplay: '5 July 2026',
    dateExact: true,
    sortKey: '2026-07-05',
    year: 2026,
    location: 'Royal Academy of Science, Kongba',
    excerpt:
      'The third programme of the Tree Plantation Drive 2026, held at the Royal Academy of Science, Kongba on 5 July 2026.',
    content: [
      'The 3rd Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at the Royal Academy of Science, Kongba on 5 July 2026.',
      'Further details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'tree-plantation-4th-programme',
    slug: 'tree-plantation-4th-programme',
    title: 'Tree Plantation Drive — 4th Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · 19 JULY 2026',
    dateDisplay: '19 July 2026',
    dateExact: true,
    sortKey: '2026-07-19',
    year: 2026,
    location: 'Golapati Hatta Linear Ningol Van',
    excerpt:
      'The fourth programme of the Tree Plantation Drive 2026, held at Golapati Hatta Linear Ningol Van on 19 July 2026.',
    content: [
      'The 4th Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at Golapati Hatta Linear Ningol Van on 19 July 2026.',
      'Further details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'tree-plantation-5th-programme',
    slug: 'tree-plantation-5th-programme',
    title: 'Tree Plantation Drive — 5th Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · 9 AUGUST 2026',
    dateDisplay: '9 August 2026',
    dateExact: true,
    sortKey: '2026-08-09',
    year: 2026,
    location: 'Porompat Ningol Van',
    excerpt:
      'The fifth programme of the Tree Plantation Drive 2026, held at Porompat Ningol Van on 9 August 2026.',
    content: [
      'The 5th Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at Porompat Ningol Van on 9 August 2026.',
      'Further details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'tree-plantation-6th-programme',
    slug: 'tree-plantation-6th-programme',
    title: 'Tree Plantation Drive — 6th Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · 23 AUGUST 2026',
    dateDisplay: '23 August 2026',
    dateExact: true,
    sortKey: '2026-08-23',
    year: 2026,
    location: 'Loushangkhong Ningol Van',
    excerpt:
      'The sixth programme of the Tree Plantation Drive 2026, held at Loushangkhong Ningol Van on 23 August 2026.',
    content: [
      'The 6th Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at Loushangkhong Ningol Van on 23 August 2026.',
      'Further details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'tree-plantation-7th-programme',
    slug: 'tree-plantation-7th-programme',
    title: 'Tree Plantation Drive — 7th Programme',
    category: 'Environment',
    cardLabel: 'ENVIRONMENT · 26 AUGUST 2026',
    dateDisplay: '26 August 2026',
    dateExact: true,
    sortKey: '2026-08-26',
    year: 2026,
    location: 'Koirengei Maibakhun',
    excerpt:
      'The seventh and final programme of the Tree Plantation Drive 2026, held at Koirengei Maibakhun on 26 August 2026.',
    content: [
      'The 7th Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at Koirengei Maibakhun on 26 August 2026.',
      'With this programme, the association concluded its seven-location plantation campaign for the year.',
      'Across the seven programmes, 2,550 saplings were planted.',
    ],
    coverImage: TREE_PROGRAMME_7_IMAGE,
    imageCaption: 'Photograph taken 26 August 2026 · Koirengei Maibakhun',
    galleryImages: [
      {
        src: TREE_PROGRAMME_7_IMAGE,
        caption: 'Photograph taken 26 August 2026 · Koirengei Maibakhun',
      },
    ],
    campaign: 'tree-plantation-2026',
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: '1st-reunion-meet',
    slug: '1st-reunion-meet',
    title: '1st Reunion Meet',
    category: 'Reunion',
    cardLabel: 'REUNION · 2025',
    dateDisplay: '2025',
    dateExact: false,
    sortKey: '2025',
    year: 2025,
    location: 'Manipur University',
    excerpt:
      'The first reunion meet of the Association of MSAP Alumni, Manipur, held at Manipur University in 2025.',
    content: [
      'The 1st Reunion Meet of the Association of MSAP Alumni, Manipur was held at Manipur University in 2025.',
      'It was the first reunion gathering of the association at the university campus.',
      'Programme details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: null,
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'new-year-celebration',
    slug: 'new-year-celebration',
    title: 'New Year Celebration',
    category: 'Community',
    cardLabel: 'COMMUNITY · JAN 2026',
    dateDisplay: 'January 2026',
    dateExact: false,
    sortKey: '2026-01',
    year: 2026,
    location: null,
    excerpt:
      'A New Year celebration for members of the Association of MSAP Alumni, Manipur, held in January 2026.',
    content: [
      'The Association of MSAP Alumni, Manipur held a New Year celebration for its members in January 2026.',
      'Programme details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: null,
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
  {
    id: 'annual-general-body-meeting',
    slug: 'annual-general-body-meeting',
    title: 'Annual General Body Meeting',
    category: 'Association',
    cardLabel: 'ASSOCIATION · 2026',
    dateDisplay: '2026',
    dateExact: false,
    sortKey: '2026',
    year: 2026,
    location: null,
    excerpt:
      'The annual general body meeting of the Association of MSAP Alumni, Manipur, held in 2026.',
    content: [
      'The Association of MSAP Alumni, Manipur convened its annual general body meeting in 2026.',
      'Meeting details and outcomes are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: null,
    imageCaption: null,
    galleryImages: [],
    campaign: null,
    sourceType: 'Official Facebook',
    source: 'Official MSAP Alumni Facebook page',
    sourceUrl: FACEBOOK_URL,
    supportingSources: [],
  },
];

function sortDescending(a, b) {
  const keyA = `${a.dateExact ? 'a' : 'b'}${a.sortKey}`;
  const keyB = `${b.dateExact ? 'a' : 'b'}${b.sortKey}`;
  return keyB.localeCompare(keyA);
}

export function getAllNews() {
  return [...NEWS_DATA].sort(sortDescending);
}

export function getNewsBySlug(slug) {
  return NEWS_DATA.find((item) => item.slug === slug) || null;
}

export function getRelatedNews(item, limit = 3) {
  const others = NEWS_DATA.filter((n) => n.id !== item.id);
  const sameCategory = others.filter((n) => n.category === item.category);
  const remaining = others.filter((n) => n.category !== item.category);
  return [...sameCategory, ...remaining].sort(sortDescending).slice(0, limit);
}