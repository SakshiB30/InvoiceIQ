import { Link } from 'react-router-dom'
import Reveal from './Reveal'

function LandingFooter() {
  const currentYear = new Date().getFullYear()

  const linkClass = 'iq-link inline-block text-sm text-slate-400 transition-colors duration-300 hover:text-indigo-300'

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0B0F19] px-5 pb-8 pt-14 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl">
        {/* Main footer */}
        <Reveal className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/25 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                I
              </div>

              <span className="iq-display text-xl font-bold text-white">
                Invoice<span className="text-indigo-400">IQ</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              An intelligent workspace for invoice management, expense tracking, financial
              analytics, and AI-powered business insights.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-400/[0.05] px-3 py-1.5 text-xs text-slate-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Smarter invoice management
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="iq-display text-sm font-semibold text-white">Product</h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a href="#features" className={linkClass}>
                  Features
                </a>
              </li>

              <li>
                <a href="#how-it-works" className={linkClass}>
                  How It Works
                </a>
              </li>

              <li>
                <Link to="/register" className={linkClass}>
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="iq-display text-sm font-semibold text-white">Your Account</h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link to="/login" className={linkClass}>
                  Sign In
                </Link>
              </li>

              <li>
                <Link to="/register" className={linkClass}>
                  Create Account
                </Link>
              </li>

              <li>
                <Link to="/dashboard" className={linkClass}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">© {currentYear} InvoiceIQ. All rights reserved.</p>

          <p className="text-xs text-slate-500">Built to make financial management smarter.</p>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter