import { Routes, Route } from 'react-router-dom'

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

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
    <Route path="/" element={<Dashboard />} />
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