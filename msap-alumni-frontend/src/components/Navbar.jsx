import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: 'Events',
    children: [
      {
        heading: 'Gatherings & Meets',
        links: [
          { label: 'All Upcoming Events', to: '/events' },
          { label: 'Annual Flagship Meet', to: '/events' },
          { label: 'Cultural Gatherings', to: '/events' },
          { label: 'Career & Mentorship', to: '/events' },
        ],
      },
      {
        heading: 'Reunion Archives',
        links: [
          { label: 'Golden Jubilee 50th', to: '/events' },
          { label: 'Photo Highlights & Memories', to: '/events' },
        ],
      },
    ],
  },
  {
    label: 'Stories',
    children: [
      {
        heading: 'Voices & Chronicles',
        links: [
          { label: 'All Stories & Articles', to: '/stories' },
          { label: 'Alumni Spotlights', to: '/stories' },
          { label: 'Class Notes & Milestones', to: '/stories' },
        ],
      },
      {
        heading: 'Publications',
        links: [
          { label: 'Annual Newsletters', to: '/stories' },
          { label: 'Student Memories Archive', to: '/stories' },
        ],
      },
    ],
  },
  {
    label: 'Community',
    children: [
      {
        heading: 'Regional Chapters',
        links: [
          { label: 'All Chapters & Networks', to: '/community' },
          { label: 'Pune Flagship Chapter', to: '/community' },
          { label: 'Imphal & Manipur Network', to: '/community' },
          { label: 'Bengaluru Tech Circle', to: '/community' },
        ],
      },
      {
        heading: 'Directory',
        links: [
          { label: 'Young Alumni Network', to: '/community' },
          { label: 'Professional Directory', to: '/community' },
        ],
      },
    ],
  },
  {
    label: 'About',
    children: [
      {
        heading: 'The Association',
        links: [
          { label: 'Our 50-Year History', to: '/about' },
          { label: 'Governing Body & Leadership', to: '/about' },
          { label: 'Contact Us', to: '/about' },
        ],
      },
      {
        heading: 'Trust & Governance',
        links: [
          { label: 'Financial Transparency', to: '/accounts' },
          { label: 'Society Registration', to: '/about' },
        ],
      },
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

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('msap_alumni_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const stored = sessionStorage.getItem('msap_alumni_user');
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener('msap_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('msap_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem('msap_alumni_token');
    sessionStorage.removeItem('msap_alumni_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('msap_auth_change'));
  };

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
    timeoutRef.current = setTimeout(() => setActiveMega(null), 140);
  };

  return (
    <>
      <nav className="bg-card/95 backdrop-blur-md text-ink sticky top-0 z-50 border-b border-main shadow-xs">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center h-18">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <img
                src="/logo.png"
                alt="MSAP Alumni Official Logo"
                className="w-11 h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-display text-ink group-hover:text-lavender transition-colors text-lg font-bold leading-none block">
                  MSAP Alumni
                </span>
                <span className="text-muted text-[10px] tracking-widest uppercase font-semibold block mt-0.5">
                  Est. 1973 &middot; Pune
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-2 h-full">
              {NAV_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`text-[14px] font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeMega === idx
                        ? 'text-lavender bg-section-alt font-bold'
                        : 'text-stone hover:text-lavender hover:bg-page'
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeMega === idx ? 'rotate-180 text-lavender' : 'text-muted'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mega Menu Dropdown */}
                  {activeMega === idx && (
                    <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[520px] bg-card border-2 border-lavender/35 shadow-[0_20px_50px_rgba(58,27,115,0.18)] rounded-3xl overflow-hidden z-50 animate-heroIn">
                      <div className="grid grid-cols-2 gap-0 p-6">
                        {item.children.map((group, gi) => (
                          <div key={gi} className={gi > 0 ? 'pl-6 border-l border-main' : ''}>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-lavender mb-3 flex items-center gap-1.5">
                              {group.heading}
                            </div>
                            <ul className="space-y-1">
                              {group.links.map((link, li) => (
                                <li key={li}>
                                  <Link
                                    to={link.to}
                                    className="group/item flex items-center gap-2.5 text-[13.5px] font-medium text-stone hover:text-lavender p-2 rounded-xl hover:bg-section-alt/70 transition-all"
                                  >
                                    <span className="group-hover/item:translate-x-0.5 transition-transform">
                                      {link.label}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Dropdown bottom footer bar */}
                      <div className="bg-section-alt px-6 py-2.5 border-t border-main flex items-center justify-between text-[12px] text-muted font-medium">
                        <span>Manipuri Students' Association Pune</span>
                        <Link to="/about" className="text-lavender font-bold hover:underline">
                          Learn about trust
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/gallery"
                className="text-[14px] font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-stone hover:text-lavender hover:bg-page"
              >
                Gallery
              </Link>
            </div>

            {/* Desktop Auth / CTA */}
            <div className="hidden lg:flex items-center gap-3.5">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/community"
                    className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-page border border-main text-ink text-[13px] font-bold shadow-2xs hover:border-lavender transition-all"
                  >
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                    </span>
                    <span className="group-hover:text-lavender transition-colors">
                      {currentUser.fullName?.split(' ')[0] || 'Alumnus'}
                    </span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="text-[13px] font-semibold text-muted hover:text-vermilion px-2.5 py-1 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-[14px] font-semibold text-stone hover:text-lavender transition-colors px-3 py-1.5"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="btn-hover text-[14px] font-bold text-white bg-lavender hover:bg-lavender-dark px-5 py-2.5 rounded-xl shadow-[0_6px_20px_rgba(78,45,146,0.25)] transition-all"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              className="lg:hidden text-ink hover:text-lavender p-2 rounded-xl bg-page border border-main"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-card border-t border-main max-h-[80vh] overflow-y-auto shadow-2xl animate-heroIn">
            <div className="px-5 py-5 space-y-2">
              {NAV_ITEMS.map((item, idx) => (
                <div key={idx} className="border-b border-main/60 pb-2">
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-[15px] font-bold text-ink py-2 hover:text-lavender transition-colors"
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        mobileExpanded === idx ? 'rotate-180 text-lavender' : 'text-muted'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileExpanded === idx && (
                    <div className="pl-3 py-2 space-y-3">
                      {item.children.map((group, gi) => (
                        <div key={gi}>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-lavender mb-1.5">
                            {group.heading}
                          </div>
                          <div className="space-y-1">
                            {group.links.map((link, li) => (
                              <Link
                                key={li}
                                to={link.to}
                                className="flex items-center gap-2 text-sm text-stone font-medium hover:text-lavender py-1.5 transition-colors"
                              >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/gallery"
                className="w-full flex items-center justify-between text-left text-[15px] font-bold text-ink py-2 hover:text-lavender transition-colors"
              >
                <span>Gallery</span>
              </Link>

              <div className="pt-4 space-y-2.5">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-section-alt rounded-xl border border-main flex items-center gap-2 text-xs font-bold text-ink">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                      Signed in as {currentUser.fullName}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-center text-sm font-bold text-stone border border-main py-2.5 rounded-xl hover:text-vermilion"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center text-sm font-bold text-stone border-2 border-main py-3 rounded-xl hover:border-lavender hover:text-lavender transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center text-sm font-bold text-white bg-lavender hover:bg-lavender-dark py-3 rounded-xl shadow-md text-center"
                    >
                      Register for Verification
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
