import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALUMNI_STORIES } from '../data/alumniStories';

const FILTERS = ['All', 'Academic', 'Community', 'Culture', 'Legacy'];

export default function StoriesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredStories =
    activeFilter === 'All'
      ? ALUMNI_STORIES
      : ALUMNI_STORIES.filter((s) => s.category.toLowerCase() === activeFilter.toLowerCase());

  const featured = filteredStories[0];
  const rest = filteredStories.slice(1);

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
          <div>
            <p className="eyebrow mb-4">Alumni chronicles</p>
            <h1 className="display-lg text-4xl md:text-5xl">Stories of journey &amp; impact</h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted md:pb-2 shrink-0">
            An alumni publication
          </p>
        </div>
        <p className="text-stone text-base sm:text-lg max-w-2xl">
          Documented stories of achievement, community and the generations connected through MSAP.
        </p>

        {/* Filter tabs */}
        <nav aria-label="Filter stories by category" className="flex flex-wrap gap-x-8 gap-y-2 mt-9">
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                aria-pressed={active}
                className={`pb-1.5 text-[15px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'text-lavender border-lavender'
                    : 'text-stone border-transparent hover:text-lavender hover:border-lavender/40'
                }`}
              >
                {f}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-5 pb-20 md:pb-28">
        {/* Featured spread */}
        {featured && (
          <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            {featured.image ? (
              <div className="lg:col-span-7">
                <div className="media-frame">
                  <div className="aspect-[4/3] sm:aspect-[16/10] bg-section-alt overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.imageCaption || featured.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-7">
                <div
                  className="border border-main border-t-4 border-t-lavender flex items-center justify-center min-h-[16rem] sm:min-h-[20rem] bg-card"
                  aria-hidden="true"
                >
                  <span className="font-display text-lavender italic text-7xl leading-none select-none">“</span>
                </div>
              </div>
            )}
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-lavender mb-3">
                Featured &middot; {featured.kicker} &middot; {featured.year}
              </p>
              <h2 className="font-display text-ink text-3xl sm:text-4xl font-bold leading-tight mb-4">
                {featured.title}
              </h2>
              <p className="text-stone text-base leading-relaxed mb-5">{featured.excerpt}</p>
              <Link to={`/stories/${featured.id}`} className="text-link link-underline">
                Read the full chronicle
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        )}

        {/* Supporting stories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {rest.map((story, idx) => (
            <article key={story.id} className={`${idx > 0 ? 'sm:border-t-0' : ''} border-t border-main sm:pt-0 pt-6`}>
              {story.image ? (
                <div className="media-frame mb-5">
                  <div className="aspect-[16/10] bg-section-alt overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.imageCaption || story.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-5 flex items-center border-l-2 border-lavender pl-4 h-24 bg-card" aria-hidden="true">
                  <span className="font-display text-lavender italic text-4xl leading-none select-none">“</span>
                </div>
              )}
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted mb-2">
                {story.category} &middot; {story.year}
              </p>
              <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 transition-colors">
                <Link to={`/stories/${story.id}`} className="hover:text-lavender transition-colors">
                  {story.title}
                </Link>
              </h3>
              <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-3 mb-4">
                {story.excerpt}
              </p>
              <Link to={`/stories/${story.id}`} className="text-link">
                Read story
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}