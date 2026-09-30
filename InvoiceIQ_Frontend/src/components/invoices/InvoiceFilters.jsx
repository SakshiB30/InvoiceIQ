function InvoiceFilters() {
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
            placeholder="Search by invoice or vendor..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            defaultValue="All"
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Review">Review</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date
          </label>

          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            defaultValue="All"
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

export default InvoiceFilters