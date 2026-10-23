import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import InsightsHeader from '../components/insights/InsightsHeader'
import InsightSummary from '../components/insights/InsightSummary'
import SpendingInsights from '../components/insights/SpendingInsights'
import Recommendations from '../components/insights/Recommendations'

import { fetchAIInsights } from '../redux/slices/invoiceSlice'

function Insights() {
const dispatch = useDispatch()

const {
aiInsights,
aiInsightsLoading,
aiInsightsError,
} = useSelector((state) => state.invoices)

useEffect(() => {
dispatch(fetchAIInsights())
}, [dispatch])

return ( <div className="min-h-full space-y-6 text-slate-100"> <InsightsHeader />


  {aiInsightsLoading && (
    <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-lg shadow-black/10">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
        </div>

        <div>
          <p className="font-semibold text-slate-100">
            AI is analyzing your invoices...
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Generating personalized spending insights. This may take a
            moment.
          </p>
        </div>
      </div>
    </div>
  )}

  {aiInsightsError && (
    <div
      role="alert"
      className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3h.008M10.3 3.86 1.82 18.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-2.86L13.7 3.86a2 2 0 0 0-3.4 0Z"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-rose-300">
            Unable to generate AI insights
          </p>

          <p className="mt-1 break-words text-sm leading-6 text-rose-200/70">
            {aiInsightsError}
          </p>

          <button
            type="button"
            onClick={() => dispatch(fetchAIInsights())}
            disabled={aiInsightsLoading}
            className="mt-3 inline-flex items-center rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )}

  {aiInsights && !aiInsightsLoading && (
    <div className="space-y-6">
      <InsightSummary />

      <SpendingInsights />

      <Recommendations />
    </div>
  )}

  {!aiInsightsLoading && !aiInsightsError && !aiInsights && (
    <div className="rounded-2xl border border-slate-800 bg-[#151B2B] px-6 py-12 text-center shadow-lg shadow-black/10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.06 16.94l-1.42 1.42m12.72 0-1.42-1.42M7.06 7.06 5.64 5.64M15 9.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 3v2"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-100">
        No insights available yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Your spending insights will appear here once invoice data is
        available. Try processing and confirming an invoice first.
      </p>

      <button
        type="button"
        onClick={() => dispatch(fetchAIInsights())}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B]"
      >
        Generate insights
      </button>
    </div>
  )}
</div>


)
}

export default Insights
