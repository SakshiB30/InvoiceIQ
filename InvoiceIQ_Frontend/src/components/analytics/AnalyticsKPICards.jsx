const AnalyticsKPICards = ({ kpis, comparison }) => {
  if (!kpis) {
    return null;
  }

  const formatPercentage = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    return `${Math.abs(Number(value)).toFixed(1)}%`;
  };

  const getComparisonText = (
    value,
    suffix = "vs previous period"
  ) => {
    if (!comparison) {
      return null;
    }

    if (value === null || value === undefined) {
      return "No previous period data";
    }

    const percentage = Number(value);

    if (percentage === 0) {
      return `No change ${suffix}`;
    }

    return `${percentage > 0 ? "↑" : "↓"} ${formatPercentage(
      percentage
    )} ${suffix}`;
  };

  const getComparisonClass = (value) => {
    if (
      !comparison ||
      value === null ||
      value === undefined ||
      Number(value) === 0
    ) {
      return "text-[#94A3B8]";
    }

    // Lower spending is favorable; higher spending is highlighted.
    return Number(value) > 0
      ? "text-rose-400"
      : "text-emerald-400";
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const spendingComparison = getComparisonText(
    comparison?.spendingChangePercentage
  );

  const transactionComparison = getComparisonText(
    comparison?.transactionChangePercentage,
    "transactions vs previous period"
  );

  const averageMonthlyComparison = getComparisonText(
    comparison?.averageMonthlySpendingChangePercentage,
    "vs previous period"
  );

  const cards = [
    {
      title: "Total Spending",
      value: formatCurrency(kpis.totalSpending),
      description: `${kpis.transactionCount || 0} transactions`,
      comparison: spendingComparison,
      comparisonClass: getComparisonClass(
        comparison?.spendingChangePercentage
      ),
      secondaryComparison: transactionComparison,
      secondaryComparisonClass: getComparisonClass(
        comparison?.transactionChangePercentage
      ),
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18m5-14H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
          />
        </svg>
      ),
      iconStyle: "border-indigo-400/20 bg-indigo-500/10 text-indigo-400",
    },
    {
      title: "Average Monthly Spending",
      value: formatCurrency(kpis.averageMonthlySpending),
      description: "Average across active months",
      comparison: averageMonthlyComparison,
      comparisonClass: getComparisonClass(
        comparison?.averageMonthlySpendingChangePercentage
      ),
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
          />
          <path
            strokeLinecap="round"
            d="M16 3v4M8 3v4M3 10h18"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8 15 2 2 5-5"
          />
        </svg>
      ),
      iconStyle: "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    },
    {
      title: "Top Spending Category",
      value: kpis.topSpendingCategory || "N/A",
      description: "Highest spending category",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"
          />
        </svg>
      ),
      iconStyle: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    },
    {
      title: "Top Vendor",
      value: kpis.topVendor || "N/A",
      description: "Highest spending vendor",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h2m-2 4h2m-2 4h2m7-3h1m-1 3h1"
          />
        </svg>
      ),
      iconStyle: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#151B2B] p-5 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/10"
        >
          {/* Subtle decorative accent */}
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.02] blur-2xl transition group-hover:bg-white/[0.05]"
            aria-hidden="true"
          />

          <div className="relative flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-5 text-[#94A3B8]">
              {card.title}
            </p>

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${card.iconStyle}`}
            >
              {card.icon}
            </div>
          </div>

          <p
            title={String(card.value)}
            className="relative mt-5 truncate text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-[1.65rem]"
          >
            {card.value}
          </p>

          <p className="mt-2 text-xs text-[#94A3B8]">
            {card.description}
          </p>

          {card.comparison && (
            <p
              className={`mt-4 border-t border-white/5 pt-3 text-xs font-medium leading-5 ${card.comparisonClass}`}
            >
              {card.comparison}
            </p>
          )}

          {card.secondaryComparison && (
            <p
              className={`mt-1 text-xs font-medium leading-5 ${card.secondaryComparisonClass}`}
            >
              {card.secondaryComparison}
            </p>
          )}
        </article>
      ))}
    </div>
  );
};

export default AnalyticsKPICards;
