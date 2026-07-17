import { Link } from 'react-router-dom';

const GROUPS = [
  { title: 'Pune Chapter', type: 'Regional', members: '120+', description: 'The original home chapter. Meetups, events, and networking in Pune.' },
  { title: 'Imphal Chapter', type: 'Regional', members: '80+', description: 'Alumni based in Manipur, connected through regular gatherings.' },
  { title: 'Tech Professionals', type: 'Professional', members: '45+', description: 'Software engineers, startup founders, and tech leads.' },
  { title: 'Healthcare Network', type: 'Professional', members: '30+', description: 'Alumni in medicine and healthcare fields.' },
  { title: 'Young Alumni', type: 'Interest', members: '60+', description: 'Recent graduates building careers and networks.' },
  { title: 'Women in Leadership', type: 'Affinity', members: '35+', description: 'Mentorship and leadership development for women alumni.' },
];

export default function CommunityPage() {
  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Community</h1>
        <p className="text-muted text-sm">Groups by region, profession, and shared interest.</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-16 md:pb-24">
        {/* Stats — plain, no card */}
        <div className="flex flex-wrap gap-8 md:gap-14 mb-16 pb-16 border-b border-parchment-dark">
          {[
            { value: '6', label: 'Active groups' },
            { value: '370+', label: 'Members' },
            { value: '3', label: 'Regional chapters' },
            { value: '12+', label: 'Events per year' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-display text-ink text-3xl md:text-4xl">{stat.value}</div>
              <div className="text-muted text-xs uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Groups */}
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Alumni groups</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {GROUPS.map((group, idx) => (
            <div key={idx} className="p-5 bg-parchment-dark">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{group.type}</span>
                <span className="text-[10px] text-muted/50">&middot;</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{group.members}</span>
              </div>
              <h3 className="font-display text-ink text-xl mb-1">{group.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{group.description}</p>
            </div>
          ))}
        </div>

        {/* Start a group CTA */}
        <div className="border border-parchment-dark p-8 text-center">
          <h3 className="font-display text-ink text-xl mb-2">Want to start a new group?</h3>
          <p className="text-sm text-muted mb-5 max-w-md mx-auto">
            Regional chapter, professional network, or interest group — email us and we'll help you set it up.
          </p>
          <Link
            to="/about"
            className="inline-block text-sm font-medium text-vermilion hover:underline"
          >
            Get in touch &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
