import { Link } from 'react-router-dom';

const EVENTS = [
  { id: 1, date: 'Aug 15, 2026', title: 'Annual Alumni Meet', location: 'Pune', category: 'Community' },
  { id: 2, date: 'Sep 10, 2026', title: 'Career Networking Night', location: 'Virtual', category: 'Career' },
  { id: 3, date: 'Mar 3, 2026', title: 'Yaoshang Cultural Evening', location: 'Imphal', category: 'Cultural' },
  { id: 4, date: 'Jul 20, 2026', title: 'New Alumni Orientation', location: 'Online', category: 'Onboarding' },
];

export default function EventsSection() {
  return (
    <section className="bg-ink text-parchment">
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <h2 className="font-display text-parchment text-2xl md:text-3xl">Up next</h2>
            <p className="text-muted text-sm mt-1">Gatherings, celebrations, and ways to connect.</p>
          </div>
          <Link to="/events" className="text-vermilion text-sm font-medium hover:underline">
            All events &rarr;
          </Link>
        </div>

        <div className="divide-y divide-ink-lighter">
          {EVENTS.map((event) => (
            <Link key={event.id} to="/events" className="group flex items-baseline gap-6 py-5 hover:pl-2 transition-all">
              <span className="text-muted text-sm font-medium w-28 shrink-0">{event.date}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-parchment text-lg group-hover:text-vermilion transition-colors">{event.title}</h3>
              </div>
              <span className="text-muted text-xs uppercase tracking-wider hidden sm:block">{event.location}</span>
              <span className="text-vermilion text-xs font-medium uppercase tracking-wider hidden sm:block">{event.category}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
