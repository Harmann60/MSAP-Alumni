import { Link } from 'react-router-dom';

const EVENTS = [
  {
    id: 1,
    title: 'Annual Alumni Meet 2026',
    date: 'Aug 15, 2026',
    location: 'Pune',
    category: 'Community',
    description: 'The yearly gathering of all Pune Manipuri alumni — reconnect, celebrate, and plan the year ahead.',
  },
  {
    id: 2,
    title: 'Career Networking Night',
    date: 'Sep 10, 2026',
    location: 'Virtual',
    category: 'Career',
    description: 'Connect with alumni across industries for mentorship, referrals, and career guidance.',
  },
  {
    id: 3,
    title: 'Cultural Evening — Yaoshang Special',
    date: 'Mar 3, 2026',
    location: 'Imphal',
    category: 'Cultural',
    description: 'Celebrate the festival of colors with the community through music, dance, and tradition.',
  },
  {
    id: 4,
    title: 'New Alumni Orientation',
    date: 'Jul 20, 2026',
    location: 'Online',
    category: 'Onboarding',
    description: 'A welcome session for recently registered alumni to learn about the association and its programs.',
  },
];

const categoryColors = {
  Community: 'bg-forest-100 text-forest-700 border-forest-200',
  Career: 'bg-gold-100 text-gold-700 border-gold-200',
  Cultural: 'bg-purple-100 text-purple-700 border-purple-200',
  Onboarding: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function EventsSection() {
  return (
    <section className="bg-forest-50/50 border-y border-forest-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-display text-forest-950">Events</h2>
            <p className="text-gray-500 mt-1 text-sm">Upcoming gatherings, meetings, and celebrations.</p>
          </div>
          <Link to="/events" className="text-forest-700 hover:text-forest-900 text-sm font-semibold flex items-center gap-1 transition-colors">
            All Events
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              to="/events"
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex gap-5"
            >
              {/* Date badge */}
              <div className="shrink-0 w-16 h-16 bg-forest-900 text-white rounded-xl flex flex-col items-center justify-center text-center shadow-md">
                <div className="text-[10px] uppercase tracking-wider text-forest-300 font-semibold">{event.date.split(' ')[0]}</div>
                <div className="text-xl font-extrabold font-display leading-none">{event.date.split(' ')[1].replace(',', '')}</div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </span>
                </div>
                <h3 className="font-bold text-forest-950 text-base mb-1 group-hover:text-forest-700 transition-colors">{event.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
