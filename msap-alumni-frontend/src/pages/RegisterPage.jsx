import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitRegistration } from '../services/alumniService';

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  value,
  onChange,
  hint,
  error,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
}) {
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasError = Boolean(error);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="text-[13px] font-bold uppercase tracking-wider text-ink flex items-center gap-1"
        >
          {label} {required && <span className="text-lavender font-bold">*</span>}
        </label>
        {hint && !hasError && <span className="text-xs text-muted">{hint}</span>}
      </div>

      <div className="relative">
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : undefined}
          className={`w-full border bg-white pl-4 ${
            isPassword ? 'pr-11' : 'pr-4'
          } py-3 rounded-sm text-[15px] text-ink font-medium transition-all placeholder:text-muted/50 ${
            hasError
              ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none'
              : 'border-main focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25'
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-ink p-1 rounded transition-colors focus:outline-none cursor-pointer"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5 text-stone hover:text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-stone hover:text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {hasError && (
        <div id={`${name}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-red-600 leading-snug">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <span>{error}</span>
            {name === 'email' && (error.toLowerCase().includes('already registered') || error.toLowerCase().includes('sign in') || error.toLowerCase().includes('already been submitted')) && (
              <span className="block mt-1 font-bold">
                <Link to="/login" className="underline text-lavender hover:text-lavender-dark">
                  Click here to Sign In &rarr;
                </Link>
              </span>
            )}
          </div>
        </div>
      )}
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (formData.batchYear) {
      const year = Number(formData.batchYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1973 || year > currentYear + 6) {
        errors.batchYear = `Batch year must be between 1973 and ${currentYear + 6}.`;
      }
    }

    if (!formData.password) {
      errors.password = 'Account password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else {
      const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).+$/;
      if (!complexityRegex.test(formData.password)) {
        errors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please re-type your password to confirm.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please verify.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstField = Object.keys(errors)[0];
      const el = document.getElementById(firstField);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      await submitRegistration(payload);
      setSubmitted(true);
    } catch (err) {
      const newErrors = {};

      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((item) => {
          const field = item.field || item.path;
          if (field) {
            newErrors[field] = item.message;
          }
        });
      }

      const msg = err.message || '';
      const lower = msg.toLowerCase();

      if (
        lower.includes('email') ||
        lower.includes('already registered') ||
        lower.includes('already been submitted') ||
        lower.includes('pending verification')
      ) {
        newErrors.email = msg;
      } else if (lower.includes('password') && lower.includes('match')) {
        newErrors.confirmPassword = msg;
      } else if (lower.includes('password')) {
        newErrors.password = msg;
      } else if (lower.includes('batch')) {
        newErrors.batchYear = msg;
      } else if (lower.includes('name')) {
        newErrors.fullName = msg;
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        const firstField = Object.keys(newErrors)[0];
        const el = document.getElementById(firstField);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      } else {
        setGeneralError(msg || 'Failed to submit registration. Please try again.');
      }
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
            Welcome to the Association of MSAP Alumni, Manipur
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
                setFieldErrors({});
                setGeneralError('');
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
          <img src="/logo.png" alt="Association of MSAP Alumni, Manipur" className="w-full h-full object-contain" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender mb-4">
          Official alumni verification
        </p>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Join the Association of MSAP Alumni, Manipur
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Please provide your Pune college background to request directory access. Submissions are verified by the executive committee.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto px-5">
        {/* Membership Tier Info Banner */}
        <div className="mb-6 p-4 rounded-sm bg-lavender/10 border border-lavender/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-lavender text-white font-bold flex items-center justify-center text-[10px] shrink-0">
              ✓
            </span>
            <p className="text-stone">
              <strong className="text-ink font-bold">Lifetime Membership: ₹3,000</strong> &middot; One-time contribution upon credential verification
            </p>
          </div>
          <Link to="/membership" className="font-bold text-lavender hover:text-lavender-dark hover:underline shrink-0">
            ← Review Membership Perks &amp; FAQs
          </Link>
        </div>

        <div className="bg-card border border-main overflow-hidden">
          {/* Card Top Banner */}
          <div className="p-6 sm:p-8 bg-section-alt border-b border-main flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-ink text-2xl font-bold">
                Alumni Registration Form
              </h2>
              <p className="text-sm text-muted mt-1">
                Submissions are reviewed by the Association of MSAP Alumni, Manipur executive committee for verified credentials.
              </p>
            </div>
            <p className="text-sm text-muted shrink-0">Verified before account activation</p>
          </div>

          {/* Only display general top banner if the error cannot be mapped to an individual field */}
          {generalError && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 border border-red-300 bg-red-50 text-red-800 text-sm leading-relaxed flex items-start gap-3">
              <span aria-hidden="true" className="shrink-0 text-base mt-0.5">⚠️</span>
              <p className="font-medium">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-9">
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
                  error={fieldErrors.fullName}
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
                  error={fieldErrors.email}
                />
              </div>
              <div className="mt-5">
                <FormField
                  label="Phone / WhatsApp Number"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  error={fieldErrors.phone}
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
                  error={fieldErrors.puneCollege}
                />
                <FormField
                  label="Batch / Passing Year"
                  name="batchYear"
                  type="number"
                  placeholder="e.g. 2016"
                  value={formData.batchYear}
                  onChange={handleChange}
                  error={fieldErrors.batchYear}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <FormField
                  label="Current City / Country"
                  name="currentLocation"
                  placeholder="e.g. Pune, Bengaluru, London, Imphal"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  error={fieldErrors.currentLocation}
                />
                <FormField
                  label="Current Profession / Role"
                  name="profession"
                  placeholder="e.g. Architect, Software Engineer, Doctor"
                  value={formData.profession}
                  onChange={handleChange}
                  error={fieldErrors.profession}
                />
              </div>
            </fieldset>

            {/* Section 3: Account Password */}
            <fieldset>
              <legend className="flex items-baseline gap-3 pb-2 mb-5 border-b border-main text-[13px] font-bold uppercase tracking-wider text-lavender w-full">
                <span>03</span>
                <span>Portal Account Password</span>
              </legend>

              <p className="text-sm text-muted mb-4">
                Choose the password you'll use to log in to the Alumni Directory once approved. Click the eye icon to preview your password.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  label="Account Password"
                  name="password"
                  placeholder="Min. 8 characters"
                  required
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  value={formData.password}
                  onChange={handleChange}
                  error={fieldErrors.password}
                />
                <FormField
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Re-type password"
                  required
                  isPassword
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={fieldErrors.confirmPassword}
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