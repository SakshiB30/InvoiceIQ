import { useNavigate } from 'react-router-dom'

function DashboardHeader() {
  const navigate = useNavigate()

  const handleUploadInvoice = () => {
    navigate('/invoices')
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Here's what's happening with your invoices.
        </p>
      </div>

      <button
        type="button"
        onClick={handleUploadInvoice}
        className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
      >
        + Upload Invoice
      </button>
    </div>
  )
}

export default DashboardHeader