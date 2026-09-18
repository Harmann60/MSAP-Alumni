import { useState, useEffect } from 'react';
import { fetchEvents } from '../services/dataService';

const DEFAULT_EVENTS = [
  {
    id: 1,
    month: 'AUG',
    day: '15',
    year: '2026',
    time: '10:00 AM – 6:00 PM IST',
    title: '51st Annual MSAP Alumni Meet 2026',
    location: 'Symbiosis Campus &middot; Viman Nagar, Pune',
    category: 'Flagship',
    badgeColor: 'bg-[#E4DCF5] text-lavender border-lavender/30',
    description:
      'The premier annual reunion for all Manipuri graduates who studied in Pune. Keynote panel, networking lunch, cultural performances, and the annual general body session.',
  },
  {
    id: 2,
    month: 'SEP',
    day: '10',
    year: '2026',
    time: '7:00 PM – 9:00 PM IST',
    title: 'Global Career & Tech Networking Night',
    location: 'Virtual via Google Meet',
    category: 'Career',
    badgeColor: 'bg-emerald-100/70 text-emerald-800 border-emerald-300',
    description:
      'Alumni leaders in engineering, finance, biotech, and entrepreneurship share strategies and offer career advice to recent graduates.',
  },
  {
    id: 3,
    month: 'MAR',
    day: '03',
    year: '2026',
    time: '4:00 PM – 9:00 PM IST',
    title: 'Yaoshang Cultural Evening & Thabal',
    location: 'Classic Grande &middot; Imphal, Manipur',
    category: 'Cultural',
    badgeColor: 'bg-amber-100/70 text-amber-900 border-amber-300',
    description:
      'A joyful evening of traditional Meitei folk music, dance, Thabal Chongba, and culinary celebrations honoring our cultural roots.',
  },
  {
    id: 4,
    month: 'JUL',
    day: '20',
    year: '2026',
    time: '6:00 PM – 8:00 PM IST',
    title: 'New Graduates Pune Welcome & Orientation',
    location: 'FC Road &middot; Pune, Maharashtra',
    category: 'Onboarding',
    badgeColor: 'bg-purple-100/70 text-purple-800 border-purple-300',
    description:
      'Welcome evening for new graduates transitioning into life and work across Maharashtra and the broader diaspora.',
  },
  {
    id: 5,
    month: 'NOV',
    day: '14',
    year: '2026',
    time: '5:00 PM – 8:00 PM IST',
    title: 'MSAP Winter Social & Fireside Chat',
    location: 'Bengaluru Chapter &middot; Indiranagar',
    category: 'Chapter',
    badgeColor: 'bg-blue-100/70 text-blue-800 border-blue-300',
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
            month: 'OCT',
            day: '15',
            year: '2026',
            time: item.time_display || item.time || '6:00 PM IST',
            title: item.title,
            location: item.location,
            category: item.category || 'General',
            badgeColor: 'bg-[#E4DCF5] text-lavender border-lavender/30',
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
    <div className="relative bg-page min-h-[90vh]">
      {/* Header */}
      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-10 md:pt-20 md:pb-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-lavender text-xs font-bold uppercase tracking-wider mb-4 border border-main">
          <span>🗓</span> Gatherings & Reunions
        </div>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Events & Gatherings
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Join fellow alumni at annual reunions, chapter mixers, mentorship sessions, and cultural celebrations.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-lavender text-white shadow-md shadow-lavender/20'
                  : 'bg-card border border-main text-stone hover:border-lavender hover:text-lavender'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-8">
          {filteredEvents.map((event) => {
            const isRsvpd = !!rsvpStatus[event.id];
            return (
              <div
                key={event.id}
                className="group card-lift bg-card border border-main hover:border-lavender/50 p-7 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Calendar Block */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-page border border-main text-center shrink-0 group-hover:bg-lavender group-hover:text-white transition-colors duration-300">
                      <span className="text-[11px] font-bold tracking-wider uppercase block leading-none text-lavender group-hover:text-white/90">
                        {event.month}
                      </span>
                      <span className="text-2xl font-display font-extrabold leading-tight mt-0.5">
                        {event.day}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${
                          event.badgeColor || 'bg-lavender-soft text-lavender border-lavender/25'
                        }`}
                      >
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-display text-ink text-2xl font-bold mb-3 leading-snug group-hover:text-lavender transition-colors">
                    {event.title}
                  </h2>

                  {/* Metadata line */}
                  <div className="space-y-1.5 text-xs text-muted font-medium mb-4">
                    <div className="flex items-center gap-2 text-stone font-semibold" dangerouslySetInnerHTML={{ __html: `📍 ${event.location}` }} />
                    <div className="flex items-center gap-2">
                      <span>🕒 {event.time}</span>
                    </div>
                  </div>

                  <p className="text-stone text-[14px] leading-relaxed mb-6 font-normal">
                    {event.description}
                  </p>
                </div>

                {/* Footer RSVP Action */}
                <div className="pt-5 border-t border-main flex items-center justify-between gap-4">
                  <span className="text-xs text-muted font-semibold">
                    {isRsvpd ? '✓ RSVP Confirmed' : 'RSVP Open to Alumni'}
                  </span>

                  <button
                    onClick={() => handleRsvp(event.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isRsvpd
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-lavender hover:bg-lavender-dark text-white shadow-sm'
                    }`}
                  >
                    {isRsvpd ? 'Attending ✓' : 'RSVP Now →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
