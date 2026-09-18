import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStories } from '../services/dataService';

const DEFAULT_STORIES = [
  {
    id: 1,
    title: "From Pune to Silicon Valley: One Alumnus's 30-Year Journey",
    source: 'MSAP Alumni Spotlight',
    category: 'Spotlight',
    date: 'June 2026',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
    excerpt:
      'How a small group of Manipuri students in Pune went on to lead technology careers across Silicon Valley — and what inspired them to establish the MSAP tech scholarship.',
  },
  {
    id: 2,
    title: 'The Golden Jubilee: 200 Alumni, One Auditorium, 50 Years of Fellowship',
    source: 'Alumni Magazine',
    category: 'Milestone',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
    excerpt:
      'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to celebrate half a century of campus unity, song, and lifelong community bonds.',
  },
  {
    id: 3,
    title: 'Keeping Yaoshang Alive 1,200 km from Home',
    source: 'Cultural Desk',
    category: 'Culture',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
    excerpt:
      'Every March, Manipuris in Pune gather to celebrate Yaoshang, proving that cultural heritage and vibrant community spirit endure across geography.',
  },
  {
    id: 4,
    title: '50 New Members in One Month: The Alumni Registration Drive',
    source: 'MSAP Secretariat',
    category: 'Community',
    date: 'April 2026',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=800&fit=crop',
    excerpt:
      'The spring verification campaign connected dozens of recent graduates with senior mentors in healthcare, civil services, and software engineering.',
  },
  {
    id: 5,
    title: 'The Mentorship Program: Guiding New Graduates in Pune',
    source: 'Career Network',
    category: 'Career',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1531538606174-e1ed98e5ef2e?w=1200&h=800&fit=crop',
    excerpt:
      'Pune alumni are offering 1-on-1 career navigation for Manipur students transitioning from college to corporate and academic careers.',
  },
  {
    id: 6,
    title: 'From Pune Campus to State Service: A Civil Servant’s Memoir',
    source: 'Alumni Magazine',
    category: 'Spotlight',
    date: 'February 2026',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
    excerpt:
      'Memories of hostel study circles in Deccan Gymkhana that paved the way to public administration and social impact.',
  },
];

export default function StoriesPage() {
  const [stories, setStories] = useState(DEFAULT_STORIES);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchStories()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            title: item.title,
            source: item.source || 'MSAP News',
            category: item.category || 'General',
            date: item.published_date || item.date || '2026',
            image: item.image_url || item.image || DEFAULT_STORIES[0].image,
            excerpt: item.excerpt,
          }));
          setStories(mapped);
        }
      })
      .catch((err) => {
        console.warn('Using fallback stories data:', err.message);
      });
  }, []);

  const filters = ['All', 'Spotlight', 'Milestone', 'Culture', 'Community'];
  const filteredStories =
    activeFilter === 'All'
      ? stories
      : stories.filter((s) => s.category?.toLowerCase() === activeFilter.toLowerCase());

  const featured = filteredStories[0] || DEFAULT_STORIES[0];
  const rest = filteredStories.slice(1);

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow mb-5">Alumni chronicles</p>
        <h1 className="display-lg text-4xl md:text-5xl mb-3">Stories of journey & impact</h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Fifty years of student life, global careers, cultural heritage, and giving back to Pune and
          Manipur.
        </p>

        {/* Filter tabs */}
<nav aria-label="Filter stories by category" className="flex flex-wrap gap-x-8 gap-y-2 mt-9">
            {filters.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  aria-pressed={active}
                  className={`pb-1.5 text-[15px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'text-lavender border-lavender'
                    : 'text-stone border-transparent hover:text-lavender hover:border-lavender/40'
                }`}
              >
                {f}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        {/* Featured spread */}
        {featured && (
          <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
            <div className="lg:col-span-7">
              <div className="media-frame">
                <div className="aspect-[16/10] bg-section-alt overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-lavender mb-3">
                Featured &middot; {featured.source} &middot; {featured.date}
              </p>
              <h2 className="font-display text-ink text-3xl sm:text-4xl font-bold leading-tight mb-4">
                {featured.title}
              </h2>
              <p className="text-stone text-base leading-relaxed mb-5">{featured.excerpt}</p>
              <Link to="/stories" className="text-link link-underline">
                Read the full chronicle
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        )}

        {/* Supporting stories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {rest.map((story, idx) => (
            <article key={story.id} className={`${idx > 0 ? 'sm:border-t-0' : ''} border-t border-main sm:pt-0 pt-6`}>
              <div className="media-frame mb-5">
                <div className="aspect-[16/10] bg-section-alt overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted mb-2">
                {story.source} &middot; {story.date}
              </p>
              <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 group-hover:text-lavender transition-colors">
                <Link to="/stories" className="hover:text-lavender transition-colors">
                  {story.title}
                </Link>
              </h3>
              <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-3 mb-4">
                {story.excerpt}
              </p>
              <Link to="/stories" className="text-link">
                Read story
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}