import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

function Navbar() {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth,
  )

  const displayName = user?.name || 'Business Owner'
  const businessName = user?.businessName || 'InvoiceIQ'

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#263148] bg-[#0F172A]/95 text-slate-100 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink
          to="/"
          aria-label="InvoiceIQ dashboard"
          className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold tracking-tight text-white shadow-lg shadow-indigo-950/40 transition-transform duration-200 group-hover:scale-105">
            IQ
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-slate-100 sm:text-xl">
              Invoice<span className="text-indigo-400">IQ</span>
            </span>

            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
              Finance intelligence
            </span>
          </div>
        </NavLink>

        {/* Right Section */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-all duration-200 hover:border-[#263148] hover:bg-[#151B2B] hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 21h4"
              />
            </svg>

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#0F172A] bg-cyan-400" />
          </button>

          {/* Profile */}
          <NavLink
            to="/settings"
            aria-label={`Open settings for ${displayName}`}
            className="flex min-w-0 items-center gap-2 rounded-xl border border-transparent py-1.5 pl-2 pr-1.5 transition-all duration-200 hover:border-[#263148] hover:bg-[#151B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:gap-3 sm:pl-3 sm:pr-2"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/15 text-xs font-bold text-indigo-300 ring-2 ring-indigo-500/10">
              {isAuthenticated ? initials : 'BO'}
            </div>

            {/* User Information */}
            <div className="hidden min-w-0 max-w-[180px] sm:block">
              <p className="truncate text-sm font-semibold leading-5 text-slate-100">
                {displayName}
              </p>

              <p className="truncate text-xs leading-4 text-slate-400">
                {businessName}
              </p>
            </div>

            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="hidden h-4 w-4 text-slate-500 sm:block"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7 4 6 6-6 6"
              />
            </svg>
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
