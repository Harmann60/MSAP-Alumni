import { Link } from 'react-router-dom';

const GROUPS = [
  {
    title: 'Pune Chapter',
    type: 'Regional',
    members: '120+',
    description: 'The original home chapter. Connect with alumni based in Pune for meetups, events, and networking.',
    color: 'forest',
  },
  {
    title: 'Imphal Chapter',
    type: 'Regional',
    members: '80+',
    description: 'Alumni based in Manipur stay connected through regular gatherings and cultural celebrations.',
    color: 'forest',
  },
  {
    title: 'Tech Professionals',
    type: 'Professional',
    members: '45+',
    description: 'A group for alumni working in technology — from software engineers to startup founders.',
    color: 'blue',
  },
  {
    title: 'Healthcare Network',
    type: 'Professional',
    members: '30+',
    description: 'Connecting alumni in the medical and healthcare fields for collaboration and mentorship.',
    color: 'blue',
  },
  {
    title: 'Young Alumni',
    type: 'Interest',
    members: '60+',
    description: 'Recent graduates and early-career professionals building their networks and careers.',
    color: 'gold',
  },
  {
    title: 'Women in Leadership',
    type: 'Affinity',
    members: '35+',
    description: 'Empowering women alumni through mentorship, leadership development, and community support.',
    color: 'purple',
  },
];

const colorMap = {
  forest: 'bg-forest-50 text-forest-700 border-forest-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  gold: 'bg-gold-50 text-gold-700 border-gold-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

const typeMap = {
  forest: 'bg-forest-100 text-forest-600',
  blue: 'bg-blue-100 text-blue-600',
  gold: 'bg-gold-100 text-gold-600',
  purple: 'bg-purple-100 text-purple-600',
};

export default function CommunityPage() {
  return (
    <div className="animate-slideUp">
      {/* Page header */}
      <div className="bg-forest-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">Community</h1>
          <p className="text-forest-200/70 text-sm">Discover alumni groups based on region, industry, identity, and interest.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Stats banner */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold font-display text-forest-700">6</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active Groups</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-gold-500">370+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Total Members</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-forest-700">3</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Regional Chapters</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-display text-gold-500">12+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Events Per Year</div>
          </div>
        </div>

        {/* Groups grid */}
        <h2 className="text-xl font-bold text-forest-950 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-forest-400 rounded-full" />
          Alumni Groups
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {GROUPS.map((group, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colorMap[group.color]}`}>
                  {group.type}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeMap[group.color]}`}>
                  {group.members} members
                </span>
              </div>
              <h3 className="font-bold text-forest-950 text-lg mb-2">{group.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{group.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-forest-950 mb-2">Want to Start a New Group?</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
            Have an idea for a new alumni community? Whether it's a regional chapter, professional network, or interest group — we'd love to help you get started.
          </p>
          <Link
            to="/register"
            className="bg-forest-900 hover:bg-forest-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
