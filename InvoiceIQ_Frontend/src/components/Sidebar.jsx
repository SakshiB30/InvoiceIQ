import { NavLink } from 'react-router-dom'

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
  const handleLogout = () => {
    // Authentication/logout logic will be added later.
    console.log('Logout clicked')
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col">
        {/* Main Navigation */}
        <nav className="flex-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-yellow-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <span className="text-base">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 p-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-yellow-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <span>⚙️</span>
            <span>Settings</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar