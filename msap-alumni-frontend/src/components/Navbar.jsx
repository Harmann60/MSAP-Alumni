import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'News', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSignOut = () => {
    sessionStorage.removeItem('msap_alumni_token');
    sessionStorage.removeItem('msap_alumni_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('msap_auth_change'));
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-main">
      <div className="max-w-[90rem] mx-auto px-5">
        <div className="flex items-center justify-between gap-3 lg:gap-4 min-h-[70px] md:h-20 lg:h-24 py-2 md:py-0">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 md:gap-4 min-w-0 group lg:shrink-0" aria-label="Association of MSAP Alumni, Manipur — Home">
            <img
              src="/logo.png"
              alt="Association of MSAP Alumni, Manipur official logo"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-[52px] lg:h-[52px] object-contain shrink-0"
            />
            <span className="min-w-0">
              <span className="block font-display text-ink font-semibold leading-tight group-hover:text-lavender transition-colors text-[18px] sm:text-[21px] md:text-[25px] lg:text-[28px]">
                Association of MSAP Alumni, Manipur
              </span>
              <span className="block text-muted font-semibold uppercase tracking-[0.32em] mt-1 text-[9.5px] sm:text-[10.5px] md:text-[11px]">
                EST. 2024
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[15px] font-semibold tracking-wide pb-1 border-b-2 transition-colors ${
                    active
                      ? 'text-lavender border-lavender'
                      : 'text-stone border-transparent hover:text-lavender hover:border-lavender/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop auth / CTA */}
          <div className="hidden lg:flex items-center gap-5">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-semibold text-stone">
                  {currentUser.fullName?.split(' ')[0] || 'Alumnus'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-[13px] font-semibold text-stone hover:text-lavender transition-colors cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[15px] font-semibold text-stone hover:text-lavender transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-lavender hover:bg-lavender-dark text-white text-[15px] font-bold px-5 py-2.5 rounded-sm transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden w-11 h-11 shrink-0 flex items-center justify-center text-ink hover:text-lavender rounded-sm border border-main/80 bg-card/60 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav aria-label="Mobile" className="lg:hidden border-t border-main bg-card">
          <div className="max-w-[90rem] mx-auto px-5 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`block py-3 text-base font-semibold border-b border-main/60 first:border-t-0 ${
                    active ? 'text-lavender' : 'text-stone hover:text-lavender transition-colors'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 space-y-2.5">
              {currentUser ? (
                <div className="space-y-2.5">
                  <p className="text-sm font-semibold text-stone">
                    Signed in as <span className="text-ink">{currentUser.fullName}</span>
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-center text-sm font-bold text-ink border border-main py-2.5 rounded-sm hover:text-lavender transition-colors cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center text-sm font-bold text-ink border border-main py-2.5 rounded-sm hover:text-lavender transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center text-sm font-bold text-white bg-lavender hover:bg-lavender-dark py-2.5 rounded-sm transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}