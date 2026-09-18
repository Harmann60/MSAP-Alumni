import GallerySection from '../components/GallerySection';

export default function GalleryPage() {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-4 md:pt-24 md:pb-4">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Gallery</h1>
        <p className="text-muted text-sm">Moments captured from our events and gatherings.</p>
      </div>

      <GallerySection showHeading={false} />
    </div>
  );
}
