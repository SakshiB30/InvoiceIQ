import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function InvoiceFilters({ onFilterChange }) {
  const reduxFilters = useSelector(
    (state) => state.invoices.filters,
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
    const timer = setTimeout(() => {
      const today = new Date()

      let fromDate = ''
      let toDate = ''

      if (dateFilter === 'Today') {
        fromDate = formatDate(today)
        toDate = formatDate(today)
      }

      if (dateFilter === 'This Week') {
        const startOfWeek = new Date(today)
        const day = startOfWeek.getDay()
        const difference = day === 0 ? 6 : day - 1

        startOfWeek.setDate(
          startOfWeek.getDate() - difference,
        )

        fromDate = formatDate(startOfWeek)
        toDate = formatDate(today)
      }

      if (dateFilter === 'This Month') {
        const startOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        )

        fromDate = formatDate(startOfMonth)
        toDate = formatDate(today)
      }

      if (dateFilter === 'This Year') {
        const startOfYear = new Date(
          today.getFullYear(),
          0,
          1,
        )

        fromDate = formatDate(startOfYear)
        toDate = formatDate(today)
      }

      onFilterChange({
        search,
        category: category === 'All' ? '' : category,
        dateFilter,
        fromDate,
        toDate,
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [search, category, dateFilter, onFilterChange])

  const handleClearFilters = () => {
    setSearch('')
    setCategory('All')
    setDateFilter('All')
  }

  const hasFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    dateFilter !== 'All'

  const inputClass =
    'w-full rounded-xl border border-slate-700/80 bg-[#0B0F19] px-4 py-3 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

  const labelClass =
    'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400'

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-[#151B2B] p-4 shadow-lg shadow-black/10 sm:p-5">
      {/* Filter header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M7 12h10m-7 6h4"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Find invoices
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Search and refine your invoice list
            </p>
          </div>
        </div>

        {hasFilters && (
          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            Filters active
          </span>
        )}
      </div>

      {/* Search and filter controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <label htmlFor="invoice-search" className={labelClass}>
            Search invoices
          </label>

          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16 16 4 4"
              />
            </svg>

            <input
              id="invoice-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Invoice number or vendor..."
              autoComplete="off"
              className={`${inputClass} pl-11`}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18 6-12 12M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="invoice-category" className={labelClass}>
            Category
          </label>

          <select
            id="invoice-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
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
          <label htmlFor="invoice-date-filter" className={labelClass}>
            Date range
          </label>

          <select
            id="invoice-date-filter"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className={inputClass}
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>

      {/* Active filter actions */}
      {hasFilters && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-400">
            Refine your results using the selected filters.
          </p>

          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
              />
            </svg>
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}

export default InvoiceFilters
