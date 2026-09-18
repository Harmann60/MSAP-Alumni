import { Link } from 'react-router-dom';

const STATS = [
  { value: '50+', label: 'Years of legacy' },
  { value: '2,000+', label: 'Alumni connected' },
  { value: 'Pune & global', label: 'Chapter network' },
];

export default function HeroSection() {
  return (
    <section className="bg-page">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Editorial copy */}
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Association of MSAP Alumni &middot; Est. 1973</p>

            <h1 className="display-xl text-[clamp(2.1rem,4.5vw,3.4rem)] mb-6">
              For fifty years, Manipuri students came to Pune to build their futures.
              <span className="block text-lavender italic font-semibold mt-2">
                This is where we stay connected.
              </span>
            </h1>

            <p className="text-stone text-base sm:text-lg leading-relaxed mb-9 max-w-xl">
              The Association of MSAP Alumni unites generations of Manipuris who lived, learned,
              and grew in Pune — from the pioneering PMSA days of 1973 to today. Register to
              reconnect with your batchmates, chapters, and mentors.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/register"
                className="bg-lavender hover:bg-lavender-dark text-white text-[15px] font-bold px-7 py-3.5 rounded-sm transition-colors"
              >
                Register for verification
              </Link>
              <Link
                to="/about"
                className="text-link link-underline text-[15px]"
              >
                Explore our heritage
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Typographic stats — rules, not cards */}
            <dl className="mt-12 pt-8 border-t border-main grid grid-cols-3 gap-6 max-w-lg">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-l border-main pl-4 first:border-0 first:pl-0">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl sm:text-3xl font-bold text-ink">{stat.value}</dd>
                  <dd className="text-[11px] sm:text-xs text-muted font-semibold uppercase tracking-wider mt-1">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Authentic image-led panel */}
          <div className="lg:col-span-5">
            <figure className="media-frame">
              <div className="aspect-[4/3] bg-section-alt overflow-hidden">
                <img
                  src="/hero.png"
                  alt="MSAP alumni gathered at a reunion in Pune"
                  className="w-full h-full object-cover"
                />
              </div>
            </figure>
            <figcaption className="flex items-baseline justify-between gap-4 mt-3 text-xs text-muted">
              <span>The 50th Golden Jubilee reunion, Symbiosis Ishanya Auditorium, Pune.</span>
              <span className="shrink-0 uppercase tracking-widest font-semibold">2024</span>
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}