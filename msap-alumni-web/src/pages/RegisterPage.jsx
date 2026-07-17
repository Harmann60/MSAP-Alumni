import { useState } from 'react';

function Field({ label, name, type = 'text', placeholder, required, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
        {label}{required && <span className="text-vermilion ml-0.5">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full border border-parchment-dark bg-parchment px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
      />
    </div>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', puneCollege: '',
    batchYear: '', currentLocation: '', profession: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
          <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Register</h1>
        </div>
        <div className="max-w-lg mx-auto text-center pb-20 px-5">
          <div className="font-display text-vermilion text-5xl mb-4">&#10003;</div>
          <h2 className="font-display text-ink text-2xl mb-3">Registration submitted</h2>
          <p className="text-muted mb-6 leading-relaxed">
            Thank you, <strong className="text-ink">{formData.fullName}</strong>. We'll verify your details and email you at <strong className="text-ink">{formData.email}</strong> within 3–5 days.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', puneCollege: '', batchYear: '', currentLocation: '', profession: '' }); }}
            className="text-sm font-medium text-vermilion hover:underline"
          >
            Register another person
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Register</h1>
        <p className="text-muted text-sm">Verify your alumni status and join the directory.</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-16 md:pb-24">
        <div className="border border-parchment-dark">
          <div className="p-6 border-b border-parchment-dark">
            <h2 className="font-display text-ink text-xl">Alumni onboarding</h2>
            <p className="text-muted text-sm mt-1">Your submission is reviewed by admin within 3–5 days.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name" name="fullName" placeholder="Your full name" required value={formData.fullName} onChange={handleChange} />
              <Field label="Email" name="email" type="email" placeholder="you@email.com" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
              <Field label="Pune college" name="puneCollege" placeholder="e.g. Symbiosis, Ferguson, MIT" value={formData.puneCollege} onChange={handleChange} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Batch year" name="batchYear" type="number" placeholder="e.g. 2012" value={formData.batchYear} onChange={handleChange} />
              <Field label="Current location" name="currentLocation" placeholder="City, Country" value={formData.currentLocation} onChange={handleChange} />
            </div>
            <Field label="Profession" name="profession" placeholder="e.g. Software Engineer at TCS" value={formData.profession} onChange={handleChange} />

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-ink text-parchment font-semibold py-3 hover:bg-ink-light transition-colors text-sm"
              >
                Submit registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
