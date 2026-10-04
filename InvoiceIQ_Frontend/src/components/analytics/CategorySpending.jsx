import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function CategorySpending() {
  const { invoices, loading, error } = useSelector(
    (state) => state.invoices,
  )

  const categoryTotals = invoices.reduce(
    (categories, invoice) => {
      const category = invoice.category || 'Other'
      const amount = Number(invoice.totalAmount) || 0

      categories[category] =
        (categories[category] || 0) + amount

      return categories
    },
    {},
  )

  const categories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )

  const totalSpending = categories.reduce(
    (total, [, amount]) => total + amount,
    0,
  )

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending by Category
        </h2>

        <p className="mt-6 text-center text-sm text-slate-500">
          Loading category data...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending by Category
        </h2>

        <p className="mt-4 text-sm text-red-600">
          Unable to load category data.
        </p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending by Category
        </h2>

        <div className="py-10 text-center">
          <div className="text-3xl">📊</div>

          <p className="mt-3 text-sm text-slate-500">
            No expense data available yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Spending by Category
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of your business expenses.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {categories.map(([category, amount]) => {
          const percentage =
            totalSpending > 0
              ? (amount / totalSpending) * 100
              : 0

          return (
            <div key={category}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {category}
                  </span>

                  <span className="text-xs text-slate-400">
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {formatAmount(amount)}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Total Spending
          </span>

          <span className="text-base font-bold text-slate-900">
            {formatAmount(totalSpending)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CategorySpending