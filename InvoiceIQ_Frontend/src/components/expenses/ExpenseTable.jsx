import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ExpenseCategoryBadge from './ExpenseCategoryBadge'

function formatDate(date) {
  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
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
    expenses,
    loading,
    error,
  } = useSelector(
    (state) => state.expenses,
  )

  const sortedExpenses = [...expenses].sort(
    (a, b) => {
      const dateA = new Date(
        a.invoiceDate ||
          a.createdAt ||
          0,
      )

      const dateB = new Date(
        b.invoiceDate ||
          b.createdAt ||
          0,
      )

      return dateB - dateA
    },
  )

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-yellow-400" />

        <p className="mt-3 text-sm text-slate-500">
          Loading expenses...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">
          Failed to load expenses.
        </p>

        <p className="mt-1 text-xs text-red-500">
          {typeof error === 'string'
            ? error
            : 'Please try again.'}
        </p>
      </div>
    )
  }

  if (sortedExpenses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          💰
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No expenses found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your filters or upload an invoice.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
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
            {sortedExpenses.map(
              (expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {expense.invoiceNumber ||
                      '—'}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {expense.vendor?.name ||
                      expense.vendorName ||
                      'Unknown Vendor'}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {expense.items?.length
                      ? `${expense.items.length} item${
                          expense.items.length >
                          1
                            ? 's'
                            : ''
                        }`
                      : 'Invoice expense'}
                  </td>

                  <td className="px-6 py-4">
                    <ExpenseCategoryBadge
                      category={
                        expense.category ||
                        'Other'
                      }
                    />
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(
                      expense.invoiceDate,
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatAmount(
                      expense.totalAmount,
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/invoices/${expense.id}`,
                        )
                      }
                      className="text-sm font-medium text-yellow-600 transition hover:text-yellow-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing {sortedExpenses.length}{' '}
          {sortedExpenses.length === 1
            ? 'expense'
            : 'expenses'}
        </p>
      </div>
    </div>
  )
}

export default ExpenseTable