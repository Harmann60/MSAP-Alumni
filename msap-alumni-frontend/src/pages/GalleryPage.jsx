import GallerySection from '../components/GallerySection';

export default function GalleryPage() {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-5 pt-14 md:pt-20">
        <p className="eyebrow mb-4">Photo archives</p>
        <h1 className="display-lg text-4xl md:text-5xl">Gallery</h1>
        <p className="text-stone text-base mt-3 max-w-xl">
          Moments captured from our events and gatherings.
        </p>
      </div>

      <GallerySection showHeading={false} />
    </div>
  );
}