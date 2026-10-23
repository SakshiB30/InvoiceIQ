import { Link } from 'react-router-dom'

function LandingCTA() {
  return (
    <section
      id="about"
      className="scroll-mt-20 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-indigo-400/20 bg-[#111827] px-6 py-16 text-center sm:px-12 sm:py-20 lg:px-20">
        {/* Background effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]"
        />

        {/* Content */}
        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-2xl text-indigo-300">
            ✦
          </div>

          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Take Control of Your Finances
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to make your invoices
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              work smarter?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Bring your invoice records, expense tracking, and financial
            insights together. Spend less time organizing documents and more
            time focusing on your business.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              Get Started Free
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-slate-200 transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Your invoices. Your insights. One intelligent workspace.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LandingCTA