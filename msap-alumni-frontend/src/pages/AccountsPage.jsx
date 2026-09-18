import { useState, useEffect } from 'react';
import { fetchAccounts } from '../services/dataService';

const DEFAULT_ACCOUNTS = [
  { category: 'Fixed Deposits & Endowments', balance_formatted: '₹3,50,000', status: 'Verified' },
  { category: 'Operating Savings Account', balance_formatted: '₹1,24,350', status: 'Verified' },
  { category: 'Alumni Membership Corpus', balance_formatted: '₹42,000', status: 'Audited' },
  { category: 'Event & Cultural Trust Fund', balance_formatted: '₹18,500', status: 'Active' },
];

const DEFAULT_TOTAL = '₹5,34,850';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [total, setTotal] = useState(DEFAULT_TOTAL);

  useEffect(() => {
    fetchAccounts()
      .then((data) => {
        if (data && data.accounts) {
          setAccounts(data.accounts);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        console.warn('Using offline financial records:', err.message);
      });
  }, []);

  return (
    <div className="bg-page min-h-[90vh]">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-5 pt-14 pb-10 md:pt-20 md:pb-12">
        <p className="eyebrow mb-5">Financial governance & audit</p>
        <h1 className="display-lg text-4xl md:text-5xl mb-3">Financial transparency</h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Open-book accounting of all alumni funds, fixed deposits, and operational accounts. Society
          Reg. No. 915/M/SR/2025.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pb-16 md:pb-24 space-y-12">
        {/* Total — typographic statement, not a card */}
        <section className="border-y border-main py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-lavender mb-2">
            Total assets under management
          </p>
          <p className="font-display text-ink text-5xl md:text-6xl font-bold tracking-tight">
            {total}
          </p>
          <p className="text-muted text-sm mt-3">
            FY 2025–26 &middot; Independently verified &amp; audited by the executive committee
          </p>
        </section>

        {/* Ledger table */}
        <section className="border border-main rounded-sm overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-main bg-section-alt">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-display text-ink text-lg font-bold">Financial registry & ledger</h3>
              <span className="text-sm text-muted">
                FY 2025&ndash;26 &middot; Last updated January 2026
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted text-xs font-bold uppercase tracking-wider border-b border-main bg-page/80">
                  <th scope="col" className="px-6 md:px-8 py-3.5">Account / Fund</th>
                  <th scope="col" className="px-6 md:px-8 py-3.5 text-right">Balance</th>
                  <th scope="col" className="px-6 md:px-8 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-main/60 last:border-0 hover:bg-page/60 transition-colors">
                    <td className="px-6 md:px-8 py-4 font-semibold text-ink">{row.category}</td>
                    <td className="px-6 md:px-8 py-4 text-right font-mono font-bold text-stone">
                      {row.balance_formatted || row.balance}
                    </td>
                    <td className="px-6 md:px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted">
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-section-alt border-t border-main">
                  <td className="px-6 md:px-8 py-4 font-bold text-ink text-base">Total verified assets</td>
                  <td className="px-6 md:px-8 py-4 text-right font-mono font-bold text-lavender text-lg">
                    {total}
                  </td>
                  <td className="px-6 md:px-8 py-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Note */}
        <p className="text-[15px] text-stone/80 leading-relaxed">
          For audit reports, bank statements, or official vouchers, email{' '}
          <a href="mailto:alumni.msap1973@gmail.com" className="text-lavender hover:underline font-semibold">
            alumni.msap1973@gmail.com
          </a>
          . Formal information requests from registered members are welcomed and answered within 7
          business days.
        </p>
      </div>
    </div>
  );
}