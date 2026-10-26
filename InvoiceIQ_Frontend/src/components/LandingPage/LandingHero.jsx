import { Link } from 'react-router-dom'
import DashboardPreview from './DashboardPreview'

// Hero signature: a laser scans an invoice and the extracted fields light up.
function ScanInvoice() {
  const fields = [
    { label: 'Vendor', value: 'Northwind Traders', d: '0.9s' },
    { label: 'Invoice no.', value: 'INV-2041', d: '1.8s' },
    { label: 'Total', value: '₹18,450', d: '2.7s' },
  ]

  return (
    <div
      aria-hidden="true"
      className="iq-float absolute -right-4 -top-10 z-20 hidden w-56 rotate-[4deg] rounded-2xl border border-white/10 bg-[#0F1524]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur xl:block"
    >
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="h-2 w-14 rounded bg-slate-600/60" />
          <span className="text-[9px] text-slate-500">PDF · 1 page</span>
        </div>

        <div className="space-y-2">
          {fields.map((f) => (
            <div key={f.label} className="iq-field flex items-center justify-between px-2 py-1.5 text-[10px]" style={{ '--d': f.d }}>
              <span>{f.label}</span>
              <span className="font-semibold">{f.value}</span>
            </div>
          ))}
          <span className="block h-1.5 w-full rounded bg-slate-700/50" />
          <span className="block h-1.5 w-4/5 rounded bg-slate-700/50" />
        </div>

        <div className="iq-scanline" />
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[10px] text-cyan-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
        Reading invoice
      </p>
    </div>
  )
}

function LandingHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pb-32 lg:pt-40">
      {/* Background: grid + drifting aurora */}
      <div aria-hidden="true" className="iq-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="iq-aurora pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.2] blur-[130px]" />
      <div aria-hidden="true" className="iq-aurora-slow pointer-events-none absolute right-0 top-36 h-80 w-80 rounded-full bg-cyan-500/[0.14] blur-[100px]" />
      <div aria-hidden="true" className="iq-aurora pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-600/[0.14] blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        {/* Hero content */}
        <div className="text-center lg:text-left">
          <div
            className="iq-hero-in mb-7 inline-flex items-center gap-2.5 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-4 py-2 text-xs font-medium text-indigo-300 backdrop-blur sm:text-sm"
            style={{ '--d': '0ms' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Intelligent Invoice Management
          </div>

          <h1 className="iq-display text-5xl font-extrabold leading-[1.02] text-white sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            <span className="iq-hero-in block" style={{ '--d': '120ms' }}>Your invoices.</span>
            <span className="iq-hero-in block" style={{ '--d': '240ms' }}>
              <span className="iq-gradient-text">Understood.</span>
            </span>
            <span className="iq-hero-in block" style={{ '--d': '380ms' }}>Your business.</span>
            <span className="iq-hero-in block text-slate-500" style={{ '--d': '500ms' }}>In control.</span>
          </h1>

          <p
            className="iq-hero-in mx-auto mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg lg:mx-0"
            style={{ '--d': '650ms' }}
          >
            Transform invoices into actionable business intelligence. Extract details,
            validate records, track expenses, and discover insights from one intelligent
            workspace.
          </p>

          <div
            className="iq-hero-in mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            style={{ '--d': '780ms' }}
          >
            <Link
              to="/register"
              className="iq-btn group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/60"
            >
              Get Started Free
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
            >
              Explore Features
            </a>
          </div>

          <div
            className="iq-hero-in mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-slate-500 lg:justify-start"
            style={{ '--d': '900ms' }}
          >
            {['Centralized Records', 'Smart Validation', 'Actionable Insights'].map((label) => (
              <span key={label} className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview + scanning invoice */}
        <div className="iq-hero-in relative min-w-0" style={{ '--d': '450ms' }}>
          <ScanInvoice />
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}

export default LandingHero