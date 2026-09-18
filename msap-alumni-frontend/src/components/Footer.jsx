import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Stories', to: '/stories' },
  { label: 'Chapters', to: '/community' },
  { label: 'Gallery', to: '/gallery' },
];

const ASSOCIATION_LINKS = [
  { label: 'Our 50-year history', to: '/about' },
  { label: 'Financial transparency', to: '/accounts' },
  { label: 'Register for verification', to: '/register' },
  { label: 'Alumni sign in', to: '/login' },
  { label: 'Administrator access', to: '/admin/login' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lavender-deep text-[#E7E1F3]">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Association of MSAP Alumni logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display text-[#FAF8F4] text-xl font-bold">
                MSAP Alumni
              </span>
            </div>
            <p className="text-[#C9BDE6] text-sm leading-relaxed max-w-sm mb-5">
              The Association of MSAP Alumni connects generations of Manipuri students who lived and
              learned in Pune since 1973. A registered, non-profit alumni association.
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#B49FD8]">
              Society Reg. No. 915/M/SR/2025 &middot; Established 1973
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="lg:col-span-2">
            <h3 className="text-[#FAF8F4] text-xs font-bold uppercase tracking-[0.16em] mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#C9BDE6] hover:text-[#FAF8F4] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Association */}
          <nav aria-label="Association" className="lg:col-span-3">
            <h3 className="text-[#FAF8F4] text-xs font-bold uppercase tracking-[0.16em] mb-5">
              Association
            </h3>
            <ul className="space-y-3">
              {ASSOCIATION_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#C9BDE6] hover:text-[#FAF8F4] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-[#FAF8F4] text-xs font-bold uppercase tracking-[0.16em] mb-5">
              Connect
            </h3>
            <ul className="space-y-3 text-sm text-[#C9BDE6]">
              <li>
                <a
                  href="mailto:alumni.msap1973@gmail.com"
                  className="hover:text-[#FAF8F4] transition-colors"
                >
                  alumni.msap1973@gmail.com
                </a>
              </li>
              <li>Sagolband Moirang Leirak,</li>
              <li>Imphal West, 795001, Manipur</li>
              <li className="pt-1">Pune chapter office, Maharashtra</li>
            </ul>
            <div className="flex gap-5 mt-5 text-sm font-semibold text-[#B49FD8]">
              <span>Facebook</span>
              <span>LinkedIn</span>
              <span>Instagram</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3A2A66]">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#A99CCB]">
          <span>&copy; {year} Association of MSAP Alumni. All rights reserved.</span>
          <span className="flex items-center gap-5">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
            <Link to="/accounts" className="hover:text-[#FAF8F4] transition-colors">
              Audit &amp; transparency
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}