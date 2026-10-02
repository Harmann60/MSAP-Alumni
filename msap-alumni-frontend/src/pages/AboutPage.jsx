import { governingBody } from '../data/governingBody';

const initials = (name) =>
  name
    .replace(/^(Prof\.|Col\.|Dr\.|Shri|Mr|Mrs|Ngongo)\s*\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

const PortraitPlaceholder = ({ name }) => (
  <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-lavender/10 px-6 py-12 text-center">
    <span
      aria-hidden="true"
      className="font-display font-bold text-lavender text-5xl md:text-6xl leading-none"
    >
      {initials(name)}
    </span>
    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lavender/70">
      Photo coming soon
    </span>
  </div>
);

const PortraitCard = ({ member, role, featured }) => (
  <figure
    className={`group border border-main bg-card ${
      featured ? 'border-t-4 border-t-lavender' : ''
    }`}
  >
    <div className="aspect-[4/5] overflow-hidden border-b border-main bg-main/30">
      {member.image ? (
        <img
          src={member.image}
          alt={`${member.name} — ${role}`}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <PortraitPlaceholder name={member.name} />
      )}
    </div>
    <figcaption className="px-5 py-4">
      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-lavender">
        {role}
      </span>
      <span
        className={`mt-1.5 block font-display text-ink font-bold leading-snug ${
          featured ? 'text-lg md:text-xl' : 'text-base md:text-lg'
        }`}
      >
        {member.name}
      </span>
    </figcaption>
  </figure>
);

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
    title: 'Golden Jubilee & Alumni Association (Est. 2024)',
    desc: 'The golden jubilee of the MSAP student community was marked in Pune and the Alumni Association was established — the founding year recorded in the association’s logo. The body formally registered in 2025 as Society No. 915/M/SR/2025.',
  },
  {
    year: '2025–Present',
    title: 'Formally registered alumni body',
    desc: 'Officially registered as Society No. 915/M/SR/2025 under the Societies Registration Act.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-[90rem] mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow mb-5">1973 to 2026 &middot; 50+ years</p>
        <h1 className="display-lg text-4xl md:text-5xl xl:text-6xl mb-3">Our heritage & governance</h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          The story of how student solidarity in Maharashtra blossomed into a global alumni community.
        </p>
      </div>

      <div className="max-w-[90rem] mx-auto px-5 pb-20 md:pb-28 space-y-20">
        {/* Mission — editorial prose */}
        <section className="max-w-3xl">
          <p className="eyebrow mb-5">Our foundational mission</p>
          <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl mb-6">Preserving camaraderie across decades</h2>
          <div className="space-y-5 text-stone text-base sm:text-[17px] leading-relaxed">
            <p>
              In 1973, Manipuri students stepping off trains at Pune Railway Station formed PMSA so
              that no student would ever feel alone in a distant city. Over five decades, thousands
              of doctors, engineers, civil servants, and artists walked the halls of Pune
              universities.
            </p>
            <p>
              In 2025, we formally registered as the{' '}
              <strong className="text-ink font-bold">Association of MSAP Alumni, Manipur (Society No. 915/M/SR/2025)</strong>{' '}
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
          <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl mb-12">50 years of community history</h2>

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
          <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl mb-3">The governing body</h2>
          <p className="font-display text-ink text-lg md:text-xl mb-2">
            Managing Committee of Association of MSAP Alumni, Manipur
          </p>
          <p className="text-stone text-base mb-10 max-w-xl">
            Office bearers, executive members and the advisory board of the Association of MSAP
            Alumni, Manipur.
          </p>

          {/* Office bearers — large portrait cards */}
          <h3 className="eyebrow mb-8">Office bearers</h3>
          <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-x-10 items-start">
            <PortraitCard member={governingBody.officeBearers[0]} role="President" featured />
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10 mt-10 lg:mt-0">
              {governingBody.officeBearers.slice(1).map((member) => (
                <PortraitCard key={member.position} member={member} role={member.position} />
              ))}
            </div>
          </div>

          {/* Executive members — 3-column profile grid */}
          <h3 className="eyebrow mt-16 mb-8">Executive members</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {governingBody.executiveMembers.map((member) => (
              <PortraitCard key={member.name} member={member} role="Executive member" />
            ))}
          </div>

          {/* Advisory board — 4-column profile grid */}
          <h3 className="eyebrow mt-16 mb-8">Advisory board</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
            {governingBody.advisoryBoard.map((member) => (
              <PortraitCard key={member.name} member={member} role="Advisory board member" />
            ))}
          </div>
        </section>

        {/* Registered addresses */}
        <section>
          <p className="eyebrow mb-5">Registered secretariat</p>
          <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl mb-10">Official addresses</h2>
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
                Orange County II, Baner Pashan Link Road, Pune 411 021
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
          </div>
        </section>
      </div>
    </div>
  );
}