import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 font-bold text-slate-900">
            IQ
          </div>

          <span className="text-xl font-bold text-slate-900">
            Invoice<span className="text-yellow-500">IQ</span>
          </span>
        </NavLink>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-lg transition hover:bg-slate-100"
            title="Notifications"
          >
            🔔

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 font-semibold text-slate-700">
              BO
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Business Owner
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar