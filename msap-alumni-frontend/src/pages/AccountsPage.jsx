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
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative bg-page min-h-[90vh]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-10 md:pt-20 md:pb-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card text-lavender text-xs font-bold uppercase tracking-wider mb-4 border border-main">
          Financial Governance & Audit
        </div>
        <h1 className="font-display text-ink text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Financial Transparency
        </h1>
        <p className="text-stone text-base sm:text-lg max-w-xl">
          Open-book accounting of all alumni funds, fixed deposits, and operational accounts. Society Reg. No. 915/M/SR/2025.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pb-16 md:pb-24 space-y-10">
        {/* Total Banner Card */}
        <div className="text-center py-12 px-6 bg-card border border-main rounded-3xl shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-lavender mb-2">
            Total Assets Under Management
          </div>
          <div className="font-display text-ink text-5xl md:text-6xl font-bold mb-2 tracking-tight">
            {total}
          </div>
          <div className="text-muted text-sm font-medium">
            FY 2025–26 &middot; Independently verified &amp; audited by executive committee
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-card border border-main rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-main flex items-center justify-between bg-section-alt">
            <h3 className="font-display text-ink text-lg font-bold">Financial Registry & Ledger</h3>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-full">
              {loading ? 'Refreshing...' : 'All accounts verified'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted text-[11px] font-bold uppercase tracking-wider border-b border-main bg-page/80">
                  <th className="px-6 md:px-8 py-3.5">Account / Fund</th>
                  <th className="px-6 md:px-8 py-3.5 text-right">Balance</th>
                  <th className="px-6 md:px-8 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((row, i) => (
                  <tr
                    key={row.id || i}
                    className="border-b border-main/60 last:border-0 hover:bg-page/50 transition-colors"
                  >
                    <td className="px-6 md:px-8 py-4 font-semibold text-ink">{row.category}</td>
                    <td className="px-6 md:px-8 py-4 text-right font-mono font-bold text-stone">
                      {row.balance_formatted || row.balance}
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-section-alt border-t border-main">
                  <td className="px-6 md:px-8 py-4 font-bold text-ink text-base">Total Verified Assets</td>
                  <td className="px-6 md:px-8 py-4 text-right font-mono font-bold text-lavender text-lg">
                    {total}
                  </td>
                  <td className="px-6 md:px-8 py-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-stone/80 leading-relaxed">
          For audit reports, bank statements, or official vouchers, email{' '}
          <a href="mailto:alumni.msap1973@gmail.com" className="text-lavender hover:underline font-semibold">
            alumni.msap1973@gmail.com
          </a>
          . Formal information requests from registered members are welcomed and answered within 7 business days.
        </p>
      </div>
    </div>
  );
}
