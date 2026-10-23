import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ExpenseCategoryBadge from './ExpenseCategoryBadge'

function formatDate(date) {
if (!date) {
return '—'
}

// Preserve calendar dates without shifting them across time zones.
if (
typeof date === 'string' &&
/^\d{4}-\d{2}-\d{2}$/.test(date)
) {
const [year, month, day] = date.split('-').map(Number)
const parsedDate = new Date(year, month - 1, day)


return parsedDate.toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})


}

const parsedDate = new Date(date)

if (Number.isNaN(parsedDate.getTime())) {
return String(date)
}

return parsedDate.toLocaleDateString('en-IN', {
day: '2-digit',
month: 'short',
year: 'numeric',
})
}

function formatAmount(amount) {
return new Intl.NumberFormat('en-IN', {
style: 'currency',
currency: 'INR',
maximumFractionDigits: 2,
}).format(Number(amount) || 0)
}

function ExpenseTable() {
const navigate = useNavigate()

const {
expenses = [],
loading,
error,
} = useSelector((state) => state.expenses)

const sortedExpenses = [...expenses].sort((a, b) => {
const dateA = new Date(
a.invoiceDate || a.createdAt || 0,
)


const dateB = new Date(
  b.invoiceDate || b.createdAt || 0,
)

return dateB - dateA


})

if (loading) {
return ( <div className="rounded-2xl border border-slate-800/80 bg-[#151B2B] p-10 text-center shadow-lg shadow-black/10"> <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />


    <p className="mt-4 text-sm font-medium text-slate-300">
      Loading expenses...
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Fetching your expense transactions.
    </p>
  </div>
)


}

if (error) {
return ( <div
     role="alert"
     className="rounded-2xl border border-rose-400/20 bg-[#151B2B] p-8 text-center shadow-lg shadow-black/10"
   > <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 text-rose-300"> <svg
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.8"
         className="h-6 w-6"
         aria-hidden="true"
       > <path
           strokeLinecap="round"
           strokeLinejoin="round"
           d="M12 8v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
         /> </svg> </div>


    <h3 className="mt-4 text-base font-semibold text-slate-100">
      Unable to load expenses
    </h3>

    <p className="mt-2 text-sm text-slate-400">
      {typeof error === 'string'
        ? error
        : 'Something went wrong. Please try again.'}
    </p>
  </div>
)


}

if (sortedExpenses.length === 0) {
return ( <div className="rounded-2xl border border-slate-800/80 bg-[#151B2B] px-6 py-14 text-center shadow-lg shadow-black/10"> <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300"> <svg
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.6"
         className="h-7 w-7"
         aria-hidden="true"
       > <rect
           x="4"
           y="3"
           width="16"
           height="18"
           rx="2"
         /> <path
           strokeLinecap="round"
           strokeLinejoin="round"
           d="M8 8h8M8 12h5m-5 4h8"
         /> </svg> </div>


    <h3 className="mt-5 text-base font-semibold text-slate-100">
      No expenses found
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
      There are no expenses matching your current filters.
      Try adjusting your search or upload an invoice to get started.
    </p>

    <button
      type="button"
      onClick={() => navigate('/invoices')}
      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14m-7-7h14"
        />
      </svg>

      Go to Invoices
    </button>
  </div>
)


}

return ( <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#151B2B] shadow-lg shadow-black/10">
{/* Header */} <div className="flex flex-col gap-2 border-b border-slate-800/80 px-5 py-5 sm:px-6 sm:py-6"> <div className="flex items-center justify-between gap-3"> <div> <h2 className="text-lg font-semibold tracking-tight text-slate-100">
Expense Transactions </h2>


        <p className="mt-1 text-sm text-slate-400">
          View your recorded business expenses.
        </p>
      </div>

      <span className="shrink-0 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
        {sortedExpenses.length}{' '}
        {sortedExpenses.length === 1
          ? 'transaction'
          : 'transactions'}
      </span>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-left text-sm">
      <thead>
        <tr className="border-b border-slate-800/80 bg-[#101626]">
          <th
            scope="col"
            className="px-6 py-4 font-medium text-slate-400"
          >
            Invoice
          </th>

          <th
            scope="col"
            className="px-6 py-4 font-medium text-slate-400"
          >
            Vendor
          </th>

          <th
            scope="col"
            className="px-6 py-4 font-medium text-slate-400"
          >
            Description
          </th>

          <th
            scope="col"
            className="px-6 py-4 font-medium text-slate-400"
          >
            Category
          </th>

          <th
            scope="col"
            className="px-6 py-4 font-medium text-slate-400"
          >
            Date
          </th>

          <th
            scope="col"
            className="px-6 py-4 text-right font-medium text-slate-400"
          >
            Amount
          </th>

          <th
            scope="col"
            className="px-6 py-4 text-right font-medium text-slate-400"
          >
            Action
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-800/70">
        {sortedExpenses.map((expense) => (
          <tr
            key={expense.id}
            className="transition-colors hover:bg-slate-800/30"
          >
            <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-200">
              {expense.invoiceNumber || '—'}
            </td>

            <td className="max-w-[200px] truncate px-6 py-4 text-slate-300">
              {expense.vendor?.name ||
                expense.vendorName ||
                'Unknown Vendor'}
            </td>

            <td className="px-6 py-4 text-slate-400">
              {expense.items?.length
                ? `${expense.items.length} item${
                    expense.items.length > 1 ? 's' : ''
                  }`
                : 'Invoice expense'}
            </td>

            <td className="whitespace-nowrap px-6 py-4">
              <ExpenseCategoryBadge
                category={expense.category || 'Other'}
              />
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-slate-400">
              {formatDate(expense.invoiceDate)}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-100">
              {formatAmount(expense.totalAmount)}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-right">
              <button
                type="button"
                onClick={() =>
                  navigate(`/invoices/${expense.id}`)
                }
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/10 hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                aria-label={`View invoice ${
                  expense.invoiceNumber || ''
                }`}
              >
                View

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17 17 7M8 7h9v9"
                  />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Footer */}
  <div className="flex flex-col gap-1 border-t border-slate-800/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
    <p className="text-sm text-slate-400">
      Showing{' '}
      <span className="font-medium text-slate-200">
        {sortedExpenses.length}
      </span>{' '}
      {sortedExpenses.length === 1
        ? 'expense'
        : 'expenses'}
    </p>

    <p className="text-xs text-slate-500">
      Sorted by most recent date
    </p>
  </div>
</section>


)
}

export default ExpenseTable
