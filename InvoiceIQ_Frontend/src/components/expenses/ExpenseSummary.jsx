import { useSelector } from 'react-redux'

function formatAmount(amount) {
return new Intl.NumberFormat('en-IN', {
style: 'currency',
currency: 'INR',
maximumFractionDigits: 2,
}).format(Number(amount) || 0)
}

const summaryIcons = {
money: ( <svg
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.7"
   className="h-5 w-5"
   aria-hidden="true"
 > <rect x="3" y="6" width="18" height="13" rx="2" /> <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M7 6V4h10v2M12 10v5m-2-2 2 2 2-2"
   /> </svg>
),
average: ( <svg
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.7"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6"
   /> </svg>
),
category: ( <svg
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.7"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M4 5h7v7H4zM15 5h5v5h-5zM15 14h5v5h-5zM4 15h7v4H4z"
   /> </svg>
),
transactions: ( <svg
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.7"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
   /> <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M15 3v5h4M9 12h6M9 16h6"
   /> </svg>
),
}

const iconStyles = {
money: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
average: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
category: 'border-violet-400/20 bg-violet-500/10 text-violet-300',
transactions: 'border-indigo-400/20 bg-indigo-500/10 text-indigo-300',
}

function ExpenseSummary() {
const {
expenses = [],
loading,
} = useSelector((state) => state.expenses)

const totalExpenses = expenses.reduce(
(total, expense) =>
total + (Number(expense.totalAmount) || 0),
0,
)

const transactionCount = expenses.length

const averageExpense =
transactionCount > 0
? totalExpenses / transactionCount
: 0

const categoryTotals = expenses.reduce(
(categories, expense) => {
const category = expense.category || 'Other'
const amount = Number(expense.totalAmount) || 0


  categories[category] =
    (categories[category] || 0) + amount

  return categories
},
{},


)

const highestCategory = Object.entries(
categoryTotals,
).sort((a, b) => b[1] - a[1])[0]

const highestCategoryName =
highestCategory?.[0] || '—'

const highestCategoryAmount =
highestCategory?.[1] || 0

const summary = [
{
title: 'Total Expenses',
value: loading ? '—' : formatAmount(totalExpenses),
description: 'Based on current filters',
icon: 'money',
},
{
title: 'Average Expense',
value: loading ? '—' : formatAmount(averageExpense),
description: 'Average per transaction',
icon: 'average',
},
{
title: 'Highest Category',
value: loading ? '—' : highestCategoryName,
description: loading
? 'Calculating...'
: highestCategory
? `${formatAmount(highestCategoryAmount)} spent`
: 'No expenses recorded',
icon: 'category',
},
{
title: 'Transactions',
value: loading ? '—' : transactionCount,
description: 'Matching transactions',
icon: 'transactions',
},
]

return ( <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
{summary.map((item) => ( <div
       key={item.title}
       className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#151B2B] p-5 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20"
     > <div className="flex items-start justify-between gap-3"> <div className="min-w-0 flex-1"> <p className="text-sm font-medium text-slate-400">
{item.title} </p>


          <h2 className="mt-3 truncate text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
            {item.value}
          </h2>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {item.description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconStyles[item.icon]}`}
        >
          {summaryIcons[item.icon]}
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-10 -right-8 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition group-hover:bg-indigo-500/10" />
    </div>
  ))}
</div>


)
}

export default ExpenseSummary
