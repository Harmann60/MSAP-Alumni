import { Link } from 'react-router-dom';

const DEFAULT_FACEBOOK_URL = 'https://www.facebook.com/share/1Jco7CPBqJ/?mibextid=wwXIfr';

export default function NewsCard({ item }) {
  // Check if current session user has editor/admin privileges (RBAC)
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

  const lastEditedDate = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : item.dateDisplay || 'Archived';
  const editorName = item.editorName || 'MSAP Secretariat';
  const facebookUrl = item.sourceUrl || DEFAULT_FACEBOOK_URL;

  return (
    <article className="border-t border-main pt-6 flex flex-col justify-between h-full group">
      <div>
        {item.coverImage ? (
          <Link to={`/news/${item.slug}`} className="media-frame mb-5 block relative group">
            <div className="aspect-[16/10] bg-section-alt overflow-hidden rounded-xs relative">
              <img
                src={item.coverImage}
                alt={item.imageCaption || item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
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

        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            {item.cardLabel}
          </p>
          {canEdit && (
            <Link
              to="/admin"
              className="text-[11px] font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-2 py-0.5 rounded-xs border border-amber-300 transition-colors"
              title="Edit story in Admin Portal"
            >
              ✏️ Edit
            </Link>
          )}
        </div>

        <h3 className="font-display text-ink text-xl font-bold leading-snug mb-2 transition-colors">
          <Link to={`/news/${item.slug}`} className="hover:text-lavender transition-colors">
            {item.title}
          </Link>
        </h3>

        {item.location && (
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-lavender/70 mb-2">
            {item.location}
          </p>
        )}

        <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-3 mb-3">{item.excerpt}</p>

        {/* Last edited metadata */}
        <p className="text-[11px] text-muted mb-4 flex items-center gap-1.5">
          <span>🕒 Last edited:</span>
          <span className="font-medium text-stone/75">{lastEditedDate}</span>
          <span>·</span>
          <span>by {editorName}</span>
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-main/40 mt-auto">
        <Link to={`/news/${item.slug}`} className="text-link text-sm">
          Read More
          <span className="arrow" aria-hidden="true">→</span>
        </Link>

        {/* Facebook Link */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1877F2] hover:underline bg-[#1877F2]/5 px-2 py-1 rounded-xs"
          title="View official post on Facebook"
        >
          <span>Facebook</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}