import { Link } from 'react-router-dom';

const TIMELINE = [
  { year: '1973', title: 'Roots are Planted', desc: 'Founded as the Pune Manipuri Students Association (PMSA) to assist Manipuri students relocating to Pune for education.' },
  { year: '1987', title: 'Evolution to MSAP', desc: 'Transitioned and officially renamed to the Manipuri Students\' Association Pune (MSAP), expanding scope and membership.' },
  { year: '2000s', title: 'Decades of Service', desc: 'Continued community building across multiple decades — Holi, Yaoshang, and cultural events became annual traditions.' },
  { year: '2024', title: 'The Golden Jubilee', desc: 'Celebrated 50 proud years at Symbiosis Ishanya Auditorium, Pune. The milestone sparked the formal decision to create an alumni unit.' },
  { year: '2025', title: 'MSAP Alumni Registered', desc: 'Formally registered as a society (No. 915/M/SR/2025) at Sagolband Moirang Leirak, Imphal West, marking a new chapter.' },
];

const COMMITTEE = [
  { role: 'President', name: 'TBD', note: 'Verified by Committee' },
  { role: 'Secretary', name: 'General Secretary', note: 'Administrative head' },
  { role: 'Treasurer', name: 'Finance & Accounts', note: 'Manages all FDs & balances' },
  { role: 'Member', name: 'Executive Members', note: 'Elected body representatives' },
];

export default function AboutPage() {
  return (
    <div className="animate-slideUp">
      {/* Page header */}
      <div className="bg-forest-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">About Us</h1>
          <p className="text-forest-200/70 text-sm">Our story, governance, and the people behind MSAP Alumni.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        {/* Mission statement */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-forest-950 mb-4">Our Mission</h2>
          <p className="text-gray-500 leading-relaxed text-base">
            From a small student welfare body in 1973 to a formally registered alumni association — five decades of brotherhood, culture, and community. MSAP Alumni bridges the gap between Manipuri students who studied in Pune and builds lasting connections across generations.
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-forest-950 text-lg mb-8 flex items-center gap-2">
            <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historical Timeline
          </h3>
          <div className="relative">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative pl-10 pb-8 last:pb-0">
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-forest-500 border-4 border-white shadow-md z-10" />
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gradient-to-b from-forest-300 to-forest-100" />
                )}
                <div className="bg-cream-50 rounded-xl p-5 border border-cream-200 hover:shadow-md transition-shadow">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-50 px-3 py-1 rounded-full mb-2 border border-forest-100">
                    {item.year}
                  </span>
                  <h4 className="font-bold text-forest-950 text-base mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-forest-950 text-lg mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            Governing Body
          </h3>
          <p className="text-sm text-gray-400 mb-6">The association is managed by a democratically elected executive committee.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMMITTEE.map((m, i) => (
              <div key={i} className="bg-cream-50 rounded-xl p-5 border border-cream-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-forest-100 text-forest-700 font-bold text-base flex items-center justify-center shrink-0">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-forest-950 text-sm">{m.name}</div>
                  <div className="text-xs text-forest-600 font-medium">{m.role}</div>
                  {m.note && <div className="text-xs text-gray-400 mt-0.5">{m.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-forest-950 text-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact Us
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-forest-950">Email</div>
                  <a href="mailto:alumni.msap1973@gmail.com" className="text-forest-600 hover:text-forest-800 transition-colors">alumni.msap1973@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-forest-950">Address</div>
                  <p className="text-gray-500">Sagolband Moirang Leirak, Imphal West, 795001</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-forest-950">Registration</div>
                  <p className="text-gray-500">Society No. 915/M/SR/2025</p>
                </div>
              </div>
            </div>
            <div className="bg-forest-50 rounded-xl p-6 border border-forest-100">
              <h4 className="font-bold text-forest-950 text-sm mb-3">Frequently Asked Questions</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-forest-800">How do I join?</div>
                  <p className="text-gray-500 mt-0.5">Visit our <Link to="/register" className="text-forest-600 underline">registration page</Link> and fill out the form. Admin will verify within 3-5 days.</p>
                </div>
                <div>
                  <div className="font-semibold text-forest-800">Who can be a member?</div>
                  <p className="text-gray-500 mt-0.5">Any former student from Pune who identifies with the Manipuri community.</p>
                </div>
                <div>
                  <div className="font-semibold text-forest-800">How can I volunteer?</div>
                  <p className="text-gray-500 mt-0.5">Email us at alumni.msap1973@gmail.com with your interests and we'll get you involved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
