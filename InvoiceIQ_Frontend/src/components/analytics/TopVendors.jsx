import { useSelector } from 'react-redux'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function TopVendors() {
  const { invoices, loading, error } = useSelector(
    (state) => state.invoices,
  )

  const vendorTotals = invoices.reduce(
    (vendors, invoice) => {
      const vendorName =
        invoice.vendor?.name ||
        invoice.vendorName ||
        'Unknown Vendor'

      const amount = Number(invoice.totalAmount) || 0

      if (!vendors[vendorName]) {
        vendors[vendorName] = {
          amount: 0,
          invoices: 0,
        }
      }

      vendors[vendorName].amount += amount
      vendors[vendorName].invoices += 1

      return vendors
    },
    {},
  )

  const vendors = Object.entries(vendorTotals)
    .sort(([, a], [, b]) => b.amount - a.amount)
    .slice(0, 5)

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Top Vendors
        </h2>

        <p className="mt-6 text-center text-sm text-slate-500">
          Loading vendor data...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Top Vendors
        </h2>

        <p className="mt-4 text-sm text-red-600">
          Unable to load vendor data.
        </p>
      </div>
    )
  }

  if (vendors.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Top Vendors
        </h2>

        <div className="py-10 text-center">
          <div className="text-3xl">🏢</div>

          <p className="mt-3 text-sm text-slate-500">
            No vendor data available yet.
          </p>
        </div>
      </div>
    )
  }

  const maxAmount = vendors[0][1].amount

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Top Vendors
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Vendors with the highest recorded spending.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {vendors.map(([vendorName, data], index) => {
          const percentage =
            maxAmount > 0
              ? (data.amount / maxAmount) * 100
              : 0

          return (
            <div key={vendorName}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-slate-700">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {vendorName}
                      </p>

                      <p className="text-xs text-slate-400">
                        {data.invoices}{' '}
                        {data.invoices === 1
                          ? 'invoice'
                          : 'invoices'}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-slate-900">
                      {formatAmount(data.amount)}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopVendors