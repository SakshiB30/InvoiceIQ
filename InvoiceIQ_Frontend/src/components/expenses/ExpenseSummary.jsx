const summary = [
  {
    title: 'Total Expenses',
    value: '₹2,45,600',
    description: 'All recorded expenses',
    icon: '💰',
  },
  {
    title: 'This Month',
    value: '₹48,200',
    description: 'Expenses this month',
    icon: '📅',
  },
  {
    title: 'Highest Category',
    value: 'Inventory',
    description: '₹86,500 spent',
    icon: '📦',
  },
  {
    title: 'Transactions',
    value: '128',
    description: 'Total transactions',
    icon: '🧾',
  },
]

function ExpenseSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => (
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

              <p className="mt-1 text-xs text-slate-400">
                {item.description}
              </p>
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

export default ExpenseSummary