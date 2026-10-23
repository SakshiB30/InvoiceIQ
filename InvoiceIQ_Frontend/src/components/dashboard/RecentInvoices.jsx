import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function StatusBadge({ invoice }) {
  const status = invoice?.processingStatus
  const isValid = invoice?.validationResult?.valid

  let label = 'Pending'
  let styles = 'border-amber-400/20 bg-amber-400/10 text-amber-300'
  let dot = 'bg-amber-300'

  if (status === 'COMPLETED') {
    label = 'Verified'
    styles = 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
    dot = 'bg-emerald-300'
  } else if (isValid === false) {
    label = 'Review'
    styles = 'border-rose-400/20 bg-rose-400/10 text-rose-300'
    dot = 'bg-rose-300'
  } else if (
    status === 'PENDING' ||
    status === 'PROCESSING' ||
    status === 'UPLOADING'
  ) {
    label = 'Pending'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

function formatCurrency(amount) {
  const value = Number(amount)

  if (!Number.isFinite(value)) {
    return '—'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateValue) {
  if (!dateValue) return '—'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function RecentInvoices() {
  const navigate = useNavigate()

  const {
    invoices = [],
    loading,
    error,
  } = useSelector((state) => state.invoices)

  const recentInvoices = [...invoices]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.invoiceDate || 0).getTime()
      const dateB = new Date(b.createdAt || b.invoiceDate || 0).getTime()

      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <section className="overflow-hidden rounded-2xl border border-[#263148] bg-[#151B2B] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col justify-between gap-3 border-b border-[#263148] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
            Recent invoices
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Your latest invoice activity in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#394765] bg-[#1B2336] px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200 sm:self-center"
        >
          View all invoices
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {loading && invoices.length === 0 ? (
        <div className="space-y-3 p-5 sm:p-6" role="status" aria-live="polite">
          <p className="text-sm text-slate-400">Loading recent invoices...</p>

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center gap-4 rounded-xl border border-[#263148] bg-[#0F172A]/50 p-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-700/60" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-36 max-w-full rounded bg-slate-700/60" />
                <div className="h-3 w-24 rounded bg-slate-800" />
              </div>
              <div className="h-5 w-20 rounded bg-slate-700/60" />
            </div>
          ))}
        </div>
      ) : error && invoices.length === 0 ? (
        <div className="px-5 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-lg text-rose-300">
            !
          </div>
          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            Could not load invoices
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Please refresh the page or try again shortly.
          </p>
        </div>
      ) : recentInvoices.length === 0 ? (
        <div className="px-5 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-xl text-indigo-300">
            ▤
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-200">
            No invoices yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
            Upload your first invoice to start tracking your business spending.
          </p>
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="iq-primary-button mt-4"
          >
            Go to invoices
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[620px] text-left">
            <thead>
              <tr className="border-b border-[#263148] bg-[#0F172A]/60">
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider sm:px-6">
                  Vendor
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                  Invoice date
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider">
                  <span className="sr-only">Open invoice</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#263148]/80">
              {recentInvoices.map((invoice) => {
                const vendorName =
                  invoice.vendor?.name ||
                  invoice.vendorName ||
                  'Unknown Vendor'

                const invoiceId = invoice.id

                return (
                  <tr
                    key={invoiceId}
                    onClick={() => navigate(`/invoices/${invoiceId}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(`/invoices/${invoiceId}`)
                      }
                    }}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open invoice from ${vendorName}`}
                    className="group cursor-pointer transition-colors duration-150 hover:bg-[#1B2336]/80 focus-visible:bg-[#1B2336] focus-visible:outline-none"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-sm font-semibold text-indigo-300">
                          {String(vendorName).charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p
                            title={vendorName}
                            className="max-w-[190px] truncate text-sm font-medium text-slate-200 transition-colors group-hover:text-indigo-200"
                          >
                            {vendorName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Invoice #{invoice.invoiceNumber || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                      {formatDate(invoice.invoiceDate)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-200">
                      {formatCurrency(invoice.totalAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge invoice={invoice} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span
                        className="text-lg text-slate-600 transition-colors group-hover:text-indigo-300"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between gap-3 border-t border-[#263148] px-5 py-3.5 sm:px-6">
            <p className="text-xs text-slate-500">
              Showing {recentInvoices.length} of {invoices.length} invoices
            </p>

            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="text-xs font-semibold text-indigo-300 transition hover:text-indigo-200"
            >
              All invoices →
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default RecentInvoices
