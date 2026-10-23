const RANK_STYLES = [
  "border-amber-400/20 bg-amber-400/10 text-amber-400",
  "border-slate-300/20 bg-slate-300/10 text-slate-300",
  "border-orange-400/20 bg-orange-400/10 text-orange-400",
  "border-indigo-400/20 bg-indigo-400/10 text-indigo-400",
  "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
];

const TopVendors = ({ data = [] }) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#151B2B] p-5 shadow-lg shadow-black/5 transition-colors duration-300 hover:border-white/15 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-1 rounded-full bg-[#6366F1]"
            aria-hidden="true"
          />

          <h2 className="text-lg font-semibold tracking-tight text-[#F1F5F9]">
            Top Vendors
          </h2>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Vendors receiving the highest amount of your spending.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-2xl">
            🏢
          </div>

          <p className="text-sm font-semibold text-[#F1F5F9]">
            No vendor data
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#94A3B8]">
            There is no vendor spending data available for the selected date range.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((vendor, index) => {
            const rankStyle =
              RANK_STYLES[index % RANK_STYLES.length];

            return (
              <div
                key={`${vendor.vendor}-${index}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-transparent p-3 transition-colors duration-200 hover:border-white/5 hover:bg-white/[0.02]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${rankStyle}`}
                    aria-label={`Rank ${index + 1}`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p
                      title={vendor.vendor || "Unknown Vendor"}
                      className="truncate text-sm font-semibold text-[#F1F5F9]"
                    >
                      {vendor.vendor || "Unknown Vendor"}
                    </p>

                    <p className="mt-1 text-xs text-[#94A3B8]">
                      {vendor.transactionCount || 0} transactions
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-bold text-[#22D3EE]">
                  ₹
                  {Number(vendor.amount || 0).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TopVendors;