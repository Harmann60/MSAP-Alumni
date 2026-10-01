import { Link, Navigate, useParams } from 'react-router-dom';
import { getNewsBySlug, getRelatedNews } from '../data/newsData';
import NewsCard from '../components/NewsCard';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const item = getNewsBySlug(slug);

  if (!item) {
    return <Navigate to="/news" replace />;
  }

  const related = getRelatedNews(item);

  return (
    <div className="bg-page min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-20 md:pt-20 md:pb-28">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted hover:text-lavender transition-colors mb-10"
        >
          <span aria-hidden="true">←</span>
          Back to news
        </Link>

        <header className="max-w-3xl">
          <p className="eyebrow mb-4">
            {item.category} &middot; {item.dateDisplay}
          </p>
          <h1 className="display-lg text-4xl md:text-5xl">{item.title}</h1>
          {item.location && (
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-lavender">
              {item.location}
            </p>
          )}
        </header>

        <p className="font-display text-ink text-xl md:text-2xl leading-relaxed max-w-2xl mt-8 mb-10">
          {item.excerpt}
        </p>

        {item.coverImage && (
          <figure className="media-frame mb-12 max-w-3xl">
            <div className="aspect-[16/10] bg-section-alt overflow-hidden">
              <img
                src={item.coverImage}
                alt={item.imageCaption || item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.imageCaption && (
              <figcaption className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted border-t border-main bg-card">
                {item.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="max-w-2xl">
          {item.content.map((paragraph, idx) => (
            <p
              key={idx}
              className={`text-stone/85 text-base sm:text-lg leading-[1.85] ${idx > 0 ? 'mt-6' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {item.galleryImages.length > 0 && (
          <section className="max-w-3xl mt-14 md:mt-16">
            <h2 className="eyebrow mb-6">Event photographs</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {item.galleryImages.map((photo, idx) => (
                <figure key={idx} className="media-frame">
                  <div className="aspect-[16/10] bg-section-alt overflow-hidden">
                    <img src={photo.src} alt={photo.caption || item.title} className="w-full h-full object-cover" />
                  </div>
                  {photo.caption && (
                    <figcaption className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted border-t border-main bg-card">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-2xl mt-14 md:mt-16">
          <h2 className="eyebrow mb-4">Source</h2>
          <p className="text-stone text-[15px] leading-relaxed">
            {item.sourceType}: {item.source}{' '}
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-link link-underline"
            >
              View original post
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </p>
          {item.supportingSources && item.supportingSources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted mb-3">
                Additional coverage
              </h3>
              <ul className="space-y-2">
                {item.supportingSources.map((src) => (
                  <li key={src.url}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-link link-underline text-[15px]"
                    >
                      {src.name}
                      <span className="arrow" aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-muted text-sm leading-relaxed mt-4">
            Only details documented on the official page are included. No additional information has
            been added.
          </p>
        </section>

        {related.length > 0 && (
          <section className="border-t border-main mt-16 md:mt-20 pt-10">
            <h2 className="eyebrow mb-8">Related news</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {related.map((relatedItem) => (
                <NewsCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}