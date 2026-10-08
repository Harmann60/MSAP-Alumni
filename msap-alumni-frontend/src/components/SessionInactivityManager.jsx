import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { alumniLogout } from '../services/alumniService';
import { adminLogout } from '../services/adminService';

// Default: 24 hours of total idle threshold before auto-logout ("keep it for a long time")
const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
// Warning window: Show the modal in the last 5 minutes (300 seconds)
const WARNING_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export default function SessionInactivityManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(300);

  const lastWriteRef = useRef(0);

  // Check current auth status from storage
  const checkAuth = useCallback(() => {
    const adminUser = typeof window !== 'undefined' ? sessionStorage.getItem('msap_admin_user') : null;
    const alumniUser = typeof window !== 'undefined' ? sessionStorage.getItem('msap_alumni_user') : null;
    const hasAdmin = Boolean(adminUser);
    const hasAlumni = Boolean(alumniUser);

    setIsAdmin(hasAdmin);
    setIsAuthenticated(hasAdmin || hasAlumni);
    return hasAdmin || hasAlumni;
  }, []);

  // Update activity timestamp in localStorage (throttled to once every 30 seconds)
  const recordActivity = useCallback(() => {
    if (!checkAuth()) return;
    const now = Date.now();
    if (now - lastWriteRef.current > 30000) {
      lastWriteRef.current = now;
      try {
        localStorage.setItem('msap_last_activity', String(now));
      } catch {
        // Safe fallback
      }
    }
  }, [checkAuth]);

  // Execute clean sign out due to inactivity
  const performInactivityLogout = useCallback(async () => {
    setShowWarning(false);
    const adminSession = Boolean(sessionStorage.getItem('msap_admin_user'));

    try {
      if (adminSession) {
        await adminLogout();
      } else {
        await alumniLogout();
      }
    } catch {
      // Ignore network errors during auto-logout
    }

    try {
      sessionStorage.removeItem('msap_admin_token');
      sessionStorage.removeItem('msap_admin_user');
      sessionStorage.removeItem('msap_alumni_token');
      sessionStorage.removeItem('msap_alumni_user');
      localStorage.removeItem('msap_last_activity');
      localStorage.setItem('msap_inactivity_logout_notice', 'true');
    } catch {
      // Safe fallback
    }

    setIsAuthenticated(false);
    setIsAdmin(false);
    window.dispatchEvent(new Event('msap_auth_change'));

    if (adminSession) {
      navigate('/admin/login', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Extend session (user clicks "Stay Signed In" or interacts)
  const extendSession = useCallback(() => {
    const now = Date.now();
    lastWriteRef.current = now;
    try {
      localStorage.setItem('msap_last_activity', String(now));
    } catch {
      // Safe fallback
    }
    setShowWarning(false);
    setRemainingSeconds(300);
  }, []);

  // Monitor activity timestamps on a timer
  useEffect(() => {
    const isAuthed = checkAuth();
    if (!isAuthed) {
      setShowWarning(false);
      return;
    }

    // Ensure we have a recorded baseline activity timestamp
    const existing = localStorage.getItem('msap_last_activity');
    if (!existing) {
      localStorage.setItem('msap_last_activity', String(Date.now()));
    }

    const interval = setInterval(() => {
      if (!checkAuth()) {
        setShowWarning(false);
        return;
      }

      const raw = localStorage.getItem('msap_last_activity');
      const lastActive = raw ? parseInt(raw, 10) : Date.now();
      const elapsed = Date.now() - lastActive;

      // Case 1: Exceeded total inactivity threshold (24 hours)
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        performInactivityLogout();
        return;
      }

      // Case 2: Within warning window (last 5 minutes of 24h)
      const timeRemaining = INACTIVITY_TIMEOUT_MS - elapsed;
      if (timeRemaining <= WARNING_WINDOW_MS) {
        const secsLeft = Math.max(1, Math.floor(timeRemaining / 1000));
        setRemainingSeconds(secsLeft);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [checkAuth, performInactivityLogout]);

  // Listen to user interaction events across the window
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleUserEvent = () => recordActivity();

    events.forEach((evt) => window.addEventListener(evt, handleUserEvent, { passive: true }));

    // Multi-tab sync: if another tab recorded activity or logged out
    const handleStorage = (e) => {
      if (e.key === 'msap_last_activity') {
        const newTime = parseInt(e.newValue || '0', 10);
        const elapsed = Date.now() - newTime;
        if (elapsed < INACTIVITY_TIMEOUT_MS - WARNING_WINDOW_MS) {
          setShowWarning(false);
        }
      }
      checkAuth();
    };

    const handleAuthEvent = () => checkAuth();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('msap_auth_change', handleAuthEvent);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserEvent));
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('msap_auth_change', handleAuthEvent);
    };
  }, [isAuthenticated, recordActivity, checkAuth]);

  // Modal countdown tick when warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          performInactivityLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, performInactivityLogout]);

  // Check for logout notice on navigation
  const [logoutNotice, setLogoutNotice] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem('msap_inactivity_logout_notice') === 'true') {
        localStorage.removeItem('msap_inactivity_logout_notice');
        setLogoutNotice(true);
        const t = setTimeout(() => setLogoutNotice(false), 8000);
        return () => clearTimeout(t);
      }
    } catch {
      // Safe fallback
    }
  }, [location.pathname]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Toast Notice when returned after session expiration */}
      {logoutNotice && (
        <div className="fixed top-5 right-5 z-[9999] max-w-md bg-stone-900 text-white p-4 rounded-sm shadow-2xl border-l-4 border-amber-500 flex items-start gap-3">
          <span className="text-xl">⏳</span>
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm text-amber-400 mb-0.5">Session Expired</p>
            <p className="text-white/80 leading-relaxed">
              You were signed out after 24 hours of inactivity for your account security. Please sign in again.
            </p>
          </div>
          <button
            onClick={() => setLogoutNotice(false)}
            className="text-white/60 hover:text-white font-bold text-sm ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Inactivity Warning Modal */}
      {showWarning && isAuthenticated && (
        <div className="fixed inset-0 z-[9999] bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card max-w-md w-full border border-main rounded-sm shadow-2xl overflow-hidden">
            <div className="bg-section-alt p-5 border-b border-main flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-xl font-bold">
                ⏱️
              </div>
              <div>
                <h3 className="font-display font-bold text-ink text-base">Session Inactivity Notice</h3>
                <p className="text-xs text-muted">
                  {isAdmin ? 'Administrator Portal' : 'Alumni Network'}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-stone leading-relaxed">
                You have been inactive for an extended period. For your security, your session will automatically close in:
              </p>

              <div className="py-3 px-4 bg-amber-50 border border-amber-200 rounded-sm flex items-center justify-center gap-2 text-amber-900 font-mono font-bold text-2xl tracking-wider">
                <span>{formatCountdown(remainingSeconds)}</span>
              </div>

              <p className="text-xs text-muted">
                Click <strong>"Stay Signed In"</strong> to refresh your session, or log out if you are finished.
              </p>
            </div>

            <div className="p-4 bg-section-alt border-t border-main flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={performInactivityLogout}
                className="px-4 py-2 text-xs font-bold text-stone hover:text-ink border border-main bg-white hover:bg-page rounded-sm transition-all cursor-pointer"
              >
                Sign Out Now
              </button>
              <button
                type="button"
                onClick={extendSession}
                className="px-5 py-2 text-xs font-bold text-white bg-lavender hover:bg-lavender-dark rounded-sm shadow-sm transition-all cursor-pointer"
              >
                Stay Signed In →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
