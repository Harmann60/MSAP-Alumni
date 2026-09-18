import { Link } from 'react-router-dom';

const TIMELINE = [
  {
    year: '1973',
    title: 'Founded as PMSA (Pune Manipuri Students Association)',
    desc: 'Pioneering Manipuri students arriving in Pune formed an informal brotherhood and welfare union to support each other in housing, academics, and cultural solidarity.',
    highlight: 'Foundation Milestone',
  },
  {
    year: '1987',
    title: 'Formalized as MSAP',
    desc: 'Renamed to the Manipuri Students\' Association Pune, establishing a formal constitution, executive body, and expanding cultural celebrations across universities.',
    highlight: 'Constitution & Name',
  },
  {
    year: '2000–2020s',
    title: 'Decades of Cultural & Academic Tradition',
    desc: 'Annual Yaoshang sports, Ningol Chakouba, freshers meets, and blood donation drives became cherished fixtures in Pune’s student landscape.',
    highlight: 'Community Life',
  },
  {
    year: '2024',
    title: 'Golden Jubilee Reunion (50 Years)',
    desc: 'Over 200 alumni gathered at Symbiosis Ishanya Auditorium, Pune, commemorating 50 golden years and initiating the formal alumni network.',
    highlight: 'Golden Jubilee',
  },
  {
    year: '2025–Present',
    title: 'Formally Registered Alumni Body',
    desc: 'Officially registered as Society No. 915/M/SR/2025 under the Societies Registration Act with chapters across Pune, Imphal, Bengaluru, and globally.',
    highlight: 'Official Society',
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
    <div className="relative bg-page min-h-[90vh]">
      {/* Header */}
      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-10 md:pt-20 md:pb-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-lavender text-xs font-bold uppercase tracking-wider mb-4 border border-main">
          <span>📜</span> 1973 to 2026 &middot; 50+ Years
        </div>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Our Heritage & Governance
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          The story of how student solidarity in Maharashtra blossomed into a global alumni community.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-20 md:pb-28 space-y-16">
        {/* Mission Statement Card */}
        <div className="bg-card border border-main rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-lavender block mb-2">
              Our Foundational Mission
            </span>
            <h2 className="font-display text-ink text-2xl sm:text-3xl font-bold mb-4">
              Preserving Camaraderie Across Decades
            </h2>
            <p className="text-stone text-base leading-relaxed mb-4">
              In 1973, Manipuri students stepping off trains at Pune Railway Station formed PMSA so that no student would ever feel alone in a distant city. Over five decades, thousands of doctors, engineers, civil servants, and artists walked the halls of Pune universities.
            </p>
            <p className="text-stone text-base leading-relaxed">
              In 2025, we formally registered as the <strong className="text-ink">Association of MSAP Alumni (Society No. 915/M/SR/2025)</strong> to preserve this brotherhood and sisterhood, mentor aspiring students, and support each other through every stage of life.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-page text-xs font-bold text-ink border border-main">
                🏛 Registered Society: 915/M/SR/2025
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-page text-xs font-bold text-ink border border-main">
                📍 Imphal West & Pune
              </span>
            </div>
          </div>
        </div>

        {/* Cultural Divider */}
        <div className="meitei-rule text-lavender/50">
          <div className="meitei-rule-diamond bg-lavender/60" />
        </div>

        {/* 50-Year Interactive Timeline */}
        <div>
          <div className="mb-10 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-lavender block mb-2">
              Timeline of Milestones
            </span>
            <h2 className="font-display text-ink text-3xl font-bold">50 Years of Community History</h2>
          </div>

          <div className="relative pl-6 sm:pl-10 space-y-10 before:absolute before:left-3 before:sm:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-lavender/30">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative group">
                {/* Node circle */}
                <div className="absolute -left-6 sm:-left-10 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-page border-2 border-lavender shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-lavender" />
                </div>

                <div className="bg-card border border-main hover:border-lavender/50 p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-display text-2xl font-bold text-lavender">{item.year}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted bg-page px-2.5 py-0.5 rounded-md border border-main">
                      {item.highlight}
                    </span>
                  </div>
                  <h3 className="font-display text-ink text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance & Leadership */}
        <div>
          <div className="mb-8 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-lavender block mb-2">
              Association Governance
            </span>
            <h2 className="font-display text-ink text-3xl font-bold">The Governing Body</h2>
            <p className="text-stone text-sm mt-1">
              Operated under democratic bylaws and an elected alumni executive council.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {COMMITTEE.map((m, i) => (
              <div
                key={i}
                className="p-6 bg-card border border-main rounded-2xl shadow-sm hover:border-lavender/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-lavender mb-1">
                    {m.role}
                  </div>
                  <div className="font-display text-ink text-xl font-bold">{m.name}</div>
                  <p className="text-stone/80 text-sm mt-2">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information & Registered Address */}
        <div className="bg-card border border-main rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-lavender block mb-2">
                Registered Secretariat
              </span>
              <h3 className="font-display text-ink text-2xl font-bold mb-4">Official Addresses</h3>
              <p className="text-stone text-sm leading-relaxed mb-4">
                <strong>Registered Headquarters:</strong><br />
                Sagolband Moirang Leirak, Imphal West, 795001, Manipur, India<br />
                Registration No. 915/M/SR/2025
              </p>
              <p className="text-stone text-sm leading-relaxed">
                <strong>Pune Liaison Office:</strong><br />
                FC Road / Deccan Gymkhana, Pune, Maharashtra 411004
              </p>
            </div>

            <div className="flex flex-col justify-center bg-page p-6 rounded-2xl border border-main">
              <h4 className="font-display text-ink text-lg font-bold mb-2">Get in Touch</h4>
              <p className="text-stone text-xs leading-relaxed mb-4">
                For questions regarding society registration, verification documents, or chapter initiatives, reach out directly.
              </p>
              <a
                href="mailto:alumni.msap1973@gmail.com"
                className="inline-flex items-center gap-2 text-lavender font-bold text-sm hover:underline"
              >
                <span>✉️ alumni.msap1973@gmail.com</span>
              </a>
              <div className="mt-4 pt-4 border-t border-main">
                <Link to="/accounts" className="text-xs font-bold text-ink hover:text-lavender transition-colors">
                  View Financial Transparency & Audit Ledger →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
