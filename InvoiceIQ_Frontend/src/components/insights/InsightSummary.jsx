const summary = [
  {
    title: 'Potential Savings',
    value: '₹12,500',
    description: 'Estimated monthly savings',
    icon: '💡',
  },
  {
    title: 'Unusual Spending',
    value: '3',
    description: 'Transactions need attention',
    icon: '⚠️',
  },
  {
    title: 'Duplicate Invoices',
    value: '2',
    description: 'Possible duplicates detected',
    icon: '🔍',
  },
  {
    title: 'Cost Increase',
    value: '8.4%',
    description: 'Compared with last month',
    icon: '📈',
  },
]

function InsightSummary() {
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

export default InsightSummary