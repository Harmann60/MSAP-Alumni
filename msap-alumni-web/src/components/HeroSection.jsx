import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative bg-ink text-parchment overflow-hidden">
      {/* Video */}
      <div className="absolute inset-0">
        <video
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster="/hero.png"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl animate-heroIn">
          <p className="text-vermilion text-xs font-semibold uppercase tracking-[0.2em] mb-5">
            Est. 1973 &middot; Pune, Maharashtra
          </p>

          <h1 className="font-display text-parchment text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-6">
            For 50 years, Manipuri students came to Pune.
            <br />
            <span className="text-gold">This is where we stay connected.</span>
          </h1>

          <p className="text-parchment/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            The Association of MSAP Alumni brings together every Manipuri who studied in Pune — from the 1973 PMSA days to today. Register to find your people.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="bg-vermilion hover:bg-vermilion-light text-parchment font-semibold px-7 py-3 transition-colors text-sm"
            >
              Register Now
            </Link>
            <Link
              to="/about"
              className="border border-parchment/20 text-parchment/80 hover:text-parchment hover:border-parchment/40 font-medium px-7 py-3 transition-colors text-sm"
            >
              Our History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
