import { useDispatch, useSelector } from 'react-redux'

import { fetchAIInsights } from '../../redux/slices/invoiceSlice'

function InsightsHeader() {
  const dispatch = useDispatch()

  const {
    aiInsights,
    aiInsightsLoading,
  } = useSelector((state) => state.invoices)

  const handleRefresh = () => {
    dispatch(fetchAIInsights())
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">
            AI Insights
          </h1>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            ✨ AI Powered
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Turn your invoice data into actionable business insights.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        {aiInsights && !aiInsightsLoading && (
          <div className="max-w-xl rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI Summary
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              {aiInsights.summary}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleRefresh}
          disabled={aiInsightsLoading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
        >
          {aiInsightsLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Analyzing...
            </>
          ) : (
            <>
              <span>↻</span>
              Refresh AI Analysis
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default InsightsHeader
