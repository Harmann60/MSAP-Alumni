import { Link } from 'react-router-dom';

const EVENTS = [
  {
    id: 1,
    day: '15',
    month: 'August',
    year: '2026',
    title: 'Annual MSAP Alumni Meet 2026',
    location: 'Symbiosis Campus · Pune',
    time: '5:00 PM IST',
    category: 'Flagship reunion',
  },
  {
    id: 2,
    day: '10',
    month: 'September',
    year: '2026',
    title: 'Global Career & Mentorship Night',
    location: 'Virtual / Google Meet',
    time: '7:30 PM IST',
    category: 'Career & mentorship',
  },
  {
    id: 3,
    day: '03',
    month: 'March',
    year: '2026',
    title: 'Yaoshang Cultural Festival',
    location: 'Classic Grande · Imphal',
    time: '4:00 PM IST',
    category: 'Culture & heritage',
  },
];

export default function EventsSection() {
  return (
    <section className="bg-section-alt border-y border-main">
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-4">02 &mdash; Annual calendar</p>
            <h2 className="display-lg text-3xl sm:text-4xl md:text-[2.75rem]">Reunions & upcoming events</h2>
            <p className="text-stone text-base sm:text-lg mt-4 max-w-xl">
              From the flagship Pune annual meet to chapter mixers and cultural celebrations across
              India and the diaspora.
            </p>
          </div>
          <Link to="/events" className="text-link link-underline shrink-0 mb-1">
            Full event calendar
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        <ol className="divide-y divide-main border-t border-main">
          {EVENTS.map((event, idx) => (
            <li key={event.id}>
              <Link
                to="/events"
                className={`group flex flex-col lg:flex-row lg:items-center gap-x-8 gap-y-3 py-7 ${
                  idx === 0 ? 'border-l-2 border-lavender pl-6' : 'pl-6'
                }`}
              >
                {/* Date */}
                <div className="flex items-baseline gap-3 lg:w-44 shrink-0">
                  <span className="font-display text-5xl font-bold text-ink leading-none">{event.day}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted leading-tight">
                    {event.month}
                    <br />
                    {event.year}
                  </span>
                </div>

                {/* Title + location */}
                <div className="flex-1">
                  <h3 className="font-display text-ink text-2xl sm:text-[1.7rem] font-bold leading-snug mb-1.5 group-hover:text-lavender transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[15px] text-stone/85">
                    <span>{event.location}</span>
                    <span className="mx-2 text-muted">·</span>
                    <span>{event.time}</span>
                    <span className="mx-2 text-muted">·</span>
                    <span className="text-muted">{event.category}</span>
                  </p>
                </div>

                {/* Action */}
                <span className="text-sm font-semibold text-muted hover:text-lavender transition-colors shrink-0 whitespace-nowrap">
                  View details <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}