import { Routes, Route } from 'react-router-dom'

import LandingPage from '../pages/LandingPage'
import Dashboard from '../pages/Dashboard'
import Invoices from '../pages/Invoices'
import Expenses from '../pages/Expenses'
import Analytics from '../pages/Analytics'
import Insights from '../pages/Insights'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import InvoiceDetails from '../components/invoices/InvoiceDetails'

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes