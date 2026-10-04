import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

function StatsCards() {
  const { invoices, loading } = useSelector(
    (state) => state.invoices,
  )

  const totalInvoices = invoices.length

  const totalExpenses = invoices.reduce(
    (total, invoice) =>
      total + (Number(invoice.totalAmount) || 0),
    0,
  )

  const pendingReview = invoices.filter((invoice) => {
    const status = invoice.processingStatus

    return (
      status === 'PENDING' ||
      status === 'PROCESSING' ||
      status === 'UPLOADING' ||
      invoice.validation?.valid === false
    )
  }).length

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

  const stats = [
    {
      title: 'Total Invoices',
      value: loading ? '—' : totalInvoices,
      description: 'All uploaded invoices',
      icon: '📄',
    },
    {
      title: 'Total Expenses',
      value: loading
        ? '—'
        : formatAmount(totalExpenses),
      description: 'Total recorded expenses',
      icon: '💰',
    },
    {
      title: 'Pending Review',
      value: loading ? '—' : pendingReview,
      description: 'Invoices to review',
      icon: '⏳',
    },
    {
      title: 'This Month',
      value: loading
        ? '—'
        : formatAmount(thisMonthExpenses),
      description: 'Expenses this month',
      icon: '📈',
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-2 truncate text-2xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
