import { useState } from 'react';
import { Link } from 'react-router-dom';

const LIFETIME_PERKS = [
  'Permanent Life Member ID and Official Society Certificate',
  'Full voting & resolution rights in the Annual General Body Meeting (AGBM)',
  'Permanent listing in the verified Alumni Directory & Worldwide Network',
  'VIP invitations & priority access to all state & national reunions & Golden Jubilee meets',
  'Direct participation in student welfare, scholarships & emergency relief funds',
  'Official MSAP Alumni lapel pin, keepsake & membership souvenir',
  'Access to cross-industry mentorship & professional referrals across 50 batches',
  'Invitations to annual New Year get-togethers, cultural meets & plantation drives',
];

const PERKS_GRID = [
  {
    icon: '🤝',
    title: '50-Year Cross-Batch Network',
    desc: 'Connect with senior administrators, doctors, engineers, advocates, artists, and entrepreneurs who studied in Pune from 1973 to present.',
  },
  {
    icon: '🧭',
    title: 'Career & Student Mentorship',
    desc: 'Offer or receive career counseling, higher education guidance, and professional insights for youth from Manipur navigating opportunities.',
  },
  {
    icon: '🌳',
    title: 'Community Impact & Initiatives',
    desc: 'Participate directly in flagship social causes like the 7-programme Tree Plantation Drive across Manipur and humanitarian outreach.',
  },
  {
    icon: '🎉',
    title: 'Annual Reunions & Gatherings',
    desc: 'Rekindle golden memories at high-profile reunions such as the 50th Golden Jubilee in Pune and annual New Year get-togethers.',
  },
  {
    icon: '🗳️',
    title: 'Governance & Society Rights',
    desc: 'Cast votes in the Annual General Body Meeting, propose resolutions, and help shape the future policies of the alumni body.',
  },
  {
    icon: '🛡️',
    title: 'Verified & Secure Directory',
    desc: 'All profiles undergo human admin verification to ensure authentic, spam-free, privacy-conscious communication.',
  },
];

