import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-100 w-full border-b border-white/[0.08] bg-[#0B0F19]/90 shadow-lg shadow-black/5 backdrop-blur-2xl">
      {/* Animated top border */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-indigo-500 to-cyan-400 opacity-80" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-indigo-500/50">
            <span className="relative">I</span>
          </div>

          <span className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-200">
            Invoice
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              IQ
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-2 text-sm font-medium text-slate-400 transition-colors duration-300 hover:text-white"
            >
              {item.label}

              <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 active:translate-y-0"
          >
            {/* Button shine */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative">Get Started</span>

            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/10 md:hidden"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />

            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <span
              className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden border-t border-white/[0.06] transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-1 px-5 py-4 sm:px-8">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-indigo-500/10 hover:pl-6 hover:text-indigo-300"
              >
                {item.label}
              </a>
            ))}

            <div className="grid grid-cols-2 gap-3 pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-200 transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/[0.05]"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/40"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default LandingNavbar