import React, { useState } from 'react';
const LOGO = '/logo.png';

const NAV_TABS = ['Home', 'History & Governance', 'Register', 'Accounts & Transparency'];

// ── Reusable Components ──────────────────────────────────────────────────────

function StatCard({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-bold font-display text-brand-300">{value}</div>
      <div className="text-xs text-slate-300 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-royal-50 text-royal-700 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-brand-400 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-base text-royal-950 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function TimelineItem({ year, title, desc, isLast }) {
  return (
    <div className="relative pl-10 pb-8">
      <div className={`absolute left-0 top-1 w-5 h-5 rounded-full bg-brand-400 border-4 border-white shadow-md z-10`} />
      {!isLast && <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gradient-to-b from-brand-300 to-royal-200" />}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-2">{year}</span>
        <h4 className="font-bold text-royal-950 text-base mb-1">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CommitteeCard({ role, name, note }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-full bg-royal-100 text-royal-800 font-bold text-base flex items-center justify-center flex-shrink-0">
        {name.charAt(0)}
      </div>
      <div>
        <div className="font-semibold text-royal-950 text-sm">{name}</div>
        <div className="text-xs text-brand-600 font-medium">{role}</div>
        {note && <div className="text-xs text-slate-400 mt-0.5">{note}</div>}
      </div>
    </div>
  );
}

// ── Page Sections ─────────────────────────────────────────────────────────────

function HomePage({ onRegister }) {
  return (
    <div className="animate-slideUp space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal-950 via-royal-800 to-indigo-900 text-white px-8 py-14 md:px-14 md:py-20 shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center gap-10">
          {/* Logo — hero feature */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-44 h-44 md:w-52 md:h-52 bg-white/10 backdrop-blur rounded-full p-3 shadow-2xl border border-white/20">
              <img src={LOGO} alt="Association of MSAP Alumni Logo" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-brand-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              Est. 1973 · Pune, Maharashtra
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display leading-tight mb-5">
              Welcome Back,<br />
              <span className="text-brand-300">Pune Manipuris</span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
              Strengthening bonds forged in Pune. A unified platform bridging alumni from the 1973 PMSA roots up to the registered MSAP of today.
            </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onRegister}
              className="bg-brand-400 hover:bg-brand-500 text-royal-950 font-bold px-7 py-3 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Join the Network →
            </button>
            <a
              href="mailto:alumni.msap1973@gmail.com"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 rounded-xl border border-white/20 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
          </div>{/* end flex-1 */}
        </div>{/* end flex row */}

        {/* Stats bar */}
        <div className="relative mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="🎓" value="50+" label="Years of Legacy" />
          <StatCard icon="🏙️" value="Pune" label="Chapter City" />
          <StatCard icon="📜" value="Regd." label="Society No. 915" />
          <StatCard icon="🤝" label="Growing Network" value="Active" />
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h3 className="text-xl font-bold text-royal-950 mb-6 text-center">Why Join the Alumni Network?</h3>
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard icon="📋" title="Registered Body" desc="Officially registered under the Manipur Societies Registration Act (Regd. No. 915/M/SR/2025), providing a legitimate and trusted platform." />
          <FeatureCard icon="💡" title="Full Transparency" desc="Open-book financial reporting — community contributions, trust balances, and audit reports are publicly accessible on this platform." />
          <FeatureCard icon="🌐" title="Career & Mentorship" desc="Connect with established alumni from diverse industries who built their careers after studying in Pune." />
        </div>
      </div>

      {/* Notice/Announcement banner */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 flex items-start gap-4">
        <div className="text-brand-500 text-2xl mt-0.5">📢</div>
        <div>
          <h4 className="font-bold text-brand-800 mb-1">Annual Meet 2026 — Registration Open</h4>
          <p className="text-sm text-brand-700 leading-relaxed">
            The yearly alumni gathering is being planned. All former students of Pune who are Manipuri are encouraged to register and participate. Details will be shared via email.
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  const timeline = [
    { year: '1973', title: 'Roots are Planted', desc: 'Founded as the Pune Manipuri Students Association (PMSA) to assist Manipuri students relocating to Pune for education.' },
    { year: '1987', title: 'Evolution to MSAP', desc: 'Transitioned and officially renamed to the Manipuri Students\' Association Pune (MSAP), expanding scope and membership.' },
    { year: '2000s', title: 'Decades of Service', desc: 'Continued community building across multiple decades — Holi, Yaoshang, and cultural events became annual traditions.' },
    { year: '2024', title: 'The Golden Jubilee', desc: 'Celebrated 50 proud years at Symbiosis Ishanya Auditorium, Pune. The milestone sparked the formal decision to create an alumni unit.' },
    { year: '2025', title: 'MSAP Alumni Registered', desc: 'Formally registered as a society (No. 915/M/SR/2025) at Sagolband Moirang Leirak, Imphal West, marking a new chapter.' },
  ];

  const committee = [
    { role: 'President', name: 'Tbd — Verified by Committee', note: 'contact: alumni.msap1973@gmail.com' },
    { role: 'Secretary', name: 'General Secretary', note: 'Administrative head' },
    { role: 'Treasurer', name: 'Finance & Accounts', note: 'Manages all FDs & balances' },
    { role: 'Member', name: 'Executive Members', note: 'Elected body representatives' },
  ];

  return (
    <div className="animate-slideUp space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold font-display text-royal-950 mb-3">Our Story</h2>
        <p className="text-slate-500 leading-relaxed">From a small student welfare body in 1973 to a formally registered alumni association — five decades of brotherhood, culture, and community.</p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="font-bold text-royal-950 text-lg mb-6 flex items-center gap-2">
          <span className="text-brand-400">📅</span> Historical Timeline
        </h3>
        <div>
          {timeline.map((item, i) => (
            <TimelineItem key={i} {...item} isLast={i === timeline.length - 1} />
          ))}
        </div>
      </div>

      {/* Governance */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h3 className="font-bold text-royal-950 text-lg mb-2 flex items-center gap-2">
          <span className="text-brand-400">🏛️</span> Governing Body
        </h3>
        <p className="text-sm text-slate-400 mb-6">The association is managed by a democratically elected executive committee.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {committee.map((m, i) => <CommitteeCard key={i} {...m} />)}
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', puneCollege: '', batchYear: '', currentLocation: '', profession: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animate-slideUp max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-extrabold font-display text-royal-950 mb-3">Registration Submitted!</h2>
        <p className="text-slate-500 mb-6 leading-relaxed">Thank you, <strong>{formData.fullName}</strong>. Your registration has been sent to the admin queue for verification. You'll hear from us at <strong>{formData.email}</strong>.</p>
        <button onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', puneCollege: '', batchYear: '', currentLocation: '', profession: '' }); }} className="bg-royal-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-royal-800 transition-colors">
          Register Another
        </button>
      </div>
    );
  }

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label className="block text-sm font-semibold text-royal-950 mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} required={required}
        className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all placeholder:text-slate-300" />
    </div>
  );

  return (
    <div className="animate-slideUp max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-royal-950 to-royal-800 text-white px-8 py-6">
          <h2 className="text-2xl font-extrabold font-display mb-1">Alumni Onboarding</h2>
          <p className="text-slate-300 text-sm">Register to verify your alumni status and join the searchable directory.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full Name" name="fullName" placeholder="Your full name" required />
            <Field label="Email Address" name="email" type="email" placeholder="you@email.com" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone Number" name="phone" placeholder="+91 98765 43210" />
            <Field label="Pune College Attended" name="puneCollege" placeholder="e.g. Symbiosis, Ferguson, MIT" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Batch / Passing Year" name="batchYear" type="number" placeholder="e.g. 2012" />
            <Field label="Current Location" name="currentLocation" placeholder="City, Country" />
          </div>
          <Field label="Current Profession / Designation" name="profession" placeholder="e.g. Software Engineer at TCS" />

          <div className="pt-2">
            <button type="submit" className="w-full bg-gradient-to-r from-royal-900 to-royal-700 hover:from-royal-800 hover:to-royal-600 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              Submit Registration
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">Submissions are reviewed by admin within 3–5 days.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccountsPage() {
  const accounts = [
    { category: 'Fixed Deposits Asset', balance: '₹3,50,000', status: 'Verified', statusColor: 'emerald' },
    { category: 'Savings Account Balance', balance: '₹1,24,350', status: 'Verified', statusColor: 'emerald' },
    { category: 'Annual Membership Corpus', balance: '₹42,000', status: 'Audited', statusColor: 'blue' },
    { category: 'Event & Cultural Fund', balance: '₹18,500', status: 'Active', statusColor: 'amber' },
  ];

  const total = '₹5,34,850';

  return (
    <div className="animate-slideUp space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold font-display text-royal-950 mb-3">Financial Transparency</h2>
        <p className="text-slate-500 leading-relaxed">Open-book reporting of all fixed deposits, savings, and operational funds. Updated quarterly.</p>
      </div>

      {/* Total balance highlight */}
      <div className="bg-gradient-to-br from-royal-950 to-indigo-900 text-white rounded-2xl p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-300 mb-2">Total Assets Under Management</p>
        <div className="text-5xl font-extrabold font-display text-brand-300 mb-1">{total}</div>
        <p className="text-slate-400 text-sm">As of FY 2025–26 · All figures independently verified</p>
      </div>

      {/* Accounts table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-royal-950">Financial Registry</h3>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1 rounded-full border border-emerald-200">✓ All accounts verified</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Account / Category</th>
                <th className="px-6 py-3 text-right">Balance</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-royal-950">{row.category}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">{row.balance}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                      ${row.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                      ${row.statusColor === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                      ${row.statusColor === 'amber' ? 'bg-brand-50 text-brand-700 border border-brand-200' : ''}
                    `}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-royal-50">
              <tr>
                <td className="px-6 py-4 font-bold text-royal-950">Total</td>
                <td className="px-6 py-4 text-right font-mono font-extrabold text-royal-900 text-base">{total}</td>
                <td className="px-6 py-4" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 flex gap-3 items-start">
        <span className="text-xl">📌</span>
        <p className="text-sm text-brand-800 leading-relaxed">
          For full audit reports, bank statements, or queries, contact the treasurer at <a href="mailto:alumni.msap1973@gmail.com" className="font-semibold underline">alumni.msap1973@gmail.com</a>. RTI-style requests are welcomed.
        </p>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const goTo = (tab) => { setActiveTab(tab); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navigation */}
      <nav className="bg-royal-950 text-white sticky top-0 z-50 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => goTo('Home')}>
            <img src={LOGO} alt="MSAP Alumni Logo" className="w-11 h-11 object-contain drop-shadow-md" />
            <div>
              <div className="font-bold text-base leading-tight">MSAP Alumni</div>
              <div className="text-xs text-slate-400 leading-none">Pune Chapter · Est. 1973</div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_TABS.map(tab => (
              <button key={tab} onClick={() => goTo(tab)}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab ? 'bg-brand-400 text-royal-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(v => !v)}>
            <div className={`w-5 h-0.5 bg-white transition-all mb-1.5 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-white transition-all mb-1.5 ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-royal-900 border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {NAV_TABS.map(tab => (
              <button key={tab} onClick={() => goTo(tab)}
                className={`text-left text-sm font-medium px-4 py-2.5 rounded-lg transition-all ${activeTab === tab ? 'bg-brand-400 text-royal-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
                {tab}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === 'Home' && <HomePage onRegister={() => goTo('Register')} />}
        {activeTab === 'History & Governance' && <HistoryPage />}
        {activeTab === 'Register' && <RegisterPage />}
        {activeTab === 'Accounts & Transparency' && <AccountsPage />}
      </main>

      {/* Footer */}
      <footer className="bg-royal-950 text-slate-400 mt-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={LOGO} alt="MSAP Alumni Logo" className="w-9 h-9 object-contain" />
              <span className="text-white font-semibold">MSAP Alumni</span>
            </div>
            <p className="leading-relaxed">Serving the Manipuri community in Pune and beyond since 1973.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {NAV_TABS.map(t => <button key={t} onClick={() => goTo(t)} className="text-left hover:text-brand-300 transition-colors">{t}</button>)}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p>📧 <a href="mailto:alumni.msap1973@gmail.com" className="hover:text-brand-300 transition-colors">alumni.msap1973@gmail.com</a></p>
            <p className="mt-2">📍 Sagolband Moirang Leirak, Imphal West, 795001</p>
            <p className="mt-2">📜 Society No. 915/M/SR/2025</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
          © 2026 Association of MSAP Alumni. All rights reserved.
        </div>
      </footer>
    </div>
  );
}