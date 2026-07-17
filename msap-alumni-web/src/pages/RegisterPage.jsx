import { useState } from 'react';

function Field({ label, name, type = 'text', placeholder, required, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-forest-950 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full border border-gray-200 bg-cream-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all placeholder:text-gray-300"
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
      <div className="animate-slideUp">
        <div className="bg-forest-950 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">Register</h1>
            <p className="text-forest-200/70 text-sm">Join the MSAP Alumni network.</p>
          </div>
        </div>
        <div className="max-w-lg mx-auto text-center py-16 px-4">
          <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-forest-950 mb-3">Registration Submitted!</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Thank you, <strong>{formData.fullName}</strong>. Your registration has been sent to the admin queue for verification. You'll hear from us at <strong>{formData.email}</strong>.
          </p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', puneCollege: '', batchYear: '', currentLocation: '', profession: '' }); }}
            className="bg-forest-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-forest-800 transition-colors text-sm"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slideUp">
      <div className="bg-forest-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">Register</h1>
          <p className="text-forest-200/70 text-sm">Join the MSAP Alumni network and verify your alumni status.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white px-8 py-6">
            <h2 className="text-xl font-extrabold font-display mb-1">Alumni Onboarding</h2>
            <p className="text-forest-200/70 text-sm">Register to verify your alumni status and join the searchable directory.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" name="fullName" placeholder="Your full name" required value={formData.fullName} onChange={handleChange} />
              <Field label="Email Address" name="email" type="email" placeholder="you@email.com" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone Number" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
              <Field label="Pune College Attended" name="puneCollege" placeholder="e.g. Symbiosis, Ferguson, MIT" value={formData.puneCollege} onChange={handleChange} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Batch / Passing Year" name="batchYear" type="number" placeholder="e.g. 2012" value={formData.batchYear} onChange={handleChange} />
              <Field label="Current Location" name="currentLocation" placeholder="City, Country" value={formData.currentLocation} onChange={handleChange} />
            </div>
            <Field label="Current Profession / Designation" name="profession" placeholder="e.g. Software Engineer at TCS" value={formData.profession} onChange={handleChange} />

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-700 hover:to-forest-600 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Submit Registration
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Submissions are reviewed by admin within 3–5 days.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
