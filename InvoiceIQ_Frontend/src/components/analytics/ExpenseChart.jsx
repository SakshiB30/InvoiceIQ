const monthlyExpenses = [
  { month: 'Apr', amount: 32000 },
  { month: 'May', amount: 41000 },
  { month: 'Jun', amount: 36500 },
  { month: 'Jul', amount: 52000 },
  { month: 'Aug', amount: 45200 },
  { month: 'Sep', amount: 48200 },
]

function ExpenseChart() {
  const maxAmount = Math.max(
    ...monthlyExpenses.map((item) => item.amount)
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Expenses
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Expense trends over the last six months.
        </p>
      </div>

      <div className="flex h-64 items-end gap-4">
        {monthlyExpenses.map((item) => {
          const height = (item.amount / maxAmount) * 100

          return (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-medium text-slate-500">
                ₹{(item.amount / 1000).toFixed(1)}k
              </span>

              <div className="flex h-48 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-yellow-400 transition hover:bg-yellow-500"
                  style={{ height: `${height}%` }}
                  title={`₹${item.amount.toLocaleString('en-IN')}`}
                />
              </div>

              <span className="text-xs font-medium text-slate-500">
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpenseChart