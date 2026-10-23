import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

const statStyles = [
  {
    icon: '▤',
    iconColor: 'text-indigo-300',
    iconBackground: 'bg-indigo-500/15',
    accent: 'bg-indigo-400',
  },
  {
    icon: '₹',
    iconColor: 'text-cyan-300',
    iconBackground: 'bg-cyan-500/15',
    accent: 'bg-cyan-400',
  },
  {
    icon: '◷',
    iconColor: 'text-amber-300',
    iconBackground: 'bg-amber-500/15',
    accent: 'bg-amber-400',
  },
  {
    icon: '↗',
    iconColor: 'text-emerald-300',
    iconBackground: 'bg-emerald-500/15',
    accent: 'bg-emerald-400',
  },
]

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
    },
    {
      title: 'Total Expenses',
      value: loading ? '—' : formatAmount(totalExpenses),
      description: 'Total recorded expenses',
    },
    {
      title: 'Pending Review',
      value: loading ? '—' : pendingReview,
      description: 'Invoices to review',
    },
    {
      title: 'This Month',
      value: loading ? '—' : formatAmount(thisMonthExpenses),
      description: 'Expenses this month',
    },
  ]

  return (
    <section aria-label="Invoice statistics">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const style = statStyles[index]

          return (
            <article
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-[#263148] bg-[#151B2B] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-600 hover:bg-[#1B2336] sm:p-6"
            >
              {/* Top accent */}
              <div
                className={`absolute left-0 top-0 h-[2px] w-12 ${style.accent} opacity-70 transition-all duration-200 group-hover:w-20 group-hover:opacity-100`}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <h2
                    className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-100 sm:text-[26px]"
                    title={String(stat.value)}
                  >
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBackground} ${style.iconColor} text-xl font-semibold transition-transform duration-200 group-hover:scale-105`}
                  aria-hidden="true"
                >
                  {style.icon}
                </div>
              </div>

              {/* Loading indicator */}
              {loading && (
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-slate-800"
                  aria-label="Loading statistics"
                >
                  <div className="h-full w-1/3 animate-pulse bg-indigo-400" />
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default StatsCards
