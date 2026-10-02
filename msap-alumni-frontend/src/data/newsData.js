const FACEBOOK_URL = 'https://www.facebook.com/share/1Jco7CPBqJ/?mibextid=wwXIfr';

const newsImages = import.meta.glob('../assets/News/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const newsImage = (name) => {
  const match = Object.entries(newsImages).find(([key]) => key.includes(`News/${name}`));
  return match ? match[1] : null;
};

const REUNION_IMAGE = newsImage('1st Reunion Meet — Manipur University, 2025.png');
const NEW_YEAR_IMAGE = newsImage('new year.jpeg');
const AGBM_IMAGE = newsImage('Annual Body Meeting.jpeg');

// Gallery-wide helper. Folder names contain parentheses/newlines in some cases, so avoid literal
// glob paths (fast-glob treats parens as extglob) and match by filename suffix instead.
const allGalleryImages = import.meta.glob('../assets/Gallary/**/*.{jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const galleryImage = (file, folder) => {
  const target = folder ? `${folder}/${file}` : `/${file}`;
  const match = Object.entries(allGalleryImages).find(([key]) => key.includes(target));
  return match ? match[1] : null;
};

const AGM_FOLDER = '1st Annual General Body Meeting';
const AGM_GALLERY = [
  'WhatsApp Image 2026-07-07 at 2.03.58 PM.jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.58 PM (1).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM.jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (1).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (2).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (3).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (5).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (7).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (8).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (9).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (10).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (11).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (12).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (13).jpeg',
  'WhatsApp Image 2026-07-07 at 2.03.59 PM (14).jpeg',
].map((file) => ({
  src: galleryImage(file, AGM_FOLDER),
  caption: '1st Annual General Body Meeting · 7 July 2026',
}));

