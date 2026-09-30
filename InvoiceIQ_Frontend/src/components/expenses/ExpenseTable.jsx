import ExpenseCategoryBadge from './ExpenseCategoryBadge'

const expenses = [
  {
    id: 'EXP-001',
    vendor: 'ABC Suppliers',
    description: 'Raw materials purchase',
    category: 'Inventory',
    date: '28 Sep 2026',
    amount: '₹12,500',
  },
  {
    id: 'EXP-002',
    vendor: 'Office Mart',
    description: 'Office stationery',
    category: 'Office',
    date: '27 Sep 2026',
    amount: '₹3,250',
  },
  {
    id: 'EXP-003',
    vendor: 'City Travels',
    description: 'Business travel',
    category: 'Travel',
    date: '25 Sep 2026',
    amount: '₹7,800',
  },
  {
    id: 'EXP-004',
    vendor: 'MSEB',
    description: 'Electricity bill',
    category: 'Utilities',
    date: '23 Sep 2026',
    amount: '₹5,400',
  },
  {
    id: 'EXP-005',
    vendor: 'Digital Ads',
    description: 'Online advertising',
    category: 'Marketing',
    date: '20 Sep 2026',
    amount: '₹9,500',
  },
]

function ExpenseTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Table Header */}
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Expense Transactions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View and manage your recorded business expenses.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 font-medium text-slate-500">
                Expense
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Vendor
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Description
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Category
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Date
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Amount
              </th>

              <th className="px-6 py-3 font-medium text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {expense.id}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {expense.vendor}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {expense.description}
                </td>

                <td className="px-6 py-4">
                  <ExpenseCategoryBadge category={expense.category} />
                </td>

                <td className="px-6 py-4 text-slate-500">
                  {expense.date}
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {expense.amount}
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
          Showing 1–5 of 128 expenses
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

export default ExpenseTable