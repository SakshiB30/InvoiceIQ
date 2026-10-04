import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchAIInsights } from '../../redux/slices/invoiceSlice'

function AISpendingSnapshot() {
  const dispatch = useDispatch()

  const {
    aiInsights,
    aiInsightsLoading,
    aiInsightsError,
  } = useSelector((state) => state.invoices)

  useEffect(() => {
    if (!aiInsights && !aiInsightsLoading && !aiInsightsError) {
      dispatch(fetchAIInsights())
    }
  }, [
    dispatch,
    aiInsights,
    aiInsightsLoading,
    aiInsightsError,
  ])

  const handleRetry = () => {
    dispatch(fetchAIInsights())
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)
  }

  // Loading state
  if (aiInsightsLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>

          <h2 className="text-lg font-semibold text-slate-900">
            AI Spending Snapshot
          </h2>

          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
            AI Powered
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

          <p className="text-sm text-slate-500">
            AI is analyzing your spending...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (aiInsightsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>

          <h2 className="text-lg font-semibold text-slate-900">
            AI Spending Snapshot
          </h2>
        </div>

        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            Unable to generate AI insights.
          </p>

          <p className="mt-1 text-sm leading-5 text-red-600">
            {typeof aiInsightsError === 'string'
              ? aiInsightsError
              : 'Something went wrong while generating AI insights.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRetry}
          disabled={aiInsightsLoading}
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Try Again
        </button>
      </div>
    )
  }

  // No insights yet
  if (!aiInsights) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>

          <h2 className="text-lg font-semibold text-slate-900">
            AI Spending Snapshot
          </h2>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Upload invoices to generate AI-powered spending insights.
        </p>

        <Link
          to="/invoices"
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Upload Invoice
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">✨</span>

            <h2 className="text-lg font-semibold text-slate-900">
              AI Spending Snapshot
            </h2>

            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
              AI Powered
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            A quick overview of your business spending.
          </p>
        </div>

        <Link
          to="/insights"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          View full insights →
        </Link>
      </div>

      {/* AI Summary */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          AI Summary
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {aiInsights.summary ||
            'No AI summary is available yet.'}
        </p>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Spending */}
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">
            Total Spending
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatAmount(aiInsights.totalSpending)}
          </p>
        </div>

        {/* Top Category */}
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">
            Top Category
          </p>

          <p
            className="mt-2 truncate text-lg font-bold text-slate-900"
            title={aiInsights.topCategory || '—'}
          >
            {aiInsights.topCategory || '—'}
          </p>
        </div>

        {/* Top Vendor */}
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">
            Top Vendor
          </p>

          <p
            className="mt-2 truncate text-lg font-bold text-slate-900"
            title={aiInsights.topVendor || '—'}
          >
            {aiInsights.topVendor || '—'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AISpendingSnapshot
