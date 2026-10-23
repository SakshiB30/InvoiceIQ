import { Link } from 'react-router-dom'

function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] bg-[#0B0F19] px-5 pb-8 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Main footer */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/20">
                I
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Invoice<span className="text-indigo-400">IQ</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              An intelligent workspace for invoice management, expense
              tracking, financial analytics, and AI-powered business insights.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-400/[0.05] px-3 py-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Smarter invoice management
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:text-indigo-300"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-slate-400 transition hover:text-indigo-300"
                >
                  How It Works
                </a>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-sm text-slate-400 transition hover:text-indigo-300"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Your Account</h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-slate-400 transition hover:text-indigo-300"
                >
                  Sign In
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-sm text-slate-400 transition hover:text-indigo-300"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-400 transition hover:text-indigo-300"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {currentYear} InvoiceIQ. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built to make financial management smarter.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter