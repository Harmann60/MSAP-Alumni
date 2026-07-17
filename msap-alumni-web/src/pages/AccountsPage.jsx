const ACCOUNTS = [
  { category: 'Fixed Deposits', balance: '₹3,50,000', status: 'Verified' },
  { category: 'Savings Account', balance: '₹1,24,350', status: 'Verified' },
  { category: 'Membership Corpus', balance: '₹42,000', status: 'Audited' },
  { category: 'Event & Cultural Fund', balance: '₹18,500', status: 'Active' },
];

const total = '₹5,34,850';

export default function AccountsPage() {
  return (
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="font-display text-ink text-3xl md:text-4xl mb-2">Financial transparency</h1>
        <p className="text-muted text-sm">Open-book reporting of all funds. Updated quarterly.</p>
      </div>

      <div className="max-w-4xl mx-auto px-5 pb-16 md:pb-24 space-y-10">
        {/* Total */}
        <div className="text-center py-10 border border-parchment-dark">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Total assets under management</div>
          <div className="font-display text-ink text-5xl md:text-6xl mb-2">{total}</div>
          <div className="text-muted text-sm">FY 2025–26 &middot; Independently verified</div>
        </div>

        {/* Table */}
        <div className="border border-parchment-dark">
          <div className="px-6 py-4 border-b border-parchment-dark flex items-center justify-between">
            <h3 className="font-display text-ink text-lg">Financial registry</h3>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-verified">All accounts verified</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted text-[11px] font-semibold uppercase tracking-wider border-b border-parchment-dark">
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3 text-right">Balance</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((row, i) => (
                <tr key={i} className="border-b border-parchment-dark last:border-0">
                  <td className="px-6 py-4 font-medium text-ink">{row.category}</td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-ink">{row.balance}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-verified">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-parchment-dark">
                <td className="px-6 py-4 font-semibold text-ink">Total</td>
                <td className="px-6 py-4 text-right font-mono font-bold text-ink text-base">{total}</td>
                <td className="px-6 py-4" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Note */}
        <p className="text-sm text-muted leading-relaxed">
          For audit reports, bank statements, or questions, email{' '}
          <a href="mailto:alumni.msap1973@gmail.com" className="text-vermilion hover:underline font-medium">alumni.msap1973@gmail.com</a>.
          Formal information requests are welcome.
        </p>
      </div>
    </div>
  );
}
