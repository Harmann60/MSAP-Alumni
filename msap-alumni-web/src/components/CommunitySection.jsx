import { Link } from 'react-router-dom';

const ACTIONS = [
  { label: 'Find alumni in your city', to: '/community' },
  { label: 'Join a professional network', to: '/community' },
  { label: 'Attend an event', to: '/events' },
  { label: 'Mentor a recent graduate', to: '/community' },
  { label: 'Read community stories', to: '/stories' },
  { label: 'Start a new alumni group', to: '/community' },
];

export default function CommunitySection() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left: statement */}
        <div>
          <h2 className="font-display text-ink text-2xl md:text-3xl mb-4">
            What you can do here
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            MSAP Alumni connects Manipuri graduates from Pune across cities, careers, and generations. Whether you left Pune last year or 30 years ago, this is your community.
          </p>
          <Link to="/community" className="text-vermilion text-sm font-medium hover:underline">
            Explore all groups &rarr;
          </Link>
        </div>

        {/* Right: plain list */}
        <div>
          <ul className="space-y-0 divide-y divide-parchment-dark">
            {ACTIONS.map((action, idx) => (
              <li key={idx}>
                <Link
                  to={action.to}
                  className="flex items-center justify-between py-4 text-ink hover:text-vermilion transition-colors group"
                >
                  <span className="text-base font-medium">{action.label}</span>
                  <svg className="w-4 h-4 text-muted group-hover:text-vermilion transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
