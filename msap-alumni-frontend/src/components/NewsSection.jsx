import { Link } from 'react-router-dom';
import { getAllNews } from '../data/newsData';
import NewsCard from './NewsCard';

export default function NewsSection() {
  const latest = getAllNews().slice(0, 4);

  return (
    <section className="max-w-[90rem] mx-auto px-5 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow mb-4">01 &mdash; News &amp; events</p>
          <h2 className="display-lg text-3xl sm:text-4xl md:text-[2.75rem]">Latest news</h2>
          <p className="text-stone text-base sm:text-lg mt-4 max-w-2xl">
            Recent activities, events and announcements from the Association of MSAP Alumni, Manipur.
          </p>
        </div>
        <Link to="/news" className="text-link link-underline shrink-0 mb-1">
          View all news
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
        {latest.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}