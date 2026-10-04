import { useSelector } from 'react-redux'

function SpendingInsights() {
  const {
    aiInsights,
    aiInsightsLoading,
  } = useSelector((state) => state.invoices)

  if (aiInsightsLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending Insights
        </h2>

        <p className="mt-6 text-center text-sm text-slate-500">
          AI is analyzing your spending patterns...
        </p>
      </div>
    )
  }

  if (!aiInsights) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending Insights
        </h2>

        <div className="py-10 text-center">
          <div className="text-3xl">💡</div>

          <p className="mt-3 text-sm text-slate-500">
            Upload invoices to generate AI spending insights.
          </p>
        </div>
      </div>
    )
  }

  const insights = aiInsights.spendingInsights || []

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Spending Insights
          </h2>

          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
            AI Powered
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Key spending patterns identified by InvoiceIQ AI.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-3xl">💡</div>

          <p className="mt-3 text-sm text-slate-500">
            Not enough data to generate detailed spending insights.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {insights.map((insight, index) => (
            <div
              key={`${index}-${insight}`}
              className="rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xl">
                  {index === 0
                    ? '📊'
                    : index === 1
                      ? '💰'
                      : index === 2
                        ? '🏢'
                        : '💡'}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    AI Insight {index + 1}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {insight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SpendingInsights
