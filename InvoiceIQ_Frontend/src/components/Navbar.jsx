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
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">

        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 font-bold text-slate-900 shadow-sm">
            IQ
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Invoice<span className="text-yellow-500">IQ</span>
          </span>
        </NavLink>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-lg transition hover:bg-slate-100"
            title="Notifications"
          >
            🔔

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <NavLink
            to="/settings"
            className="flex items-center gap-2 rounded-lg border-l border-slate-200 pl-3 transition hover:bg-slate-50 sm:gap-3 sm:pl-4"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-slate-700">
              {isAuthenticated ? initials : 'BO'}
            </div>

            {/* User Information */}
            <div className="hidden max-w-[180px] sm:block">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>

              <p className="truncate text-xs text-slate-500">
                {businessName}
              </p>
            </div>

            {/* Arrow */}
            <span className="hidden text-xs text-slate-400 sm:block">
              →
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default Navbar
