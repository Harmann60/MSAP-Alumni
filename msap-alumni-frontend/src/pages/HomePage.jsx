import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import StoriesSection from '../components/StoriesSection';
import EventsSection from '../components/EventsSection';
import CommunitySection from '../components/CommunitySection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Cultural Meitei Mayek divider */}
      <div className="max-w-3xl mx-auto px-5">
        <div className="meitei-rule text-lavender/50">
          <div className="meitei-rule-diamond" />
        </div>
      </div>

      <StoriesSection />

      <EventsSection />

      <CommunitySection />

      {/* Institutional CTA band */}
      <section className="bg-lavender-deep text-[#FAF8F4]">
        <div className="max-w-3xl mx-auto px-5 py-20 md:py-28 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#CFC4E8] mb-6">
            Association of MSAP Alumni &middot; Est. 1973
          </p>
          <h2 className="display-xl text-[clamp(1.9rem,4vw,3rem)] text-[#FAF8F4] mb-6">
            Be part of the next 50 years.
          </h2>
          <p className="text-[#E7E1F3] text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Reconnect with former classmates. Meet alumni in your city. Mentor current students, and
            help strengthen the MSAP community for generations to come.
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#FAF8F4] hover:bg-white text-ink text-[15px] font-bold px-8 py-3.5 rounded-sm transition-colors"
          >
            Join the alumni network
          </Link>

          <p className="mt-10 text-[12px] text-[#C9BDE6] tracking-wide">
            <span>Admin verified records</span>
            <span className="mx-3 opacity-50">|</span>
            <span>Privacy protected</span>
            <span className="mx-3 opacity-50">|</span>
            <span>Official MSAP network</span>
          </p>
        </div>
      </section>
    </div>
  );
}