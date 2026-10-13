import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { alumniLogout } from '../services/alumniService';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'News', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Membership', to: '/membership' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('msap_alumni_user') || sessionStorage.getItem('msap_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const stored = sessionStorage.getItem('msap_alumni_user') || sessionStorage.getItem('msap_admin_user');
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

  const handleSignOut = async () => {
    try {
      await alumniLogout();
    } catch {
      // Ignore network errors on logout
    }
    sessionStorage.removeItem('msap_alumni_token');
    sessionStorage.removeItem('msap_alumni_user');
    sessionStorage.removeItem('msap_admin_token');
    sessionStorage.removeItem('msap_admin_user');
    setCurrentUser(null);
    window.dispatchEvent(new Event('msap_auth_change'));
  };

  const getInitials = (name) => {
    if (!name) return 'MA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isContentManager = currentUser?.role === 'MODERATOR' || currentUser?.role === 'CONTENT_MANAGER' || Boolean(currentUser?.isContentManager);
  const isStaff = isSuperAdmin || isAdmin || isContentManager || Boolean(currentUser?.isStaff);

  const roleBadge = isSuperAdmin
    ? 'Super Admin'
    : isAdmin
    ? 'Admin'
    : isContentManager
    ? 'Content Manager'
    : 'Verified Alumnus';

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
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-main/80 hover:border-lavender/50 hover:bg-card/80 transition-all group shadow-xs"
                  title="View your verified alumni profile"
                >
                  {/* Monogram initials circle (Strictly text-based, NO profile pictures) */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-lavender to-lavender-dark shadow-sm shrink-0 select-none">
                    {getInitials(currentUser.fullName || currentUser.email)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold text-ink leading-tight group-hover:text-lavender transition-colors max-w-[130px] truncate">
                      {currentUser.fullName || 'Member'}
                    </span>
                    <span className={`text-[10px] font-bold leading-none mt-0.5 ${
                      isSuperAdmin || isAdmin
                        ? 'text-amber-700'
                        : isContentManager
                        ? 'text-purple-700'
                        : 'text-emerald-700'
                    }`}>
                      {roleBadge}
                    </span>
                  </div>
                </Link>

                {isStaff && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 bg-lavender/10 hover:bg-lavender text-lavender-dark hover:text-white rounded text-xs font-bold transition-all border border-lavender/30 whitespace-nowrap"
                    title="Launch Content Management / Admin Portal"
                  >
                    Editorial Portal
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-stone hover:text-red-600 transition-colors cursor-pointer px-2 py-1"
                  title="Sign out of your account"
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
                  to="/membership"
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
                <div className="space-y-3 pt-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded bg-parchment/60 border border-main"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-lavender to-lavender-dark shadow-sm shrink-0 select-none">
                      {getInitials(currentUser.fullName || currentUser.email)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">{currentUser.fullName || 'Member'}</p>
                      <p className="text-xs font-semibold text-lavender-dark">{roleBadge}</p>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      className="w-full text-center text-xs font-bold text-ink border border-main py-2 rounded hover:text-lavender transition-colors"
                    >
                      My Profile
                    </Link>
                    {isStaff && (
                      <Link
                        to="/admin"
                        className="w-full text-center text-xs font-bold text-white bg-lavender hover:bg-lavender-dark py-2 rounded transition-colors"
                      >
                        Editorial Portal
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-center text-xs font-bold text-stone hover:text-red-600 border border-main py-2 rounded transition-colors cursor-pointer"
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
                    to="/membership"
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