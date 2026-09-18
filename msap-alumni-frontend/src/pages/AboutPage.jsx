import { Link } from 'react-router-dom';

const TIMELINE = [
  {
    year: '1973',
    title: 'Founded as PMSA (Pune Manipuri Students Association)',
    desc: 'Pioneering Manipuri students arriving in Pune formed an informal brotherhood and welfare union to support each other in housing, academics, and cultural solidarity.',
  },
  {
    year: '1987',
    title: 'Formalized as MSAP',
    desc: 'Renamed to the Manipuri Students\' Association Pune, establishing a formal constitution, executive body, and expanding cultural celebrations across universities.',
  },
  {
    year: '2000–2020s',
    title: 'Decades of cultural & academic tradition',
    desc: 'Annual Yaoshang sports, Ningol Chakouba, freshers meets, and blood donation drives became cherished fixtures in Pune’s student landscape.',
  },
  {
    year: '2024',
    title: 'Golden Jubilee Reunion (50 Years)',
    desc: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium, Pune, commemorating 50 golden years and initiating the formal alumni network.',
  },
  {
    year: '2025–Present',
    title: 'Formally registered alumni body',
    desc: 'Officially registered as Society No. 915/M/SR/2025 under the Societies Registration Act with chapters across Pune, Imphal, Bengaluru, and globally.',
  },
];

const COMMITTEE = [
  { role: 'President', name: 'Alumni Executive Council', note: 'Elected leadership & strategic direction' },
  { role: 'General Secretary', name: 'Secretariat Office', note: 'Alumni registry, chapter coordination & communications' },
  { role: 'Treasurer & Accounts', name: 'Finance Committee', note: 'Manages audits, bank accounts & financial transparency' },
  { role: 'Advisory Board', name: 'Senior Alumni Guild', note: '1973–1995 veteran alumni council' },
];

export default function AboutPage() {
  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow mb-5">1973 to 2026 &middot; 50+ years</p>
        <h1 className="display-lg text-4xl md:text-5xl mb-3">Our heritage & governance</h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          The story of how student solidarity in Maharashtra blossomed into a global alumni community.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-20 md:pb-28 space-y-20">
        {/* Mission — editorial prose */}
        <section className="max-w-3xl">
          <p className="eyebrow mb-5">Our foundational mission</p>
          <h2 className="display-lg text-3xl sm:text-4xl mb-6">Preserving camaraderie across decades</h2>
          <div className="space-y-5 text-stone text-base sm:text-[17px] leading-relaxed">
            <p>
              In 1973, Manipuri students stepping off trains at Pune Railway Station formed PMSA so
              that no student would ever feel alone in a distant city. Over five decades, thousands
              of doctors, engineers, civil servants, and artists walked the halls of Pune
              universities.
            </p>
            <p>
              In 2025, we formally registered as the{' '}
              <strong className="text-ink font-bold">Association of MSAP Alumni (Society No. 915/M/SR/2025)</strong>{' '}
              to preserve this brotherhood and sisterhood, mentor aspiring students, and support each
              other through every stage of life.
            </p>
          </div>
          <p className="mt-7 text-sm text-muted">
            Registered Society 915/M/SR/2025 &middot; Imphal West &amp; Pune
          </p>
        </section>

        {/* Cultural divider */}
        <div className="meitei-rule text-lavender/50">
          <div className="meitei-rule-diamond" />
        </div>

        {/* Timeline — ruled, not carded */}
        <section>
          <p className="eyebrow mb-5">Timeline of milestones</p>
          <h2 className="display-lg text-3xl sm:text-4xl mb-12">50 years of community history</h2>

          <ol className="border-l border-main space-y-0">
            {TIMELINE.map((item) => (
              <li key={item.year} className="relative pl-8 pb-12 last:pb-0">
                <span
                  className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-lavender border-2 border-page"
                  aria-hidden="true"
                />
                <div className="font-display text-3xl font-bold text-lavender mb-1.5">{item.year}</div>
                <h3 className="font-display text-ink text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-stone text-base leading-relaxed max-w-2xl">{item.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Governance */}
        <section>
          <p className="eyebrow mb-5">Association governance</p>
          <h2 className="display-lg text-3xl sm:text-4xl mb-4">The governing body</h2>
          <p className="text-stone text-base mb-10 max-w-xl">
            Operated under democratic bylaws and an elected alumni executive council.
          </p>

          <dl>
            {COMMITTEE.map((m) => (
              <div
                key={m.role}
                className="border-t border-main py-5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8"
              >
                <dt className="sm:w-56 shrink-0 text-xs font-bold uppercase tracking-widest text-lavender pt-1">
                  {m.role}
                </dt>
                <dd>
                  <span className="font-display text-ink text-lg font-bold block">{m.name}</span>
                  <span className="text-stone/80 text-[15px]">{m.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Registered addresses */}
        <section>
          <p className="eyebrow mb-5">Registered secretariat</p>
          <h2 className="display-lg text-3xl sm:text-4xl mb-10">Official addresses</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="border-t border-main pt-5">
              <h3 className="text-ink font-bold text-lg mb-2">Registered headquarters</h3>
              <p className="text-stone text-base leading-relaxed">
                Sagolband Moirang Leirak, Imphal West, 795001, Manipur, India
                <br />
                <span className="text-muted text-sm">Registration No. 915/M/SR/2025</span>
              </p>
            </div>
            <div className="border-t border-main pt-5">
              <h3 className="text-ink font-bold text-lg mb-2">Pune liaison office</h3>
              <p className="text-stone text-base leading-relaxed">
                FC Road / Deccan Gymkhana, Pune, Maharashtra 411004
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-main flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="mailto:alumni.msap1973@gmail.com"
              className="text-link link-underline"
            >
              alumni.msap1973@gmail.com
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <Link to="/accounts" className="text-link">
              View financial transparency &amp; audit ledger
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}