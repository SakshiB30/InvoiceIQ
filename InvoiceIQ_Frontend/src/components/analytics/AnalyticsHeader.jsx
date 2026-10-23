const AnalyticsHeader = () => {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.45)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#22D3EE]">
            Financial Intelligence
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-3xl">
          Analytics
          <span className="ml-2 text-[#6366F1]">Overview</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
          Track spending patterns, understand category breakdowns,
          and monitor vendor performance in one place.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-[#151B2B] px-4 py-3 shadow-lg shadow-black/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5 text-indigo-400"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3v18h18M7 14l4-4 4 4 6-7"
            />
          </svg>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#F1F5F9]">
            Financial Overview
          </p>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Spending & performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
