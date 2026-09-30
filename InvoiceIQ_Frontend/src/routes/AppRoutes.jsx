import { Routes, Route } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Invoices from '../pages/Invoices'
import Expenses from '../pages/Expenses'
import Analytics from '../pages/Analytics'
import Insights from '../pages/Insights'
import Settings from '../pages/Settings'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default AppRoutes