const TREE_PROGRAMME_1_IMAGE = newsImage('Tree Plantation Drive 1.1 — Taobungkhok.jpg');
const TREE_PROGRAMME_2_IMAGE = newsImage('Tree Plantation Drive 1.2 — Mekola.jpg');
const TREE_PROGRAMME_3_IMAGE = newsImage('Tree Plantation Drive 1.3 — Royal Academy of Science, Kongba.jpg');
const TREE_PROGRAMME_4_IMAGE = newsImage('Tree Plantation Drive 1.4 — Golapati Hatta.jpg');
const TREE_PROGRAMME_5_IMAGE = newsImage('Tree Plantation Drive 1.5 — Porompat.jpg');
const TREE_PROGRAMME_6_IMAGE = newsImage('Tree Plantation Drive 1.6 — Loushangkhong.jpg');
const TREE_PROGRAMME_7_IMAGE = newsImage('Tree Plantation Drive 1.7 — Koirengei Maibakhun.jpg');

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
    location: 'Taobungkhok',
    excerpt:
      'The first programme of the Tree Plantation Drive 2026 by the Association of MSAP Alumni, Manipur, held at Taobungkhok on 31 May 2026.',
    content: [
      'The 1st Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at Taobungkhok on 31 May 2026.',
      'It was the opening programme of the association’s seven-location plantation campaign across Manipur.',
      'Participant details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: TREE_PROGRAMME_1_IMAGE,
    imageCaption: 'Tree Plantation Drive · 1st Programme',
    galleryImages: [
      {
        src: TREE_PROGRAMME_1_IMAGE,
        caption: '1st Programme · Taobungkhok',
      },
    ],
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
    location: 'Mekola',
    excerpt:
      'The second programme of the Tree Plantation Drive 2026 by the Association of MSAP Alumni, Manipur, held at Mekola in June 2026.',
    content: [
      'The 2nd Programme of the Tree Plantation Drive 2026, organised by the Association of MSAP Alumni, Manipur, was held at Mekola in June 2026.',
      'The exact date and participant details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: TREE_PROGRAMME_2_IMAGE,
    imageCaption: 'Tree Plantation Drive · 2nd Programme',
    galleryImages: [
      {
        src: TREE_PROGRAMME_2_IMAGE,
        caption: '2nd Programme · Mekola',
      },
    ],
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
    coverImage: TREE_PROGRAMME_3_IMAGE,
    imageCaption: 'Tree Plantation Drive · 3rd Programme',
    galleryImages: [
      {
        src: TREE_PROGRAMME_3_IMAGE,
        caption: '3rd Programme · Royal Academy of Science, Kongba',
      },
    ],
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
    coverImage: TREE_PROGRAMME_4_IMAGE,
    imageCaption: 'Tree Plantation Drive · 4th Programme',
    galleryImages: [
      {
        src: TREE_PROGRAMME_4_IMAGE,
        caption: '4th Programme · Golapati Hatta Linear Ningol Van',
      },
    ],
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
    coverImage: TREE_PROGRAMME_5_IMAGE,
    imageCaption: 'Tree Plantation Drive · 5th Programme',
    galleryImages: [
      {
        src: TREE_PROGRAMME_5_IMAGE,
        caption: '5th Programme · Porompat Ningol Van',
      },
    ],
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
    coverImage: TREE_PROGRAMME_6_IMAGE,
    imageCaption: 'Tree Plantation Drive · 6th Programme',
    galleryImages: [
      {
        src: TREE_PROGRAMME_6_IMAGE,
        caption: '6th Programme · Loushangkhong Ningol Van',
      },
    ],
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
    imageCaption: 'Photograph · Koirengei Maibakhun, 26 August 2026',
    galleryImages: [
      {
        src: TREE_PROGRAMME_7_IMAGE,
        caption: 'Photograph · Koirengei Maibakhun, 26 August 2026',
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
    cardLabel: 'REUNION · 11 MAY 2025',
    dateDisplay: '11 May 2025',
    dateExact: true,
    sortKey: '2025-05-11',
    year: 2025,
    location: 'Manipur University, Centenary Hall',
    excerpt:
      'The first reunion meet of the Association of MSAP Alumni, Manipur, held at the Manipur University Centenary Hall on 11 May 2025.',
    content: [
      'The 1st Reunion Meet of the Association of MSAP Alumni, Manipur was held on 11 May 2025 at the Centenary Hall, Manipur University.',
      'It was the first reunion gathering of the association at the university campus.',
      'Programme details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: REUNION_IMAGE,
    imageCaption: '1st Reunion Meet · Manipur University Centenary Hall, 11 May 2025',
    galleryImages: [
      {
        src: galleryImage('1.jpg', '1st Re-Union of Association MSAP Alumni, Manipur at Manipur University Centenary Hall on 11th May, 2025'),
        caption: '1st Reunion Meet · Manipur University Centenary Hall, 11 May 2025',
      },
      {
        src: galleryImage('2.jpg', '1st Re-Union of Association MSAP Alumni, Manipur at Manipur University Centenary Hall on 11th May, 2025'),
        caption: '1st Reunion Meet · Manipur University Centenary Hall, 11 May 2025',
      },
      {
        src: galleryImage('3.jpg', '1st Re-Union of Association MSAP Alumni, Manipur at Manipur University Centenary Hall on 11th May, 2025'),
        caption: '1st Reunion Meet · Manipur University Centenary Hall, 11 May 2025',
      },
      {
        src: galleryImage('4.jpg', '1st Re-Union of Association MSAP Alumni, Manipur at Manipur University Centenary Hall on 11th May, 2025'),
        caption: '1st Reunion Meet · Manipur University Centenary Hall, 11 May 2025',
      },
      {
        src: galleryImage('5.jpg', '1st Re-Union of Association MSAP Alumni, Manipur at Manipur University Centenary Hall on 11th May, 2025'),
        caption: '1st Reunion Meet · Manipur University Centenary Hall, 11 May 2025',
      },
    ],
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
    cardLabel: 'COMMUNITY · 4 JAN 2026',
    dateDisplay: '4 January 2026',
    dateExact: true,
    sortKey: '2026-01-04',
    year: 2026,
    location: 'Imphal',
    excerpt:
      'The 1st New Year Get Together of the Association of MSAP Alumni, Manipur, held on Sunday, 4 January 2026.',
    content: [
      'The Association of MSAP Alumni, Manipur held its 1st New Year Get Together on Sunday, 4 January 2026.',
      'Programme details are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: NEW_YEAR_IMAGE,
    imageCaption: 'New Year Get Together · 4 January 2026',
    galleryImages: [
      {
        src: galleryImage('2026 MSAP Alumni New Year Party group.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('2026 MSAP Alumni New Year Party group2.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('2026 MSAP Alumni New Year Party President.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('2026 MSAP Alumni New Year Party with Host.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('MSAP Alumni ReUnion 4th Jan 2026 portrait.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('2026 MSAP Alumni New Year Party Uttam.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('2026 MSAP Alumni New Year Party Tejkumar.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
      {
        src: galleryImage('2026 MSAP Alumni New Year Party sub group.jpeg'),
        caption: 'New Year Get Together · 4 January 2026',
      },
    ],
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
    cardLabel: 'ASSOCIATION · 7 JULY 2026',
    dateDisplay: '7 July 2026',
    dateExact: true,
    sortKey: '2026-07-07',
    year: 2026,
    location: null,
    excerpt:
      'The annual general body meeting of the Association of MSAP Alumni, Manipur, held on 7 July 2026.',
    content: [
      'The Association of MSAP Alumni, Manipur convened its annual general body meeting on 7 July 2026.',
      'Meeting details and outcomes are as documented on the official MSAP Alumni Facebook page.',
    ],
    coverImage: AGBM_IMAGE,
    imageCaption: '1st Annual General Body Meeting · 7 July 2026',
    galleryImages: AGM_GALLERY,
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