import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatsCards from '../components/dashboard/StatsCards'
import AISpendingSnapshot from '../components/dashboard/AISpendingSnapshot'
import RecentInvoices from '../components/dashboard/RecentInvoices'

import { fetchInvoices } from '../redux/slices/invoiceSlice'

function Dashboard() {
  const dispatch = useDispatch()

  const loadInvoices = useCallback(() => {
    dispatch(fetchInvoices())
  }, [dispatch])

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsCards />

      <AISpendingSnapshot />

      <RecentInvoices />
    </div>
  )
}

export default Dashboard
