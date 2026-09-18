import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitRegistration } from '../services/alumniService';

function FormField({ label, name, type = 'text', placeholder, required, value, onChange, icon, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1">
          {label} {required && <span className="text-lavender font-bold">*</span>}
        </label>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted text-sm">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-main bg-white ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 py-3 rounded-xl text-[15px] text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all placeholder:text-muted/50 shadow-2xs`}
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    puneCollege: '',
    batchYear: '',
    currentLocation: '',
    profession: '',
    password: '',
    confirmPassword: '',
    hp_website: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    if (formData.password && formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      await submitRegistration(payload);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to submit registration. Please check your details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative bg-page min-h-[85vh] flex items-center justify-center px-5 py-16">
        <div className="relative max-w-lg w-full text-center p-8 sm:p-10 bg-card border-2 border-lavender/35 rounded-3xl shadow-[0_20px_60px_-15px_rgba(58,27,115,0.18)] animate-heroIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-emerald-700 border border-emerald-300 flex items-center justify-center text-3xl font-bold mx-auto mb-5 shadow-sm">
            Confirmed
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            Submission Confirmed
          </div>

          <h2 className="font-display text-ink text-2xl sm:text-3xl font-bold mb-3">
            Welcome to the MSAP Community
          </h2>

          <p className="text-stone text-[14.5px] leading-relaxed mb-6">
            Thank you, <strong className="text-ink">{formData.fullName}</strong>. Your account credentials have been securely stored. Our administrator will verify your Pune college alumni credentials within <span className="font-semibold text-lavender">2–3 business days</span>.
          </p>

          <div className="p-4 rounded-2xl bg-page border border-main text-left text-xs space-y-2 mb-8">
            <div className="flex items-center gap-2 text-stone font-semibold">
              <span>Confirmation Sent:</span>
              <span className="text-ink">{formData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-stone font-semibold">
              <span>College Stated:</span>
              <span className="text-ink">{formData.puneCollege || 'Pune Institution'} ({formData.batchYear || 'Alumnus'})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-lavender hover:bg-lavender-dark text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-lavender/20"
            >
              Go to Sign In →
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  puneCollege: '',
                  batchYear: '',
                  currentLocation: '',
                  profession: '',
                  password: '',
                  confirmPassword: '',
                  hp_website: '',
                });
              }}
              className="text-xs font-semibold text-muted hover:text-lavender py-2 px-4 transition-colors"
            >
              Submit another registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-page min-h-[90vh] py-14 sm:py-20 overflow-hidden">
      {/* Header */}
      <div className="relative max-w-4xl mx-auto px-5 text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-3">
          <img src="/logo.png" alt="MSAP Alumni" className="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-lavender text-xs font-bold uppercase tracking-wider mb-4 border border-main">
          Official Alumni Verification
        </div>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Join the MSAP Alumni Network
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Verify your credentials as a former Manipuri student in Pune to access the alumni directory, events, and mentorship initiatives.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto px-5">
        <div className="bg-card border-2 border-lavender/35 rounded-3xl shadow-[0_20px_60px_-15px_rgba(58,27,115,0.18)] overflow-hidden">
          {/* Card Top Banner */}
          <div className="p-6 sm:p-8 bg-section-alt border-b border-main flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-ink text-2xl font-bold">
                Alumni Registration Form
              </h2>
              <p className="text-muted text-xs font-medium mt-1">
                Submissions are reviewed by the MSAP executive committee for verified credentials.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-main text-[11px] font-bold text-lavender shadow-2xs self-start sm:self-auto">
              256-Bit Encrypted
            </div>
          </div>

          {errorMessage && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl border border-red-300 bg-red-100/70 text-red-800 text-xs font-semibold flex items-center gap-2.5">
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
            {/* Honeypot field */}
            <input
              type="text"
              name="hp_website"
              value={formData.hp_website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden opacity-0 pointer-events-none absolute"
              aria-hidden="true"
            />

            {/* Section 1: Personal Details */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-main text-xs font-bold uppercase tracking-wider text-lavender">
                <span>01</span>
                <span>Personal Information</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  label="Full Name"
                  name="fullName"
                  placeholder="e.g. Ningthouja Lemba"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  required
                  hint="Used for verification notices"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-5">
                <FormField
                  label="Phone / WhatsApp Number"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 2: Pune Academic History */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-main text-xs font-bold uppercase tracking-wider text-lavender">
                <span>02</span>
                <span>Pune Academic Experience</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  label="Pune College / University"
                  name="puneCollege"
                  placeholder="e.g. Symbiosis, Fergusson, COEP, MIT"
                  value={formData.puneCollege}
                  onChange={handleChange}
                />
                <FormField
                  label="Batch / Passing Year"
                  name="batchYear"
                  type="number"
                  placeholder="e.g. 2016"
                  value={formData.batchYear}
                  onChange={handleChange}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <FormField
                  label="Current City / Country"
                  name="currentLocation"
                  placeholder="e.g. Pune, Bengaluru, London, Imphal"
                  value={formData.currentLocation}
                  onChange={handleChange}
                />
                <FormField
                  label="Current Profession / Role"
                  name="profession"
                  placeholder="e.g. Architect, Software Engineer, Doctor"
                  value={formData.profession}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 3: Account Password */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-main">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lavender">
                  <span>03</span>
                  <span>Portal Account Password</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-muted hover:text-lavender cursor-pointer"
                >
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>

              <p className="text-muted text-xs mb-4">
                Choose the password you'll use to log in to the Alumni Directory once approved.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  label="Account Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-type password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-hover bg-lavender hover:bg-lavender-dark text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(78,45,146,0.3)] transition-all text-base disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Submitting Registration securely...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Alumni Registration</span>
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted mt-4">
                Already registered or verified?{' '}
                <Link to="/login" className="text-lavender font-bold hover:underline">
                  Sign in to your account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
