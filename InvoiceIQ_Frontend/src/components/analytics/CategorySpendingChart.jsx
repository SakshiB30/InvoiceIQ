import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "#6366F1",
  "#22D3EE",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#A78BFA",
  "#38BDF8",
  "#F97316",
  "#2DD4BF",
  "#E879F9",
];

const CategorySpendingChart = ({ data = [] }) => {
  const chartData = data.filter(
    (item) => Number(item.amount) > 0
  );

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const renderTooltip = ({
    active,
    payload,
  }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const item = payload[0];

    return (
      <div className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 shadow-xl">
        <p className="mb-1 text-xs font-medium text-[#94A3B8]">
          {item.name || item.payload?.category}
        </p>

        <p className="text-sm font-bold text-[#F1F5F9]">
          {formatCurrency(item.value)}
        </p>
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151B2B] p-5 shadow-lg shadow-black/5 transition-colors duration-300 hover:border-white/15 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-1 rounded-full bg-[#22D3EE]"
            aria-hidden="true"
          />

          <h2 className="text-lg font-semibold tracking-tight text-[#F1F5F9]">
            Category-wise Spending
          </h2>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          See how your expenses are distributed across categories.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-2xl">
            🗂️
          </div>

          <p className="text-sm font-semibold text-[#F1F5F9]">
            No category spending data
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#94A3B8]">
            There is no category-wise spending data available
            for the selected date range.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={55}
                paddingAngle={3}
                stroke="#151B2B"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.category || index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                content={renderTooltip}
                cursor={false}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingTop: "16px",
                  fontSize: "12px",
                  color: "#94A3B8",
                }}
                formatter={(value) => (
                  <span
                    style={{
                      color: "#CBD5E1",
                      marginLeft: "3px",
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default CategorySpendingChart;
