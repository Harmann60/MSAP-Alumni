const ALL_EVENTS = [
  { id: 1, date: 'Aug 15, 2026', time: '10 AM – 6 PM', title: 'Annual Alumni Meet 2026', location: 'Pune, Maharashtra', category: 'Community', description: 'The yearly gathering of all Pune Manipuri alumni. Reconnect, celebrate, and plan the year ahead.' },
  { id: 2, date: 'Sep 10, 2026', time: '7 PM – 9 PM', title: 'Career Networking Night', location: 'Virtual (Zoom)', category: 'Career', description: 'Connect with alumni across industries for mentorship, referrals, and career guidance.' },
  { id: 3, date: 'Mar 3, 2026', time: '5 PM – 10 PM', title: 'Yaoshang Cultural Evening', location: 'Imphal, Manipur', category: 'Cultural', description: 'Celebrate the festival of colors with the community through music, dance, and tradition. Families welcome.' },
  { id: 4, date: 'Jul 20, 2026', time: '6 PM – 7:30 PM', title: 'New Alumni Orientation', location: 'Online', category: 'Onboarding', description: 'A welcome session for recently registered alumni to learn about the association and how to get involved.' },
  { id: 5, date: 'Mar 14, 2026', time: '11 AM – 3 PM', title: 'Holi Celebration', location: 'Pune, Maharashtra', category: 'Cultural', description: 'Join fellow Manipuris in Pune for traditional music, food, and colors.' },
  { id: 6, date: 'Oct 5, 2026', time: '6 PM – 8 PM', title: 'Mentorship Program Kickoff', location: 'Hybrid', category: 'Career', description: 'Launch of the annual mentorship program pairing experienced alumni with recent graduates.' },
];

export default function EventsPage() {
  const featured = ALL_EVENTS.filter(e => e.category === 'Community' || e.category === 'Career');
  const rest = ALL_EVENTS.filter(e => e.category !== 'Community' && e.category !== 'Career');

  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Events</h1>
        <p className="text-muted text-sm">Gatherings, celebrations, and ways to reconnect.</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-16 md:pb-24">
        {/* Featured */}
        <div className="mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">Featured</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((event) => (
              <div key={event.id} className="bg-parchment-dark p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-vermilion mb-2">{event.category}</div>
                <h3 className="font-display text-ink text-xl mb-2">{event.title}</h3>
                <div className="text-xs text-muted mb-3">{event.date} &middot; {event.time} &middot; {event.location}</div>
                <p className="text-sm text-muted leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All events */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">All events</h2>
          <div className="divide-y divide-parchment-dark">
            {rest.map((event) => (
              <div key={event.id} className="py-5">
                <div className="flex items-baseline gap-6">
                  <span className="text-muted text-sm font-medium w-28 shrink-0">{event.date}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-ink text-lg">{event.title}</h3>
                    <div className="text-xs text-muted mt-1">{event.time} &middot; {event.location}</div>
                    <p className="text-sm text-muted leading-relaxed mt-2">{event.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted hidden sm:block">{event.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
