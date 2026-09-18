import { Link } from 'react-router-dom';

const EVENTS = [
  {
    id: 1,
    month: 'AUG',
    day: '15',
    year: '2026',
    title: 'Annual MSAP Alumni Meet 2026',
    location: 'Symbiosis Campus &middot; Pune',
    category: 'Flagship Reunion',
    badgeColor: 'bg-lavender-soft text-lavender border-lavender/30',
    time: '5:00 PM IST',
  },
  {
    id: 2,
    month: 'SEP',
    day: '10',
    year: '2026',
    title: 'Global Career & Mentorship Night',
    location: 'Virtual / Google Meet',
    category: 'Career & Tech',
    badgeColor: 'bg-emerald-100/70 text-emerald-800 border-emerald-300',
    time: '7:30 PM IST',
  },
  {
    id: 3,
    month: 'MAR',
    day: '03',
    year: '2026',
    title: 'Yaoshang Cultural Festival',
    location: 'Classic Grande &middot; Imphal',
    category: 'Culture & Heritage',
    badgeColor: 'bg-amber-100/70 text-amber-900 border-amber-300',
    time: '4:00 PM IST',
  },
  {
    id: 4,
    month: 'JUL',
    day: '20',
    year: '2026',
    title: 'New Graduates Pune Welcome',
    location: 'FC Road &middot; Pune',
    category: 'Youth Onboarding',
    badgeColor: 'bg-purple-100/70 text-purple-800 border-purple-300',
    time: '6:00 PM IST',
  },
];

export default function EventsSection() {
  return (
    <section className="relative bg-section-alt border-y border-main py-16 md:py-24">
      <div className="relative max-w-6xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-card border-1.5 border-lavender/35 text-lavender-dark text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <span>🗓</span> Calendar of Gatherings
            </div>
            <h2 className="font-display text-ink text-3xl sm:text-4xl font-bold tracking-tight">
              Reunions & Upcoming Events
            </h2>
            <p className="text-stone/80 text-base mt-2 max-w-xl">
              From the flagship Pune Annual Meet to international chapter mixers and cultural celebrations.
            </p>
          </div>
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 text-lavender-dark font-bold text-sm hover:text-lavender transition-colors shrink-0"
          >
            <span>Explore full calendar</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              to="/events"
              className="group card-lift bg-card border-1.5 border-lavender/25 hover:border-lavender/70 p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(58,27,115,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(58,27,115,0.22)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with Dark Lavender Calendar block and category */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-lavender-dark text-white border border-lavender/40 text-center shrink-0 shadow-sm group-hover:scale-105 transition-all duration-300">
                    <span className="text-[10px] font-bold tracking-widest uppercase block leading-none text-gold-soft">
                      {event.month}
                    </span>
                    <span className="text-xl font-display font-extrabold leading-tight mt-0.5 text-white">
                      {event.day}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${event.badgeColor}`}>
                    {event.category}
                  </span>
                </div>

                <h3 className="font-display text-ink text-lg font-bold group-hover:text-lavender transition-colors mb-2.5 leading-snug">
                  {event.title}
                </h3>

                <div className="space-y-1 text-xs text-muted font-medium mb-4">
                  <div className="flex items-center gap-1.5" dangerouslySetInnerHTML={{ __html: `📍 ${event.location}` }} />
                  <div className="flex items-center gap-1.5 text-stone/70">
                    <span>🕒 {event.time}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-lavender/20 text-xs font-bold text-lavender-dark group-hover:text-lavender transition-colors flex items-center justify-between">
                <span>View Details & RSVP</span>
                <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
