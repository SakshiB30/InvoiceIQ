const invoices = [
  {
    id: 'INV-001',
    vendor: 'ABC Suppliers',
    date: '28 Sep 2026',
    amount: '₹12,500',
    status: 'Verified',
  },
  {
    id: 'INV-002',
    vendor: 'XYZ Traders',
    date: '27 Sep 2026',
    amount: '₹8,750',
    status: 'Pending',
  },
  {
    id: 'INV-003',
    vendor: 'Tech Solutions',
    date: '25 Sep 2026',
    amount: '₹21,300',
    status: 'Verified',
  },
  {
    id: 'INV-004',
    vendor: 'Global Supplies',
    date: '23 Sep 2026',
    amount: '₹15,800',
    status: 'Review',
  },
]

function RecentInvoices() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Invoices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest uploaded invoices
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 font-medium text-slate-500">
                Invoice
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Vendor
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Date
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Amount
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {invoice.id}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {invoice.vendor}
                </td>

                <td className="px-6 py-4 text-slate-500">
                  {invoice.date}
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {invoice.amount}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Verified: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Review: 'bg-orange-100 text-orange-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

export default RecentInvoices