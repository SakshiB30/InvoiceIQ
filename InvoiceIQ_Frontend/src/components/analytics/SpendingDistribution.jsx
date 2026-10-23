const DISTRIBUTION_COLORS = [
  "bg-indigo-400",
  "bg-cyan-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-violet-400",
  "bg-sky-400",
  "bg-orange-400",
  "bg-teal-400",
  "bg-fuchsia-400",
];

const SpendingDistribution = ({ data = [] }) => {
  const distribution = data.filter(
    (item) => Number(item.amount) > 0
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151B2B] p-5 shadow-lg shadow-black/5 transition-colors duration-300 hover:border-white/15 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-1 rounded-full bg-[#22D3EE]"
            aria-hidden="true"
          />

          <h2 className="text-lg font-semibold tracking-tight text-[#F1F5F9]">
            Spending Distribution
          </h2>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Breakdown of your total spending by category.
        </p>
      </div>

      {distribution.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
            📊
          </div>

          <p className="text-sm font-semibold text-[#F1F5F9]">
            No spending distribution data
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#94A3B8]">
            There is no spending distribution data available
            for the selected date range.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {distribution.map((item, index) => {
            const percentage = Math.min(
              Math.max(Number(item.percentage || 0), 0),
              100
            );

            const color =
              DISTRIBUTION_COLORS[
                index % DISTRIBUTION_COLORS.length
              ];

            return (
              <div key={item.category}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`}
                      aria-hidden="true"
                    />

                    <p
                      title={item.category}
                      className="truncate text-sm font-medium text-[#CBD5E1]"
                    >
                      {item.category}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[#F1F5F9]">
                    {Number(item.percentage || 0).toFixed(1)}%
                  </p>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-[#0B0F19]"
                  role="progressbar"
                  aria-label={`${item.category} spending`}
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-end">
                  <span className="text-xs font-medium text-[#94A3B8]">
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
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SpendingDistribution;
