import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../services/adminService';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('msap_admin_token');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(email.trim(), password.trim());
      if (data?.token) {
        sessionStorage.setItem('msap_admin_token', data.token);
        sessionStorage.setItem('msap_admin_user', JSON.stringify(data.user));
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4" style={{ background: '#1A1429' }}>

      {/* Decorative rule top */}
      <div className="mb-10 flex items-center gap-3 opacity-20">
        <div className="h-px w-16 bg-parchment" />
        <div className="w-1.5 h-1.5 bg-parchment rotate-45" />
        <div className="h-px w-16 bg-parchment" />
      </div>

      {/* Brand */}
      <div className="text-center mb-10 animate-heroIn">
        <div className="w-16 h-16 mx-auto mb-4">
          <img src="/logo.png" alt="MSAP Alumni" className="w-full h-full object-contain drop-shadow-md" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
          Manipur Students' Association Pune
        </p>
        <h1 className="font-display text-parchment text-3xl md:text-4xl">
          MSAP Alumni
        </h1>
        <p className="text-muted text-sm mt-2 uppercase tracking-wider text-xs">
          Admin Portal
        </p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm animate-heroInDelay">
        <div className="border border-parchment/10 bg-ink-light" style={{ background: '#261E3B' }}>

          <div className="px-8 py-6 border-b border-parchment/10">
            <h2 className="font-display text-parchment text-xl">Sign in</h2>
            <p className="text-muted text-xs mt-1">Authorised administrators only.</p>
          </div>

          {error && (
            <div className="mx-8 mt-6 px-4 py-3 border border-vermilion/40 bg-vermilion/10 text-vermilion-light text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@msap.org"
                className="w-full bg-ink border border-parchment/10 text-parchment px-4 py-2.5 text-sm placeholder:text-muted/40 focus:outline-none focus:border-parchment/30 transition-colors"
                style={{ background: '#1A1429' }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@msap.org');
                    setPassword('Admin@123#MSAP');
                  }}
                  className="text-xs text-lavender-light hover:underline font-medium cursor-pointer"
                >
                  Autofill demo login
                </button>
              </div>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-ink border border-parchment/10 text-parchment px-4 py-2.5 text-sm placeholder:text-muted/40 focus:outline-none focus:border-parchment/30 transition-colors"
                style={{ background: '#1A1429' }}
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-parchment text-ink font-semibold py-3 text-sm uppercase tracking-wider hover:bg-parchment-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-2 mt-6">
          <Link
            to="/"
            className="text-xs text-parchment/60 hover:text-parchment transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            ← Back to Public Website
          </Link>
          <p className="text-center text-muted text-xs">
            For access issues, contact{' '}
            <a href="mailto:alumni.msap1973@gmail.com" className="text-vermilion-light hover:underline">
              alumni.msap1973@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Decorative rule bottom */}
      <div className="mt-10 flex items-center gap-3 opacity-20">
        <div className="h-px w-16 bg-parchment" />
        <div className="w-1.5 h-1.5 bg-parchment rotate-45" />
        <div className="h-px w-16 bg-parchment" />
      </div>
    </div>
  );
}
