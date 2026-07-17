import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-forest-950 text-white">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Video/Image placeholder */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Text content */}
          <div className="flex-1 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-forest-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" />
              Est. 1973 · Pune, Maharashtra
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] mb-6">
              Welcome Home,<br />
              <span className="text-forest-300">Pune Manipuris</span>
            </h1>

            <p className="text-forest-200/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              A unified platform bridging alumni from the 1973 PMSA roots to the registered MSAP of today. Reconnect, network, and strengthen the bonds forged in Pune.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to="/register"
                className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-sm"
              >
                Join the Network
              </Link>
              <Link
                to="/about"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all duration-200 text-sm"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
              <div className="text-3xl font-extrabold font-display text-forest-300">50+</div>
              <div className="text-xs text-forest-200/60 uppercase tracking-widest mt-1">Years of Legacy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
              <div className="text-3xl font-extrabold font-display text-gold-400">Pune</div>
              <div className="text-xs text-forest-200/60 uppercase tracking-widest mt-1">Chapter City</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
              <div className="text-3xl font-extrabold font-display text-forest-300">915</div>
              <div className="text-xs text-forest-200/60 uppercase tracking-widest mt-1">Regd. Society No.</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
              <div className="text-3xl font-extrabold font-display text-gold-400">Active</div>
              <div className="text-xs text-forest-200/60 uppercase tracking-widest mt-1">Growing Network</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
