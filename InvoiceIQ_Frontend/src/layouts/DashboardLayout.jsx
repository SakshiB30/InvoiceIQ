import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Application Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Page Content */}
        <main
          className="
            min-w-0
            flex-1
            bg-[#0B0F19]
            px-4
            py-6
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
