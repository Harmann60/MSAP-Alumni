import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitRegistration } from '../services/alumniService';

function FormField({ label, name, type = 'text', placeholder, required, value, onChange, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="text-[13px] font-bold uppercase tracking-wider text-ink flex items-center gap-1"
        >
          {label} {required && <span className="text-lavender font-bold">*</span>}
        </label>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-main bg-white pl-4 pr-4 py-3 rounded-sm text-[15px] text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all placeholder:text-muted/50"
      />
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
        <div className="relative max-w-lg w-full text-center border-t-[3px] border-lavender bg-card p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender mb-4">
            Submission received
          </p>
          <h2 className="font-display text-ink text-3xl sm:text-4xl font-bold mb-4">
            Welcome to the MSAP community
          </h2>
          <p className="text-stone text-base leading-relaxed mb-8">
            Thank you, <strong className="text-ink">{formData.fullName}</strong>. Your registration
            has been recorded. Our administrator will verify your Pune college alumni credentials
            before your account is activated.
          </p>

          <dl className="border-t border-main text-left divide-y divide-main">
            <div className="py-3.5 flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">Confirmation email</dt>
              <dd className="text-[15px] font-semibold text-ink">{formData.email}</dd>
            </div>
            <div className="py-3.5 flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">College stated</dt>
              <dd className="text-[15px] font-semibold text-ink">
                {formData.puneCollege || 'Pune Institution'} ({formData.batchYear || 'Alumnus'})
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-lavender hover:bg-lavender-dark text-white font-bold px-7 py-3.5 rounded-sm text-[15px] transition-colors"
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
              className="text-sm font-semibold text-muted hover:text-lavender py-2 px-4 transition-colors cursor-pointer"
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
        <div className="w-16 h-16 mx-auto mb-4">
          <img src="/logo.png" alt="MSAP Alumni" className="w-full h-full object-contain" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender mb-4">
          Official alumni verification
        </p>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Join the MSAP Alumni Network
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Verify your credentials as a former Manipuri student in Pune to access the alumni
          directory, events, and mentorship initiatives.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto px-5">
        <div className="bg-card border border-main overflow-hidden">
          {/* Card Top Banner */}
          <div className="p-6 sm:p-8 bg-section-alt border-b border-main flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-ink text-2xl font-bold">
                Alumni Registration Form
              </h2>
              <p className="text-sm text-muted mt-1">
                Submissions are reviewed by the MSAP executive committee for verified credentials.
              </p>
            </div>
            <p className="text-sm text-muted shrink-0">Verified before account activation</p>
          </div>

          {errorMessage && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 border border-red-300 bg-red-100/70 text-red-800 text-sm leading-relaxed flex items-start gap-2.5">
              <span aria-hidden="true">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-9">
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
            <fieldset>
              <legend className="flex items-baseline gap-3 pb-2 mb-5 border-b border-main text-[13px] font-bold uppercase tracking-wider text-lavender w-full">
                <span>01</span>
                <span>Personal Information</span>
              </legend>
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
            </fieldset>

            {/* Section 2: Pune Academic History */}
            <fieldset>
              <legend className="flex items-baseline gap-3 pb-2 mb-5 border-b border-main text-[13px] font-bold uppercase tracking-wider text-lavender w-full">
                <span>02</span>
                <span>Pune Academic Experience</span>
              </legend>
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
            </fieldset>

            {/* Section 3: Account Password */}
            <fieldset>
              <legend className="flex items-baseline gap-3 pb-2 mb-5 border-b border-main text-[13px] font-bold uppercase tracking-wider text-lavender w-full">
                <span>03</span>
                <span>Portal Account Password</span>
              </legend>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted">
                  Choose the password you'll use to log in to the Alumni Directory once approved.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm font-semibold text-muted hover:text-lavender cursor-pointer whitespace-nowrap"
                >
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>
              </div>

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
            </fieldset>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-lavender hover:bg-lavender-dark text-white font-bold py-4 rounded-sm transition-colors text-base disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
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

              <p className="text-center text-sm text-muted mt-4">
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