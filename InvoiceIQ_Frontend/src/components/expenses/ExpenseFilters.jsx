import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function getDateRange(dateFilter) {
const today = new Date()

const formatDate = (date) => {
const year = date.getFullYear()
const month = String(
date.getMonth() + 1,
).padStart(2, '0')
const day = String(
date.getDate(),
).padStart(2, '0')


return `${year}-${month}-${day}`


}

if (dateFilter === 'All') {
return {
fromDate: '',
toDate: '',
}
}

if (dateFilter === 'Today') {
const date = formatDate(today)


return {
  fromDate: date,
  toDate: date,
}


}

if (dateFilter === 'This Week') {
const startOfWeek = new Date(today)


const day = startOfWeek.getDay()
const difference = day === 0 ? 6 : day - 1

startOfWeek.setDate(
  startOfWeek.getDate() - difference,
)

return {
  fromDate: formatDate(startOfWeek),
  toDate: formatDate(today),
}


}

if (dateFilter === 'This Month') {
const startOfMonth = new Date(
today.getFullYear(),
today.getMonth(),
1,
)


return {
  fromDate: formatDate(startOfMonth),
  toDate: formatDate(today),
}


}

if (dateFilter === 'This Year') {
const startOfYear = new Date(
today.getFullYear(),
0,
1,
)


return {
  fromDate: formatDate(startOfYear),
  toDate: formatDate(today),
}


}

return {
fromDate: '',
toDate: '',
}
}

const inputClassName =
'w-full rounded-xl border border-slate-700/80 bg-[#0B0F19] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

const labelClassName =
'mb-2 block text-sm font-medium text-slate-300'

function ExpenseFilters({ onFilterChange }) {
const reduxFilters = useSelector(
(state) => state.expenses.filters,
)

const [search, setSearch] = useState(
reduxFilters.search || '',
)

const [category, setCategory] = useState(
reduxFilters.category || 'All',
)

const [dateFilter, setDateFilter] = useState(
reduxFilters.dateFilter || 'All',
)

useEffect(() => {
setSearch(reduxFilters.search || '')
setCategory(reduxFilters.category || 'All')
setDateFilter(reduxFilters.dateFilter || 'All')
}, [
reduxFilters.search,
reduxFilters.category,
reduxFilters.dateFilter,
])

useEffect(() => {
const timer = setTimeout(() => {
const { fromDate, toDate } =
getDateRange(dateFilter)


  onFilterChange({
    search: search.trim(),
    category,
    dateFilter,
    fromDate,
    toDate,
  })
}, 300)

return () => clearTimeout(timer)


}, [
search,
category,
dateFilter,
onFilterChange,
])

return ( <section className="rounded-2xl border border-slate-800/80 bg-[#151B2B] p-5 shadow-lg shadow-black/10 sm:p-6"> <div className="mb-5 flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300"> <svg
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="1.8"
         className="h-5 w-5"
         aria-hidden="true"
       > <path
           strokeLinecap="round"
           strokeLinejoin="round"
           d="M4 7h16M7 12h10m-7 5h4"
         /> </svg> </div>


    <div>
      <h2 className="text-base font-semibold text-slate-100">
        Filter Expenses
      </h2>
      <p className="mt-0.5 text-sm text-slate-400">
        Find transactions by keyword, category, or date.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
    {/* Search */}
    <div className="md:col-span-2">
      <label
        htmlFor="expense-search"
        className={labelClassName}
      >
        Search
      </label>

      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path
            strokeLinecap="round"
            d="m16 16 4 4"
          />
        </svg>

        <input
          id="expense-search"
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by vendor or invoice..."
          className={`${inputClassName} pl-10`}
        />
      </div>
    </div>

    {/* Category */}
    <div>
      <label
        htmlFor="expense-category"
        className={labelClassName}
      >
        Category
      </label>

      <select
        id="expense-category"
        value={category}
        onChange={(event) =>
          setCategory(event.target.value)
        }
        className={inputClassName}
      >
        <option value="All">All Categories</option>
        <option value="Inventory">Inventory</option>
        <option value="Office">Office</option>
        <option value="Travel">Travel</option>
        <option value="Utilities">Utilities</option>
        <option value="Marketing">Marketing</option>
        <option value="Other">Other</option>
      </select>
    </div>

    {/* Date */}
    <div>
      <label
        htmlFor="expense-date-filter"
        className={labelClassName}
      >
        Date Range
      </label>

      <select
        id="expense-date-filter"
        value={dateFilter}
        onChange={(event) =>
          setDateFilter(event.target.value)
        }
        className={inputClassName}
      >
        <option value="All">All Dates</option>
        <option value="Today">Today</option>
        <option value="This Week">This Week</option>
        <option value="This Month">This Month</option>
        <option value="This Year">This Year</option>
      </select>
    </div>
  </div>
</section>


)
}

export default ExpenseFilters;
