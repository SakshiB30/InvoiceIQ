import { useSelector } from 'react-redux'

function formatAmount(amount) {
return new Intl.NumberFormat('en-IN', {
style: 'currency',
currency: 'INR',
maximumFractionDigits: 0,
}).format(Number(amount) || 0)
}

function InsightSummary() {
const {
aiInsights,
aiInsightsLoading,
} = useSelector((state) => state.invoices)

const summary = [
{
title: 'Total Spending',
value:
aiInsightsLoading || !aiInsights
? '—'
: formatAmount(aiInsights.totalSpending),
description: 'Across all analyzed invoices',
icon: ( <svg
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="1.8"
       className="h-6 w-6"
       aria-hidden="true"
     > <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M12 6v12m4-9.5c0-1.38-1.79-2.5-4-2.5s-4 1.12-4 2.5 1.79 2.5 4 2.5 4 1.12 4 2.5-1.79 2.5-4 2.5-4-1.12-4-2.5"
       /> </svg>
),
iconStyle: 'bg-emerald-400/10 text-emerald-400',
accent: 'from-emerald-400/10',
},
{
title: 'Top Category',
value:
aiInsightsLoading || !aiInsights
? '—'
: aiInsights.topCategory || '—',
description:
aiInsightsLoading || !aiInsights
? 'AI is analyzing...'
: 'Highest spending category',
icon: ( <svg
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="1.8"
       className="h-6 w-6"
       aria-hidden="true"
     > <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="m4 7 8-4 8 4-8 4-8-4Zm0 5 8 4 8-4M4 17l8 4 8-4"
       /> </svg>
),
iconStyle: 'bg-cyan-400/10 text-cyan-400',
accent: 'from-cyan-400/10',
},
{
title: 'Top Vendor',
value:
aiInsightsLoading || !aiInsights
? '—'
: aiInsights.topVendor || '—',
description:
aiInsightsLoading || !aiInsights
? 'AI is analyzing...'
: 'Highest spending vendor',
icon: ( <svg
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="1.8"
       className="h-6 w-6"
       aria-hidden="true"
     > <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M8 9v.01M8 12v.01M8 15v.01M8 18v.01M16 14v.01M16 17v.01"
       /> </svg>
),
iconStyle: 'bg-violet-400/10 text-violet-400',
accent: 'from-violet-400/10',
},
{
title: 'Invoices Analyzed',
value:
aiInsightsLoading || !aiInsights
? '—'
: aiInsights.totalInvoices ?? 0,
description: 'Invoices analyzed by AI',
icon: ( <svg
       xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="1.8"
       className="h-6 w-6"
       aria-hidden="true"
     > <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5h-3M14 3v6h6M7 13h10M7 17h7"
       /> </svg>
),
iconStyle: 'bg-indigo-400/10 text-indigo-400',
accent: 'from-indigo-400/10',
},
]

return ( <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
{summary.map((item) => (
<div
key={item.title}
className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${item.accent} to-[#151B2B] p-5 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20`}
> <div className="flex items-start justify-between gap-3"> <div className="min-w-0 flex-1"> <p className="text-sm font-medium text-slate-400">
{item.title} </p>

          <h2
            className="mt-3 break-words text-xl font-bold tracking-tight text-slate-100 sm:text-2xl"
            title={String(item.value)}
          >
            {item.value}
          </h2>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {item.description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconStyle} transition-transform duration-200 group-hover:scale-105`}
        >
          {item.icon}
        </div>
      </div>

      {aiInsightsLoading && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-indigo-400" />
        </div>
      )}
    </div>
  ))}
</div>

)
}

export default InsightSummary
