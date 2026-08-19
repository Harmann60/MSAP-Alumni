import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: 'Gallery',
    to: '/#gallery',
  },
  {
    label: 'Events',
    children: [
      { heading: 'Events', links: [
        { label: 'All Events', to: '/events' },
        { label: 'Annual Meet', to: '/events' },
        { label: 'Cultural Events', to: '/events' },
        { label: 'Career Events', to: '/events' },
      ]},
      { heading: 'Past Events', links: [
        { label: '2025 Highlights', to: '/events' },
        { label: 'Golden Jubilee', to: '/events' },
      ]},
    ],
  },
  {
    label: 'Stories',
    children: [
      { heading: 'Stories', links: [
        { label: 'All Stories', to: '/stories' },
        { label: 'Alumni Spotlight', to: '/stories' },
        { label: 'Class Notes', to: '/stories' },
      ]},
      { heading: 'Resources', links: [
        { label: 'Newsletters', to: '/stories' },
        { label: 'Learning', to: '/stories' },
      ]},
    ],
  },
  {
    label: 'Community',
    children: [
      { heading: 'Groups', links: [
        { label: 'All Groups', to: '/community' },
        { label: 'Pune Chapter', to: '/community' },
        { label: 'Imphal Chapter', to: '/community' },
      ]},
      { heading: 'People', links: [
        { label: 'Young Alumni', to: '/community' },
        { label: 'Professional Networks', to: '/community' },
      ]},
    ],
  },
  {
    label: 'About',
    children: [
      { heading: 'About', links: [
        { label: 'Our History', to: '/about' },
        { label: 'Governing Body', to: '/about' },
        { label: 'Contact', to: '/about' },
      ]},
      { heading: 'Trust', links: [
        { label: 'Financial Transparency', to: '/accounts' },
        { label: 'Society Registration', to: '/about' },
      ]},
    ],
  },
];

export default function Navbar() {
  const [activeMega, setActiveMega] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const timeoutRef = useRef(null);

  const prevPathname = useRef(location.pathname);
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      setMobileOpen(false);
      setMobileExpanded(null);
      setActiveMega(null);
      prevPathname.current = location.pathname;
    }
  }, [location.pathname]);

  const handleMouseEnter = (idx) => {
    clearTimeout(timeoutRef.current);
    setActiveMega(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMega(null), 120);
  };

  return (
    <>
      <nav className="bg-ink text-parchment sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src="/logo.png" alt="MSAP Alumni" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <span className="font-display text-parchment text-base leading-none block">MSAP Alumni</span>
                <span className="text-muted text-[10px] tracking-wider uppercase">Est. 1973</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0 h-full">
              {NAV_ITEMS.map((item, idx) => {
                if (item.to) {
                  return (
                    <Link
                      key={idx}
                      to={item.to}
                      className="text-[13px] font-medium px-3.5 py-1.5 transition-colors text-muted hover:text-parchment"
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter(idx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`text-[13px] font-medium px-3.5 py-1.5 transition-colors flex items-center gap-1 ${
                        activeMega === idx
                          ? 'text-parchment'
                          : 'text-muted hover:text-parchment'
                      }`}
                    >
                      {item.label}
                      <svg className={`w-3 h-3 transition-transform ${activeMega === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeMega === idx && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-ink-light border border-ink-lighter shadow-2xl z-50">
                        <div className="grid grid-cols-2 gap-0 p-6">
                          {item.children.map((group, gi) => (
                            <div key={gi} className={gi > 0 ? 'pl-6 border-l border-ink-lighter' : ''}>
                              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2.5">{group.heading}</div>
                              <ul className="space-y-1">
                                {group.links.map((link, li) => (
                                  <li key={li}>
                                    <Link
                                      to={link.to}
                                      className="text-sm text-parchment/70 hover:text-parchment block py-1 transition-colors"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
              <Link
                to="/register"
                className="text-[13px] font-semibold text-parchment border border-parchment/20 px-4 py-1.5 hover:bg-parchment hover:text-ink transition-colors"
              >
                Register
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-parchment p-1"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-ink-light border-t border-ink-lighter max-h-[70vh] overflow-y-auto">
            <div className="px-5 py-4 space-y-1">
              {NAV_ITEMS.map((item, idx) => {
                if (item.to) {
                  return (
                    <Link
                      key={idx}
                      to={item.to}
                      className="block text-sm font-medium text-parchment/80 py-2.5 hover:text-parchment transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <div key={idx}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-sm font-medium text-parchment/80 py-2.5 hover:text-parchment transition-colors"
                    >
                      {item.label}
                      <svg className={`w-4 h-4 transition-transform ${mobileExpanded === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === idx && (
                      <div className="pl-3 pb-3 space-y-2">
                        {item.children.map((group, gi) => (
                          <div key={gi}>
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">{group.heading}</div>
                            {group.links.map((link, li) => (
                              <Link
                                key={li}
                                to={link.to}
                                className="block text-sm text-parchment/60 hover:text-parchment py-1 transition-colors"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-ink-lighter">
                <Link
                  to="/register"
                  className="block w-full text-center text-sm font-semibold text-parchment border border-parchment/20 py-2.5 hover:bg-parchment hover:text-ink transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
