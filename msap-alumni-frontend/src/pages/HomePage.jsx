import HeroSection from '../components/HeroSection';
import StoriesSection from '../components/StoriesSection';
import EventsSection from '../components/EventsSection';
import CommunitySection from '../components/CommunitySection';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Cultural Meitei Mayek single divider */}
      <div className="max-w-4xl mx-auto px-5 my-2">
        <div className="meitei-rule">
          <div className="meitei-rule-diamond" />
        </div>
      </div>

      <StoriesSection />

      <EventsSection />

      <CommunitySection />

      {/* Elevated Join / Register Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-section-alt border-t border-main">
        <div className="relative max-w-4xl mx-auto px-5">
          <div className="section-highlight-card p-8 sm:p-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-page border-1.5 border-lavender/40 text-lavender-dark text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
              <span>Join 2,000+ MSAP Alumni</span>
            </div>

            <h2 className="font-display text-ink text-3xl sm:text-5xl mb-4 font-bold tracking-tight">
              Your Alumni Community is Waiting
            </h2>

            <p className="text-stone text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed font-normal">
              Register once to verify your credentials. Gain instant access to the verified directory, exclusive chapter reunions, mentorship opportunities, and campus memories.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-lavender hover:bg-lavender-dark text-white font-bold px-9 py-4 rounded-xl shadow-[0_10px_30px_rgba(78,45,146,0.35)] transition-all text-base hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Register for Verification</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-card border-2 border-lavender/30 hover:border-lavender text-stone hover:text-ink font-bold px-8 py-4 rounded-xl transition-all text-base hover:-translate-y-0.5 shadow-sm"
              >
                <span>Already Registered? Sign In</span>
              </Link>
            </div>

            {/* Quick trust badges */}
            <div className="mt-10 pt-8 border-t border-lavender/20 flex flex-wrap items-center justify-center gap-6 text-xs text-muted font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="text-verified font-bold">✓</span> Admin Verified Records
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-verified font-bold">✓</span> Privacy Protected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-verified font-bold">✓</span> Official MSAP Network
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
