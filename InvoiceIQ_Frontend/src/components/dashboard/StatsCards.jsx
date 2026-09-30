const stats = [
  {
    title: 'Total Invoices',
    value: '128',
    description: 'All uploaded invoices',
    icon: '📄',
  },
  {
    title: 'Total Expenses',
    value: '₹2,45,600',
    description: 'Total recorded expenses',
    icon: '💰',
  },
  {
    title: 'Pending Review',
    value: '12',
    description: 'Invoices to review',
    icon: '⏳',
  },
  {
    title: 'This Month',
    value: '₹48,200',
    description: 'Expenses this month',
    icon: '📈',
  },
]

function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards