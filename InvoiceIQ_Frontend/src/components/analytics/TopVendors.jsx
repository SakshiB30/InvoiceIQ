const TopVendors = ({ data = [] }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Top Vendors
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Vendors receiving the highest amount of your spending.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
            🏢
          </div>

          <p className="text-sm font-medium text-gray-700">
            No vendor data
          </p>

          <p className="mt-1 max-w-sm text-xs text-gray-500">
            There is no vendor spending data available
            for the selected date range.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((vendor, index) => (
            <div
              key={`${vendor.vendor}-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {vendor.vendor || "Unknown Vendor"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {vendor.transactionCount || 0} transactions
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-sm font-semibold text-gray-900">
                ₹
                {Number(vendor.amount || 0).toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopVendors;