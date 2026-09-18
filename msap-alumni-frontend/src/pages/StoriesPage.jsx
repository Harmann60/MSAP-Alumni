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
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    excerpt:
      'How a small group of Manipuri students in Pune went on to lead technology careers across Silicon Valley — and what inspired them to establish the MSAP tech scholarship.',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'The Golden Jubilee: 200 Alumni, One Auditorium, 50 Years of Fellowship',
    source: 'Alumni Magazine',
    category: 'Milestone',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    excerpt:
      'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to celebrate half a century of campus unity, song, and lifelong community bonds.',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Keeping Yaoshang Alive 1,200 km from Home',
    source: 'Cultural Desk',
    category: 'Culture',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    excerpt:
      'Every March, Manipuris in Pune gather to celebrate Yaoshang, proving that cultural heritage and vibrant community spirit endure across geography.',
    readTime: '4 min read',
  },
  {
    id: 4,
    title: '50 New Members in One Month: The Alumni Registration Drive',
    source: 'MSAP Secretariat',
    category: 'Community',
    date: 'April 2026',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',
    excerpt:
      'The spring verification campaign connected dozens of recent graduates with senior mentors in healthcare, civil services, and software engineering.',
    readTime: '3 min read',
  },
  {
    id: 5,
    title: 'The Mentorship Program: Guiding New Graduates in Pune',
    source: 'Career Network',
    category: 'Career',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1531538606174-e1ed98e5ef2e?w=800&h=500&fit=crop',
    excerpt:
      'Pune alumni are offering 1-on-1 career navigation for Manipur students transitioning from college to corporate and academic careers.',
    readTime: '4 min read',
  },
  {
    id: 6,
    title: 'From Pune Campus to State Service: A Civil Servant’s Memoir',
    source: 'Alumni Magazine',
    category: 'Spotlight',
    date: 'February 2026',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
    excerpt:
      'Memories of hostel study circles in Deccan Gymkhana that paved the way to public administration and social impact.',
    readTime: '5 min read',
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
            readTime: '4 min read',
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
    <div className="relative bg-page min-h-[90vh]">
      {/* Header */}
      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-10 md:pt-20 md:pb-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-lavender text-xs font-bold uppercase tracking-wider mb-4 border border-main">
          <span>📖</span> Alumni Chronicles & Spotlights
        </div>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Stories of Journey & Impact
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Fifty years of student life, global careers, cultural heritage, and giving back to Pune and Manipur.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-lavender text-white shadow-md shadow-lavender/20'
                  : 'bg-card border border-main text-stone hover:border-lavender hover:text-lavender'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        {/* Featured story card */}
        {featured && (
          <div className="mb-14">
            <Link
              to="/stories"
              className="group card-lift block bg-card border border-main hover:border-lavender/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-section-alt relative min-h-[300px]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold uppercase tracking-wider bg-card/95 backdrop-blur-md text-lavender px-3.5 py-1 rounded-full border border-main shadow-sm">
                      Featured Story
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-3">
                      <span className="text-lavender font-semibold">{featured.source}</span>
                      <span>&middot;</span>
                      <span>{featured.date}</span>
                    </div>

                    <h2 className="font-display text-ink text-2xl sm:text-3xl font-bold mb-4 leading-tight group-hover:text-lavender transition-colors">
                      {featured.title}
                    </h2>

                    <p className="text-stone text-[15px] leading-relaxed mb-6 font-normal">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-main flex items-center justify-between text-xs font-bold text-lavender">
                    <span>Read Full Chronicle</span>
                    <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((story) => (
            <Link
              key={story.id}
              to="/stories"
              className="group card-lift bg-card border border-main hover:border-lavender/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-section-alt relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-card/95 backdrop-blur-md text-lavender px-3 py-1 rounded-full border border-main shadow-2xs">
                    {story.category || 'Article'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                    {story.source} &middot; {story.date}
                  </div>
                  <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 group-hover:text-lavender transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-[14px] text-stone leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-main text-xs font-bold text-lavender flex items-center justify-between">
                  <span>Read Story</span>
                  <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
