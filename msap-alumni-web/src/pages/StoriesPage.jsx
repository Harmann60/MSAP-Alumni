import { Link } from 'react-router-dom';

const ALL_STORIES = [
  { id: 1, title: 'From Pune to Silicon Valley: One Alumni\'s 30-Year Journey', source: 'MSAP Alumni Report', date: 'June 2026', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop', excerpt: 'How a small group of Manipuri students in Pune went on to lead careers across the globe — and what brought them back.' },
  { id: 2, title: 'The Golden Jubilee: 200 Alumni, One Auditorium', source: 'Alumni Magazine', date: 'September 2025', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop', excerpt: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to mark half a century of community.' },
  { id: 3, title: 'Keeping Yaoshang Alive 1,200 km from Home', source: 'Community Spotlight', date: 'March 2026', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop', excerpt: 'Every March, Manipuris in Pune gather to light the Yaoshang — and prove that culture travels with people.' },
  { id: 4, title: '50 New Members in One Month: The Registration Drive', source: 'MSAP Report', date: 'April 2026', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop', excerpt: 'The registration drive for new alumni members exceeded expectations this spring.' },
  { id: 5, title: 'The Mentorship Program: Alumni Guiding Graduates', source: 'Community Spotlight', date: 'March 2026', image: 'https://images.unsplash.com/photo-1531538606174-e1ed98e5ef2e?w=800&h=500&fit=crop', excerpt: 'Experienced alumni are pairing with recent graduates for career guidance and professional development.' },
  { id: 6, title: 'From Yaoshang to Sangai: Cultural Identity in Pune', source: 'Alumni Magazine', date: 'February 2026', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop', excerpt: 'How Pune\'s Manipuri community preserves cultural identity across generations.' },
];

export default function StoriesPage() {
  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Stories</h1>
        <p className="text-muted text-sm">News, profiles, and moments from the community.</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-16 md:pb-24">
        {/* Featured story */}
        <Link to="/stories" className="group block mb-14">
          <div className="md:flex">
            <div className="md:w-3/5 aspect-[16/10] md:aspect-auto bg-parchment-dark overflow-hidden">
              <img src={ALL_STORIES[0].image} alt={ALL_STORIES[0].title} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">{ALL_STORIES[0].source} &middot; {ALL_STORIES[0].date}</div>
              <h2 className="font-display text-ink text-2xl md:text-3xl mb-3 group-hover:text-vermilion transition-colors">{ALL_STORIES[0].title}</h2>
              <p className="text-muted leading-relaxed">{ALL_STORIES[0].excerpt}</p>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_STORIES.slice(1).map((story) => (
            <Link key={story.id} to="/stories" className="group">
              <div className="aspect-[16/10] overflow-hidden bg-parchment-dark mb-3">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-1.5">{story.source} &middot; {story.date}</div>
              <h3 className="font-display text-ink text-lg leading-snug mb-1.5 group-hover:text-vermilion transition-colors">{story.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{story.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
