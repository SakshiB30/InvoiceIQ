import { useEffect, useRef, useState } from 'react'
import useInView from './Useinview'

// Counts from 0 to `end` once `active` becomes true.
function useCountUp(end, active, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end)
      return undefined
    }

    let frame
    let start
    const tick = (time) => {
      if (start === undefined) start = time
      const progress = Math.min((time - start) / duration, 1)
      setValue(end * (1 - Math.pow(1 - progress, 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, end, duration])

  return value
}

function StatCard({ stat, active }) {
  const value = useCountUp(stat.end, active)

  const shown = stat.decimals
    ? value.toFixed(stat.decimals)
    : String(Math.round(value)).padStart(stat.pad || 0, '0')

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 transition duration-300 hover:border-white/[0.15] hover:bg-white/[0.05]">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${stat.line} to-transparent`} />

      <p className="text-[10px] text-slate-400 sm:text-xs">{stat.label}</p>

      <p className={`iq-display mt-2 text-xl font-bold tabular-nums ${stat.color}`}>
        {stat.prefix}
        {shown}
        {stat.suffix}
      </p>

      <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">{stat.description}</p>
    </div>
  )
}

function DashboardPreview() {
  const [viewRef, inView] = useInView({ threshold: 0.25 })
  const tiltRef = useRef(null)

  const stats = [
    {
      label: 'Total Invoices',
      end: 128,
      description: 'Processed records',
      color: 'text-indigo-300',
      line: 'via-indigo-400/60',
    },
    {
      label: 'Total Spending',
      end: 2.4,
      decimals: 1,
      prefix: '₹',
      suffix: 'L',
      description: 'Invoice expenditure',
      color: 'text-cyan-300',
      line: 'via-cyan-400/60',
    },
    {
      label: 'Pending Review',
      end: 8,
      pad: 2,
      description: 'Requires attention',
      color: 'text-amber-300',
      line: 'via-amber-400/60',
    },
  ]

  const navigationItems = [
    { icon: '▦', label: 'Dashboard', active: true },
    { icon: '▤', label: 'Invoices', active: false },
    { icon: '◫', label: 'Expenses', active: false },
    { icon: '↗', label: 'Analytics', active: false },
    { icon: '✦', label: 'Insights', active: false },
  ]

  const chartBars = [36, 54, 43, 76, 60, 88, 66, 95, 70, 82, 58, 73]

  // Gentle 3D tilt that follows the cursor
  const handleMove = (event) => {
    const element = tiltRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    element.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`
  }

  const handleLeave = () => {
    if (tiltRef.current) {
      tiltRef.current.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)'
    }
  }

  return (
    <div
      ref={viewRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto w-full max-w-2xl"
    >
      {/* Background glow */}
      <div className="iq-aurora absolute -inset-8 rounded-full bg-indigo-600/20 blur-3xl" />

      <div ref={tiltRef} className="relative transition-transform duration-500 ease-out will-change-transform">
        {/* Dashboard window */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/90 shadow-2xl shadow-black/50 backdrop-blur">
          {/* Top edge highlight */}
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />

          {/* Window header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>

            <span className="text-xs font-medium text-slate-400">InvoiceIQ Workspace</span>

            <span className="flex items-center gap-1.5 rounded-lg border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-xs text-indigo-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-300" />
              </span>
              Preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[145px_1fr]">
            {/* Sidebar preview */}
            <aside className="hidden border-r border-white/10 p-4 sm:block">
              <div className="mb-7 flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-xs">
                  I
                </span>
                InvoiceIQ
              </div>

              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs transition duration-300 ${
                      item.active
                        ? 'bg-indigo-500/15 text-indigo-300 shadow-[inset_2px_0_0_0_#818cf8]'
                        : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
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

                <h3 className="iq-display mt-1 text-lg font-semibold text-white">Dashboard</h3>

                <p className="mt-1 text-xs text-slate-500">Your business finances at a glance.</p>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} active={inView} />
                ))}
              </div>

              {/* Spending chart */}
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Spending Overview</h4>

                    <p className="mt-1 text-[10px] text-slate-500">Illustrative dashboard preview</p>
                  </div>

                  <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-300">
                    Analytics
                  </span>
                </div>

                <div className={`iq-bars flex h-28 items-end gap-2 sm:gap-4 ${inView ? 'is-visible' : ''}`}>
                  {chartBars.map((height, index) => (
                    <div key={index} className="flex h-full flex-1 items-end">
                      <div
                        className="iq-bar w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 opacity-80 transition duration-300 hover:-translate-y-1 hover:opacity-100 hover:shadow-[0_0_18px_rgba(103,232,249,0.45)]"
                        style={{ height: `${height}%`, '--d': `${index * 60 + 300}ms` }}
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
                  <p className="text-xs font-medium text-slate-200">Business insights, simplified</p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Understand your invoice data in one workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating feature badge */}
      <div className="iq-float absolute -bottom-5 -left-3 hidden rounded-xl border border-white/10 bg-[#151B2B]/90 p-3 shadow-xl shadow-black/40 backdrop-blur sm:block md:-left-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
            ✓
          </span>

          <div>
            <p className="text-xs font-semibold text-white">Smarter processing</p>

            <p className="text-[10px] text-slate-400">Less manual work</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPreview