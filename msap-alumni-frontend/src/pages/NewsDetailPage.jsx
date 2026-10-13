/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNewsBySlug, getRelatedNews, getAllNews, resolveNewsImage } from '../data/newsData';
import { fetchStories } from '../services/dataService';
import NewsCard from '../components/NewsCard';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const staticItem = getNewsBySlug(slug);
  const [item, setItem] = useState(staticItem);
  const [loading, setLoading] = useState(!staticItem);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);

  useEffect(() => {
    if (!staticItem) {
      setLoading(true);
      fetchStories()
        .then((data) => {
          if (Array.isArray(data)) {
            const found = data.find(
              (s) =>
                s.id === slug ||
                s.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
            );
            if (found) {
              const staticMatch = getAllNews().find(
                (item) =>
                  item.title.trim().toLowerCase() === found.title.trim().toLowerCase() ||
                  item.id === found.id ||
                  item.slug === slug
              );
              const resolvedImage =
                resolveNewsImage(found.image_url) ||
                staticMatch?.coverImage ||
                found.image_url;

              setItem({
                ...(staticMatch || {}),
                id: found.id,
                slug: staticMatch?.slug || found.id,
                title: found.title,
                category: found.category || staticMatch?.category || 'Spotlight',
                dateDisplay: found.published_date || staticMatch?.dateDisplay || 'Recent',
                cardLabel: `${found.published_date || 'Recent'} · ${found.category || 'Association'}`,
                coverImage: resolvedImage,
                excerpt: found.excerpt || staticMatch?.excerpt,
                content:
                  typeof found.content === 'string'
                    ? found.content.split('\n\n')
                    : found.content || staticMatch?.content || [],
                isFeatured: Boolean(found.is_featured),
                source: found.source || staticMatch?.source,
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

  const user = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem('msap_admin_user') || sessionStorage.getItem('msap_alumni_user')
      );
    } catch {
      return null;
    }
  })();
  const canEdit = Boolean(
    user && ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role?.toUpperCase())
  );

  const related = (getRelatedNews(item) || getAllNews().slice(0, 3)).filter(
    (r) => r && r.id !== item.id
  );

  // Extract any gallery photos embedded in content
  const rawContent = item.content;
  const initialGallery = Array.isArray(item.galleryImages) ? item.galleryImages : [];

  let contentString = Array.isArray(rawContent)
    ? rawContent.join('\n\n')
    : typeof rawContent === 'string'
    ? rawContent
    : '';

  let extractedGallery = [];
  if (contentString) {
    const galleryMatch = contentString.match(/<!--\s*GALLERY_PHOTOS:\s*(\[.*?\])\s*-->/s);
    if (galleryMatch) {
      try {
        const parsed = JSON.parse(galleryMatch[1]);
        if (Array.isArray(parsed)) {
          extractedGallery = parsed.map((p) => ({
            src: resolveNewsImage(p.url || p.src) || p.url || p.src,
            caption: p.caption || '',
          }));
        }
      } catch (e) {
        console.warn('Failed parsing embedded gallery photos:', e);
      }
      contentString = contentString.replace(/<!--\s*GALLERY_PHOTOS:\s*(\[.*?\])\s*-->/gs, '').trim();
    }
  }

  const contentParagraphs = contentString
    ? contentString.split('\n\n').filter(Boolean)
    : [item.excerpt || 'No additional content provided.'];

  const galleryImages = [...initialGallery, ...extractedGallery];
  const supportingSources = Array.isArray(item.supportingSources) ? item.supportingSources : [];

  const lastEditedDate = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : item.dateDisplay || 'Archival Record';
  const editorName = item.editorName || 'MSAP Editorial Board';
  const facebookUrl = item.sourceUrl || 'https://www.facebook.com/share/1Jco7CPBqJ/?mibextid=wwXIfr';

  return (
    <div className="bg-page min-h-[90vh]">
      <div className="max-w-[90rem] mx-auto px-5 pt-12 pb-20 md:pt-16 md:pb-28">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted hover:text-lavender transition-colors mb-8"
        >
          <span aria-hidden="true">←</span>
          Back to news archive
        </Link>

        {/* 2-Column Balanced Editorial Layout — No empty RHS */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Article Content (8 cols) */}
          <div className="lg:col-span-8">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-lavender bg-lavender/10 px-3 py-1 rounded-xs">
                  {item.category || 'Spotlight'}
                </span>
                <span className="text-xs font-semibold text-muted">
                  &middot; {item.dateDisplay || 'Recent'}
                </span>
              </div>
              <h1 className="display-lg text-3xl sm:text-4xl md:text-5xl leading-tight text-ink font-bold">
                {item.title}
              </h1>
              {item.location && (
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-lavender flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{item.location}</span>
                </p>
              )}
            </header>

            {item.excerpt && (
              <p className="font-display text-ink text-xl md:text-2xl leading-relaxed mb-8 border-l-3 border-lavender pl-5 py-1 bg-card/40">
                {item.excerpt}
              </p>
            )}

            {item.coverImage && (
              <figure
                className="media-frame mb-10 group cursor-pointer"
                onClick={() => setSelectedLightboxImage({ src: item.coverImage, caption: item.imageCaption || item.title })}
                title="Click to view full image"
              >
                <div className="aspect-[16/10] bg-section-alt overflow-hidden rounded-xs relative">
                  <img
                    src={item.coverImage}
                    alt={item.imageCaption || item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-stone-900/80 text-white text-xs px-3.5 py-1.5 rounded-full font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                      <span>🔍 Expand Photo</span>
                    </span>
                  </div>
                </div>
                {item.imageCaption && (
                  <figcaption className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted border-t border-main bg-card">
                    {item.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="space-y-6 text-stone/90 text-base sm:text-lg leading-[1.85]">
              {contentParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {galleryImages.length > 0 && (
              <section className="mt-14 md:mt-16 pt-10 border-t border-main">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="eyebrow mb-1">Documented Photographs</h2>
                    <p className="text-xs text-muted font-semibold">
                      {galleryImages.length} additional archival photo{galleryImages.length === 1 ? '' : 's'} attached to this record
                    </p>
                  </div>
                  <span className="text-xs font-mono text-lavender font-bold bg-lavender/10 px-2.5 py-1 rounded-xs">
                    {galleryImages.length} photo{galleryImages.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {galleryImages.map((photo, idx) => (
                    <figure
                      key={idx}
                      className="media-frame group cursor-pointer"
                      onClick={() => setSelectedLightboxImage({ src: photo.src || photo.url || photo, caption: photo.caption || item.title })}
                      title="Click to view full photo"
                    >
                      <div className="aspect-[16/10] bg-section-alt overflow-hidden rounded-xs relative">
                        <img
                          src={photo.src || photo.url || photo}
                          alt={photo.caption || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-stone-900/80 text-white text-xs px-3.5 py-1.5 rounded-full font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                            <span>🔍 Expand</span>
                          </span>
                        </div>
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

            {/* Sources & Transparency Note */}
            <section className="mt-14 pt-8 border-t border-main/60">
              <h2 className="eyebrow mb-3">Verification &amp; Source note</h2>
              <p className="text-stone text-[14px] leading-relaxed">
                {item.sourceType ? `${item.sourceType}: ` : ''}{item.source || 'Official MSAP Alumni Facebook archive'}.
                All information reflects official records of the Association of MSAP Alumni, Manipur.
              </p>

              {supportingSources.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted mb-2">
                    Additional coverage
                  </h3>
                  <ul className="space-y-1.5">
                    {supportingSources.map((src) => (
                      <li key={src.url || src.name}>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-link text-sm font-semibold"
                        >
                          {src.name} →
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Sticky RHS Sidebar (4 cols) — Eliminates blank space & provides official actions */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            {/* 1. Official Facebook Post Card */}
            <div className="bg-card border border-main p-6 rounded-sm shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  f
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Official Facebook Post</h3>
                  <p className="text-[11px] text-muted">Community updates &amp; photos</p>
                </div>
              </div>

              <p className="text-xs text-stone leading-relaxed mb-4">
                This activity was published on the official Association of MSAP Alumni, Manipur Facebook page.
                View community comments, member reactions, and high-resolution photo albums.
              </p>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold py-2.5 px-4 rounded-xs transition-colors shadow-xs"
              >
                <span>View on Facebook</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            {/* 2. Editorial Metadata & Last Edited Box */}
            <div className="bg-section-alt border border-main p-6 rounded-sm space-y-3.5 text-xs">
              <div className="border-b border-main/60 pb-3">
                <p className="eyebrow text-[10px] mb-1">Archival record</p>
                <h4 className="font-display font-bold text-ink text-base">Editorial Details</h4>
              </div>

              <div className="flex justify-between py-1 border-b border-main/40">
                <span className="text-muted">Published Date:</span>
                <span className="font-semibold text-ink">{item.dateDisplay || 'Documented'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-main/40">
                <span className="text-muted">Last Edited:</span>
                <span className="font-semibold text-ink">{lastEditedDate}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-main/40">
                <span className="text-muted">Edited By:</span>
                <span className="font-semibold text-lavender">{editorName}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-muted">Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-xs">
                  Verified Archive
                </span>
              </div>

              {/* RBAC Edit Quick Button for Content Managers */}
              {canEdit && (
                <div className="pt-2">
                  <Link
                    to="/admin"
                    className="w-full block text-center py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xs border border-amber-300 transition-colors"
                  >
                    ✏️ Edit Article in Admin Portal →
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Membership & Verification Callout */}
            <div className="bg-card border border-main p-6 rounded-sm space-y-3">
              <span className="eyebrow text-[10px]">Alumni Community</span>
              <h4 className="font-display font-bold text-ink text-lg leading-snug">
                Were you a student in Pune?
              </h4>
              <p className="text-xs text-stone leading-relaxed">
                Join our verified alumni network to reconnect with batchmates, participate in community programmes, and receive reunion invitations.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 bg-lavender hover:bg-lavender-dark text-white font-bold text-xs rounded-xs transition-colors shadow-2xs"
                >
                  Register for verification →
                </Link>
                <Link
                  to="/membership"
                  className="w-full text-center py-2 bg-white hover:bg-page text-ink border border-main font-bold text-xs rounded-xs transition-colors"
                >
                  Membership Perks &amp; Fees
                </Link>
              </div>
            </div>

            {/* 4. Contact Us */}
            <div className="p-4 bg-section-alt border border-main rounded-sm text-center text-xs text-muted">
              <span>Have an article or update to submit?</span>
              <Link to="/contact" className="block font-bold text-lavender hover:underline mt-1">
                Contact Secretariat Desk →
              </Link>
            </div>
          </aside>
        </div>

        {/* Related News Carousel / Grid */}
        {related.length > 0 && (
          <section className="border-t border-main mt-16 md:mt-24 pt-12">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <p className="eyebrow mb-2">More from the archives</p>
                <h2 className="display-lg text-2xl sm:text-3xl">Related documented activities</h2>
              </div>
              <Link to="/news" className="text-xs font-bold text-lavender hover:underline">
                View all activities →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {related.map((relatedItem) => (
                <NewsCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute -top-11 right-0 text-white/80 hover:text-white text-2xl font-bold transition-colors cursor-pointer w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close image modal"
            >
              ✕
            </button>
            <img
              src={selectedLightboxImage.src || selectedLightboxImage.url || selectedLightboxImage}
              alt={selectedLightboxImage.caption || item.title}
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-xs shadow-2xl border border-white/10"
            />
            {selectedLightboxImage.caption && (
              <p className="mt-3.5 text-white/95 text-xs sm:text-sm font-medium text-center bg-stone-900/80 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 max-w-xl">
                {selectedLightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}