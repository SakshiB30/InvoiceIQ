const SpendingDistribution = ({ data = [] }) => {
  const distribution = data.filter(
    (item) => item.amount > 0
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Spending Distribution
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Breakdown of your total spending by category.
        </p>
      </div>

      {distribution.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
            📊
          </div>

          <p className="text-sm font-medium text-gray-700">
            No spending distribution data
          </p>

          <p className="mt-1 max-w-sm text-xs text-gray-500">
            There is no spending distribution data
            available for the selected date range.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {distribution.map((item) => (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="truncate text-sm font-medium text-gray-700">
                  {item.category}
                </p>

                <p className="shrink-0 text-sm font-semibold text-gray-900">
                  {Number(item.percentage || 0).toFixed(1)}%
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        Number(item.percentage || 0),
                        0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-1 flex justify-end">
                <span className="text-xs text-gray-500">
                  ₹
                  {Number(item.amount || 0).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpendingDistribution;
