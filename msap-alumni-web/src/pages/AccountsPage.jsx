const ACCOUNTS = [
  { category: 'Fixed Deposits Asset', balance: '₹3,50,000', status: 'Verified', statusColor: 'emerald' },
  { category: 'Savings Account Balance', balance: '₹1,24,350', status: 'Verified', statusColor: 'emerald' },
  { category: 'Annual Membership Corpus', balance: '₹42,000', status: 'Audited', statusColor: 'blue' },
  { category: 'Event & Cultural Fund', balance: '₹18,500', status: 'Active', statusColor: 'gold' },
];

const total = '₹5,34,850';

const statusStyles = {
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  gold: 'bg-gold-50 text-gold-700 border border-gold-200',
};

export default function AccountsPage() {
  return (
    <div className="animate-slideUp">
      {/* Page header */}
      <div className="bg-forest-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2">Financial Transparency</h1>
          <p className="text-forest-200/70 text-sm">Open-book reporting of all fixed deposits, savings, and operational funds. Updated quarterly.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8">
        {/* Total balance highlight */}
        <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Total Assets Under Management</p>
          <div className="text-5xl md:text-6xl font-extrabold font-display text-gold-400 mb-2">{total}</div>
          <p className="text-forest-300/60 text-sm">As of FY 2025–26 · All figures independently verified</p>
        </div>

        {/* Accounts table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-forest-950">Financial Registry</h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1 rounded-full border border-emerald-200">
              All accounts verified
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-cream-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Account / Category</th>
                  <th className="px-6 py-3 text-right">Balance</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ACCOUNTS.map((row, i) => (
                  <tr key={i} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-forest-950">{row.category}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">{row.balance}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[row.statusColor]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-forest-50">
                <tr>
                  <td className="px-6 py-4 font-bold text-forest-950">Total</td>
                  <td className="px-6 py-4 text-right font-mono font-extrabold text-forest-900 text-base">{total}</td>
                  <td className="px-6 py-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5 flex gap-3 items-start">
          <svg className="w-5 h-5 text-forest-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-sm text-forest-800 leading-relaxed">
            For full audit reports, bank statements, or queries, contact the treasurer at{' '}
            <a href="mailto:alumni.msap1973@gmail.com" className="font-semibold underline hover:text-forest-600">alumni.msap1973@gmail.com</a>.
            RTI-style requests are welcomed.
          </p>
        </div>
      </div>
    </div>
  );
}
