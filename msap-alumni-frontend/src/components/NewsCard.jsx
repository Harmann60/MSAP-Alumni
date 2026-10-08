import { Link } from 'react-router-dom';

export default function NewsCard({ item }) {
  return (
    <article className="border-t border-main pt-6">
      {item.coverImage ? (
        <Link to={`/news/${item.slug}`} className="media-frame mb-5 block relative group">
          <div className="aspect-[16/10] bg-section-alt overflow-hidden rounded-xs relative">
            <img
              src={item.coverImage}
              alt={item.imageCaption || item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {item.isFeatured && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[11px] font-black uppercase tracking-wider shadow-lg border border-amber-300/60">
                <span className="text-xs">⭐</span>
                <span>Spotlight</span>
              </div>
            )}
          </div>
        </Link>
      ) : (
        <Link
          to={`/news/${item.slug}`}
          className="mb-5 flex items-center justify-between border-l-3 border-amber-400 pl-4 pr-4 h-24 bg-card hover:bg-section-alt transition-colors"
          aria-label={`Read ${item.title}`}
        >
          <span className="font-display text-lavender italic text-4xl leading-none select-none" aria-hidden="true">
            “
          </span>
          {item.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-600 text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
              ⭐ Spotlight
            </span>
          )}
        </Link>
      )}
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted mb-2">
        {item.cardLabel}
      </p>
      <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 transition-colors">
        <Link to={`/news/${item.slug}`} className="hover:text-lavender transition-colors">
          {item.title}
        </Link>
      </h3>
      {item.location && (
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-lavender/70 mb-2">
          {item.location}
        </p>
      )}
      <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-3 mb-4">{item.excerpt}</p>
      <Link to={`/news/${item.slug}`} className="text-link">
        Read More
        <span className="arrow" aria-hidden="true">→</span>
      </Link>
    </article>
  );
}