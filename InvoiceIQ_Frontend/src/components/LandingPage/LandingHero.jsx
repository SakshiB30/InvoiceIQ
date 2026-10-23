import { Link } from 'react-router-dom'
import DashboardPreview from './DashboardPreview'

function LandingHero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-32 lg:pt-32">
      {/* Background glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.12] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-36 h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[100px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        {/* Hero content */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.07] px-4 py-2 text-xs font-medium text-indigo-300 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Intelligent Invoice Management
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold leading-[1.13] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Your invoices.
            <br />

            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              Understood.
            </span>

            <br />

            Your business.
            <br />

            In control.
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg lg:mx-0">
            Transform invoices into actionable business intelligence.
            Extract details, validate records, track expenses, and discover
            insights from one intelligent workspace.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              Get Started Free
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-200 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]"
            >
              Explore Features
            </a>
          </div>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-slate-500 lg:justify-start">
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Centralized Records
            </span>

            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Smart Validation
            </span>

            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Actionable Insights
            </span>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="min-w-0">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}

export default LandingHero