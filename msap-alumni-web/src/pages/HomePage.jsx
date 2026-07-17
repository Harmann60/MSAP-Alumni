import HeroSection from '../components/HeroSection';
import StoriesSection from '../components/StoriesSection';
import EventsSection from '../components/EventsSection';
import CommunitySection from '../components/CommunitySection';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="animate-slideUp">
      <HeroSection />

      {/* Stories */}
      <StoriesSection />

      {/* Events */}
      <EventsSection />

      {/* Community */}
      <CommunitySection />

      {/* CTA Banner */}
      <section className="bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display mb-4">
            Stay Connected With Your Community
          </h2>
          <p className="text-forest-200/70 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
            Register today to access the alumni directory, join events, and reconnect with classmates from across decades.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/register"
              className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-sm"
            >
              Join the Network
            </Link>
            <Link
              to="/accounts"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-all duration-200 text-sm"
            >
              View Financial Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
