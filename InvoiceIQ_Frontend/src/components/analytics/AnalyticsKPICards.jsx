
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

  const getComparisonText = (value, suffix = "vs previous period") => {
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
    if (!comparison) {
      return "text-gray-500";
    }

    if (value === null || value === undefined) {
      return "text-gray-500";
    }

    const percentage = Number(value);

    if (percentage > 0) {
      return "text-red-600";
    }

    if (percentage < 0) {
      return "text-green-600";
    }

    return "text-gray-500";
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
      value: `₹${Number(
        kpis.totalSpending || 0
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      description: `${kpis.transactionCount || 0} transactions`,
      comparison: spendingComparison,
      comparisonClass: getComparisonClass(
        comparison?.spendingChangePercentage
      ),
      secondaryComparison: transactionComparison,
      secondaryComparisonClass: getComparisonClass(
        comparison?.transactionChangePercentage
      ),
    },
    {
      title: "Average Monthly Spending",
      value: `₹${Number(
        kpis.averageMonthlySpending || 0
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      description: "Average across active months",
      comparison: averageMonthlyComparison,
      comparisonClass: getComparisonClass(
        comparison?.averageMonthlySpendingChangePercentage
      ),
    },
    {
      title: "Top Spending Category",
      value: kpis.topSpendingCategory || "N/A",
      description: "Highest spending category",
    },
    {
      title: "Top Vendor",
      value: kpis.topVendor || "N/A",
      description: "Highest spending vendor",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">
            {card.title}
          </p>

          <p className="mt-3 truncate text-2xl font-bold text-gray-900">
            {card.value}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {card.description}
          </p>

          {card.comparison && (
            <p
              className={`mt-1 text-xs font-medium ${card.comparisonClass}`}
            >
              {card.comparison}
            </p>
          )}

          {card.secondaryComparison && (
            <p
              className={`mt-1 text-xs font-medium ${card.secondaryComparisonClass}`}
            >
              {card.secondaryComparison}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalyticsKPICards;
