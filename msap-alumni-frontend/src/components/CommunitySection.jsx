import { Link } from 'react-router-dom';

const CHAPTERS = [
  { name: 'Pune Flagship Chapter', region: 'Maharashtra', members: '850+ Alumni' },
  { name: 'Imphal & Manipur Chapter', region: 'North East', members: '620+ Alumni' },
  { name: 'Bengaluru Tech Network', region: 'Karnataka', members: '340+ Alumni' },
  { name: 'Delhi NCR Chapter', region: 'Capital Region', members: '290+ Alumni' },
  { name: 'Global Diaspora Circle', region: 'US, UK, Europe, SEA', members: '180+ Alumni' },
  { name: 'Young Alumni & Mentorship', region: 'Recent Grads (2020–2026)', members: '410+ Members' },
];

export default function CommunitySection() {
  return (
    <section className="relative max-w-6xl mx-auto px-5 py-16 md:py-24">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: highlighted statement card */}
        <div className="lg:col-span-5 section-highlight-card p-8 sm:p-10 relative overflow-hidden">
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-page text-lavender-dark text-xs font-bold uppercase tracking-wider mb-4 border-1.5 border-lavender/35 shadow-sm">
              Regional Chapters & Networks
            </div>

            <h2 className="font-display text-ink text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Connect Across Cities & Generations
            </h2>

            <p className="text-stone text-[15px] leading-relaxed mb-6 font-normal">
              MSAP Alumni connects Manipuri graduates from Pune across continents, industries, and decades. Whether you left Pune last year or in 1980, your alumni family is here to support, mentor, and celebrate with you.
            </p>

            <div className="pt-2">
              <Link
                to="/community"
                className="group inline-flex items-center gap-2 bg-lavender hover:bg-lavender-dark text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md text-sm hover:-translate-y-0.5"
              >
                <span>Browse All Regional Chapters</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: action cards grid */}
        <div className="lg:col-span-7">
          <div className="grid sm:grid-cols-2 gap-4">
            {CHAPTERS.map((chapter, idx) => (
              <Link
                key={idx}
                to="/community"
                className="group card-lift flex items-center justify-between p-4.5 bg-card border-1.5 border-lavender/25 hover:border-lavender/70 rounded-2xl transition-all shadow-[0_4px_16px_rgba(58,27,115,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(58,27,115,0.2)]"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-11 h-11 rounded-xl bg-page border border-lavender/25 text-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-lavender transition-all">
                    {chapter.icon}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-ink group-hover:text-lavender transition-colors leading-tight">
                      {chapter.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted font-medium">{chapter.region}</span>
                      <span className="text-[10px] text-lavender-dark font-bold bg-lavender-soft px-2.5 py-0.5 rounded-full border border-lavender/30">
                        {chapter.members}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-page border border-lavender/25 flex items-center justify-center text-muted group-hover:bg-lavender group-hover:text-white group-hover:border-lavender transition-all shrink-0 ml-2">
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
