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
    const difference =
      day === 0 ? 6 : day - 1

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
    reduxFilters.dateFilter || 'This Month',
  )

  useEffect(() => {
    setSearch(reduxFilters.search || '')
    setCategory(
      reduxFilters.category || 'All',
    )
    setDateFilter(
      reduxFilters.dateFilter || 'This Month',
    )
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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        {/* Search */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Search
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by vendor or invoice..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          >
            <option value="All">
              All Categories
            </option>

            <option value="Inventory">
              Inventory
            </option>

            <option value="Office">
              Office
            </option>

            <option value="Travel">
              Travel
            </option>

            <option value="Utilities">
              Utilities
            </option>

            <option value="Marketing">
              Marketing
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date
          </label>

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          >
            <option value="All">
              All Dates
            </option>

            <option value="Today">
              Today
            </option>

            <option value="This Week">
              This Week
            </option>

            <option value="This Month">
              This Month
            </option>

            <option value="This Year">
              This Year
            </option>
          </select>
        </div>

      </div>
    </div>
  )
}

export default ExpenseFilters