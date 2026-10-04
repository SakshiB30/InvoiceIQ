import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)
}

function AnalyticsStats() {
  const { invoices, loading } = useSelector(
    (state) => state.invoices,
  )

  const totalSpending = invoices.reduce(
    (total, invoice) =>
      total + (Number(invoice.totalAmount) || 0),
    0,
  )

  const averageInvoice =
    invoices.length > 0
      ? totalSpending / invoices.length
      : 0

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

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0]

  const stats = [
    {
      title: 'Total Spending',
      value: loading
        ? '—'
        : formatAmount(totalSpending),
      description: 'Total recorded expenses',
      icon: '💰',
    },
    {
      title: 'Average Invoice',
      value: loading
        ? '—'
        : formatAmount(averageInvoice),
      description: 'Average invoice value',
      icon: '📊',
    },
    {
      title: 'Total Invoices',
      value: loading ? '—' : invoices.length,
      description: 'Invoices analyzed',
      icon: '🧾',
    },
    {
      title: 'Top Category',
      value: loading
        ? '—'
        : topCategory
          ? topCategory[0]
          : '—',
      description: loading
        ? 'Calculating...'
        : topCategory
          ? `${formatAmount(topCategory[1])} spent`
          : 'No data available',
      icon: '📦',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnalyticsStats