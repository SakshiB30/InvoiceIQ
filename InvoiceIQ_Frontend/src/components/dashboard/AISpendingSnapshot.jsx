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
  }, [dispatch, aiInsights, aiInsightsLoading, aiInsightsError])

  const handleRetry = () => {
    dispatch(fetchAIInsights())
  }

  const formatCurrency = (amount) => {
    const value = Number(amount)

    if (!Number.isFinite(value)) {
      return '₹0'
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const hasInsights =
    aiInsights &&
    (
      aiInsights.summary ||
      aiInsights.totalSpending != null ||
      aiInsights.topCategory ||
      aiInsights.topVendor ||
      aiInsights.spendingInsights?.length ||
      aiInsights.recommendations?.length
    )

  const insightCards = [
    {
      label: 'Total spending',
      value: formatCurrency(aiInsights?.totalSpending),
      icon: '₹',
      accent: 'text-cyan-300',
      iconBackground: 'bg-cyan-400/10',
    },
    {
      label: 'Top category',
      value: aiInsights?.topCategory || 'Not available',
      icon: '▦',
      accent: 'text-indigo-300',
      iconBackground: 'bg-indigo-400/10',
    },
    {
      label: 'Top vendor',
      value: aiInsights?.topVendor || 'Not available',
      icon: '⌂',
      accent: 'text-emerald-300',
      iconBackground: 'bg-emerald-400/10',
    },
  ]

  return (
    <section className="overflow-hidden rounded-2xl border border-[#303454] bg-[#151B2B] shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
      <div className="relative overflow-hidden border-b border-[#263148] px-5 py-5 sm:px-6">
        <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/15 text-xl text-indigo-300">
              ✧
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
                  AI Spending Snapshot
                </h2>

                <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                  AI powered
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                A quick overview of your invoice spending and patterns.
              </p>
            </div>
          </div>

          <Link
            to="/insights"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#394765] bg-[#1B2336] px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200 sm:self-center"
          >
            View insights
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {aiInsightsLoading && !aiInsights && (
          <div
            role="status"
            aria-live="polite"
            className="space-y-4 py-5"
          >
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Analyzing your spending
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Preparing your financial snapshot...
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-[#263148] bg-[#0F172A]/70 p-4"
                >
                  <div className="h-3 w-24 rounded bg-slate-700/70" />
                  <div className="mt-4 h-6 w-32 max-w-full rounded bg-slate-700/70" />
                </div>
              ))}
            </div>
          </div>
        )}

        {aiInsightsError && !aiInsights && !aiInsightsLoading && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-300">
                  Unable to load spending insights
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Please try again. Your invoices have not been changed.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/10"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!aiInsightsLoading && !aiInsightsError && !hasInsights && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#303B53] bg-[#0F172A]/50 px-5 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-2xl text-indigo-300">
              ✧
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-200">
              No spending insights yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Once your invoices are processed, your spending summary and
              patterns will appear here.
            </p>

            <Link
              to="/invoices"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
            >
              View invoices
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {hasInsights && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {insightCards.map((card) => (
                <div
                  key={card.label}
                  className="group min-w-0 rounded-xl border border-[#263148] bg-[#0F172A]/70 p-4 transition duration-200 hover:border-[#394765] hover:bg-[#111C30]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-slate-400">
                      {card.label}
                    </p>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${card.iconBackground} ${card.accent}`}
                    >
                      {card.icon}
                    </span>
                  </div>

                  <p
                    title={String(card.value)}
                    className={`mt-3 truncate text-xl font-semibold tracking-tight ${card.accent}`}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.09] via-[#111827] to-cyan-500/[0.04] p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="text-lg text-indigo-300" aria-hidden="true">
                  ✦
                </span>
                <h3 className="text-sm font-semibold text-slate-200">
                  AI summary
                </h3>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                {aiInsights?.summary ||
                  'Your spending snapshot is ready. Visit Insights for more details.'}
              </p>

              {Array.isArray(aiInsights?.spendingInsights) &&
                aiInsights.spendingInsights.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-[#303454] pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Spending observations
                    </h4>

                    {aiInsights.spendingInsights.slice(0, 2).map((insight, index) => (
                      <p
                        key={`${index}-${insight}`}
                        className="flex gap-2 text-sm leading-6 text-slate-300"
                      >
                        <span className="mt-0.5 text-cyan-300" aria-hidden="true">
                          •
                        </span>
                        <span>{insight}</span>
                      </p>
                    ))}
                  </div>
                )}

              {Array.isArray(aiInsights?.recommendations) &&
                aiInsights.recommendations.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-[#303454] pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Recommendations
                    </h4>

                    {aiInsights.recommendations.slice(0, 2).map((recommendation, index) => (
                      <p
                        key={`${index}-${recommendation}`}
                        className="flex gap-2 text-sm leading-6 text-slate-300"
                      >
                        <span className="mt-0.5 text-emerald-300" aria-hidden="true">
                          ✓
                        </span>
                        <span>{recommendation}</span>
                      </p>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Based on your available invoice data</span>
              <Link
                to="/insights"
                className="font-medium text-indigo-300 transition hover:text-indigo-200"
              >
                Explore all insights →
              </Link>
            </div>
          </div>
        )}

        {aiInsightsLoading && aiInsights && (
          <div
            role="status"
            className="mb-4 flex items-center gap-2 text-xs text-slate-400"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            Refreshing insights...
          </div>
        )}

        {aiInsightsError && aiInsights && (
          <p className="mt-4 text-xs text-amber-300">
            The latest refresh failed. Showing the previously loaded insights.
          </p>
        )}
      </div>
    </section>
  )
}

export default AISpendingSnapshot
