import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: 'Events',
    children: [
      { heading: 'Featured Events', links: [
        { label: 'All Alumni Events', to: '/events' },
        { label: 'Community Events', to: '/events' },
        { label: 'Career Events', to: '/events' },
        { label: 'Student Events', to: '/events' },
      ]},
      { heading: 'Annual Events', links: [
        { label: 'Reunion 2026', to: '/events' },
        { label: 'Annual Meet', to: '/events' },
        { label: 'Cultural Fest', to: '/events' },
      ]},
    ],
  },
  {
    label: 'Stories',
    children: [
      { heading: 'News & Stories', links: [
        { label: 'Recent Stories', to: '/stories' },
        { label: 'Alumni Spotlight', to: '/stories' },
        { label: 'Newsletters', to: '/stories' },
      ]},
      { heading: 'Learn', links: [
        { label: 'Learning Opportunities', to: '/stories' },
        { label: 'Recommended Reads', to: '/stories' },
      ]},
    ],
  },
  {
    label: 'Community',
    children: [
      { heading: 'Clubs & Groups', links: [
        { label: 'Discover Alumni Groups', to: '/community' },
        { label: 'Interest & Affinity Groups', to: '/community' },
        { label: 'Professional Groups', to: '/community' },
      ]},
      { heading: 'Regional', links: [
        { label: 'Pune Chapter', to: '/community' },
        { label: 'Imphal Chapter', to: '/community' },
        { label: 'International Groups', to: '/community' },
      ]},
      { heading: 'Students', links: [
        { label: 'Recent Grad Resources', to: '/community' },
        { label: 'Young Alumni', to: '/community' },
      ]},
    ],
  },
  {
    label: 'About',
    children: [
      { heading: 'About Us', links: [
        { label: 'Get to Know MSAP Alumni', to: '/about' },
        { label: 'Our History', to: '/about' },
        { label: 'Executive Leadership', to: '/about' },
      ]},
      { heading: 'Governance', links: [
        { label: 'Governing Body', to: '/about' },
        { label: 'Financial Transparency', to: '/accounts' },
        { label: 'Contact Us', to: '/about' },
      ]},
    ],
  },
];

function MegaMenuDropdown({ item, isOpen }) {
  const ref = useRef(null);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[640px] bg-white rounded-b-2xl shadow-2xl border border-forest-100 animate-slideDown z-50"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0 p-8">
        {item.children.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'border-l border-forest-50 pl-6' : ''}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-3">
              {group.heading}
            </h4>
            <ul className="space-y-2">
              {group.links.map((link, li) => (
                <li key={li}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 hover:text-forest-700 hover:bg-forest-50 px-2 py-1 rounded-md transition-colors block"
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
  );
}

export default function Navbar() {
  const [activeMega, setActiveMega] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    timeoutRef.current = setTimeout(() => setActiveMega(null), 150);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-forest-950 text-forest-200 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/register" className="hover:text-white transition-colors">Alumni Directory</Link>
            <a href="mailto:alumni.msap1973@gmail.com" className="hover:text-white transition-colors">Email</a>
          </div>
          <div className="flex gap-4">
            <Link to="/register" className="hover:text-white transition-colors font-medium text-gold-400">Join Now</Link>
            <a href="mailto:alumni.msap1973@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        className={`bg-forest-900 text-white sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-2xl' : 'shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20">
                <span className="text-forest-300 font-bold text-lg font-display">M</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-sm leading-tight tracking-tight">MSAP Alumni</div>
                <div className="text-[10px] text-forest-300 leading-none tracking-wide">Est. 1973 · Pune</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0 h-full">
              {NAV_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      activeMega === idx || location.pathname.startsWith(`/${item.label.toLowerCase()}`)
                        ? 'text-white bg-white/15'
                        : 'text-forest-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${activeMega === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <MegaMenuDropdown item={item} isOpen={activeMega === idx} />
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/register"
                className="bg-gold-500 hover:bg-gold-400 text-forest-950 text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Join the Network
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <div className={`w-5 h-0.5 bg-white transition-all mb-1.5 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-all mb-1.5 ${mobileOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-forest-800 border-t border-white/10 max-h-[70vh] overflow-y-auto animate-slideDown">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-medium text-forest-100 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                    <svg className={`w-4 h-4 transition-transform ${mobileExpanded === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === idx && (
                    <div className="pl-4 pb-2 space-y-3 animate-slideDown">
                      {item.children.map((group, gi) => (
                        <div key={gi}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-forest-400 px-3 mb-1">{group.heading}</div>
                          {group.links.map((link, li) => (
                            <Link
                              key={li}
                              to={link.to}
                              className="block text-sm text-forest-200 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-white/10">
                <Link
                  to="/register"
                  className="block w-full text-center bg-gold-500 hover:bg-gold-400 text-forest-950 text-sm font-bold px-5 py-2.5 rounded-lg transition-all"
                >
                  Join the Network
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
