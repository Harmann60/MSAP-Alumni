import { Link } from 'react-router-dom';

const STORIES = [
  {
    id: 1,
    title: "From Pune to Silicon Valley: One Alumnus's 30-Year Journey",
    category: "Alumni Spotlight",
    readTime: "4 min read",
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    excerpt: 'How a pioneering group of Manipuri graduates in Pune shaped careers across the global tech landscape — and what brought them back to mentor the next generation.',
    author: 'Rajesh Sharma &middot; Class of 1994',
  },
  {
    id: 2,
    title: 'The Golden Jubilee: 200 Alumni, One Auditorium, 50 Years',
    category: 'Celebration',
    readTime: "5 min read",
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    excerpt: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to celebrate half a century of community, shared memories, and student solidarity.',
    author: 'Editorial Desk &middot; Pune Chapter',
  },
  {
    id: 3,
    title: 'Keeping Yaoshang Alive 1,200 km from Home',
    category: 'Culture & Tradition',
    readTime: "3 min read",
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    excerpt: 'Every March, Manipuris in Pune gather to light the sacred Yaoshang — demonstrating how cultural bonds thrive across distance through community warmth.',
    author: 'Culture Committee &middot; MSAP',
  },
];

export default function StoriesSection() {
  return (
    <section className="relative max-w-6xl mx-auto px-5 pt-10 pb-16 md:pt-14 md:pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-card text-lavender-dark text-xs font-bold uppercase tracking-wider mb-3 border-1.5 border-lavender/35 shadow-sm">
            <span>📖</span> Chronicles & Milestones
          </div>
          <h2 className="font-display text-ink text-3xl sm:text-4xl font-bold tracking-tight">
            Stories from MSAP Alumni
          </h2>
          <p className="text-stone/80 text-base mt-2 max-w-xl">
            Journeys of leadership, lifelong friendships, and 50 years of unforgettable memories.
          </p>
        </div>
        <Link
          to="/stories"
          className="group inline-flex items-center gap-2 text-lavender-dark font-bold text-sm hover:text-lavender transition-colors shrink-0"
        >
          <span>View all stories</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {STORIES.map((story) => (
          <Link
            key={story.id}
            to="/stories"
            className="group card-lift bg-card border-1.5 border-lavender/25 hover:border-lavender/70 rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(58,27,115,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(58,27,115,0.22)] transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[16/10] overflow-hidden bg-section-alt relative">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute top-3.5 left-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-lavender-dark bg-card/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-lavender/35 shadow-sm">
                  {story.category}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="text-[10px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {story.readTime}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-medium text-stone/70 mb-2.5" dangerouslySetInnerHTML={{ __html: story.author }} />
                <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 group-hover:text-lavender transition-colors">
                  {story.title}
                </h3>
                <p className="text-[14px] text-stone/85 leading-relaxed line-clamp-3 font-normal">
                  {story.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-lavender/20 text-xs font-bold text-lavender-dark group-hover:text-lavender flex items-center justify-between transition-colors">
                <span>Read Full Chronicle</span>
                <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
