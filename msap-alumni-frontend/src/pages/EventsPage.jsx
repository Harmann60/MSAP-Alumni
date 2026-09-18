import { useState, useEffect } from 'react';
import { fetchEvents } from '../services/dataService';

const DEFAULT_EVENTS = [
  {
    id: 1,
    month: 'August',
    day: '15',
    year: '2026',
    time: '10:00 AM – 6:00 PM IST',
    title: '51st Annual MSAP Alumni Meet 2026',
    location: 'Symbiosis Campus &middot; Viman Nagar, Pune',
    category: 'Flagship',
    description:
      'The premier annual reunion for all Manipuri graduates who studied in Pune. Keynote panel, networking lunch, cultural performances, and the annual general body session.',
  },
  {
    id: 2,
    month: 'September',
    day: '10',
    year: '2026',
    time: '7:00 PM – 9:00 PM IST',
    title: 'Global Career & Tech Networking Night',
    location: 'Virtual via Google Meet',
    category: 'Career',
    description:
      'Alumni leaders in engineering, finance, biotech, and entrepreneurship share strategies and offer career advice to recent graduates.',
  },
  {
    id: 3,
    month: 'March',
    day: '03',
    year: '2026',
    time: '4:00 PM – 9:00 PM IST',
    title: 'Yaoshang Cultural Evening & Thabal',
    location: 'Classic Grande &middot; Imphal, Manipur',
    category: 'Cultural',
    description:
      'A joyful evening of traditional Meitei folk music, dance, Thabal Chongba, and culinary celebrations honoring our cultural roots.',
  },
  {
    id: 4,
    month: 'July',
    day: '20',
    year: '2026',
    time: '6:00 PM – 8:00 PM IST',
    title: 'New Graduates Pune Welcome & Orientation',
    location: 'FC Road &middot; Pune, Maharashtra',
    category: 'Onboarding',
    description:
      'Welcome evening for new graduates transitioning into life and work across Maharashtra and the broader diaspora.',
  },
  {
    id: 5,
    month: 'November',
    day: '14',
    year: '2026',
    time: '5:00 PM – 8:00 PM IST',
    title: 'MSAP Winter Social & Fireside Chat',
    location: 'Bengaluru Chapter &middot; Indiranagar',
    category: 'Chapter',
    description:
      'Informal mixer for Pune alumni working and living in the Bengaluru technology and academic hub.',
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [rsvpStatus, setRsvpStatus] = useState({});

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            month: 'October',
            day: '15',
            year: '2026',
            time: item.time_display || item.time || '6:00 PM IST',
            title: item.title,
            location: item.location,
            category: item.category || 'General',
            description: item.description,
          }));
          setEvents(mapped);
        }
      })
      .catch((err) => {
        console.warn('Using offline events data:', err.message);
      });
  }, []);

  const handleRsvp = (eventId) => {
    setRsvpStatus((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const categories = ['All', 'Flagship', 'Career', 'Cultural', 'Chapter'];
  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((e) => e.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow mb-5">Calendar &middot; Season 2025&ndash;26</p>
        <h1 className="display-lg text-4xl md:text-5xl mb-3">Events & gatherings</h1>
        <p className="text-stone text-lg max-w-xl">
          Join fellow alumni at annual reunions, chapter mixers, mentorship sessions, and cultural
          celebrations.
        </p>

        {/* Filter tabs */}
        <nav aria-label="Filter events by type" className="flex flex-wrap gap-x-8 gap-y-2 mt-9">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={active}
                className={`pb-1.5 text-[15px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'text-lavender border-lavender'
                    : 'text-stone border-transparent hover:text-lavender hover:border-lavender/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Events listing */}
      <div className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <ol className="divide-y divide-main border-t border-main">
          {filteredEvents.map((event) => {
            const isRsvpd = !!rsvpStatus[event.id];
            const isFlagship = event.category?.toLowerCase() === 'flagship';
            return (
              <li key={event.id} className={isFlagship ? 'py-8 pl-6 lg:pl-8 border-l-2 border-lavender' : 'py-8 pl-6'}>
                <div className="grid lg:grid-cols-12 gap-x-8 gap-y-5 items-start">
                  {/* Date */}
                  <div className="lg:col-span-2 flex lg:block items-baseline gap-3">
                    <span className="font-display text-5xl font-bold text-ink leading-none">
                      {event.day}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted leading-tight">
                      {event.month}
                      <br />
                      {event.year}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-7">
                    <h2 className="font-display text-ink text-2xl sm:text-[1.7rem] font-bold leading-snug mb-2">
                      {event.title}
                    </h2>
                    <p className="text-[15px] text-stone/85 mb-3">
                      <span dangerouslySetInnerHTML={{ __html: `📍 ${event.location}` }} />
                      <span className="mx-2 text-muted">·</span>
                      <span>{event.time}</span>
                      <span className="mx-2 text-muted">·</span>
                      <span className="text-muted">{event.category}</span>
                    </p>
                    <p className="text-stone text-[15px] leading-relaxed max-w-2xl">
                      {event.description}
                    </p>
                  </div>

                  {/* RSVP action */}
                  <div className="lg:col-span-3 flex lg:justify-end">
                    <button
                      onClick={() => handleRsvp(event.id)}
                      aria-pressed={isRsvpd}
                      className={`px-5 py-2.5 rounded-sm text-sm font-bold transition-colors cursor-pointer ${
                        isRsvpd
                          ? 'bg-section-alt text-verified border border-main'
                          : 'bg-lavender hover:bg-lavender-dark text-white'
                      }`}
                    >
                      {isRsvpd ? '✓ Attending' : 'RSVP now'}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}