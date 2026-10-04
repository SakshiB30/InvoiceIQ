import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function formatDate(date) {
  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

function getStatus(invoice) {
  if (invoice.processingStatus === 'COMPLETED') {
    return 'Verified'
  }

  if (invoice.validation?.valid === false) {
    return 'Review'
  }

  if (
    invoice.processingStatus === 'PENDING' ||
    invoice.processingStatus === 'PROCESSING' ||
    invoice.processingStatus === 'UPLOADING'
  ) {
    return 'Pending'
  }

  return 'Pending'
}

function getVendorName(invoice) {
  return (
    invoice.vendor?.name ||
    invoice.vendorName ||
    'Unknown Vendor'
  )
}

function getVendorInitial(invoice) {
  const vendorName = getVendorName(invoice)

  if (!vendorName || vendorName === 'Unknown Vendor') {
    return '?'
  }

  return vendorName.charAt(0).toUpperCase()
}

function RecentInvoices() {
  const navigate = useNavigate()

  const {
    invoices,
    loading,
    error,
  } = useSelector((state) => state.invoices)

  const recentInvoices = [...invoices]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.invoiceDate || 0,
      )

      const dateB = new Date(
        b.createdAt || b.invoiceDate || 0,
      )

      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Invoices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest uploaded invoices
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/invoices')}
          className="self-start text-sm font-medium text-yellow-600 transition hover:text-yellow-700 sm:self-auto"
        >
          View All →
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-10 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

          <p className="mt-3 text-sm text-slate-500">
            Loading recent invoices...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-10 text-center">
          <div className="text-3xl">⚠️</div>

          <p className="mt-3 text-sm font-medium text-red-600">
            Failed to load recent invoices.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Please refresh the page and try again.
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        recentInvoices.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
              📄
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">
              No invoices yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Upload your first invoice to start tracking your expenses.
            </p>

            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Upload Invoice
            </button>
          </div>
        )}

      {/* Desktop Table */}
      {!loading &&
        !error &&
        recentInvoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 font-medium text-slate-500">
                    Invoice
                  </th>

                  <th className="px-6 py-3 font-medium text-slate-500">
                    Vendor
                  </th>

                  <th className="px-6 py-3 font-medium text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-3 font-medium text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-3 font-medium text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentInvoices.map((invoice) => {
                  const status = getStatus(invoice)
                  const vendorName = getVendorName(invoice)

                  return (
                    <tr
                      key={invoice.id}
                      onClick={() =>
                        navigate(`/invoices/${invoice.id}`)
                      }
                      className="cursor-pointer border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                    >
                      {/* Invoice */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {invoice.invoiceNumber || '—'}
                        </span>
                      </td>

                      {/* Vendor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-700">
                            {getVendorInitial(invoice)}
                          </div>

                          <span className="max-w-[180px] truncate text-slate-600">
                            {vendorName}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(invoice.invoiceDate)}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {formatAmount(invoice.totalAmount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Verified: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Review: 'bg-orange-100 text-orange-700',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

export default RecentInvoices
