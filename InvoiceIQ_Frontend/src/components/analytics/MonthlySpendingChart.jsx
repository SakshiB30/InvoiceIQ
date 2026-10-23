import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MonthlySpendingChart = ({ data = [] }) => {
  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    return (
      <div className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 shadow-xl">
        <p className="mb-1 text-xs font-medium text-[#94A3B8]">
          {label}
        </p>

        <p className="text-sm font-bold text-[#22D3EE]">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151B2B] p-5 shadow-lg shadow-black/5 transition-colors duration-300 hover:border-white/15 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-1 rounded-full bg-[#6366F1]"
            aria-hidden="true"
          />

          <h2 className="text-lg font-semibold tracking-tight text-[#F1F5F9]">
            Monthly Spending Trend
          </h2>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Track how your spending changes month by month.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-2xl">
            📈
          </div>

          <p className="text-sm font-semibold text-[#F1F5F9]">
            No monthly spending data
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#94A3B8]">
            There is no spending data available for the selected date range.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke="#334155"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
                tickMargin={10}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  })}`
                }
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                width={65}
              />

              <Tooltip
                content={renderTooltip}
                cursor={{
                  stroke: "#475569",
                  strokeDasharray: "4 4",
                }}
              />

              <Line
                type="monotone"
                dataKey="amount"
                name="Spending"
                stroke="#22D3EE"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#151B2B",
                  stroke: "#22D3EE",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#22D3EE",
                  stroke: "#0F172A",
                  strokeWidth: 2,
                }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default MonthlySpendingChart;
