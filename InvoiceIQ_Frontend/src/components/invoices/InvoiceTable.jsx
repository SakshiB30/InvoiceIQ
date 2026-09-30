import InvoiceStatusBadge from './InvoiceStatusBadge'

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
  {
    id: 'INV-005',
    vendor: 'Sharma Enterprises',
    date: '20 Sep 2026',
    amount: '₹6,450',
    status: 'Verified',
  },
]

function InvoiceTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Table Header */}
      <div className="border-b border-slate-200 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            All Invoices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your uploaded invoices.
          </p>
        </div>
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

              <th className="px-6 py-3 font-medium text-slate-500">
                Action
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
                  <InvoiceStatusBadge status={invoice.status} />
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-yellow-600 transition hover:text-yellow-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing 1–5 of 128 invoices
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
          >
            Previous
          </button>

          <button
            type="button"
            className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-medium text-slate-900"
          >
            1
          </button>

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            2
          </button>

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTable