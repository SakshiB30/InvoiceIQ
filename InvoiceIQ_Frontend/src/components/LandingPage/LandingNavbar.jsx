import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../redux/slices/authSlice'

function LandingNavbar() {
const [menuOpen, setMenuOpen] = useState(false)

const dispatch = useDispatch()
const navigate = useNavigate()

const { isAuthenticated, user } = useSelector(
(state) => state.auth,
)

const closeMenu = () => setMenuOpen(false)

const handleLogout = () => {
dispatch(logout())
closeMenu()
navigate('/', { replace: true })
}

const homePath = isAuthenticated ? '/dashboard' : '/'

const navLinks = [
{ label: 'Features', href: '#features' },
{ label: 'How It Works', href: '#how-it-works' },
{ label: 'About', href: '#about' },
]

const displayName = user?.name || 'My Account'
const initial = displayName.charAt(0).toUpperCase()

return ( <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-white/[0.08] bg-[#0B0F19]/90 shadow-lg shadow-black/5 backdrop-blur-2xl"> <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-cyan-400 opacity-80" />


  <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
    {/* Logo */}
    <Link
      to={homePath}
      onClick={closeMenu}
      className="group flex shrink-0 items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110">
        I
      </div>

      <span className="text-xl font-bold tracking-tight text-white">
        Invoice
        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
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
          className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          {item.label}
        </a>
      ))}
    </div>

    {/* Desktop Authentication / Profile */}
    <div className="hidden items-center gap-3 sm:flex">
      {isAuthenticated ? (
        <>
          <Link
            to="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 font-semibold text-white">
              {initial}
            </div>

            <div className="max-w-36">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>
              <p className="text-xs text-slate-400">
                Signed in
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-rose-400/20 px-4 py-2.5 text-sm font-medium text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
          >
            Get Started →
          </Link>
        </>
      )}
    </div>

    {/* Mobile Menu Button */}
    <button
      type="button"
      aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={menuOpen}
      aria-controls="mobile-navigation"
      onClick={() => setMenuOpen((previous) => !previous)}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 md:hidden"
    >
      {menuOpen ? '✕' : '☰'}
    </button>
  </nav>

  {/* Mobile Navigation */}
  <div
    id="mobile-navigation"
    className={`grid overflow-hidden border-t border-white/[0.06] transition-all duration-300 md:hidden ${
      menuOpen
        ? 'grid-rows-[1fr] opacity-100'
        : 'grid-rows-[0fr] opacity-0'
    }`}
    aria-hidden={!menuOpen}
    inert={!menuOpen}
  >
    <div className="min-h-0 overflow-hidden">
      <div className="space-y-2 px-5 py-4 sm:px-8">
        {navLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300"
          >
            {item.label}
          </a>
        ))}

        {isAuthenticated ? (
          <div className="space-y-3 border-t border-white/10 pt-3">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 font-semibold text-white">
                {initial}
              </div>

              <span className="text-sm font-semibold text-white">
                {displayName}
              </span>
            </div>

            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="block rounded-xl bg-indigo-500/10 px-4 py-3 text-center text-sm font-semibold text-indigo-300"
            >
              Go to Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="block w-full rounded-xl border border-rose-400/20 px-4 py-3 text-center text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-3">
            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-200"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Get Started →
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
</header>

)
}

export default LandingNavbar
