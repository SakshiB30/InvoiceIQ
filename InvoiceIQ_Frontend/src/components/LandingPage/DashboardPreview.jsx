function DashboardPreview() {
const stats = [
{
label: 'Total Invoices',
value: '128',
description: 'Processed records',
color: 'text-indigo-300',
},
{
label: 'Total Spending',
value: '₹2.4L',
description: 'Invoice expenditure',
color: 'text-cyan-300',
},
{
label: 'Pending Review',
value: '08',
description: 'Requires attention',
color: 'text-amber-300',
},
]

const navigationItems = [
{ icon: '▦', label: 'Dashboard', active: true },
{ icon: '▤', label: 'Invoices', active: false },
{ icon: '◫', label: 'Expenses', active: false },
{ icon: '↗', label: 'Analytics', active: false },
{ icon: '✦', label: 'Insights', active: false },
]

const chartBars = [
36, 54, 43, 76, 60, 88, 66, 95, 70, 82, 58, 73,
]

return ( <div className="relative mx-auto w-full max-w-2xl">
{/* Background glow */} <div className="absolute -inset-8 rounded-full bg-indigo-600/15 blur-3xl" />


  {/* Dashboard window */}
  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/40">
    {/* Window header */}
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>

      <span className="text-xs font-medium text-slate-400">
        InvoiceIQ Workspace
      </span>

      <span className="rounded-lg border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-xs text-indigo-300">
        Preview
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-[145px_1fr]">
      {/* Sidebar preview */}
      <aside className="hidden border-r border-white/10 p-4 sm:block">
        <div className="mb-7 flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs">
            I
          </span>
          InvoiceIQ
        </div>

        <div className="space-y-2">
          {navigationItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs ${
                item.active
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-slate-500'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </aside>

      {/* Dashboard content */}
      <div className="min-w-0 p-4 sm:p-5">
        <div className="mb-5">
          <p className="text-xs text-slate-400">Overview</p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Dashboard
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Your business finances at a glance.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3"
            >
              <p className="text-[10px] text-slate-400 sm:text-xs">
                {stat.label}
              </p>

              <p className={`mt-2 text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>

              <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Spending chart */}
        <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Spending Overview
              </h4>

              <p className="mt-1 text-[10px] text-slate-500">
                Illustrative dashboard preview
              </p>
            </div>

            <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-300">
              Analytics
            </span>
          </div>

          <div className="flex h-28 items-end gap-2 sm:gap-4">
            {chartBars.map((height, index) => (
              <div
                key={index}
                className="flex h-full flex-1 items-end"
              >
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 opacity-80 transition-opacity hover:opacity-100"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between text-[9px] text-slate-500">
            <span>JAN</span>
            <span>MAR</span>
            <span>MAY</span>
            <span>JUL</span>
            <span>SEP</span>
            <span>DEC</span>
          </div>
        </div>

        {/* Insight highlight */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
            ✦
          </span>

          <div>
            <p className="text-xs font-medium text-slate-200">
              Business insights, simplified
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Understand your invoice data in one workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Floating feature badge */}
  <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-white/10 bg-[#151B2B] p-3 shadow-xl sm:block md:-left-8">
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
        ✓
      </span>

      <div>
        <p className="text-xs font-semibold text-white">
          Smarter processing
        </p>

        <p className="text-[10px] text-slate-400">
          Less manual work
        </p>
      </div>
    </div>
  </div>
</div>

)
}

export default DashboardPreview
