import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import homeImage from '../assets/homepage.png';
import reunionImage from '../assets/News/1st Reunion Meet — Manipur University, 2025.png';
import agbmImage from '../assets/News/Annual Body Meeting.jpeg';
import treeImage from '../assets/News/Tree Plantation Drive 1.1 — Taobungkhok.jpg';
import newYearImage from '../assets/News/new year.jpeg';

const STATS = [
  { value: '50+', label: 'Years of legacy' },
  { value: '2,000+', label: 'Alumni connected' },
  { value: 'Pune + global', label: 'Chapter network' },
];

const FEATURED_HERO_SLIDES = [
  {
    image: homeImage,
    caption: 'The 50th Golden Jubilee reunion, Symbiosis Ishanya Auditorium, Pune.',
    year: '2024',
    tag: 'Golden Jubilee',
  },
  {
    image: reunionImage,
    caption: 'Historic 1st Reunion of MSAP Alumni at Manipur University Centenary Hall.',
    year: '2025',
    tag: '1st State Reunion',
  },
  {
    image: agbmImage,
    caption: '1st Annual General Body Meeting and Executive Council election.',
    year: '2026',
    tag: 'General Body',
  },
  {
    image: treeImage,
    caption: 'Tree Plantation Drive campaign launch across seven locations in Manipur.',
    year: '2026',
    tag: 'Community Drive',
  },
  {
    image: newYearImage,
    caption: 'Annual New Year Alumni Get-Together celebration with Pune alumni families.',
    year: '2026',
    tag: 'New Year Meet',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % FEATURED_HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + FEATURED_HERO_SLIDES.length) % FEATURED_HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const activeSlide = FEATURED_HERO_SLIDES[currentSlide];

  return (
    <section className="bg-page">
      <div className="max-w-[90rem] mx-auto px-5 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Editorial copy */}
          <div className="lg:col-span-6">
            <div className="flex items-baseline justify-between gap-4 border-t border-main pt-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender">
                Association of MSAP Alumni, Manipur
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Est. 2024
              </p>
            </div>

            <h1 className="display-xl text-[clamp(2.4rem,5vw,4.1rem)] mb-7">
              For fifty years, Manipuri students came to Pune to build their futures.
              <span className="block text-lavender italic font-semibold mt-3">
                This is where we stay connected.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone leading-relaxed mb-10 max-w-xl">
              The Association of MSAP Alumni, Manipur unites generations of Manipuris who lived,
              learned, and grew in Pune — building on a student community first formed in 1973.
              Register to reconnect with your batchmates and mentors.
            </p>

            <div className="flex flex-wrap items-center gap-7">
              <Link
                to="/membership"
                className="bg-lavender hover:bg-lavender-dark text-white text-base md:text-[17px] font-bold px-8 py-4 rounded-sm transition-colors"
              >
                Register for verification
              </Link>
              <Link
                to="/membership"
                className="text-link link-underline text-base font-semibold"
              >
                Membership & Perks
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

          {/* Interactive Featured Image Carousel Showcase */}
          <div
            className="lg:col-span-6 lg:mt-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative group">
              <figure className="media-frame">
                <div className="aspect-[4/3] sm:aspect-[16/11] bg-section-alt overflow-hidden relative">
                  {FEATURED_HERO_SLIDES.map((slide, idx) => (
                    <img
                      key={idx}
                      src={slide.image}
                      alt={slide.caption}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                        idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                      }`}
                    />
                  ))}

                  {/* Top Floating Tag & Slide Counter */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-400/30">
                      ★ {activeSlide.tag}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                    {currentSlide + 1} / {FEATURED_HERO_SLIDES.length}
                  </div>

                  {/* Previous / Next Controls */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); prevSlide(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-xs cursor-pointer shadow-md"
                    aria-label="Previous featured memory"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); nextSlide(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-xs cursor-pointer shadow-md"
                    aria-label="Next featured memory"
                  >
                    ›
                  </button>

                  {/* Bottom Thumbnail Bar Indicators */}
                  <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-2">
                    {FEATURED_HERO_SLIDES.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === currentSlide ? 'w-7 bg-amber-400 shadow-sm' : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Jump to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </figure>

              <figcaption className="flex items-baseline justify-between gap-4 mt-3 text-sm text-muted">
                <span className="font-medium text-stone/90">{activeSlide.caption}</span>
                <span className="shrink-0 uppercase tracking-widest font-bold text-lavender bg-lavender/10 px-2.5 py-0.5 rounded-xs text-xs">
                  {activeSlide.year}
                </span>
              </figcaption>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}