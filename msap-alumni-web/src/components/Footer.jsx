import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-muted">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-parchment text-lg block mb-3">MSAP Alumni</Link>
            <p className="text-muted text-xs leading-relaxed">
              Sagolband Moirang Leirak<br />
              Imphal West, 795001<br />
              Manipur, India
            </p>
            <p className="text-muted/50 text-[11px] mt-3">Society No. 915/M/SR/2025</p>
          </div>

          {/* Links */}
          <div>
            <div className="text-parchment font-semibold text-xs uppercase tracking-wider mb-3">Navigate</div>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-parchment transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-parchment transition-colors">Events</Link></li>
              <li><Link to="/stories" className="hover:text-parchment transition-colors">Stories</Link></li>
              <li><Link to="/community" className="hover:text-parchment transition-colors">Community</Link></li>
              <li><Link to="/gallery" className="hover:text-parchment transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-parchment font-semibold text-xs uppercase tracking-wider mb-3">Association</div>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-parchment transition-colors">About</Link></li>
              <li><Link to="/accounts" className="hover:text-parchment transition-colors">Finances</Link></li>
              <li><Link to="/register" className="hover:text-parchment transition-colors">Register</Link></li>
              <li><a href="mailto:alumni.msap1973@gmail.com" className="hover:text-parchment transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-parchment font-semibold text-xs uppercase tracking-wider mb-3">Reach us</div>
            <a href="mailto:alumni.msap1973@gmail.com" className="hover:text-parchment transition-colors block mb-2">
              alumni.msap1973@gmail.com
            </a>
            <div className="flex gap-3 mt-4">
              {['Facebook', 'LinkedIn', 'Instagram'].map((s) => (
                <a key={s} href="#" className="text-xs text-muted/60 hover:text-parchment transition-colors uppercase tracking-wider">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-lighter">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-muted/50">
          <span>&copy; {year} Association of MSAP Alumni</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-parchment transition-colors">Privacy</a>
            <a href="#" className="hover:text-parchment transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
