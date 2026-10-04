import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)
}

function ExpenseSummary() {
  const { invoices, loading } = useSelector(
    (state) => state.invoices,
  )

  const totalExpenses = invoices.reduce(
    (total, invoice) =>
      total + (Number(invoice.totalAmount) || 0),
    0,
  )

  const now = new Date()

  const thisMonthExpenses = invoices
    .filter((invoice) => {
      if (!invoice.invoiceDate) {
        return false
      }

      const invoiceDate = new Date(invoice.invoiceDate)

      return (
        invoiceDate.getMonth() === now.getMonth() &&
        invoiceDate.getFullYear() === now.getFullYear()
      )
    })
    .reduce(
      (total, invoice) =>
        total + (Number(invoice.totalAmount) || 0),
      0,
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

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0]

  const highestCategoryName = highestCategory
    ? highestCategory[0]
    : '—'

  const highestCategoryAmount = highestCategory
    ? highestCategory[1]
    : 0

  const summary = [
    {
      title: 'Total Expenses',
      value: loading ? '—' : formatAmount(totalExpenses),
      description: 'All recorded expenses',
      icon: '💰',
    },
    {
      title: 'This Month',
      value: loading
        ? '—'
        : formatAmount(thisMonthExpenses),
      description: 'Expenses this month',
      icon: '📅',
    },
    {
      title: 'Highest Category',
      value: loading ? '—' : highestCategoryName,
      description: loading
        ? 'Calculating...'
        : highestCategory
          ? `${formatAmount(highestCategoryAmount)} spent`
          : 'No expenses recorded',
      icon: '📦',
    },
    {
      title: 'Transactions',
      value: loading ? '—' : invoices.length,
      description: 'Total transactions',
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