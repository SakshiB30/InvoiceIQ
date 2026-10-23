import { useNavigate } from 'react-router-dom'

function ExpenseHeader() {
const navigate = useNavigate()

return ( <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300"> <svg
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="1.7"
           className="h-6 w-6"
           aria-hidden="true"
         > <rect
             x="4"
             y="3"
             width="16"
             height="18"
             rx="2"
           /> <path
             strokeLinecap="round"
             strokeLinejoin="round"
             d="M8 8h8M8 12h3m-3 4h8m-2-4h2"
           /> </svg> </div>


      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Track, categorize, and manage your business expenses.
        </p>
      </div>
    </div>
  </div>

  <button
    type="button"
    onClick={() => navigate('/invoices')}
    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0F19] active:scale-[0.98] sm:self-auto"
  >
    <svg
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
        d="M12 5v14m-7-7h14"
      />
    </svg>

    Add Expense
  </button>
</div>


)
}

export default ExpenseHeader
