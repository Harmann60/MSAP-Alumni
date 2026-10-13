import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alumniLogout } from '../services/alumniService';
import { request } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [sessionUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('msap_alumni_user') || sessionStorage.getItem('msap_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!sessionUser) {
      navigate('/login', { replace: true });
      return;
    }

    async function loadFreshProfile() {
      try {
        const res = await request('/auth/me');
        if (res?.profile) {
          setProfileData(res.profile);
        } else if (res?.user) {
          setProfileData(res.user);
        }
      } catch (err) {
        // Fall back to session user if API is offline
        console.warn('Could not fetch fresh profile details, using session data', err);
      }
    }

    loadFreshProfile();
  }, [sessionUser, navigate]);

  const handleSignOut = async () => {
    try {
      await alumniLogout();
    } catch {
      // Ignore network errors
    }
    sessionStorage.removeItem('msap_alumni_token');
    sessionStorage.removeItem('msap_alumni_user');
    sessionStorage.removeItem('msap_admin_token');
    sessionStorage.removeItem('msap_admin_user');
    window.dispatchEvent(new Event('msap_auth_change'));
    navigate('/', { replace: true });
  };

  if (!sessionUser) return null;

  // Merge session user with fresh profile data
  const user = profileData ? { ...sessionUser, ...profileData } : sessionUser;

  // Determine user initials (Text monogram — strictly NO profile photos)
  const getInitials = (name) => {
    if (!name) return 'MA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const isAdmin = user.role === 'ADMIN';
  const isContentManager = user.role === 'MODERATOR' || user.role === 'CONTENT_MANAGER' || Boolean(user.isContentManager);
  const isStaff = isSuperAdmin || isAdmin || isContentManager || Boolean(user.isStaff);

  const roleLabel = isSuperAdmin
    ? 'Super Administrator'
    : isAdmin
    ? 'Administrator'
    : isContentManager
    ? 'Content Manager (Editorial Team)'
    : 'Verified Alumnus';

  const rolePillClass = isSuperAdmin || isAdmin
    ? 'bg-amber-100 text-amber-900 border-amber-300'
    : isContentManager
    ? 'bg-purple-100 text-purple-900 border-purple-300'
    : 'bg-emerald-100 text-emerald-900 border-emerald-300';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
        <Link to="/" className="hover:text-lavender transition-colors">Home</Link>
        <span>/</span>
        <span className="text-stone">Member Profile</span>
      </nav>

      {/* Main Profile Card Header */}
      <div className="bg-card rounded-lg border border-main p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Monogram Initials Avatar (Strictly text-based, no image uploads) */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-display text-2xl sm:text-3xl font-bold shadow-md shrink-0 select-none bg-gradient-to-br from-lavender to-lavender-dark ring-4 ring-lavender/20"
            aria-label={`Initials for ${user.fullName || 'Member'}`}
          >
            {getInitials(user.fullName || user.email)}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                  {user.fullName || 'Alumni Member'}
                </h1>
                <p className="text-stone text-sm sm:text-base mt-1 font-medium">{user.email}</p>
              </div>

              {/* Status and Role Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${rolePillClass}`}>
                  {roleLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user.status === 'VERIFIED' ? 'Verified Member' : user.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Editorial / Admin Access Callout */}
            {isStaff && (
              <div className="mt-5 p-3.5 bg-lavender/10 border border-lavender/30 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-ink font-medium">
                  <span className="font-bold text-lavender-dark">Staff Access:</span> You have editorial privileges to manage articles, stories, events, and galleries.
                </div>
                <Link
                  to="/admin"
                  className="px-4 py-1.5 bg-lavender hover:bg-lavender-dark text-white text-xs font-bold rounded shadow-sm transition-colors whitespace-nowrap"
                >
                  Open Editorial Portal →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Academic Heritage Card */}
        <div className="bg-card rounded-lg border border-main p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-main/60 mb-5">
            <span className="text-xl">🎓</span>
            <h2 className="font-display text-lg font-bold text-ink">Pune Academic Heritage</h2>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">College / Institution Attended</dt>
              <dd className="font-semibold text-ink mt-1">
                {user.puneCollege || user.pune_college || 'Pune College Alumni Roll'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Graduation / Batch Year</dt>
              <dd className="font-semibold text-ink mt-1">
                {user.batchYear || user.batch_year ? `Class of ${user.batchYear || user.batch_year}` : 'Recorded Member'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Professional & Location Card */}
        <div className="bg-card rounded-lg border border-main p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-main/60 mb-5">
            <span className="text-xl">💼</span>
            <h2 className="font-display text-lg font-bold text-ink">Professional & Location</h2>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Current Profession / Title</dt>
              <dd className="font-semibold text-ink mt-1">
                {user.profession || 'Alumnus / Professional'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Current Location</dt>
              <dd className="font-semibold text-ink mt-1">
                {user.currentLocation || user.current_location || 'Pune / Global Alumni'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Contact Information Card */}
        <div className="bg-card rounded-lg border border-main p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-main/60 mb-5">
            <span className="text-xl">📞</span>
            <h2 className="font-display text-lg font-bold text-ink">Contact Details</h2>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Email Address (Registered)</dt>
              <dd className="font-semibold text-ink mt-1 break-all">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Contact Phone Number</dt>
              <dd className="font-semibold text-ink mt-1">
                {user.phone || 'Provided during verification'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Membership Standing Card */}
        <div className="bg-card rounded-lg border border-main p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-main/60 mb-5">
            <span className="text-xl">🏛️</span>
            <h2 className="font-display text-lg font-bold text-ink">Membership Standing</h2>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Association</dt>
              <dd className="font-semibold text-ink mt-1">
                Association of MSAP Alumni, Manipur (EST. 2024)
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-muted">Verification Status</dt>
              <dd className="font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span>✓ Approved & Verified in Official Roll</span>
              </dd>
            </div>
            {user.adminNotes && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Administrative Notes</dt>
                <dd className="text-xs text-stone italic mt-1 bg-parchment p-2 rounded border border-main/40">
                  &ldquo;{user.adminNotes}&rdquo;
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Account Actions Bar */}
      <div className="bg-card rounded-lg border border-main p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-ink text-sm">Session Security</h3>
          <p className="text-muted text-xs mt-0.5">You are securely signed into the MSAP Alumni platform.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isStaff && (
            <Link
              to="/admin"
              className="flex-1 sm:flex-initial text-center px-4 py-2 border border-lavender text-lavender hover:bg-lavender hover:text-white rounded text-xs font-bold transition-colors"
            >
              Editorial Portal
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="flex-1 sm:flex-initial px-5 py-2 bg-stone/10 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border border-main text-stone rounded text-xs font-bold transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
