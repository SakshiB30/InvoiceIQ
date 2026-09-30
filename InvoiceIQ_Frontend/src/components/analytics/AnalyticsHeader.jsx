function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Understand your business spending and financial trends.
        </p>
      </div>

      <select
        defaultValue="This Month"
        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
      >
        <option value="This Week">This Week</option>
        <option value="This Month">This Month</option>
        <option value="Last 3 Months">Last 3 Months</option>
        <option value="This Year">This Year</option>
      </select>
    </div>
  )
}

export default AnalyticsHeader