const FAQS = [
  {
    q: 'How much is the membership fee and what does it cover?',
    a: 'The membership fee is ₹3,000 for a lifetime joining. This is a one-time contribution granting permanent Life Member status, official society credentials, full voting rights in the AGBM, and lifelong access to all society activities and directory listings with no recurring annual subscriptions.',
  },
  {
    q: 'Who is eligible to register for MSAP Alumni membership?',
    a: 'Any Manipuri individual who studied, lived, or graduated from any college, university, or educational institute in Pune (e.g. Pune University / SPPU, Fergusson, COEP, Symbiosis, BMCC, Bharati Vidyapeeth, DY Patil, MIT, etc.) is eligible to register as a Life Member.',
  },
  {
    q: 'How does the registration and payment process work?',
    a: 'Step 1: Fill out and submit your online registration details. (Registration is completely free at this stage).\nStep 2: Our Executive Council reviews and verifies your Pune college and batch credentials.\nStep 3: Upon approval, you will receive an official welcome email containing society payment instructions to contribute the ₹3,000 lifetime fee via UPI or bank transfer and activate your permanent credentials.',
  },
  {
    q: 'What if I do not remember my exact batch year or do not have degree documents?',
    a: 'You can provide approximate batch dates (e.g., 1994, 2005) and name your college in Pune. Our verification team coordinates with batch coordinators who frequently verify alumni through peer referrals.',
  },
  {
    q: 'How is the membership fund utilized?',
    a: 'All membership contributions go directly into the official Association of MSAP Alumni bank account and are allocated toward: 1) Student Welfare & Emergency Relief in Pune (35%), 2) Environmental & Social Drives in Manipur like tree plantation programmes (35%), and 3) Annual Reunions & Secretariat Administration (30%). Full audited accounts are presented annually to all members at the AGBM.',
  },
];

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Hero Banner */}
      <section className="border-b border-main bg-page">
        <div className="max-w-[90rem] mx-auto px-5 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-lavender bg-lavender/10 px-3 py-1 rounded-xs">
                Official Life Membership
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Est. 2024
              </span>
            </div>
            <h1 className="display-lg text-4xl sm:text-5xl md:text-6xl">
              Join the alumni network.
              <span className="block text-lavender italic font-medium mt-2">
                Preserve our heritage, mentor the future.
              </span>
            </h1>
            <p className="text-stone text-base sm:text-lg mt-6 leading-relaxed">
              Becoming a Life Member of the Association of MSAP Alumni, Manipur connects you to over 50 batches of Pune alumni worldwide.
              A single, one-time contribution of <strong>₹3,000</strong> grants permanent lifetime association privileges and full voting rights.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                to="/register"
                className="bg-lavender hover:bg-lavender-dark text-white font-bold px-8 py-4 rounded-sm transition-all shadow-[0_8px_25px_rgba(78,45,146,0.25)] text-base flex items-center gap-2"
              >
                <span>Proceed to Registration Form</span>
                <span>→</span>
              </Link>
              <a
                href="#lifetime-membership"
                className="text-stone font-semibold text-base hover:text-lavender px-4 py-3 transition-colors"
              >
                Review Lifetime Joining Details ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lifetime Membership Tier Section */}
      <section id="lifetime-membership" className="max-w-[90rem] mx-auto px-5 py-16 md:py-24 border-b border-main">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow">Official Contribution</p>
          <h2 className="display-lg text-3xl sm:text-4xl">Lifetime Membership Structure</h2>
          <p className="text-stone text-sm sm:text-base mt-3">
            One-time contribution for permanent membership. No recurring subscriptions or annual renewal hassles.
          </p>
        </div>

        {/* Highlighted Lifetime Card */}
        <div className="max-w-3xl mx-auto bg-card rounded-sm border-2 border-lavender shadow-[0_12px_40px_rgba(78,45,146,0.18)] relative overflow-hidden">
          <div className="bg-gradient-to-r from-lavender to-lavender-dark text-white px-8 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
            <span>Life Member Status</span>
            <span>Permanent Association</span>
          </div>

          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-main pb-8 mb-8">
              <div>
                <h3 className="font-display font-bold text-ink text-3xl sm:text-4xl">Life Member</h3>
                <p className="text-stone text-sm sm:text-base mt-1">
                  Permanent lifetime association status for verified Pune alumni.
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-lavender text-5xl">₹3,000</span>
                </div>
                <span className="text-xs text-muted block mt-1 font-semibold uppercase tracking-wider">
                  One-time lifetime joining
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">
                What is included in Lifetime Membership:
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                {LIFETIME_PERKS.map((perk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-stone font-medium leading-relaxed">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA action block */}
            <div className="pt-6 border-t border-main flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted">
                <span className="font-semibold text-ink">Zero upfront fees:</span> Details are submitted online first for executive committee verification.
              </div>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-lavender hover:bg-lavender-dark text-white font-bold px-8 py-3.5 rounded-sm text-sm uppercase tracking-wider transition-all shadow-md text-center shrink-0"
              >
                Fill Registration Details →
              </Link>
            </div>
          </div>
        </div>

        {/* Fund Allocation Notice */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-section-alt border border-main rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <strong className="block text-ink text-sm font-bold">100% Transparent Financial Governance</strong>
              <span>All contributions are deposited into the registered society account and audited annually before the AGBM.</span>
            </div>
          </div>
          <Link to="/about" className="text-lavender font-bold hover:underline shrink-0">
            Read Society By-Laws →
          </Link>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="max-w-[90rem] mx-auto px-5 py-16 md:py-24 border-b border-main">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow">Alumni Privileges</p>
          <h2 className="display-lg text-3xl sm:text-4xl">Why join the MSAP alumni network?</h2>
          <p className="text-stone text-sm sm:text-base mt-3">
            More than a directory: a living community dedicated to preserving Pune memories and uplifting our people.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PERKS_GRID.map((perk) => (
            <div
              key={perk.title}
              className="p-7 bg-card border border-main rounded-sm hover:border-lavender/50 transition-colors"
            >
              <span className="text-3xl p-3 bg-section-alt rounded-sm border border-main/60 inline-block mb-4">
                {perk.icon}
              </span>
              <h3 className="font-display font-bold text-ink text-xl mb-2">{perk.title}</h3>
              <p className="text-stone text-xs sm:text-[13px] leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-[90rem] mx-auto px-5 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow">Frequently Asked Questions</p>
          <h2 className="display-lg text-3xl sm:text-4xl">Queries & verification guidance</h2>
          <p className="text-stone text-sm sm:text-base mt-3">
            Everything you need to know about alumni eligibility, ₹3,000 lifetime fee, and verification process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-main bg-card rounded-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-ink text-base sm:text-lg hover:text-lavender transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className={`text-xl transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-45 text-lavender' : 'text-muted'}`}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone/85 leading-relaxed border-t border-main/40 whitespace-pre-line animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Help Banner */}
        <div className="max-w-3xl mx-auto mt-12 p-8 bg-section-alt border border-main rounded-sm text-center space-y-4">
          <h3 className="font-display text-ink text-2xl font-bold">Ready to apply for Lifetime Membership?</h3>
          <p className="text-stone text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Fill your Pune college, batch year, and contact credentials in the registration form. Our team will verify your records promptly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-ink border border-main hover:border-lavender rounded-sm transition-colors"
            >
              Contact Secretariat Desk →
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-lavender hover:bg-lavender-dark text-white rounded-sm transition-colors shadow-sm"
            >
              Fill Registration Form →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
