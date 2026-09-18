import { Link } from 'react-router-dom';

const STORIES = [
  {
    id: 1,
    title: "From Pune to Silicon Valley: One Alumnus's 30-Year Journey",
    category: 'Alumni Spotlight',
    date: 'June 2026',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
    excerpt:
      'How a pioneering group of Manipuri graduates in Pune shaped careers across the global technology landscape — and what brought them back to mentor the next generation.',
    author: 'Rajesh Sharma &middot; Class of 1994',
  },
  {
    id: 2,
    title: 'The Golden Jubilee: 200 Alumni, One Auditorium, 50 Years',
    category: 'Celebration',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
    excerpt:
      'Over 200 alumni gathered at Symbiosis Ishanya Auditorium to celebrate half a century of community, shared memories, and student solidarity.',
    author: 'Editorial Desk &middot; Pune Chapter',
  },
  {
    id: 3,
    title: 'Keeping Yaoshang Alive 1,200 km from Home',
    category: 'Culture & Tradition',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
    excerpt:
      'Every March, Manipuris in Pune gather to light the sacred Yaoshang — cultural bonds that thrive across distance through community warmth.',
    author: 'Culture Committee &middot; MSAP',
  },
];

export default function StoriesSection() {
  const [featured, ...rest] = STORIES;

  return (
    <section className="max-w-7xl mx-auto px-5 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow mb-4">01 &mdash; Alumni chronicles</p>
          <h2 className="display-lg text-3xl sm:text-4xl md:text-[2.75rem]">Stories from our alumni</h2>
          <p className="text-stone text-base sm:text-lg mt-4 max-w-xl">
            Journeys of leadership, lifelong friendship, and fifty years of memories — told in the
            voices of the people who lived them.
          </p>
        </div>
        <Link to="/stories" className="text-link link-underline shrink-0 mb-1">
          All stories
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Featured editorial spread */}
      <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14">
        {featured.image ? (
          <div className="lg:col-span-7">
            <div className="media-frame">
              <div className="aspect-[4/3] sm:aspect-[16/10] bg-section-alt overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7">
            <div
              className="border border-main border-t-4 border-t-lavender flex items-center justify-center min-h-[16rem] sm:min-h-[20rem] bg-card"
              aria-hidden="true"
            >
              <span className="font-display text-lavender italic text-7xl leading-none select-none">“</span>
            </div>
          </div>
        )}
        <div className="lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-lavender mb-3">
            {featured.category} &middot; {featured.date}
          </p>
          <h3 className="font-display text-ink text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {featured.title}
          </h3>
          <p className="text-stone text-base leading-relaxed mb-5">{featured.excerpt}</p>
          <Link to="/stories" className="text-link link-underline">
            Read the full chronicle
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </article>

      {/* Supporting editorial rows */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {rest.map((story) => (
          <article key={story.id} className="border-t border-main pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted mb-2">
              {story.category} &middot; {story.date}
            </p>
            <h3 className="font-display text-ink text-xl font-bold leading-snug mb-3 hover:text-lavender transition-colors">
              <Link to="/stories">{story.title}</Link>
            </h3>
            <p className="text-stone/85 text-[15px] leading-relaxed line-clamp-2 mb-4">
              {story.excerpt}
            </p>
            <Link to="/stories" className="text-link">
              Read
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}