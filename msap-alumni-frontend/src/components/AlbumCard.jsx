export default function AlbumCard({ album, onView }) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onView(album)}
        className="block w-full text-left cursor-pointer focus-visible:outline-offset-4"
        aria-label={`Open album: ${album.title}`}
      >
        <div className="media-frame mb-4">
          <div className="aspect-[16/10] overflow-hidden bg-section-alt">
            <img
              src={album.coverImage}
              alt={album.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <h3 className="font-display text-ink text-xl font-bold leading-snug mb-1.5 group-hover:text-lavender transition-colors">
          {album.title}
        </h3>

        <p className="text-[15px] text-muted">
          {album.eventDate} &middot; {album.photos.length} photo{album.photos.length === 1 ? '' : 's'}
        </p>

        <span className="text-link mt-2 inline-flex">
          View album
          <span className="arrow" aria-hidden="true">→</span>
        </span>
      </button>
    </article>
  );
}