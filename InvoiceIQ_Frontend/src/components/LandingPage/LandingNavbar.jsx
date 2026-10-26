import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../redux/slices/authSlice'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
]

function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [pill, setPill] = useState({ left: 0, width: 0, show: false })

  const progressRef = useRef(null)
  const trackRef = useRef(null)
  const linkRefs = useRef({})

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Shrink the bar after scrolling and drive the reading-progress line
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)

      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which section is on screen
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    navLinks.forEach(({ href }) => {
      const section = document.querySelector(href)
      if (section) observer.observe(section)
    })

    // Clear the highlight when back at the top of the page
    const onTop = () => window.scrollY < 200 && setActive('')
    window.addEventListener('scroll', onTop, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [])

  // Slide the highlight pill under the active link
  useLayoutEffect(() => {
    const link = linkRefs.current[active]
    if (!link) {
      setPill((previous) => ({ ...previous, show: false }))
      return
    }
    setPill({ left: link.offsetLeft, width: link.offsetWidth, show: true })
  }, [active, scrolled])

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    dispatch(logout())
    closeMenu()
    navigate('/', { replace: true })
  }

  const homePath = isAuthenticated ? '/dashboard' : '/'

  const displayName = user?.name || 'My Account'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      {/* Floating pill */}
      <div
        className={`pointer-events-auto relative mx-auto overflow-hidden rounded-2xl border transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
          scrolled || menuOpen
            ? 'max-w-5xl border-white/[0.1] bg-[#0B0F19]/70 shadow-2xl shadow-black/40 backdrop-blur-2xl'
            : 'max-w-7xl border-transparent bg-transparent'
        }`}
      >
        <nav
          className={`flex items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-5 ${
            scrolled ? 'py-2.5' : 'py-3.5'
          }`}
        >
          {/* Logo */}
          <Link to={homePath} onClick={closeMenu} className="group flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
              I
            </div>

            <span className="iq-display text-xl font-bold text-white">
              Invoice
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                IQ
              </span>
            </span>
          </Link>

          {/* Desktop navigation with sliding highlight */}
          <div
            ref={trackRef}
            className="relative hidden items-center rounded-full border border-white/[0.07] bg-white/[0.03] p-1 md:flex"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1 rounded-full bg-indigo-500/20 shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)] transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.show ? 1 : 0,
              }}
            />

            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                ref={(node) => {
                  linkRefs.current[item.href] = node
                }}
                aria-current={active === item.href ? 'true' : undefined}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                  active === item.href ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop authentication / profile */}
          <div className="hidden items-center gap-3 sm:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white">
                    {initial}
                  </div>

                  <div className="max-w-32">
                    <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-slate-400">Signed in</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-rose-400/20 px-4 py-2 text-sm font-medium text-rose-300 transition duration-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-slate-300 transition duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="iq-btn group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/50"
                >
                  Get Started
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button: the two bars morph into an X */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition active:scale-95 md:hidden"
          >
            <span
              className={`absolute h-0.5 w-4 rounded bg-slate-200 transition-all duration-300 ${
                menuOpen ? 'rotate-45' : '-translate-y-1'
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded bg-slate-200 transition-all duration-300 ${
                menuOpen ? '-rotate-45' : 'translate-y-1'
              }`}
            />
          </button>
        </nav>

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          className={`grid transition-all duration-500 ease-out md:hidden ${
            menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="space-y-2 border-t border-white/[0.06] px-4 py-4">
              {navLinks.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  style={{ transitionDelay: menuOpen ? `${index * 60}ms` : '0ms' }}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500 hover:bg-indigo-500/10 hover:text-indigo-300 ${
                    menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                  } ${active === item.href ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-300'}`}
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

                    <span className="text-sm font-semibold text-white">{displayName}</span>
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

        {/* Scroll progress */}
        <div
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-400"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </header>
  )
}

export default LandingNavbar