import { useSelector } from 'react-redux'

function SpendingInsights() {
const {
aiInsights,
aiInsightsLoading,
} = useSelector((state) => state.invoices)

if (aiInsightsLoading) {
return ( <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-lg shadow-black/10"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10"> <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" /> </div>


      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          Spending Insights
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          AI is analyzing your spending patterns...
        </p>
      </div>
    </div>

    <div className="mt-6 space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-800" />
      <div className="h-4 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-800" />
    </div>
  </div>
)


}

if (!aiInsights) {
return ( <div className="rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-lg shadow-black/10"> <h2 className="text-lg font-semibold text-slate-100">
Spending Insights </h2>


    <div className="py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v18h18M7 14l4-4 4 3 5-7"
          />
        </svg>
      </div>

      <p className="mt-4 font-medium text-slate-200">
        No spending insights yet
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Process and confirm invoices to generate AI-powered insights into
        your business spending patterns.
      </p>
    </div>
  </div>
)


}

const insights = aiInsights.spendingInsights || []

return ( <section className="rounded-2xl border border-slate-800 bg-[#151B2B] p-5 shadow-lg shadow-black/10 sm:p-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"> <div> <div className="flex flex-wrap items-center gap-2"> <h2 className="text-lg font-semibold text-slate-100">
Spending Insights </h2>


        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
          <span aria-hidden="true">✦</span>
          AI Powered
        </span>
      </div>

      <p className="mt-1 text-sm leading-6 text-slate-400">
        Key spending patterns identified from your invoice data.
      </p>
    </div>

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
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
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m12.5-7.5-.8 2.2m-5.4 12.6-.8 2.2m9-3.5-1.6-1.6M7.1 7.1 5.5 5.5M15.5 9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        />
      </svg>
    </div>
  </div>

  {insights.length === 0 ? (
    <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18h6m-5 4h4m-2-20a7 7 0 0 0-4 12.75c.7.48 1 1.2 1 2.25h6c0-1.05.3-1.77 1-2.25A7 7 0 0 0 12 2Z"
          />
        </svg>
      </div>

      <p className="mt-3 font-medium text-slate-200">
        Not enough data for detailed insights
      </p>

      <p className="mt-1 text-sm text-slate-400">
        Insights will appear here when useful spending patterns are
        available.
      </p>
    </div>
  ) : (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {insights.map((insight, index) => {
        const iconStyles = [
          'bg-indigo-500/10 text-indigo-400',
          'bg-emerald-500/10 text-emerald-400',
          'bg-cyan-500/10 text-cyan-400',
          'bg-violet-500/10 text-violet-400',
        ]

        const icons = ['↗', '₹', '▦', '✦']

        return (
          <article
            key={`${index}-${insight}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition duration-200 hover:border-indigo-400/30 hover:bg-slate-900/70"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold ${iconStyles[index % iconStyles.length]}`}
              >
                {icons[index % icons.length]}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Insight {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                  {insight}
                </p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )}
</section>

)
}

export default SpendingInsights
