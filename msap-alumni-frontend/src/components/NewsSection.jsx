import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews } from '../data/newsData';
import { fetchStories } from '../services/dataService';
import NewsCard from './NewsCard';

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState(() => getAllNews());
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);

  useEffect(() => {
    fetchStories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((story) => ({
            id: story.id,
            slug: story.id,
            title: story.title,
            category: story.category || 'Spotlight',
            dateDisplay: story.published_date || 'Recent',
            cardLabel: `${story.published_date || 'Recent'} · ${story.category || 'Association'}`,
            coverImage: story.image_url,
            excerpt: story.excerpt,
            content: typeof story.content === 'string' ? story.content.split('\n\n') : story.content || [],
            isFeatured: Boolean(story.is_featured),
            source: story.source,
            updatedAt: story.updated_at || story.created_at || '2026-01-01',
          }));

          // Sort mapped items: featured first, then by most recently updated
          mapped.sort((a, b) => {
            if (b.isFeatured !== a.isFeatured) {
              return b.isFeatured ? 1 : -1;
            }
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });

          const dbTitles = new Set(mapped.map((m) => m.title.trim().toLowerCase()));
          const staticRemain = getAllNews().filter(
            (item) => !dbTitles.has(item.title.trim().toLowerCase())
          );
          setNewsItems([...mapped, ...staticRemain]);
        }
      })
      .catch((err) => {
        console.warn('Using offline news data:', err.message);
      });
  }, []);

  // Collect all stories marked as spotlighted / featured
  const spotlightStories = newsItems.filter((item) => item.isFeatured);
  const currentSpotlight = spotlightStories[activeSpotlightIndex] || spotlightStories[0];

  // Grid cards (exclude whichever story is currently in the active spotlight hero)
  const gridStories = currentSpotlight
    ? newsItems.filter((item) => item.id !== currentSpotlight.id).slice(0, 4)
    : newsItems.slice(0, 4);

  return (
    <section className="max-w-[90rem] mx-auto px-5 py-16 md:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow mb-4">01 &mdash; News &amp; Spotlight</p>
          <h2 className="display-lg text-3xl sm:text-4xl md:text-[2.75rem]">Latest News &amp; Stories</h2>
          <p className="text-stone text-base sm:text-lg mt-4 max-w-2xl">
            Recent activities, major milestones, and highlighted stories from the Association of MSAP Alumni, Manipur.
          </p>
        </div>
        <Link to="/news" className="text-link link-underline shrink-0 mb-1">
          View all archives
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {/* ─── Premium Editorial Spotlight Hero Showcase ─── */}
      {currentSpotlight && (
        <div className="relative mb-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#181129] via-[#24173D] to-[#120B20] text-[#FAF8F5] border border-lavender/35 shadow-[0_20px_50px_rgba(26,14,50,0.35)] p-6 sm:p-10 lg:p-12 transition-all duration-500">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/25 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Details */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Glowing Animated Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-transparent border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                  <span>✦ OFFICIAL SPOTLIGHT</span>
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C3B5DA] mb-3">
                  {currentSpotlight.cardLabel}
                </p>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.6rem] text-[#FAF8F5] font-bold leading-[1.18] mb-5 tracking-tight group">
                  <Link to={`/news/${currentSpotlight.slug}`} className="hover:text-amber-300 transition-colors">
                    {currentSpotlight.title}
                  </Link>
                </h3>

                <p className="text-[#D8D0E8] text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal line-clamp-4">
                  {currentSpotlight.excerpt}
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={`/news/${currentSpotlight.slug}`}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-ink font-extrabold text-xs uppercase tracking-[0.16em] hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_10px_25px_rgba(245,158,11,0.3)]"
                >
                  <span>Read Spotlight Story</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-white/20 hover:border-white/50 text-white/90 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <span>Browse Archive</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Cover Photo */}
            <div className="lg:col-span-6">
              <div className="relative group">
                <Link to={`/news/${currentSpotlight.slug}`} className="block overflow-hidden rounded-xl border border-white/15 shadow-2xl relative bg-black/40">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={currentSpotlight.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200'}
                      alt={currentSpotlight.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white font-medium">
                    <span className="bg-amber-500 text-black px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-[11px] shadow-sm">
                      {currentSpotlight.category || 'Spotlight'}
                    </span>
                    <span className="text-white/90 font-semibold drop-shadow">
                      {currentSpotlight.dateDisplay}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* ─── Multi-Spotlight Reel Bar ─── */}
          {spotlightStories.length > 1 && (
            <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#C5B9DB] font-medium">
                <span className="uppercase tracking-widest text-[10px] font-bold text-amber-300">Spotlight Reel:</span>
                <span>Story {activeSpotlightIndex + 1} of {spotlightStories.length}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {spotlightStories.map((story, idx) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => setActiveSpotlightIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer truncate max-w-[220px] text-left shrink-0 ${
                      activeSpotlightIndex === idx
                        ? 'bg-amber-400 text-black font-extrabold shadow-md shadow-amber-400/25 ring-2 ring-amber-300'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    ✦ {story.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid of Latest Stories */}
      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
        {gridStories.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}