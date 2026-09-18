import { Link } from 'react-router-dom';

const STATS = [
  { value: '50+', label: 'Years of legacy' },
  { value: '2,000+', label: 'Alumni connected' },
  { value: 'Pune + global', label: 'Chapter network' },
];

export default function HeroSection() {
  return (
    <section className="bg-page">
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Editorial copy */}
          <div className="lg:col-span-6">
            <div className="flex items-baseline justify-between gap-4 border-t border-main pt-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender">
                Association of MSAP Alumni
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Est. 1973
              </p>
            </div>

            <h1 className="display-xl text-[clamp(2.4rem,5vw,4.1rem)] mb-7">
              For fifty years, Manipuri students came to Pune to build their futures.
              <span className="block text-lavender italic font-semibold mt-3">
                This is where we stay connected.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone leading-relaxed mb-10 max-w-xl">
              The Association of MSAP Alumni unites generations of Manipuris who lived, learned,
              and grew in Pune — from the pioneering PMSA days of 1973 to today. Register to
              reconnect with your batchmates, chapters, and mentors.
            </p>

            <div className="flex flex-wrap items-center gap-7">
              <Link
                to="/register"
                className="bg-lavender hover:bg-lavender-dark text-white text-base md:text-[17px] font-bold px-8 py-4 rounded-sm transition-colors"
              >
                Register for verification
              </Link>
              <Link
                to="/about"
                className="text-link link-underline text-base"
              >
                Explore our heritage
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Typographic stats — rules, not cards */}
            <dl className="mt-14 pt-9 border-t border-main grid grid-cols-3 gap-8 max-w-xl">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-l border-main pl-5 first:border-0 first:pl-0">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl sm:text-4xl font-bold text-ink">{stat.value}</dd>
                  <dd className="text-xs sm:text-[13px] text-muted font-semibold uppercase tracking-wider mt-2">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Authentic image-led panel */}
          <div className="lg:col-span-6 lg:mt-14">
            <figure className="media-frame">
              <div className="aspect-[4/3] sm:aspect-[16/11] bg-section-alt overflow-hidden">
                <img
                  src="/hero.png"
                  alt="MSAP alumni gathered at a reunion in Pune"
                  className="w-full h-full object-cover"
                />
              </div>
            </figure>
            <figcaption className="flex items-baseline justify-between gap-4 mt-3 text-sm text-muted">
              <span>The 50th Golden Jubilee reunion, Symbiosis Ishanya Auditorium, Pune.</span>
              <span className="shrink-0 uppercase tracking-widest font-semibold">2024</span>
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}