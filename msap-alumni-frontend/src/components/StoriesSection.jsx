import { Link } from 'react-router-dom';
import { ALUMNI_STORIES } from '../data/alumniStories';

const FEATURED_ID = 'yuireising-ngalung';
const SUPPORTING_IDS = ['from-alumni-network-to-community-action', '1973-to-today'];

export default function StoriesSection() {
  const byId = (id) => ALUMNI_STORIES.find((story) => story.id === id);
  const featured = byId(FEATURED_ID);
  const rest = SUPPORTING_IDS.map(byId).filter(Boolean);

  return (
    <section className="max-w-7xl mx-auto px-5 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow mb-4">01 &mdash; Alumni chronicles</p>
          <h2 className="display-lg text-3xl sm:text-4xl md:text-[2.75rem]">Stories from our alumni</h2>
          <p className="text-stone text-base sm:text-lg mt-4 max-w-xl">
            Documented stories of achievement, community and the generations connected through
            MSAP.
          </p>
        </div>
        <Link to="/stories" className="text-link link-underline shrink-0 mb-1">
          All stories
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Featured editorial spread */}
      <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14">
        {featured.image ? (
          <div className="lg:col-span-7">
            <div className="media-frame">
              <div className="aspect-[4/3] sm:aspect-[16/10] bg-section-alt overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.imageCaption || featured.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
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
            {featured.kicker} &middot; {featured.year}
          </p>
          <h3 className="font-display text-ink text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {featured.title}
          </h3>
          <p className="text-stone text-base leading-relaxed mb-5">{featured.excerpt}</p>
          <Link to={`/stories/${featured.id}`} className="text-link link-underline">
            Read the full chronicle
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </article>

      {/* Supporting editorial rows */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {rest.map((story) => (
          <article key={story.id} className="border-t border-main pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted mb-2">
              {story.kicker} &middot; {story.year}
            </p>
            <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 hover:text-lavender transition-colors">
              <Link to={`/stories/${story.id}`}>{story.title}</Link>
            </h3>
            <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-2 mb-4">
              {story.excerpt}
            </p>
            <Link to={`/stories/${story.id}`} className="text-link">
              Read story
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}