import { useState } from 'react';
import { getAllNews, NEWS_CAMPAIGNS } from '../data/newsData';
import NewsCard from '../components/NewsCard';

const CATEGORIES = ['All', 'Reunion', 'Community', 'Association', 'Environment'];
const YEARS = ['All years', 2026, 2025];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All years');

  const all = getAllNews();

  const filtered = all.filter((item) => {
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
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
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

      <div className="max-w-7xl mx-auto px-5 pb-20 md:pb-28">
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