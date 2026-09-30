import AnalyticsHeader from '../components/analytics/AnalyticsHeader'
import AnalyticsSummary from '../components/analytics/AnalyticsSummary'
import ExpenseChart from '../components/analytics/ExpenseChart'
import CategoryBreakdown from '../components/analytics/CategoryBreakdown'

function Analytics() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      <AnalyticsSummary />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ExpenseChart />
        <CategoryBreakdown />
      </div>
    </div>
  )
}

export default Analytics