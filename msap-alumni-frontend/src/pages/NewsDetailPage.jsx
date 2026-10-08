/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNewsBySlug, getRelatedNews, getAllNews } from '../data/newsData';
import { fetchStories } from '../services/dataService';
import NewsCard from '../components/NewsCard';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const staticItem = getNewsBySlug(slug);
  const [item, setItem] = useState(staticItem);
  const [loading, setLoading] = useState(!staticItem);

  useEffect(() => {
    if (!staticItem) {
      setLoading(true);
      fetchStories()
        .then((data) => {
          if (Array.isArray(data)) {
            const found = data.find((s) => s.id === slug || s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
            if (found) {
              setItem({
                id: found.id,
                slug: found.id,
                title: found.title,
                category: found.category || 'Spotlight',
                dateDisplay: found.published_date || 'Recent',
                cardLabel: `${found.published_date || 'Recent'} · ${found.category || 'Association'}`,
                coverImage: found.image_url,
                excerpt: found.excerpt,
                content: typeof found.content === 'string' ? found.content.split('\n\n') : found.content || [],
                isFeatured: Boolean(found.is_featured),
                source: found.source,
              });
            }
          }
        })
        .catch((err) => console.warn('Failed to load story detail:', err.message))
        .finally(() => setLoading(false));
    } else {
      setItem(staticItem);
      setLoading(false);
    }
  }, [slug, staticItem]);

  if (loading) {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <p className="text-stone font-medium">Loading article…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-page min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="display-sm text-2xl font-bold text-ink mb-2">Article Not Found</h2>
        <p className="text-stone text-sm mb-6">The article you are looking for may have been moved or removed.</p>
        <Link to="/news" className="text-link">← Return to News Archive</Link>
      </div>
    );
  }

  const related = (getRelatedNews(item) || getAllNews().slice(0, 3)).filter(
    (r) => r && r.id !== item.id
  );

  const contentParagraphs = Array.isArray(item.content)
    ? item.content
    : typeof item.content === 'string' && item.content.trim()
    ? item.content.split('\n\n').filter(Boolean)
    : [item.excerpt || 'No additional content provided.'];

  const galleryImages = Array.isArray(item.galleryImages) ? item.galleryImages : [];
  const supportingSources = Array.isArray(item.supportingSources) ? item.supportingSources : [];

  return (
    <div className="bg-page min-h-[90vh]">
      <div className="max-w-[90rem] mx-auto px-5 pt-14 pb-20 md:pt-20 md:pb-28">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted hover:text-lavender transition-colors mb-10"
        >
          <span aria-hidden="true">←</span>
          Back to news
        </Link>

        <header className="max-w-3xl">
          <p className="eyebrow mb-4">
            {item.category || 'Spotlight'} &middot; {item.dateDisplay || 'Recent'}
          </p>
          <h1 className="display-lg text-4xl md:text-5xl">{item.title}</h1>
          {item.location && (
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-lavender">
              {item.location}
            </p>
          )}
        </header>

        {item.excerpt && (
          <p className="font-display text-ink text-xl md:text-2xl leading-relaxed max-w-2xl mt-8 mb-10">
            {item.excerpt}
          </p>
        )}

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
          {contentParagraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className={`text-stone/85 text-base sm:text-lg leading-[1.85] ${idx > 0 ? 'mt-6' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {galleryImages.length > 0 && (
          <section className="max-w-3xl mt-14 md:mt-16">
            <h2 className="eyebrow mb-6">Event photographs</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {galleryImages.map((photo, idx) => (
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

        {item.source && (
          <section className="max-w-2xl mt-14 md:mt-16">
            <h2 className="eyebrow mb-4">Source</h2>
            <p className="text-stone text-[15px] leading-relaxed">
              {item.sourceType ? `${item.sourceType}: ` : ''}{item.source}{' '}
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link link-underline"
                >
                  View original post
                  <span className="arrow" aria-hidden="true">→</span>
                </a>
              )}
            </p>
            {supportingSources.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted mb-3">
                  Additional coverage
                </h3>
                <ul className="space-y-2">
                  {supportingSources.map((src) => (
                    <li key={src.url || src.name}>
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
        )}

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