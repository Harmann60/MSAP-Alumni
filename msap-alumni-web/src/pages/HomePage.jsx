import HeroSection from '../components/HeroSection';
import StoriesSection from '../components/StoriesSection';
import EventsSection from '../components/EventsSection';
import CommunitySection from '../components/CommunitySection';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Meitei Mayek divider */}
      <div className="max-w-6xl mx-auto px-5 py-2">
        <div className="meitei-rule text-ink">
          <div className="meitei-rule-diamond" />
        </div>
      </div>

      <StoriesSection />

      <EventsSection />

      <CommunitySection />

      {/* Join strip */}
      <section className="bg-ink-light text-parchment">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-20 text-center">
          <h2 className="font-display text-parchment text-2xl md:text-3xl mb-3">
            Your community is waiting
          </h2>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">
            Register once. Get access to the alumni directory, event invites, and every Manipuri who studied in Pune.
          </p>
          <Link
            to="/register"
            className="inline-block bg-vermilion hover:bg-vermilion-light text-parchment font-semibold px-8 py-3 transition-colors text-sm"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
