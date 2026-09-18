import { Link } from 'react-router-dom';

const CHAPTERS = [
  { name: 'Pune', region: 'Maharashtra — Flagship chapter', members: '850+ alumni' },
  { name: 'Imphal & Manipur', region: 'North East India', members: '620+ alumni' },
  { name: 'Bengaluru', region: 'Karnataka — Technology network', members: '340+ alumni' },
  { name: 'Delhi NCR', region: 'National Capital Region', members: '290+ alumni' },
  { name: 'Mumbai', region: 'Maharashtra — Western corridor', members: '200+ alumni' },
  { name: 'Global diaspora', region: 'United States, UK, Europe, SE Asia', members: '180+ alumni' },
];

export default function CommunitySection() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-4">Our network</p>
          <h2 className="display-lg text-3xl sm:text-4xl mb-4">Connect across cities & generations</h2>
          <p className="text-stone text-[15px] leading-relaxed mb-7">
            Whether you left Pune last year or in 1980, your alumni family is here — across regional
            chapters, professional circles, and mentorship networks.
          </p>
          <Link
            to="/community"
            className="inline-block bg-lavender hover:bg-lavender-dark text-white text-[15px] font-bold px-7 py-3.5 rounded-sm transition-colors"
          >
            Browse all chapters
          </Link>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-main">
            {CHAPTERS.map((chapter) => (
              <li
                key={chapter.name}
                className="border-b border-main py-5 group"
              >
                <Link
                  to="/community"
                  className="flex items-baseline justify-between gap-4"
                >
                  <span>
                    <span className="block font-display text-ink text-lg font-bold leading-tight group-hover:text-lavender transition-colors">
                      {chapter.name}
                    </span>
                    <span className="block text-sm text-muted mt-0.5">{chapter.region}</span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-lavender shrink-0">
                    {chapter.members}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}