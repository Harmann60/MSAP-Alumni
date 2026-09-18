import AlbumCard from './AlbumCard';

export default function AlbumGrid({ albums, onViewAlbum }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onView={onViewAlbum} />
      ))}
    </div>
  );
}
