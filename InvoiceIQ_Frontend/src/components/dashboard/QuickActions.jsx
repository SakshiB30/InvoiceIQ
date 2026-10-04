import { useNavigate } from 'react-router-dom'

function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      title: 'Upload Invoice',
      description: 'Add a new invoice for AI analysis',
      icon: '📄',
      path: '/invoices',
    },
    {
      title: 'View Analytics',
      description: 'Explore spending trends and categories',
      icon: '📊',
      path: '/analytics',
    },
    {
      title: 'AI Insights',
      description: 'See AI-powered spending recommendations',
      icon: '✨',
      path: '/insights',
    },
    {
      title: 'Settings',
      description: 'Manage your business profile',
      icon: '⚙️',
      path: '/settings',
    },
  ]

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quickly access the tools you use most.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={() => navigate(action.path)}
            className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-xl">
                {action.icon}
              </div>

              <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
                →
              </span>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              {action.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
