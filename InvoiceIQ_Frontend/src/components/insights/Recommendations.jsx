import { useSelector } from 'react-redux'

function Recommendations() {
const {
aiInsights,
aiInsightsLoading,
} = useSelector((state) => state.invoices)

if (aiInsightsLoading) {
return ( <section className="rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-lg shadow-black/10"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10"> <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-violet-400" /> </div>


      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          Recommendations
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          AI is generating personalized recommendations...
        </p>
      </div>
    </div>

    <div className="mt-6 space-y-3">
      <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-800" />
      <div className="h-4 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-4 w-2/3 animate-pulse rounded-md bg-slate-800" />
    </div>
  </section>
)

}

if (!aiInsights) {
return ( <section className="rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-lg shadow-black/10"> <h2 className="text-lg font-semibold text-slate-100">
Recommendations </h2>


    <div className="py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
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
            d="M9.5 18h5m-4 4h3m-1.5-20a7 7 0 0 0-4 12.75c.7.48 1 1.2 1 2.25h6c0-1.05.3-1.77 1-2.25A7 7 0 0 0 12 2Zm0 4v5m-2-2 2 2 2-2"
          />
        </svg>
      </div>

      <p className="mt-4 font-medium text-slate-200">
        No recommendations yet
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Process and confirm invoices to receive AI-powered suggestions
        for managing your business spending.
      </p>
    </div>
  </section>
)


}

const recommendations = aiInsights.recommendations || []

const iconStyles = [
'bg-indigo-500/10 text-indigo-400',
'bg-cyan-500/10 text-cyan-400',
'bg-emerald-500/10 text-emerald-400',
'bg-violet-500/10 text-violet-400',
]

const icons = [ <svg
   key="chart"
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.8"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M3 3v18h18M7 14l4-4 4 3 5-7"
   /> </svg>, <svg
   key="building"
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.8"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M8 9v.01M8 12v.01M8 15v.01M8 18v.01"
   /> </svg>, <svg
   key="trend"
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.8"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M3 17l6-6 4 4 8-9m-6 0h6v6"
   /> </svg>, <svg
   key="idea"
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.8"
   className="h-5 w-5"
   aria-hidden="true"
 > <path
     strokeLinecap="round"
     strokeLinejoin="round"
     d="M9 18h6m-4 4h2m-1-20a7 7 0 0 0-4 12.75c.7.48 1 1.2 1 2.25h6c0-1.05.3-1.77 1-2.25A7 7 0 0 0 12 2Z"
   /> </svg>,
]

return ( <section className="rounded-2xl border border-slate-800 bg-[#151B2B] p-5 shadow-lg shadow-black/10 sm:p-6"> <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"> <div> <div className="flex flex-wrap items-center gap-2"> <h2 className="text-lg font-semibold text-slate-100">
Recommendations </h2>

        <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">
          <span aria-hidden="true">✦</span>
          AI Powered
        </span>
      </div>

      <p className="mt-1 text-sm leading-6 text-slate-400">
        Practical suggestions to help you make smarter financial decisions.
      </p>
    </div>

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
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
          d="M9.5 18h5m-4 4h3m-1.5-20a7 7 0 0 0-4 12.75c.7.48 1 1.2 1 2.25h6c0-1.05.3-1.77 1-2.25A7 7 0 0 0 12 2Zm0 4v5m-2-2 2 2 2-2"
        />
      </svg>
    </div>
  </div>

  {recommendations.length === 0 ? (
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
            d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36-2.12 2.12M7.76 16.24l-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </div>

      <p className="mt-3 font-medium text-slate-200">
        No recommendations available
      </p>

      <p className="mt-1 text-sm text-slate-400">
        Recommendations will appear when actionable opportunities are
        identified in your invoice data.
      </p>
    </div>
  ) : (
    <div className="mt-6 space-y-3">
      {recommendations.map((recommendation, index) => (
        <article
          key={`${index}-${recommendation}`}
          className="group flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition duration-200 hover:border-violet-400/30 hover:bg-slate-900/70 sm:p-5"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyles[index % iconStyles.length]}`}
          >
            {icons[index % icons.length]}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Recommendation {index + 1}
              </h3>

              <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                AI Insight
              </span>
            </div>

            <p className="mt-2 break-words text-sm leading-6 text-slate-400">
              {recommendation}
            </p>
          </div>
        </article>
      ))}
    </div>
  )}
</section>

)
}

export default Recommendations
