import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
}

function formatDate() {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

function DashboardHeader() {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  const userName = user?.name || 'there'
  const businessName = user?.businessName

  const handleUploadInvoice = () => {
    navigate('/invoices')
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {userName} 👋
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {businessName
            ? `Here's what's happening with ${businessName}.`
            : "Here's what's happening with your invoices."}
        </p>

        <p className="mt-2 text-xs font-medium text-slate-400">
          {formatDate()}
        </p>
      </div>

      <button
        type="button"
        onClick={handleUploadInvoice}
        className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-yellow-500 hover:shadow-md"
      >
        <span className="mr-1.5 text-base">+</span>
        Upload Invoice
      </button>
    </div>
  )
}

export default DashboardHeader
