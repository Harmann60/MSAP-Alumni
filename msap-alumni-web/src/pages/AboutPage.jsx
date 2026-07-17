import { Link } from 'react-router-dom';

const TIMELINE = [
  { year: '1973', title: 'Founded as PMSA', desc: 'The Pune Manipuri Students Association was created to help Manipuri students settling in Pune for education.' },
  { year: '1987', title: 'Becomes MSAP', desc: 'Renamed to the Manipuri Students\' Association Pune, with a broader scope and growing membership.' },
  { year: '2000s', title: 'Decades of tradition', desc: 'Holi, Yaoshang, and cultural events became annual fixtures in Pune\'s Manipuri calendar.' },
  { year: '2024', title: 'Golden Jubilee', desc: '50 years celebrated at Symbiosis Ishanya Auditorium, Pune. The milestone led to the decision to formalize as an alumni body.' },
  { year: '2025', title: 'Registered as a society', desc: 'Formally registered (No. 915/M/SR/2025) at Sagolband Moirang Leirak, Imphal West.' },
];

const COMMITTEE = [
  { role: 'President', name: 'TBD', note: 'To be verified by committee' },
  { role: 'Secretary', name: 'General Secretary', note: 'Administrative head' },
  { role: 'Treasurer', name: 'Finance & Accounts', note: 'Manages all FDs & balances' },
  { role: 'Member', name: 'Executive Members', note: 'Elected body representatives' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">About us</h1>
        <p className="text-muted text-sm">Our history, governance, and how to reach us.</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-16 md:pb-24 space-y-16">
        {/* Mission */}
        <div className="max-w-2xl">
          <h2 className="font-display text-ink text-2xl mb-4">What this is</h2>
          <p className="text-muted leading-relaxed">
            In 1973, Manipuri students arriving in Pune formed a small welfare group called PMSA. Over 50 years, it grew into a community of hundreds. In 2025, we formally registered as an alumni association — Society No. 915/M/SR/2025 — to keep this community connected across cities, careers, and generations.
          </p>
        </div>

        {/* Divider */}
        <div className="meitei-rule text-ink">
          <div className="meitei-rule-diamond" />
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-display text-ink text-2xl mb-8">Our history</h2>
          <div className="relative">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative pl-10 pb-10 last:pb-0">
                {/* Vertical line */}
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-[9px] top-[14px] bottom-0 w-px bg-parchment-dark" />
                )}
                {/* Dot */}
                <div className="absolute left-0 top-[5px] w-[19px] h-[19px] rounded-full border-2 border-ink bg-parchment z-10" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-vermilion">{item.year}</span>
                  <h3 className="font-display text-ink text-lg mt-1 mb-1">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance */}
        <div>
          <h2 className="font-display text-ink text-2xl mb-2">Governing body</h2>
          <p className="text-sm text-muted mb-6">A democratically elected executive committee manages the association.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMMITTEE.map((m, i) => (
              <div key={i} className="p-5 bg-parchment-dark">
                <div className="font-display text-ink text-lg">{m.name}</div>
                <div className="text-xs font-semibold text-vermilion mt-1">{m.role}</div>
                {m.note && <div className="text-xs text-muted mt-1">{m.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-ink text-2xl mb-4">Contact</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-ink">Email</div>
                <a href="mailto:alumni.msap1973@gmail.com" className="text-vermilion hover:underline">alumni.msap1973@gmail.com</a>
              </div>
              <div>
                <div className="font-semibold text-ink">Address</div>
                <p className="text-muted">Sagolband Moirang Leirak, Imphal West, 795001</p>
              </div>
              <div>
                <div className="font-semibold text-ink">Registration</div>
                <p className="text-muted">Society No. 915/M/SR/2025</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-ink text-2xl mb-4">Common questions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-ink">How do I join?</div>
                <p className="text-muted mt-0.5">Visit the <Link to="/register" className="text-vermilion hover:underline">registration page</Link>. Admin verifies within 3–5 days.</p>
              </div>
              <div>
                <div className="font-semibold text-ink">Who can be a member?</div>
                <p className="text-muted mt-0.5">Any former student from Pune who identifies with the Manipuri community.</p>
              </div>
              <div>
                <div className="font-semibold text-ink">How can I volunteer?</div>
                <p className="text-muted mt-0.5">Email alumni.msap1973@gmail.com with your interests.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
