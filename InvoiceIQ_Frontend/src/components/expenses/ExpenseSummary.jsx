import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

function ExpenseSummary() {
  const {
    expenses,
    loading,
  } = useSelector(
    (state) => state.expenses,
  )

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total +
      (Number(expense.totalAmount) || 0),
    0,
  )

  const transactionCount = expenses.length

  const averageExpense =
    transactionCount > 0
      ? totalExpenses / transactionCount
      : 0

  const categoryTotals =
    expenses.reduce(
      (categories, expense) => {
        const category =
          expense.category || 'Other'

        const amount =
          Number(expense.totalAmount) || 0

        categories[category] =
          (categories[category] || 0) +
          amount

        return categories
      },
      {},
    )

  const highestCategory =
    Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0]

  const highestCategoryName =
    highestCategory?.[0] || '—'

  const highestCategoryAmount =
    highestCategory?.[1] || 0

  const summary = [
    {
      title: 'Total Expenses',
      value: loading
        ? '—'
        : formatAmount(totalExpenses),
      description:
        'Based on current filters',
      icon: '💰',
    },
    {
      title: 'Average Expense',
      value: loading
        ? '—'
        : formatAmount(averageExpense),
      description:
        'Average per transaction',
      icon: '📊',
    },
    {
      title: 'Highest Category',
      value: loading
        ? '—'
        : highestCategoryName,
      description: loading
        ? 'Calculating...'
        : highestCategory
          ? `${formatAmount(
              highestCategoryAmount,
            )} spent`
          : 'No expenses recorded',
      icon: '📦',
    },
    {
      title: 'Transactions',
      value: loading
        ? '—'
        : transactionCount,
      description:
        'Matching transactions',
      icon: '🧾',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {item.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {item.description}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExpenseSummary