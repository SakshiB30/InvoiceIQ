const categories = [
  {
    name: 'Inventory',
    amount: '₹86,500',
    percentage: 35,
  },
  {
    name: 'Office',
    amount: '₹42,300',
    percentage: 17,
  },
  {
    name: 'Marketing',
    amount: '₹38,200',
    percentage: 16,
  },
  {
    name: 'Travel',
    amount: '₹31,600',
    percentage: 13,
  },
  {
    name: 'Utilities',
    amount: '₹27,000',
    percentage: 11,
  },
  {
    name: 'Other',
    amount: '₹20,000',
    percentage: 8,
  },
]

function CategoryBreakdown() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Expense by Category
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          See where your business spending is going.
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-700">
                  {category.name}
                </span>

                <span className="ml-2 text-xs text-slate-400">
                  {category.percentage}%
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-900">
                {category.amount}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryBreakdown