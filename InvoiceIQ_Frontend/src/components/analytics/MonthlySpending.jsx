import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function MonthlySpending() {
  const { invoices, loading, error } = useSelector(
    (state) => state.invoices,
  )

  const monthlyTotals = invoices.reduce(
    (months, invoice) => {
      if (!invoice.invoiceDate) {
        return months
      }

      const date = new Date(invoice.invoiceDate)

      if (Number.isNaN(date.getTime())) {
        return months
      }

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`

      months[monthKey] =
        (months[monthKey] || 0) +
        (Number(invoice.totalAmount) || 0)

      return months
    },
    {},
  )

  const months = Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)

  const maxAmount = Math.max(
    ...months.map(([, amount]) => amount),
    0,
  )

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-')

    const date = new Date(
      Number(year),
      Number(month) - 1,
      1,
    )

    return date.toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Spending
        </h2>

        <p className="mt-6 text-center text-sm text-slate-500">
          Loading monthly data...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Spending
        </h2>

        <p className="mt-4 text-sm text-red-600">
          Unable to load monthly spending data.
        </p>
      </div>
    )
  }

  if (months.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Spending
        </h2>

        <div className="py-10 text-center">
          <div className="text-3xl">📈</div>

          <p className="mt-3 text-sm text-slate-500">
            No monthly spending data available yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Spending
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Spending trend over the last six active months.
        </p>
      </div>

      <div className="mt-8 flex h-64 items-end gap-3">
        {months.map(([month, amount]) => {
          const height =
            maxAmount > 0
              ? Math.max((amount / maxAmount) * 100, 4)
              : 4

          return (
            <div
              key={month}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-xs font-medium text-slate-600">
                {formatAmount(amount)}
              </span>

              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-yellow-400 transition-all duration-500"
                  style={{
                    height: `${height}%`,
                  }}
                  title={`${formatMonth(month)}: ${formatAmount(amount)}`}
                />
              </div>

              <span className="mt-3 text-xs text-slate-500">
                {formatMonth(month)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MonthlySpending