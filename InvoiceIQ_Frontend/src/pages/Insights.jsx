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

  return (
    <div className="space-y-6">
      <InsightsHeader />

      {aiInsightsLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

            <div>
              <p className="font-medium text-gray-900">
                AI is analyzing your invoices...
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Generating personalized spending insights.
              </p>
            </div>
          </div>
        </div>
      )}

      {aiInsightsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-700">
            Unable to generate AI insights
          </p>

          <p className="mt-1 text-sm text-red-600">
            {aiInsightsError}
          </p>
        </div>
      )}

      {aiInsights && !aiInsightsLoading && (
        <>
          <InsightSummary />

          <SpendingInsights />

          <Recommendations />
        </>
      )}
    </div>
  )
}

export default Insights
