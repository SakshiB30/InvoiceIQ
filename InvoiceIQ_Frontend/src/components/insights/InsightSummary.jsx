import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

function InsightSummary() {
  const {
    aiInsights,
    aiInsightsLoading,
  } = useSelector((state) => state.invoices)

  const summary = [
    {
      title: 'Total Spending',
      value:
        aiInsightsLoading || !aiInsights
          ? '—'
          : formatAmount(aiInsights.totalSpending),
      description: 'Across all analyzed invoices',
      icon: '💰',
    },
    {
      title: 'Top Category',
      value:
        aiInsightsLoading || !aiInsights
          ? '—'
          : aiInsights.topCategory || '—',
      description:
        aiInsightsLoading || !aiInsights
          ? 'AI is analyzing...'
          : 'Highest spending category',
      icon: '📦',
    },
    {
      title: 'Top Vendor',
      value:
        aiInsightsLoading || !aiInsights
          ? '—'
          : aiInsights.topVendor || '—',
      description:
        aiInsightsLoading || !aiInsights
          ? 'AI is analyzing...'
          : 'Highest spending vendor',
      icon: '🏢',
    },
    {
      title: 'Invoices Analyzed',
      value:
        aiInsightsLoading || !aiInsights
          ? '—'
          : aiInsights.totalInvoices ?? 0,
      description: 'Invoices analyzed by AI',
      icon: '🧠',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-2 truncate text-xl font-bold text-slate-900">
                {item.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {item.description}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default InsightSummary
