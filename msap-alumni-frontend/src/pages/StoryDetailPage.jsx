import { Link, Navigate, useParams } from 'react-router-dom';
import { ALUMNI_STORIES, getStory } from '../data/alumniStories';

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const story = getStory(storyId);

  if (!story) {
    return <Navigate to="/stories" replace />;
  }

  const related = ALUMNI_STORIES.filter((s) => s.id !== story.id).slice(0, 3);

  return (
    <div className="bg-page min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-20 md:pt-20 md:pb-28">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted hover:text-lavender transition-colors mb-10"
        >
          <span aria-hidden="true">←</span>
          Back to stories
        </Link>

        <header className="max-w-3xl">
          <p className="eyebrow mb-4">
            {story.kicker} &middot; {story.year}
          </p>
          <h1 className="display-lg text-4xl md:text-5xl">{story.title}</h1>
        </header>

        <p className="font-display text-ink text-xl md:text-2xl leading-relaxed max-w-2xl mt-8 mb-10">
          {story.excerpt}
        </p>

        {story.image && (
          <figure className="media-frame mb-12 max-w-3xl">
            <div className="aspect-[16/10] bg-section-alt overflow-hidden">
              <img
                src={story.image}
                alt={story.imageCaption || story.title}
                className="w-full h-full object-cover"
              />
            </div>
            {story.imageCaption && (
              <figcaption className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted border-t border-main bg-card">
                {story.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="max-w-2xl">
          {story.body.map((paragraph, idx) => (
            <p
              key={idx}
              className={`text-stone/85 text-base sm:text-lg leading-[1.85] ${
                idx > 0 ? 'mt-6' : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <section className="max-w-2xl mt-14 md:mt-16">
          <h2 className="eyebrow mb-6">Documented facts</h2>
          <ul className="border-y border-main divide-y divide-main">
            {story.facts.map((fact, idx) => (
              <li key={idx} className="py-3.5 flex gap-4">
                <span className="text-lavender shrink-0" aria-hidden="true">·</span>
                <span className="text-stone text-[15px] leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="max-w-2xl mt-12 md:mt-14">
          <h2 className="eyebrow mb-4">Source &amp; context</h2>
          <p className="font-display text-ink text-lg leading-relaxed">
            {story.source}
            {story.sourceUrl && (
              <>
                {' '}
                <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="text-link link-underline">
                  View source
                  <span className="arrow" aria-hidden="true">→</span>
                </a>
              </>
            )}
          </p>
          <p className="text-muted text-sm leading-relaxed mt-3">
            Presented on the basis of documented records only. No details beyond the verified facts
            above have been added.
          </p>
        </section>

        {related.length > 0 && (
          <section className="border-t border-main mt-16 md:mt-20 pt-10">
            <h2 className="eyebrow mb-8">More from the chronicles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {related.map((storyItem) => (
                <article key={storyItem.id} className="border-t border-main pt-6">
                  {storyItem.image ? (
                    <div className="media-frame mb-5">
                      <div className="aspect-[16/10] bg-section-alt overflow-hidden">
                        <img
                          src={storyItem.image}
                          alt={storyItem.imageCaption || storyItem.title}
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
                    {storyItem.category} &middot; {storyItem.year}
                  </p>
                  <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3">
                    <Link to={`/stories/${storyItem.id}`} className="hover:text-lavender transition-colors">
                      {storyItem.title}
                    </Link>
                  </h3>
                  <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-3 mb-4">
                    {storyItem.excerpt}
                  </p>
                  <Link to={`/stories/${storyItem.id}`} className="text-link">
                    Read story
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}