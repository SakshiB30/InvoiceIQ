import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

import { logout } from '../redux/slices/authSlice'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '▦',
  },
  {
    name: 'Invoices',
    path: '/invoices',
    icon: '▤',
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: '↗',
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: '⌁',
  },
  {
    name: 'Insights',
    path: '/insights',
    icon: '✧',
  },
]

function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navLinkClasses = ({ isActive }) =>
    [
      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-3',
      'text-sm font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
      isActive
        ? 'bg-indigo-500/15 text-indigo-300'
        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100',
    ].join(' ')

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-[#263148] bg-[#0F172A] md:block">
      <div className="flex h-full flex-col">
        {/* Workspace navigation */}
        <nav aria-label="Main navigation" className="flex-1 overflow-hidden px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={navLinkClasses}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-indigo-400" />
                    )}

                    <span
                      className={[
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        'text-xl transition-all duration-200',
                        isActive
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800/70 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>

                    <span className="flex-1">{item.name}</span>

                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Account actions */}
        <div className="border-t border-[#263148] p-4">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Account
          </p>

          <div className="space-y-1.5">
            <NavLink to="/settings" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-indigo-400" />
                  )}

                  <span
                    className={[
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      'text-lg transition-all duration-200',
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-slate-800/70 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    ⚙
                  </span>

                  <span className="flex-1">Settings</span>

                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/70 text-lg text-slate-400 transition-colors group-hover:bg-rose-500/15 group-hover:text-rose-300"
                aria-hidden="true"
              >
                ↪
              </span>

              <span>Logout</span>
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-[#263148] bg-[#151B2B] px-3 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span className="text-xs font-medium text-slate-300">
                Workspace active
              </span>
            </div>
            <p className="mt-1 pl-4 text-[11px] text-slate-500">
              InvoiceIQ · Finance workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
