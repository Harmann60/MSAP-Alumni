const ALL_EVENTS = [
  {
    id: 1,
    title: 'Annual Alumni Meet 2026',
    date: 'Aug 15, 2026',
    time: '10:00 AM - 6:00 PM',
    location: 'Pune, Maharashtra',
    category: 'Community',
    description: 'The yearly gathering of all Pune Manipuri alumni. Reconnect, celebrate, and plan the year ahead with fellow alumni.',
    featured: true,
  },
  {
    id: 2,
    title: 'Career Networking Night',
    date: 'Sep 10, 2026',
    time: '7:00 PM - 9:00 PM',
    location: 'Virtual (Zoom)',
    category: 'Career',
    description: 'Connect with alumni across industries for mentorship, referrals, and career guidance. Open to all registered alumni.',
    featured: true,
  },
  {
    id: 3,
    title: 'Cultural Evening — Yaoshang Special',
    date: 'Mar 3, 2026',
    time: '5:00 PM - 10:00 PM',
    location: 'Imphal, Manipur',
    category: 'Cultural',
    description: 'Celebrate the festival of colors with the community through music, dance, and tradition. Family welcome.',
    featured: false,
  },
  {
    id: 4,
    title: 'New Alumni Orientation',
    date: 'Jul 20, 2026',
    time: '6:00 PM - 7:30 PM',
    location: 'Online',
    category: 'Onboarding',
    description: 'A welcome session for recently registered alumni to learn about the association, its programs, and how to get involved.',
    featured: false,
  },
  {
    id: 5,
    title: 'Holi Celebration 2026',
    date: 'Mar 14, 2026',
    time: '11:00 AM - 3:00 PM',
    location: 'Pune, Maharashtra',
    category: 'Cultural',
    description: 'Join fellow Manipuris in Pune for a vibrant celebration of Holi with traditional music, food, and colors.',
    featured: false,
  },
  {
    id: 6,
    title: 'Mentorship Program Kickoff',
    date: 'Oct 5, 2026',
    time: '6:00 PM - 8:00 PM',
    location: 'Hybrid (Pune + Online)',
    category: 'Career',
    description: 'Launch of the annual mentorship program pairing experienced alumni with recent graduates for career guidance.',
    featured: false,
  },
];

const categoryColors = {
  Community: 'bg-forest-100 text-forest-700 border-forest-200',
  Career: 'bg-gold-100 text-gold-700 border-gold-200',
  Cultural: 'bg-purple-100 text-purple-700 border-purple-200',
  Onboarding: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function EventsPage() {
  const featured = ALL_EVENTS.filter(e => e.featured);
  const others = ALL_EVENTS.filter(e => !e.featured);

  return (
    <div className="animate-slideUp">
      {/* Page header */}
      <div className="bg-forest-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">Events</h1>
          <p className="text-forest-200/70 text-sm">Upcoming gatherings, meetings, and celebrations for the alumni community.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Featured events */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-forest-950 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
            Featured Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-forest-800 to-forest-900 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryColors[event.category]}`}>
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-forest-200/70">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All other events */}
        <div>
          <h2 className="text-xl font-bold text-forest-950 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-forest-400 rounded-full" />
            All Events
          </h2>
          <div className="space-y-4">
            {others.map((event) => (
              <div key={event.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex gap-5 items-start hover:shadow-md transition-shadow">
                <div className="shrink-0 w-14 h-14 bg-forest-900 text-white rounded-xl flex flex-col items-center justify-center text-center shadow-md">
                  <div className="text-[9px] uppercase tracking-wider text-forest-300 font-semibold leading-none">{event.date.split(' ')[0]}</div>
                  <div className="text-lg font-extrabold font-display leading-none mt-0.5">{event.date.split(' ')[1].replace(',', '')}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[event.category]}`}>
                      {event.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-forest-950 text-sm mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{event.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>{event.time}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
