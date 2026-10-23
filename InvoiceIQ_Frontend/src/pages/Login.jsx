import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { loginUser } from '../redux/slices/authSlice'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await dispatch(loginUser(formData))

    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-slate-700 bg-[#0B0F19] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F19] px-4 py-10">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
      />

      {/* Login Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-2xl shadow-black/30 sm:p-9">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-xl font-bold text-indigo-400 shadow-lg shadow-indigo-500/10">
            IQ
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Welcome to Invoice
            <span className="text-indigo-400">IQ</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to manage your invoices and business expenses.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className={inputClasses}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
            >
              {typeof error === 'string'
                ? error
                : 'Login failed. Please check your credentials and try again.'}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}

            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-7 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <svg
            className="h-4 w-4 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            <path d="M12 14v3" />
          </svg>

          Secure access to your business workspace
        </div>
      </div>
    </main>
  )
}

export default Login
