import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { registerUser } from '../redux/slices/authSlice'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  })

  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setSuccessMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSuccessMessage('')

    const result = await dispatch(registerUser(formData))

    if (registerUser.fulfilled.match(result)) {
      setSuccessMessage('Registration successful. You can now sign in.')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
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

      {/* Registration Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#151B2B] p-6 shadow-2xl shadow-black/30 sm:p-9">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-xl font-bold text-indigo-400 shadow-lg shadow-indigo-500/10">
            IQ
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Create your Invoice
            <span className="text-indigo-400">IQ</span> account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Start managing your invoices and business expenses.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              className={inputClasses}
            />
          </div>

          {/* Email */}
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

          {/* Business Name */}
          <div>
            <label
              htmlFor="businessName"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Business Name
            </label>

            <input
              id="businessName"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your business name"
              autoComplete="organization"
              required
              className={inputClasses}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength={6}
              autoComplete="new-password"
              required
              className={inputClasses}
            />

            <p className="mt-2 text-xs text-slate-500">
              Password must contain at least 6 characters.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
            >
              {typeof error === 'string'
                ? error
                : 'Registration failed. Please check your details and try again.'}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div
              role="status"
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              {successMessage}
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

            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-7 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Sign in
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

          Secure account creation for your business
        </div>
      </div>
    </main>
  )
}

export default Register
