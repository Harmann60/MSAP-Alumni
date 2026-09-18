import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-section-alt border-t border-main text-stone">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 text-sm">
          {/* Brand & Address */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-3 group">
              <img
                src="/logo.png"
                alt="MSAP Alumni Official Logo"
                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="font-display text-ink font-bold text-xl group-hover:text-lavender transition-colors">
                MSAP Alumni
              </span>
            </Link>
            <p className="text-stone/90 text-xs leading-relaxed max-w-sm mb-4">
              Connecting generations of Manipuri students who lived and learned in Pune since 1973. A registered non-profit alumni association.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-card border border-main text-[11px] text-stone font-semibold">
              Society Reg. No. 915/M/SR/2025
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <div className="text-ink font-bold text-xs uppercase tracking-wider mb-4">
              Discover
            </div>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-stone/80 hover:text-lavender transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-stone/80 hover:text-lavender transition-colors">Reunions & Events</Link></li>
              <li><Link to="/stories" className="text-stone/80 hover:text-lavender transition-colors">Alumni Chronicles</Link></li>
              <li><Link to="/community" className="text-stone/80 hover:text-lavender transition-colors">Regional Chapters</Link></li>
              <li><Link to="/gallery" className="text-stone/80 hover:text-lavender transition-colors">Photo Gallery</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-ink font-bold text-xs uppercase tracking-wider mb-4">
              Association
            </div>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-stone/80 hover:text-lavender transition-colors">Our 50-Year History</Link></li>
              <li><Link to="/accounts" className="text-stone/80 hover:text-lavender transition-colors">Financial Transparency</Link></li>
              <li><Link to="/register" className="text-stone/80 hover:text-lavender transition-colors">Register for Verification</Link></li>
              <li><Link to="/login" className="text-stone/80 hover:text-lavender transition-colors">Alumni Portal Sign In</Link></li>
              <li><Link to="/admin/login" className="text-stone/80 hover:text-lavender transition-colors">Administrator Access</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-span-2 md:col-span-3">
            <div className="text-ink font-bold text-xs uppercase tracking-wider mb-4">
              Connect With Us
            </div>
            <a
              href="mailto:alumni.msap1973@gmail.com"
              className="text-lavender hover:underline block mb-3 font-semibold text-xs flex items-center gap-1.5"
            >
              alumni.msap1973@gmail.com
            </a>
            <p className="text-stone/75 text-[11px] leading-relaxed mb-4">
              Sagolband Moirang Leirak, Imphal West, 795001 &middot; Pune Chapter Office, Maharashtra
            </p>
            <div className="flex gap-2">
              {['Facebook', 'LinkedIn', 'Instagram'].map((network) => (
                <span
                  key={network}
                  className="text-[11px] font-semibold text-stone/80 bg-card border border-main px-2.5 py-1 rounded-md"
                >
                  {network}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-main bg-section-alt/80">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[12px] text-stone/80 font-medium">
          <span>&copy; {year} Association of MSAP Alumni. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link to="/accounts" className="hover:text-lavender transition-colors">Audit & Transparency</Link>
            <Link to="/admin/login" className="hover:text-lavender transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
