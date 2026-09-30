import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="min-h-[calc(100vh-4rem)] flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout