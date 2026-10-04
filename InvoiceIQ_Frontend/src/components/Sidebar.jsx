import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

import { logout } from '../redux/slices/authSlice'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: '📊',
  },
  {
    name: 'Invoices',
    path: '/invoices',
    icon: '📄',
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: '💰',
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: '📈',
  },
  {
    name: 'Insights',
    path: '/insights',
    icon: '💡',
  },
]

function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col">

        {/* Navigation */}
        <nav className="flex-1 overflow-hidden p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-yellow-100 text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-base transition ${
                        isActive
                          ? 'bg-yellow-200'
                          : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.name}</span>

                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-yellow-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-200 p-4">

          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          {/* Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-yellow-100 text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-base ${
                    isActive ? 'bg-yellow-200' : 'bg-slate-100'
                  }`}
                >
                  ⚙️
                </span>

                <span>Settings</span>
              </>
            )}
          </NavLink>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-base">
              🚪
            </span>

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
