import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatsCards from '../components/dashboard/StatsCards'
import RecentInvoices from '../components/dashboard/RecentInvoices'

function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsCards />

      <RecentInvoices />
    </div>
  )
}

export default Dashboard