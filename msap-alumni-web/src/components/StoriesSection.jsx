import { Link } from 'react-router-dom';

const STORIES = [
  {
    id: 1,
    title: 'From Pune to Silicon Valley: One Alumni\'s 30-Year Journey',
    source: 'MSAP Alumni Report',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    excerpt: 'How a small group of Manipuri students in Pune went on to lead careers across the globe — and what brought them back to give.',
  },
  {
    id: 2,
    title: 'The Golden Jubilee: 200 Alumni, One Auditorium, 50 Years',
    source: 'Alumni Magazine',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    excerpt: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium in Pune to mark half a century of community.',
  },
  {
    id: 3,
    title: 'Keeping Yaoshang Alive 1,200 km from Home',
    source: 'Community Spotlight',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    excerpt: 'Every March, Manipuris in Pune gather to light the Yaoshang — and prove that culture travels with people, not just places.',
  },
];

export default function StoriesSection() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="font-display text-ink text-2xl md:text-3xl">From the community</h2>
        </div>
        <Link to="/stories" className="text-vermilion text-sm font-medium hover:underline">
          All stories &rarr;
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {STORIES.map((story) => (
          <Link key={story.id} to="/stories" className="group">
            <div className="aspect-[16/10] overflow-hidden bg-parchment-dark mb-3">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-1.5">{story.source}</div>
            <h3 className="font-display text-ink text-lg leading-snug mb-1.5 group-hover:text-vermilion transition-colors">{story.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{story.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
