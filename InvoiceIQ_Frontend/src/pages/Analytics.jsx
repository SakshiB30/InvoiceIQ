import AnalyticsHeader from '../components/analytics/AnalyticsHeader'
import AnalyticsStats from '../components/analytics/AnalyticsStats'
import CategorySpending from '../components/analytics/CategorySpending'
import MonthlySpending from '../components/analytics/MonthlySpending'
import TopVendors from '../components/analytics/TopVendors'

function Analytics() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />

      <AnalyticsStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CategorySpending />
        <MonthlySpending />
      </div>

      <TopVendors />
    </div>
  )
}

export default Analytics