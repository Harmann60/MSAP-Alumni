import { useState } from 'react';
import ALBUMS from '../data/galleryData';
import FeaturedCarousel from './FeaturedCarousel';
import AlbumGrid from './AlbumGrid';
import AlbumViewer from './AlbumViewer';

export default function GallerySection({ showHeading = true }) {
  const [viewerAlbum, setViewerAlbum] = useState(null);

  return (
    <section id="gallery" className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      {showHeading && (
        <div className="text-center mb-10">
          <h2 className="font-display text-ink text-2xl md:text-3xl uppercase tracking-wide">
            Gallery
          </h2>
          <div className="w-16 h-px bg-verified mx-auto mt-4" />
        </div>
      )}

      <FeaturedCarousel albums={ALBUMS} />

      <div className="text-center mt-16 md:mt-20 mb-10">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
          Previous Album(s)
        </h3>
        <div className="w-12 h-px bg-parchment-dark mx-auto mt-3" />
      </div>

      <AlbumGrid albums={ALBUMS} onViewAlbum={setViewerAlbum} />

      {viewerAlbum && (
        <AlbumViewer album={viewerAlbum} onClose={() => setViewerAlbum(null)} />
      )}
    </section>
  );
}
