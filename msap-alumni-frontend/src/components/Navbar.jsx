import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Stories', to: '/stories' },
  { label: 'Chapters', to: '/community' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Transparency', to: '/accounts' },
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
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group" aria-label="MSAP Alumni — Home">
            <img
              src="/logo.png"
              alt="Association of MSAP Alumni official logo"
              className="w-9 h-9 object-contain"
            />
            <span className="hidden sm:block">
              <span className="block font-display text-ink text-lg font-bold leading-none group-hover:text-lavender transition-colors">
                MSAP Alumni
              </span>
              <span className="block text-muted text-[10.5px] tracking-[0.2em] uppercase font-semibold mt-1">
                Association &middot; Est. 1973
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
                <Link to="/community" className="text-[13px] font-semibold text-stone hover:text-lavender transition-colors">
                  {currentUser.fullName?.split(' ')[0] || 'Alumnus'}
                </Link>
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
            className="lg:hidden text-ink hover:text-lavender p-2 -mr-2 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
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
        <nav aria-label="Mobile" className="lg:hidden border-t border-main bg-card">
          <div className="max-w-7xl mx-auto px-5 py-4 space-y-1">
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