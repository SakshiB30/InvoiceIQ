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

return ( <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"> <div className="min-w-0"> <div className="flex flex-wrap items-center gap-3"> <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
AI Insights </h1>


      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
        <span aria-hidden="true">✦</span>
        AI Powered
      </span>
    </div>

    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
      Turn your invoice data into actionable business insights and smarter
      spending decisions.
    </p>
  </div>

  <div className="flex w-full flex-col gap-3 sm:w-auto sm:max-w-xl sm:items-end">
    {aiInsights && !aiInsightsLoading && aiInsights.summary && (
      <div className="w-full rounded-xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 p-4 sm:min-w-[280px]">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m12.5-7.5-.8 2.2m-5.4 12.6-.8 2.2m9-3.5-1.6-1.6M7.1 7.1 5.5 5.5M15.5 9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              />
            </svg>
          </span>

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            AI Summary
          </p>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {aiInsights.summary}
        </p>
      </div>
    )}

    <button
      type="button"
      onClick={handleRefresh}
      disabled={aiInsightsLoading}
      className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition duration-200 hover:border-indigo-400/40 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
    >
      {aiInsightsLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
          Analyzing...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7v5h-5M4 17v-5h5m11-1a8 8 0 0 0-14.5-4M4 13a8 8 0 0 0 14.5 4"
            />
          </svg>
          Refresh AI Analysis
        </>
      )}
    </button>
  </div>
</div>

)
}

export default InsightsHeader
