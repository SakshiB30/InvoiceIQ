import InsightsHeader from '../components/insights/InsightsHeader'
import InsightSummary from '../components/insights/InsightSummary'
import { InsightList } from '../components/insights/InsightCard'
import SpendingRecommendations from '../components/insights/SpendingRecommendations'

function Insights() {
  return (
    <div className="space-y-6">
      <InsightsHeader />

      <InsightSummary />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              AI Insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Important patterns detected from your invoice and expense data.
            </p>
          </div>

          <InsightList />
        </div>

        <SpendingRecommendations />
      </div>
    </div>
  )
}

export default Insights