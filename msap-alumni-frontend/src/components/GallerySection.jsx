import { useState } from 'react';
import ALBUMS from '../data/galleryData';
import FeaturedCarousel from './FeaturedCarousel';
import AlbumGrid from './AlbumGrid';
import AlbumViewer from './AlbumViewer';

export default function GallerySection({ showHeading = true }) {
  const [viewerAlbum, setViewerAlbum] = useState(null);

  return (
    <section id="gallery" className="max-w-6xl mx-auto px-5 py-14 md:py-20">
      {showHeading && (
        <div className="mb-12">
          <p className="eyebrow mb-4">Photo archives</p>
          <h2 className="display-lg text-3xl sm:text-4xl">Gallery</h2>
          <p className="text-stone/80 text-base mt-3 max-w-xl">
            Moments captured from our events, reunions, cultural festivals, and gatherings.
          </p>
        </div>
      )}

      <FeaturedCarousel albums={ALBUMS} />

      <div className="my-14 border-t border-main pt-10">
        <p className="eyebrow">All albums</p>
      </div>

      <AlbumGrid albums={ALBUMS} onViewAlbum={setViewerAlbum} />

      {viewerAlbum && (
        <AlbumViewer album={viewerAlbum} onClose={() => setViewerAlbum(null)} />
      )}
    </section>
  );
}