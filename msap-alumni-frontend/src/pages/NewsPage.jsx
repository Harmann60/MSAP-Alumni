import { useState, useEffect } from 'react';
import { getAllNews, NEWS_CAMPAIGNS, resolveNewsImage } from '../data/newsData';
import { fetchStories } from '../services/dataService';
import NewsCard from '../components/NewsCard';

const CATEGORIES = ['All', 'Reunion', 'Community', 'Association', 'Environment', 'Spotlight'];
const YEARS = ['All years', 2026, 2025];

export default function NewsPage() {
  const [allNews, setAllNews] = useState(() => getAllNews());
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All years');

  useEffect(() => {
    fetchStories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const staticAll = getAllNews();
          const mapped = data.map((story) => {
            const staticMatch = staticAll.find(
              (item) =>
                item.title.trim().toLowerCase() === story.title.trim().toLowerCase() ||
                item.id === story.id ||
                item.slug === story.id
            );

            const resolvedImage =
              resolveNewsImage(story.image_url) ||
              staticMatch?.coverImage ||
              story.image_url;

            if (staticMatch) {
              return {
                ...staticMatch,
                id: story.id,
                title: story.title || staticMatch.title,
                category: story.category || staticMatch.category,
                dateDisplay: story.published_date || staticMatch.dateDisplay,
                cardLabel: `${story.published_date || staticMatch.dateDisplay} · ${story.category || staticMatch.category}`,
                coverImage: resolvedImage,
                excerpt: story.excerpt || staticMatch.excerpt,
                content:
                  typeof story.content === 'string'
                    ? story.content.split('\n\n')
                    : story.content || staticMatch.content,
                isFeatured:
                  story.is_featured !== undefined ? Boolean(story.is_featured) : staticMatch.isFeatured,
                source: story.source || staticMatch.source,
                year: staticMatch.year || (story.published_date?.includes('2025') ? 2025 : 2026),
              };
            }

            return {
              id: story.id,
              slug: story.id,
              title: story.title,
              category: story.category || 'Spotlight',
              dateDisplay: story.published_date || 'Recent',
              cardLabel: `${story.published_date || 'Recent'} · ${story.category || 'Association'}`,
              coverImage: resolvedImage,
              excerpt: story.excerpt,
              content:
                typeof story.content === 'string' ? story.content.split('\n\n') : story.content || [],
              isFeatured: Boolean(story.is_featured),
              source: story.source,
              year: story.published_date?.includes('2025') ? 2025 : 2026,
            };
          });

          const dbTitles = new Set(mapped.map((m) => m.title.trim().toLowerCase()));
          const staticRemain = staticAll.filter(
            (item) => !dbTitles.has(item.title.trim().toLowerCase())
          );
          setAllNews([...mapped, ...staticRemain]);
        }
      })
      .catch((err) => console.warn('Using offline news archive:', err.message));
  }, []);

  const filtered = allNews.filter((item) => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const yearMatch = activeYear === 'All years' || item.year === activeYear;
    return categoryMatch && yearMatch;
  });

  const campaignIds = [];
  const standalone = [];
  for (const item of filtered) {
    if (item.campaign && !campaignIds.includes(item.campaign)) campaignIds.push(item.campaign);
    if (!item.campaign) standalone.push(item);
  }
  const groupedCampaigns = campaignIds
    .map((id) => ({ meta: NEWS_CAMPAIGNS[id], items: filtered.filter((n) => n.campaign === id) }))
    .filter((group) => group.meta);

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-[90rem] mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
          <div>
            <p className="eyebrow mb-4">News &amp; events</p>
            <h1 className="display-lg text-4xl md:text-5xl">The association archive</h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted md:pb-2 shrink-0">
            An official archival record
          </p>
        </div>
        <p className="text-stone text-base sm:text-lg max-w-2xl">
          Recent activities, events and announcements from the Association of MSAP Alumni, Manipur.
        </p>

        {/* Category filters */}
        <nav aria-label="Filter news by category" className="flex flex-wrap gap-x-8 gap-y-2 mt-9">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={active}
                className={`pb-1.5 text-[15px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'text-lavender border-lavender'
                    : 'text-stone border-transparent hover:text-lavender hover:border-lavender/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Year filters */}
        <nav aria-label="Filter news by year" className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Year</span>
          {YEARS.map((year) => {
            const active = activeYear === year;
            return (
              <button
                key={String(year)}
                onClick={() => setActiveYear(year)}
                aria-pressed={active}
                className={`text-[15px] font-semibold transition-colors cursor-pointer ${
                  active ? 'text-lavender' : 'text-muted hover:text-lavender'
                }`}
              >
                {year}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="max-w-[90rem] mx-auto px-5 pb-20 md:pb-28">
        {filtered.length === 0 ? (
          <p className="text-stone text-base py-16">No documented activities match this filter.</p>
        ) : (
          <>
            {groupedCampaigns.map((group) => (
              <section key={group.meta.id} className="mb-16 md:mb-20">
                <div className="border-y border-main py-6 md:py-8 mb-10">
                  <p className="eyebrow mb-3">{group.meta.kicker}</p>
                  <h2 className="display-lg text-3xl md:text-4xl">{group.meta.name}</h2>
                  <p className="font-display text-ink text-lg md:text-xl mt-3 mb-2">{group.meta.tagline}</p>
                  <p className="text-stone text-[15px] leading-relaxed max-w-2xl mb-3">{group.meta.description}</p>
                  <p className="text-muted text-[15px]">{group.meta.total}</p>
                  <p className="text-muted/80 text-xs mt-1">{group.meta.sourceNote}</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {group.items.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}

            {standalone.length > 0 && (
              <section className={groupedCampaigns.length > 0 ? '' : 'mt-16 md:mt-20'}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10 border-b border-main pb-6">
                  <h2 className="eyebrow mb-0">All other activities</h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {standalone.length} documented {standalone.length === 1 ? 'activity' : 'activities'}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {standalone.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}