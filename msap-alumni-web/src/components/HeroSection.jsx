import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative bg-page text-ink overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-20 md:pb-14">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 animate-heroIn">
            {/* Golden Jubilee & Heritage Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-card border-1.5 border-lavender/35 text-lavender-dark text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lavender opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lavender" />
              </span>
              <span>Est. 1973 &middot; Pune, Maharashtra &middot; 50 Years</span>
            </div>

            <h1 className="font-display text-ink text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] mb-6 font-semibold">
              For 50 years, Manipuri students came to Pune.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-dark via-lavender to-lavender-light italic font-medium">
                This is where we stay connected.
              </span>
            </h1>

            <p className="text-stone text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
              The Association of MSAP Alumni connects generations of Manipuris who lived, learned, and grew in Pune — from the pioneering 1973 PMSA days to present. Register to reconnect with your batchmates.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2.5 bg-lavender hover:bg-lavender-dark text-white font-bold px-8 py-4 rounded-xl shadow-[0_8px_25px_rgba(78,45,146,0.35)] transition-all text-base hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Register for Verification</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-card hover:bg-card-hover border-2 border-lavender/30 hover:border-lavender text-stone hover:text-ink font-bold px-7 py-4 rounded-xl transition-all text-base hover:-translate-y-0.5 shadow-sm"
              >
                <span>Our Heritage</span>
              </Link>
            </div>

            {/* High-fidelity stats grid with dark lavender highlights */}
            <div className="mt-12 pt-8 border-t border-lavender/25 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              <div className="bg-card p-4 rounded-2xl border-1.5 border-lavender/25 hover:border-lavender/50 shadow-[0_4px_16px_rgba(58,27,115,0.06)] transition-all">
                <div className="font-display text-2xl sm:text-3xl font-bold text-ink">50+</div>
                <div className="text-[11px] sm:text-xs text-muted font-bold uppercase tracking-wider mt-0.5">Years Legacy</div>
              </div>
              <div className="bg-card p-4 rounded-2xl border-1.5 border-lavender/25 hover:border-lavender/50 shadow-[0_4px_16px_rgba(58,27,115,0.06)] transition-all">
                <div className="font-display text-2xl sm:text-3xl font-bold text-lavender-dark">2,000+</div>
                <div className="text-[11px] sm:text-xs text-muted font-bold uppercase tracking-wider mt-0.5">Alumni Global</div>
              </div>
              <div className="bg-card p-4 rounded-2xl border-1.5 border-lavender/25 hover:border-lavender/50 shadow-[0_4px_16px_rgba(58,27,115,0.06)] transition-all">
                <div className="font-display text-2xl sm:text-3xl font-bold text-ink">Annual</div>
                <div className="text-[11px] sm:text-xs text-muted font-bold uppercase tracking-wider mt-0.5">Meets & Events</div>
              </div>
            </div>
          </div>

          {/* Right: Media showcase card with dark lavender highlight */}
          <div className="lg:col-span-5 animate-heroInDelay">
            <div className="relative rounded-3xl p-2.5 bg-card border-2 border-lavender/35 shadow-[0_20px_50px_-10px_rgba(58,27,115,0.22)] hover:border-lavender/60 transition-all">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-ink shadow-inner group">
                <video
                  autoPlay muted loop playsInline preload="auto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  poster="/hero.png"
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                {/* Floating badge top right */}
                <div className="absolute top-4 right-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-gold-soft border border-gold/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    Golden Jubilee
                  </span>
                </div>

                {/* Bottom title info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase drop-shadow-md block">
                      50th Golden Jubilee Reunion
                    </span>
                    <span className="text-[11px] text-white/80 font-medium">Symbiosis Ishanya Auditorium &middot; Pune</span>
                  </div>
                  <span className="text-[11px] bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white font-semibold">
                    Watch Reel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
