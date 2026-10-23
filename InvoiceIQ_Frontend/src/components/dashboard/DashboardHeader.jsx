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
    <section className="relative overflow-hidden rounded-2xl border border-[#263148] bg-[#0F172A] px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
      {/* Decorative background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.08] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/3 h-40 w-40 rounded-full bg-cyan-400/[0.05] blur-3xl"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Greeting and business information */}
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              aria-hidden="true"
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
              Your finance workspace
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl lg:text-[34px]">
            {getGreeting()},{' '}
            <span className="break-words text-indigo-300">
              {userName}
            </span>
            <span className="ml-2 inline-block" aria-hidden="true">
              👋
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {businessName
              ? `Here's what's happening with ${businessName}.`
              : "Here's what's happening with your invoices."}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 shrink-0 text-indigo-400"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
              />
              <path
                strokeLinecap="round"
                d="M16 3v4M8 3v4M3 10h18"
              />
            </svg>

            <span>{formatDate()}</span>
          </div>
        </div>

        {/* Upload action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleUploadInvoice}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-indigo-400/30 bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-400 hover:shadow-indigo-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0L7 9m5-5 5 5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2"
              />
            </svg>

            Upload Invoice

            <span
              className="ml-1 text-base leading-none"
              aria-hidden="true"
            >
              →
            </span>
          </button>

          <p className="mt-2 text-center text-[11px] text-slate-500 sm:text-right">
            PDF, PNG or JPEG
          </p>
        </div>
      </div>
    </section>
  )
}

export default DashboardHeader
