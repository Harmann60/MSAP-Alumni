import { Link } from 'react-router-dom';

const ALL_STORIES = [
  {
    id: 1,
    title: 'From Pune to Silicon Valley: A MSAP Alumni Journey',
    source: 'MSAP Alumni Report',
    date: 'June 2026',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    excerpt: 'How a small group of Manipuri students in Pune went on to lead transformative careers across the globe.',
  },
  {
    id: 2,
    title: '9 Things You Didn\'t Know Were Born in Pune\'s Student Community',
    source: 'Alumni Magazine',
    date: 'May 2026',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    excerpt: 'From cultural festivals to tech startups — innovations that trace their roots back to hostel corridors.',
  },
  {
    id: 3,
    title: 'Annual Meet 2025: A Golden Jubilee to Remember',
    source: 'MSAP Newsletter',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    excerpt: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium to celebrate 50 years of brotherhood.',
  },
  {
    id: 4,
    title: 'New Alumni Registration Drive Sees Record Numbers',
    source: 'MSAP Report',
    date: 'April 2026',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',
    excerpt: 'The registration drive for new alumni members exceeded expectations with over 50 new sign-ups in a single month.',
  },
  {
    id: 5,
    title: 'Building Bridges: The MSAP Mentorship Program',
    source: 'Community Spotlight',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1531538606174-e1ed98e5ef2e?w=800&h=500&fit=crop',
    excerpt: 'How experienced alumni are guiding the next generation through career mentorship and professional development.',
  },
  {
    id: 6,
    title: 'The Cultural Legacy: Keeping Manipuri Traditions Alive in Pune',
    source: 'Alumni Magazine',
    date: 'February 2026',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',
    excerpt: 'From Yaoshang to Sangai Festival — how Pune\'s Manipuri community preserves cultural identity across generations.',
  },
];

export default function StoriesPage() {
  return (
    <div className="animate-slideUp">
      {/* Page header */}
      <div className="bg-forest-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">Stories</h1>
          <p className="text-forest-200/70 text-sm">News, views, and perspectives from the alumni community.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Featured story */}
        <div className="mb-12">
          <Link to="/stories" className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2 aspect-[16/10] md:aspect-auto bg-forest-100 overflow-hidden">
                <img
                  src={ALL_STORIES[0].image}
                  alt={ALL_STORIES[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="text-[11px] font-bold uppercase tracking-widest text-forest-600 mb-3">{ALL_STORIES[0].source} · {ALL_STORIES[0].date}</div>
                <h2 className="text-2xl font-extrabold font-display text-forest-950 mb-3 group-hover:text-forest-700 transition-colors">{ALL_STORIES[0].title}</h2>
                <p className="text-gray-500 leading-relaxed">{ALL_STORIES[0].excerpt}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Story grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_STORIES.slice(1).map((story) => (
            <Link
              key={story.id}
              to="/stories"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden bg-forest-100">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-forest-600 mb-2">
                  <span>{story.source}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400">{story.date}</span>
                </div>
                <h3 className="font-bold text-forest-950 text-base leading-snug mb-2 group-hover:text-forest-700 transition-colors">{story.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{story.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
