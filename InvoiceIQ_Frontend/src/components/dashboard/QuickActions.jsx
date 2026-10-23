import { useNavigate } from 'react-router-dom'

function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      title: 'Upload Invoice',
      description: 'Add a new invoice for AI analysis',
      icon: '↥',
      path: '/invoices',
      iconColor: 'text-indigo-300',
      iconBackground: 'bg-indigo-500/15',
      borderHover: 'hover:border-indigo-400/40',
    },
    {
      title: 'View Analytics',
      description: 'Explore spending trends and categories',
      icon: '▥',
      path: '/analytics',
      iconColor: 'text-cyan-300',
      iconBackground: 'bg-cyan-500/10',
      borderHover: 'hover:border-cyan-400/40',
    },
    {
      title: 'AI Insights',
      description: 'See AI-powered spending recommendations',
      icon: '✧',
      path: '/insights',
      iconColor: 'text-violet-300',
      iconBackground: 'bg-violet-500/10',
      borderHover: 'hover:border-violet-400/40',
    },
    {
      title: 'Settings',
      description: 'Manage your business profile',
      icon: '⚙',
      path: '/settings',
      iconColor: 'text-emerald-300',
      iconBackground: 'bg-emerald-500/10',
      borderHover: 'hover:border-emerald-400/40',
    },
  ]

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-100">
          Quick actions
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Quickly access the tools you use most.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={() => navigate(action.path)}
            aria-label={`${action.title}: ${action.description}`}
            className={`group relative overflow-hidden rounded-2xl border border-[#263148] bg-[#151B2B] p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition duration-200 hover:-translate-y-1 hover:bg-[#1B2336] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${action.borderHover}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition duration-200 group-hover:scale-105 ${action.iconBackground} ${action.iconColor}`}
                aria-hidden="true"
              >
                {action.icon}
              </div>

              <span
                className="text-lg text-slate-600 transition duration-200 group-hover:translate-x-1 group-hover:text-slate-200"
                aria-hidden="true"
              >
                →
              </span>
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-100 transition-colors group-hover:text-indigo-200">
              {action.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {action.description}
            </p>

            <div
              className={`absolute bottom-0 left-5 right-5 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${action.iconBackground}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
