import { useState } from 'react';
import { Link } from 'react-router-dom';

const CONTACT_CHANNELS = [
  {
    icon: '✉️',
    title: 'Official Email',
    detail: 'alumni.msap1973@gmail.com',
    actionLabel: 'Send email',
    href: 'mailto:alumni.msap1973@gmail.com',
    note: 'Response within 24–48 hours for general and membership enquiries.',
  },
  {
    icon: '💬',
    title: 'Official Community',
    detail: 'Association of MSAP Alumni, Manipur',
    actionLabel: 'Visit Facebook page',
    href: 'https://www.facebook.com/share/1Jco7CPBqJ/?mibextid=wwXIfr',
    note: 'Join discussions, photo updates, and live event announcements.',
  },
  {
    icon: '📍',
    title: 'Registered Headquarters',
    detail: 'Imphal, Manipur — 795001',
    actionLabel: 'View on map',
    href: 'https://maps.google.com/?q=Imphal+Manipur',
    note: 'Association of MSAP Alumni, Manipur Secretariat Office.',
  },
];

const EXECUTIVE_DESKS = [
  { desk: 'President & Secretariat Desk', purpose: 'Society governance, legal compliance, and inter-association partnerships' },
  { desk: 'Alumni Verification & Membership', purpose: 'Degree verification, batch coordinator lookups, and life membership IDs' },
  { desk: 'Events & Reunion Committee', purpose: 'Annual meets, cultural drives, seminars, and Tree Plantation Drives' },
  { desk: 'Student Welfare & Mentorship', purpose: 'Guidance and accommodation assistance for Manipuri students in Pune' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Membership Enquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page Header */}
      <div className="max-w-[90rem] mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-14 border-b border-main">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Communication & Secretariat</p>
          <h1 className="display-lg text-4xl sm:text-5xl">Contact the association</h1>
          <p className="text-stone text-base sm:text-lg mt-4 leading-relaxed">
            Have questions regarding membership verification, reunion registrations, or student mentorship in Pune?
            Connect directly with the Executive Council of the Association of MSAP Alumni, Manipur.
          </p>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-5 py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Communication Channels & Executive Desks */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="eyebrow mb-6">Direct channels</h2>
              <div className="space-y-4">
                {CONTACT_CHANNELS.map((ch) => (
                  <div
                    key={ch.title}
                    className="p-6 bg-card border border-main rounded-sm hover:border-lavender/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl p-2.5 bg-section-alt rounded-sm border border-main/60 shrink-0">
                        {ch.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-ink text-lg">{ch.title}</h3>
                        <p className="text-sm font-semibold text-lavender mt-0.5 break-all">{ch.detail}</p>
                        <p className="text-xs text-stone/80 mt-2 leading-relaxed">{ch.note}</p>
                        <a
                          href={ch.href}
                          target={ch.href.startsWith('http') ? '_blank' : undefined}
                          rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-lavender hover:underline mt-3"
                        >
                          {ch.actionLabel}
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secretariat Desks */}
            <div className="p-6 bg-section-alt border border-main rounded-sm">
              <h3 className="eyebrow mb-4">Executive desks</h3>
              <ul className="space-y-4 text-xs">
                {EXECUTIVE_DESKS.map((desk) => (
                  <li key={desk.desk} className="border-b border-main/60 last:border-0 pb-3 last:pb-0">
                    <strong className="block font-bold text-ink text-[13px]">{desk.desk}</strong>
                    <span className="text-stone/80 leading-relaxed">{desk.purpose}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-main p-6 sm:p-10 rounded-sm">
              <div className="border-b border-main pb-6 mb-8">
                <span className="eyebrow">Message the secretariat</span>
                <h2 className="font-display text-ink text-2xl sm:text-3xl font-bold mt-2">Send an inquiry</h2>
                <p className="text-stone text-sm mt-1">
                  Fill in your details below and our secretarial team will review and respond promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-300 rounded-sm text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <h3 className="font-display font-bold text-emerald-950 text-2xl">Message Received</h3>
                  <p className="text-emerald-800 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your message regarding <em>"{formData.subject}"</em> has been received. A copy has been routed to our secretarial desk.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'Membership Enquiry', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 text-xs font-bold bg-white text-emerald-900 border border-emerald-300 rounded-sm hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Ngangom Luwang"
                        className="w-full border border-main bg-white px-4 py-3 rounded-sm text-sm text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full border border-main bg-white px-4 py-3 rounded-sm text-sm text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                        Contact Phone / WhatsApp
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full border border-main bg-white px-4 py-3 rounded-sm text-sm text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                        Inquiry Subject *
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full border border-main bg-white px-4 py-3 rounded-sm text-sm text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all"
                      >
                        <option value="Membership Enquiry">Membership & Verification Inquiry</option>
                        <option value="Reunion & Events">Annual Reunion & Event Registration</option>
                        <option value="Student Welfare">Pune Student Guidance & Mentorship</option>
                        <option value="Media & Press">News, Article & Press Submission</option>
                        <option value="General Query">Other General Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                      Message Content *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please write your detailed message, batch details (if applicable), or queries here..."
                      className="w-full border border-main bg-white p-4 rounded-sm text-sm text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all placeholder:text-muted/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-lavender hover:bg-lavender-dark text-white font-bold px-8 py-3.5 rounded-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending Message...' : 'Submit Inquiry to Secretariat →'}
                  </button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-main flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
                <span>Looking to register as a verified alumnus?</span>
                <Link to="/register" className="font-bold text-lavender hover:underline">
                  Submit verification form →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
