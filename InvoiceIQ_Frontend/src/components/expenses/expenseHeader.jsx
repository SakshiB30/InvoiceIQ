function ExpenseHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track, categorize, and manage your business expenses.
        </p>
      </div>

      <button
        type="button"
        className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
      >
        + Add Expense
      </button>
    </div>
  )
}

export default ExpenseHeader