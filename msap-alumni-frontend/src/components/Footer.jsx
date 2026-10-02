import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'About us', to: '/about' },
  { label: 'News & events', to: '/news' },
  { label: 'Photo gallery', to: '/gallery' },
];

const ASSOCIATION_LINKS = [
  { label: 'History & heritage', to: '/about' },
  { label: 'Register for verification', to: '/register' },
  { label: 'Alumni sign in', to: '/login' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t-[3px] border-lavender">
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Association of MSAP Alumni, Manipur logo"
                className="w-11 h-11 object-contain"
              />
              <span>
                <span className="block font-display text-ink text-xl font-bold leading-snug">
                  Association of MSAP Alumni, Manipur
                </span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-lavender mt-0.5">
                  Est. 2024
                </span>
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-stone max-w-sm mb-5">
              The Association of MSAP Alumni, Manipur connects generations of Manipuris who lived,
              learned, and grew in Pune — carrying forward a student community first formed in 1973.
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Society Reg. No. 915/M/SR/2025
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-lavender mb-5">
              Quick links
            </h3>
            <ul className="space-y-3.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[15px] text-stone hover:text-lavender transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Association */}
          <nav aria-label="Association" className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-lavender mb-5">
              Association
            </h3>
            <ul className="space-y-3.5">
              {ASSOCIATION_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[15px] text-stone hover:text-lavender transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-5 text-[15px] font-semibold text-muted">
              <a
                href="https://www.facebook.com/share/1Jco7CPBqJ/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lavender transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/association-of-msap-alumni-manipur"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lavender transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-lavender mb-5">
              Contact
            </h3>
            <ul className="space-y-3.5 text-[15px] text-stone">
              <li>
                <a
                  href="mailto:alumni.msap1973@gmail.com"
                  className="hover:text-lavender transition-colors"
                >
                  alumni.msap1973@gmail.com
                </a>
              </li>
              <li className="leading-relaxed">
                Registered headquarters:
                <br />
                Sagolband Moirang Leirak,
                <br />
                Imphal West, 795001, Manipur
              </li>
              <li className="leading-relaxed">
                Pune liaison office:
                <br />
                Orange County II, Baner Pashan Link Road, Pune 411 021
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-main bg-page">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <span>&copy; {year} Association of MSAP Alumni, Manipur. All rights reserved.</span>
          <span className="flex items-center gap-6">
            <span className="cursor-default hover:text-lavender transition-colors">Privacy</span>
            <span className="cursor-default hover:text-lavender transition-colors">Terms</span>
          </span>
        </div>
      </div>
    </footer>
  );
}