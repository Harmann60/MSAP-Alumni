import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCommunityGroups } from '../services/dataService';

const DEFAULT_GROUPS = [
  {
    id: 1,
    title: 'Pune',
    group_type: 'Regional',
    members_count: '850+',
    location: 'Pune, Maharashtra',
    description: 'The foundational home chapter — campus meetups, career roundtables, and student support.',
  },
  {
    id: 2,
    title: 'Imphal & Manipur',
    group_type: 'Regional',
    members_count: '620+',
    location: 'Imphal, Manipur',
    description: 'Homecoming alumni across Manipur, connected through festival dinners and community projects.',
  },
  {
    id: 3,
    title: 'Bengaluru',
    group_type: 'Professional',
    members_count: '340+',
    location: 'Bengaluru, Karnataka',
    description: 'Engineers, founders, product managers, and researchers collaborating on ventures and mentorship.',
  },
  {
    id: 4,
    title: 'Healthcare & Medical',
    group_type: 'Professional',
    members_count: '110+',
    location: 'Pan-India & global',
    description: 'Doctors and health researchers who studied in Pune, offering medical guidance and student health advice.',
  },
  {
    id: 5,
    title: 'Delhi NCR',
    group_type: 'Regional',
    members_count: '290+',
    location: 'Delhi & NCR',
    description: 'Civil servants, policy professionals, journalists, and corporate leaders gathering for policy dialogues.',
  },
  {
    id: 6,
    title: 'Young Alumni & Mentorship',
    group_type: 'Youth & Career',
    members_count: '410+',
    location: 'Global',
    description: 'Recent graduates from 2020–2026 receiving 1-on-1 resume reviews, interview coaching, and relocation support.',
  },
];

const STATS = [
  { value: '6+', label: 'Active chapters' },
  { value: '2,000+', label: 'Connected alumni' },
  { value: '24+', label: 'Countries represented' },
  { value: '50+', label: 'Years of solidarity' },
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
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow mb-5">Chapters & professional networks</p>
        <h1 className="display-lg text-4xl md:text-5xl mb-3">Our global community</h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Connect with MSAP alumni across regional chapters, professional circles, and shared-interest
          networks worldwide.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 pb-20 md:pb-28">
        {/* Stats — typographic, ruled */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 mb-16 border-t border-main">
          {STATS.map((stat) => (
            <div key={stat.label} className="pt-6 pr-6">
              <div className="font-display text-ink text-4xl font-bold">{stat.value}</div>
              <div className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Directory */}
        <div className="mb-8">
          <h2 className="display-lg text-2xl sm:text-3xl mb-1">Regional chapters & industry circles</h2>
        </div>

        <ul className="border-t border-main">
          {groups.map((group, idx) => (
            <li key={group.id || idx} className="border-b border-main py-7">
              <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-baseline group">
                <div className="lg:col-span-3">
                  <span className="font-display text-ink text-2xl font-bold leading-tight group-hover:text-lavender transition-colors">
                    {group.title}
                  </span>
                </div>
                <div className="lg:col-span-3 text-[15px] text-stone/85">
                  {group.location || 'Maharashtra & beyond'}
                </div>
                <div className="lg:col-span-4 text-[15px] text-stone/85 leading-relaxed">
                  {group.description}
                </div>
                <div className="lg:col-span-2 flex lg:justify-end">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-lavender">
                    {group.members_count || '100+'} members
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Start a chapter — editorial band */}
        <section className="mt-16 bg-lavender-deep text-[#FAF8F4]">
          <div className="max-w-2xl mx-auto px-5 py-14 md:py-20 text-center">
            <h2 className="display-xl text-[clamp(1.6rem,3vw,2.4rem)] text-[#FAF8F4] mb-4">
              Want to establish a regional chapter?
            </h2>
            <p className="text-[#E7E1F3] text-base leading-relaxed mb-8 max-w-lg mx-auto">
              If you have fellow Pune alumni in your city or a specialized industry circle, our
              executive committee can help charter your official chapter.
            </p>
            <Link
              to="/about"
              className="inline-block bg-[#FAF8F4] hover:bg-white text-ink text-base font-bold px-8 py-3.5 rounded-sm transition-colors"
            >
              Contact the alumni committee
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}