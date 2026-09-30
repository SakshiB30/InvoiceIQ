const analyticsSummary = [
  {
    title: 'Total Spending',
    value: '₹2,45,600',
    change: '+8.4%',
    description: 'vs previous period',
    icon: '💰',
  },
  {
    title: 'Average Monthly',
    value: '₹48,200',
    change: '+5.2%',
    description: 'average spending',
    icon: '📊',
  },
  {
    title: 'Top Category',
    value: 'Inventory',
    change: '35.2%',
    description: 'of total spending',
    icon: '📦',
  },
  {
    title: 'Transactions',
    value: '128',
    change: '+12',
    description: 'this period',
    icon: '🧾',
  },
]

function AnalyticsSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {analyticsSummary.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {item.value}
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-green-600">
                  {item.change}
                </span>

                <span className="text-xs text-slate-400">
                  {item.description}
                </span>
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-xl">
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnalyticsSummary