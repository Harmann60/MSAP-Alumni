import { Link } from 'react-router-dom';

const STORIES = [
  {
    id: 1,
    title: 'From Pune to Silicon Valley: A MSAP Alumni Journey',
    source: 'MSAP Alumni Report',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    excerpt: 'How a small group of Manipuri students in Pune went on to lead transformative careers across the globe.',
  },
  {
    id: 2,
    title: '9 Things You Didn\'t Know Were Born in Pune\'s Student Community',
    source: 'Alumni Magazine',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    excerpt: 'From cultural festivals to tech startups — innovations that trace their roots back to hostel corridors.',
  },
  {
    id: 3,
    title: 'Annual Meet 2025: A Golden Jubilee to Remember',
    source: 'MSAP Newsletter',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    excerpt: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium to celebrate 50 years of brotherhood.',
  },
];

export default function StoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-forest-950">Stories</h2>
          <p className="text-gray-500 mt-1 text-sm">News, views, and perspectives from the alumni community.</p>
        </div>
        <Link to="/stories" className="text-forest-700 hover:text-forest-900 text-sm font-semibold flex items-center gap-1 transition-colors">
          All Stories
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {STORIES.map((story) => (
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
              <div className="text-[11px] font-bold uppercase tracking-widest text-forest-600 mb-2">{story.source}</div>
              <h3 className="font-bold text-forest-950 text-base leading-snug mb-2 group-hover:text-forest-700 transition-colors">{story.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{story.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
