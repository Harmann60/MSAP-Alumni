import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  alumniLogin,
  googleLogin,
  setAlumniPassword,
  requestPasswordReset,
  resetPassword,
} from '../services/alumniService';

export default function AlumniLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'login';
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'reset' && params.get('token') ? 'reset' : 'login';
  });
  const [email, setEmail] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('email') || '';
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('token') || '';
  });
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // 'not_registered' | 'pending' | 'needs_password' | 'rejected' | 'generic'
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode and token if query params change after mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    const tokenParam = params.get('token');
    const emailParam = params.get('email');
    if (modeParam === 'reset' && tokenParam) {
      setTimeout(() => {
        setMode('reset');
        setResetToken(tokenParam);
        if (emailParam) setEmail(emailParam);
      }, 0);
    }
  }, [location.search]);

  // If already logged in as alumni, redirect to home
  useEffect(() => {
    const user = sessionStorage.getItem('msap_alumni_user');
    if (user) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const categorizeError = (msg = '') => {
    const lower = msg.toLowerCase();
    if (
      lower.includes('not been registered') ||
      lower.includes('not registered') ||
      lower.includes('no application found') ||
      lower.includes('no alumni registration')
    ) {
      return 'not_registered';
    }
    if (lower.includes('pending') || lower.includes('under review')) {
      return 'pending';
    }
    if (lower.includes('not approved') || lower.includes('rejected')) {
      return 'rejected';
    }
    if (
      lower.includes('password has been created') ||
      lower.includes('no account password') ||
      lower.includes('complete your account setup')
    ) {
      return 'needs_password';
    }
    return 'generic';
  };

  const handleAuthSuccess = useCallback((data) => {
    if (data?.token) {
      if (data.user?.role === 'SUPER_ADMIN' || data.user?.role === 'ADMIN' || data.user?.isAdmin) {
        sessionStorage.setItem('msap_admin_token', data.token);
      } else {
        sessionStorage.setItem('msap_alumni_token', data.token);
      }
    }
    if (data?.user) {
      if (data.user?.role === 'SUPER_ADMIN' || data.user?.role === 'ADMIN' || data.user?.isAdmin) {
        sessionStorage.setItem('msap_admin_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('msap_auth_change'));
        navigate('/admin');
        return;
      }
      sessionStorage.setItem('msap_alumni_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('msap_auth_change'));
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your registered email address.');
          setLoading(false);
          return;
        }
        const res = await requestPasswordReset(email.trim());
        setSuccessMessage(
          res?.message || 'If an account exists with that email, a password reset link has been dispatched to your inbox.'
        );
      } else if (mode === 'reset') {
        if (!password || password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setErrorType('generic');
          setLoading(false);
          return;
        }
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).+$/;
        if (!complexityRegex.test(password)) {
          setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
          setErrorType('generic');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setErrorType('generic');
          setLoading(false);
          return;
        }
        const res = await resetPassword(resetToken, password);
        setSuccessMessage(res?.message || 'Your password was reset successfully! Redirecting to sign in...');
        setTimeout(() => {
          setMode('login');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('');
          navigate('/login', { replace: true });
        }, 2200);
      } else if (mode === 'setPassword') {
        if (!email) return;
        if (!password || password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setErrorType('generic');
          setLoading(false);
          return;
        }
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).+$/;
        if (!complexityRegex.test(password)) {
          setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
          setErrorType('generic');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setErrorType('generic');
          setLoading(false);
          return;
        }
        const data = await setAlumniPassword(email.trim(), password);
        setSuccessMessage('Password successfully saved! Signing you in...');
        setTimeout(() => handleAuthSuccess(data), 600);
      } else {
        if (!email || !password) return;
        const data = await alumniLogin(email.trim(), password);
        handleAuthSuccess(data);
      }
    } catch (err) {
      const msg =
        err.message || 'Unable to sign in. Please verify your credentials or wait for admin verification.';
      setError(msg);
      setErrorType(categorizeError(msg));
    } finally {
      setLoading(false);
    }
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('');

  // Initialize Google Identity Services (GIS) if Client ID is configured
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || typeof window === 'undefined') return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  const data = await googleLogin({ credential: response.credential });
                  handleAuthSuccess(data);
                } catch (err) {
                  const msg = err.message || 'Google Sign-In failed.';
                  setError(msg);
                  setErrorType(categorizeError(msg));
                } finally {
                  setLoading(false);
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        } catch (e) {
          console.warn('Google Identity initialization error:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const timer = setTimeout(initGsi, 800);
      return () => clearTimeout(timer);
    }
  }, [handleAuthSuccess]);

  const handleGoogleSignIn = async () => {
    setError('');
    setErrorType('');
    setSuccessMessage('');

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // 1. If Google OAuth Client ID is configured, trigger the Google Account Picker Popup
    if (clientId && window.google?.accounts?.oauth2) {
      setLoading(true);
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              setLoading(false);
              if (tokenResponse.error !== 'access_denied') {
                setError(tokenResponse.error_description || 'Google sign-in was cancelled.');
              }
              return;
            }
            try {
              // Fetch user profile from Google to retrieve verified email
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await res.json();
              if (!profile.email) {
                throw new Error('Google did not return an email address.');
              }
              const data = await googleLogin({
                credential: tokenResponse.access_token,
                email: profile.email.toLowerCase(),
                fullName: profile.name || profile.given_name || '',
                picture: profile.picture || '',
              });
              handleAuthSuccess(data);
            } catch (err) {
              const msg = err.message || 'Google Sign-In failed. Please try again.';
              setError(msg);
              setErrorType(categorizeError(msg));
            } finally {
              setLoading(false);
            }
          },
          error_callback: (err) => {
            setLoading(false);
            if (err?.type !== 'popup_closed') {
              setError('Google Sign-In encountered an error. Please try again.');
            }
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google oauth2 client init failed, falling back:', err);
        setLoading(false);
      }
    }

    // 2. If GIS One-Tap / Prompt is available
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    // 3. Fallback when VITE_GOOGLE_CLIENT_ID is not configured in .env:
    // Open a sleek, branded in-page dialog instead of the browser's window.prompt
    setGoogleModalEmail(email.trim() || '');
    setShowGoogleModal(true);
  };

  const handleModalGoogleSubmit = async (e) => {
    e?.preventDefault();
    if (!googleModalEmail.trim()) return;
    setShowGoogleModal(false);
    setLoading(true);
    try {
      const data = await googleLogin({ email: googleModalEmail.trim().toLowerCase() });
      handleAuthSuccess(data);
    } catch (err) {
      const msg = err.message || 'Google Sign-In failed. Please try again.';
      setError(msg);
      setErrorType(categorizeError(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] bg-page flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 max-w-md animate-heroIn">
        <div className="w-16 h-16 mx-auto mb-3">
          <img src="/logo.png" alt="Association of MSAP Alumni, Manipur" className="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lavender mb-3">
          Association of MSAP Alumni, Manipur
        </p>
        <h1 className="font-display text-ink text-3xl sm:text-4xl font-bold tracking-tight">
          {mode === 'login'
            ? 'Alumni Sign In'
            : mode === 'forgot'
            ? 'Reset Your Password'
            : mode === 'reset'
            ? 'Choose a New Password'
            : 'Activate Account Password'}
        </h1>
        <p className="text-muted text-[15px] mt-2">
          {mode === 'login'
            ? 'Access the verified directory, exclusive event invites, and chapter updates.'
            : mode === 'forgot'
            ? "Enter your registered email and we'll send you a secure link to reset your password."
            : mode === 'reset'
            ? 'Enter your new password below to regain access to your account.'
            : 'For approved alumni: set your permanent password to activate full network access.'}
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md animate-heroInDelay">
        <div className="border border-main bg-card rounded-sm overflow-hidden">
          {/* Segmented Mode Switcher */}
          {mode === 'forgot' || mode === 'reset' ? (
            <div className="p-3 bg-section-alt border-b border-main flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setErrorType('');
                  setSuccessMessage('');
                }}
                className="text-xs font-bold text-lavender hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Back to Sign In
              </button>
              <span className="text-[11px] text-muted font-bold uppercase tracking-wider">
                {mode === 'forgot' ? 'Password Recovery' : 'Reset Password'}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-section-alt border-b border-main grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setErrorType('');
                }}
                className={`py-2.5 px-3 text-[13px] font-bold rounded-sm transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-card text-ink shadow-sm'
                    : 'text-stone/70 hover:text-ink'
                }`}
              >
                Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('setPassword');
                  setError('');
                  setErrorType('');
                }}
                className={`py-2.5 px-3 text-[13px] font-bold rounded-sm transition-all cursor-pointer ${
                  mode === 'setPassword'
                    ? 'bg-card text-ink shadow-sm'
                    : 'text-stone/70 hover:text-ink'
                }`}
              >
                Set New Password
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-sm border border-emerald-300 bg-emerald-100/70 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <span className="text-base">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Context-Aware Error & Workflow Banners */}
          {error && (
            <div className="mx-6 sm:mx-8 mt-6">
              {errorType === 'not_registered' ? (
                <div className="p-4 rounded-sm border border-red-300 bg-red-100/70 text-red-800 text-sm leading-relaxed space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-base">⚠️</span>
                    <div>
                      <strong className="block font-bold">Email Not Registered</strong>
                      <span>{error}</span>
                    </div>
                  </div>
                  <Link
                    to="/register"
                    className="inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-sm transition-all shadow-sm"
                  >
                    Submit Alumni Verification Application →
                  </Link>
                </div>
              ) : errorType === 'pending' ? (
                <div className="p-4 rounded-sm border border-amber-300 bg-amber-100/70 text-amber-900 text-sm leading-relaxed space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-base">⏳</span>
                    <div>
                      <strong className="block font-bold text-amber-950">Verification Under Review</strong>
                      <span>{error}</span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-800 mt-1">
                    Once the administrator verifies your credentials, you will receive an email confirmation.
                  </p>
                </div>
              ) : errorType === 'needs_password' ? (
                <div className="p-4 rounded-sm border border-lavender/40 bg-[#E4DCF5] text-lavender text-sm leading-relaxed space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-base">🎉</span>
                    <div>
                      <strong className="block font-bold">Account Approved!</strong>
                      <span>{error}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('setPassword');
                      setError('');
                      setErrorType('');
                    }}
                    className="w-full bg-lavender hover:bg-lavender-dark text-white font-bold py-2.5 px-4 rounded-sm transition-all shadow-sm cursor-pointer"
                  >
                    Set Your Password Now →
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-sm border border-red-300 bg-red-100/70 text-red-800 text-sm font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-5">
            {/* Google Sign-In Button */}
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-main bg-white hover:bg-page text-ink font-bold py-3.5 px-4 rounded-sm shadow-2xs transition-all hover:border-lavender hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Or divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-main w-full" />
                  <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted font-bold relative">
                    or with email
                  </span>
                  <div className="border-t border-main w-full" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== 'reset' && (
                <div>
                  <label htmlFor="alumni-email" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="alumni-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="w-full border border-main bg-white pl-4 pr-4 py-3 rounded-sm text-[15px] text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all placeholder:text-muted/50"
                  />
                  {mode === 'forgot' && (
                    <p className="text-xs text-muted mt-1.5">
                      Enter the email address associated with your approved alumni account. We will send you a secure link to reset your password.
                    </p>
                  )}
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="alumni-password" className="block text-xs font-bold uppercase tracking-wider text-ink">
                      {mode === 'login' ? 'Password' : 'New Password'}
                    </label>
                    <div className="flex items-center gap-3">
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setError('');
                            setErrorType('');
                            setSuccessMessage('');
                          }}
                          className="text-xs font-semibold text-lavender hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs font-semibold text-muted hover:text-lavender cursor-pointer"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <input
                    id="alumni-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={
                      mode === 'login'
                        ? '••••••••'
                        : 'Min. 8 chars (uppercase, lowercase, number, symbol)'
                    }
                    className="w-full border border-main bg-white pl-4 pr-4 py-3 rounded-sm text-[15px] text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all placeholder:text-muted/50"
                  />
                </div>
              )}

              {(mode === 'setPassword' || mode === 'reset') && (
                <div>
                  <label htmlFor="alumni-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="alumni-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter your new password"
                    className="w-full border border-main bg-white pl-4 pr-4 py-3 rounded-sm text-[15px] text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all placeholder:text-muted/50"
                  />
                  <p className="text-[11px] text-muted mt-1.5">
                    Must be at least 8 characters with upper & lowercase letters, a number, and a symbol.
                  </p>
                </div>
              )}

              <button
                id="alumni-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full btn-hover bg-lavender hover:bg-lavender-dark text-white font-bold py-4 rounded-sm shadow-[0_8px_25px_rgba(78,45,146,0.3)] transition-all text-[15px] disabled:opacity-50 cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : mode === 'login' ? (
                  <>
                    <span>Sign In to Alumni Network</span>
                    <span>→</span>
                  </>
                ) : mode === 'forgot' ? (
                  <>
                    <span>Send Password Reset Link</span>
                    <span>→</span>
                  </>
                ) : mode === 'reset' ? (
                  <>
                    <span>Update Password & Sign In</span>
                    <span>→</span>
                  </>
                ) : (
                  <>
                    <span>Activate Account & Sign In</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-section-alt border-t border-main flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone font-medium">
            <span>Don't have an application submitted yet?</span>
            <Link to="/register" className="font-bold text-lavender hover:underline">
              Register for verification →
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted space-y-2">
          <p>
            Are you an administrator?{' '}
            <Link to="/admin/login" className="text-ink font-bold hover:text-lavender transition-colors">
              Sign in to Admin Portal
            </Link>
          </p>
          <p>
            Questions? Contact{' '}
            <a href="mailto:alumni.msap1973@gmail.com" className="text-lavender hover:underline">
              alumni.msap1973@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Google Account Fallback Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-main rounded-sm shadow-2xl max-w-md w-full p-6 sm:p-8 animate-heroIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-serif text-lg font-bold text-ink">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-stone hover:text-ink text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-stone text-xs leading-relaxed mb-4">
              Enter your Google Account email associated with your verified alumni registration to sign in.
            </p>
            <form onSubmit={handleModalGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={googleModalEmail}
                  onChange={(e) => setGoogleModalEmail(e.target.value)}
                  required
                  placeholder="your.google.account@gmail.com"
                  className="w-full border border-main bg-white pl-4 pr-4 py-3 rounded-sm text-[15px] text-ink font-medium focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/25 transition-all"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-muted italic">
                Tip: Add <code className="bg-section-alt px-1.5 py-0.5 rounded font-mono text-[10px]">VITE_GOOGLE_CLIENT_ID</code> to your frontend <code className="font-mono text-[10px]">.env</code> to trigger the Google account picker list.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-lavender hover:bg-lavender-dark text-white text-xs font-bold rounded-sm shadow-sm transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
