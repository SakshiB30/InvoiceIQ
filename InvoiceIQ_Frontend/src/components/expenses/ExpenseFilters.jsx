import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { fetchInvoices } from '../../redux/slices/invoiceSlice'

function ExpenseFilters() {
  const dispatch = useDispatch()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [dateFilter, setDateFilter] = useState('This Month')

  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = {
        search: search.trim() || undefined,
        category:
          category === 'All' ? undefined : category,
      }

      const today = new Date()

      if (dateFilter === 'Today') {
        const date = today.toISOString().split('T')[0]

        filters.fromDate = date
        filters.toDate = date
      }

      if (dateFilter === 'This Week') {
        const startOfWeek = new Date(today)

        const day = startOfWeek.getDay()
        const difference = day === 0 ? 6 : day - 1

        startOfWeek.setDate(
          startOfWeek.getDate() - difference,
        )

        filters.fromDate = startOfWeek
          .toISOString()
          .split('T')[0]

        filters.toDate = today
          .toISOString()
          .split('T')[0]
      }

      if (dateFilter === 'This Month') {
        const startOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        )

        filters.fromDate = startOfMonth
          .toISOString()
          .split('T')[0]

        filters.toDate = today
          .toISOString()
          .split('T')[0]
      }

      if (dateFilter === 'This Year') {
        const startOfYear = new Date(
          today.getFullYear(),
          0,
          1,
        )

        filters.fromDate = startOfYear
          .toISOString()
          .split('T')[0]

        filters.toDate = today
          .toISOString()
          .split('T')[0]
      }

      dispatch(fetchInvoices(filters))
    }, 300)

    return () => clearTimeout(timer)
  }, [dispatch, search, category, dateFilter])

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
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ExpenseFilters