export default function AlbumCard({ album, onView }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-parchment-dark hover:shadow-lg transition-shadow duration-300 group flex flex-col">
      {/* Cover image */}
      <div className="aspect-[16/10] overflow-hidden bg-parchment-dark">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-ink text-base md:text-lg leading-snug mb-3">
          {album.title}
        </h3>

        <div className="h-px bg-parchment-dark mb-3" />

        <div className="space-y-1 text-sm text-muted mb-4 flex-1">
          <p><span className="font-medium text-stone">Event Date:</span> {album.eventDate}</p>
          <p><span className="font-medium text-stone">Updated On:</span> {album.updatedOn}</p>
          <p><span className="font-medium text-stone">Total Photo(s):</span> {album.photos.length}</p>
        </div>

        <button
          onClick={() => onView(album)}
          className="w-full bg-verified hover:bg-verified/90 text-white font-semibold text-sm py-2.5 rounded-full transition-colors"
        >
          View Album
        </button>
      </div>
    </div>
  );
}
