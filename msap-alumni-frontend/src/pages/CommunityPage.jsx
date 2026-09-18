import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCommunityGroups } from '../services/dataService';

const DEFAULT_GROUPS = [
  {
    id: 1,
    title: 'Pune Flagship Chapter',
    group_type: 'Regional',
    members_count: '850+',
    location: 'Pune, Maharashtra',
    description:
      'The foundational home chapter. Regular campus meetups, social gatherings, career roundtables, and student emergency support in Pune.',
    link: '/community/pune-flagship-chapter',
  },
  {
    id: 2,
    title: 'Imphal & Manipur Network',
    group_type: 'Regional',
    members_count: '620+',
    location: 'Imphal, Manipur',
    description:
      'Homecoming alumni based across the state of Manipur, actively connected through annual festival dinners, youth scholarships, and community projects.',
    link: '/community/imphal-manipur-network',
  },
  {
    id: 3,
    title: 'Bengaluru Tech Circle',
    group_type: 'Professional',
    members_count: '340+',
    location: 'Bengaluru, Karnataka',
    description:
      'Engineers, founders, product managers, and researchers collaborating on technology ventures, career referrals, and mentorship.',
    link: '/community/bengaluru-tech-circle',
  },
  {
    id: 4,
    title: 'Healthcare & Medical Guild',
    group_type: 'Professional',
    members_count: '110+',
    location: 'Pan-India & Global',
    description:
      'Doctors, surgeons, dentists, and health researchers who studied in Pune offering medical guidance and student health advice.',
    link: '/community/healthcare-medical-guild',
  },
  {
    id: 5,
    title: 'Delhi NCR Chapter',
    group_type: 'Regional',
    members_count: '290+',
    location: 'Delhi & NCR',
    description:
      'Civil servants, policy professionals, journalists, and corporate leaders gathering for policy dialogues and cultural reunions.',
    link: '/community/delhi-ncr-chapter',
  },
  {
    id: 6,
    title: 'Young Alumni & Mentorship Circle',
    group_type: 'Youth & Career',
    members_count: '410+',
    location: 'Global',
    description:
      'Recent graduates from 2020–2026 receiving 1-on-1 resume reviews, interview coaching, and relocation support.',
    link: '/community/young-alumni-mentorship-circle',
  },
];

export default function CommunityPage() {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);

  useEffect(() => {
    fetchCommunityGroups()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setGroups(data);
        }
      })
      .catch((err) => {
        console.warn('Using offline community data:', err.message);
      });
  }, []);

  return (
    <div className="relative bg-page min-h-[90vh]">
      {/* Header */}
      <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-10 md:pt-20 md:pb-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-lavender text-xs font-bold uppercase tracking-wider mb-4 border border-main">
          Chapters & Professional Networks
        </div>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Our Global Community
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Connect with MSAP alumni across regional chapters, professional circles, and shared interest networks worldwide.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-card border border-main rounded-3xl p-8 shadow-sm mb-14">
          {[
            { value: `${groups.length}+`, label: 'Active Chapters' },
            { value: '2,000+', label: 'Connected Alumni' },
            { value: '24+', label: 'Countries Represented' },
            { value: '50+', label: 'Years of Solidarity' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div>
                <div className="font-display text-ink text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-muted text-xs font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Groups Grid */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-lavender">
            Regional Chapters & Industry Networks
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {groups.map((group, idx) => (
            <div
              key={group.id || idx}
              className="group card-lift p-7 bg-card border border-main hover:border-lavender/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lavender bg-lavender-soft px-3 py-1 rounded-full border border-lavender/25">
                    {group.group_type || 'Chapter'}
                  </span>
                </div>

                <h2 className="font-display text-ink text-xl font-bold mb-2 group-hover:text-lavender transition-colors">
                  {group.title}
                </h2>

                <div className="text-xs font-semibold text-stone/70 mb-3 flex items-center gap-1.5">
                  <span>{group.location || 'Maharashtra & Beyond'}</span>
                  <span>&middot;</span>
                  <span className="text-lavender font-bold">{group.members_count || '100+'} Members</span>
                </div>

                <p className="text-stone text-[14px] leading-relaxed font-normal">
                  {group.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-main flex items-center justify-between text-xs font-bold text-lavender">
                <Link to={group.link}>
                  <span>View Chapter Directory</span>
                </Link>
                <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Start a chapter CTA card */}
        <div className="relative bg-card border border-main p-8 sm:p-12 rounded-3xl text-center shadow-lg shadow-black/5 max-w-3xl mx-auto overflow-hidden">
          <div className="relative">
            <h2 className="font-display text-ink text-2xl sm:text-3xl font-bold mb-3">
              Want to Establish a Regional Chapter?
            </h2>
            <p className="text-stone text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
              If you have fellow Pune alumni in your city or specialized industry circle, our executive committee can help charter your official chapter.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-lavender hover:bg-lavender-dark text-white font-bold px-8 py-3.5 rounded-xl shadow-md text-sm transition-all hover:-translate-y-0.5"
            >
              <span>Contact the Alumni Committee</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
