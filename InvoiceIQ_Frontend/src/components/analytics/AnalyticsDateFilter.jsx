import { useState } from "react";

const AnalyticsDateFilter = ({ value, onChange }) => {
  const [customFromDate, setCustomFromDate] = useState(
    value.fromDate || ""
  );

  const [customToDate, setCustomToDate] = useState(
    value.toDate || ""
  );

  const handleRangeChange = (e) => {
    const selectedRange = e.target.value;

    if (selectedRange !== "CUSTOM") {
      onChange({
        type: selectedRange,
        fromDate: null,
        toDate: null,
      });

      return;
    }

    onChange({
      type: "CUSTOM",
      fromDate: null,
      toDate: null,
    });
  };

  const handleApplyCustomRange = () => {
    if (
      !customFromDate ||
      !customToDate ||
      customFromDate > customToDate
    ) {
      return;
    }

    onChange({
      type: "CUSTOM",
      fromDate: customFromDate,
      toDate: customToDate,
    });
  };

  const handleReset = () => {
    setCustomFromDate("");
    setCustomToDate("");

    onChange({
      type: "ALL_TIME",
      fromDate: null,
      toDate: null,
    });
  };

  const isCustomRange = value.type === "CUSTOM";

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2.5 text-sm text-[#F1F5F9] outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 [color-scheme:dark]";

  const labelClasses =
    "text-xs font-medium tracking-wide text-[#94A3B8]";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      {/* Preset Range */}
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor="analytics-date-range"
          className="text-xs font-medium tracking-wide text-[#94A3B8]"
        >
          Date Range
        </label>

        <select
          id="analytics-date-range"
          value={value.type}
          onChange={handleRangeChange}
          className={`${inputClasses} min-w-[155px] cursor-pointer`}
        >
          <option value="ALL_TIME">All Time</option>
          <option value="THIS_MONTH">This Month</option>
          <option value="LAST_MONTH">Last Month</option>
          <option value="THIS_QUARTER">This Quarter</option>
          <option value="THIS_YEAR">This Year</option>
          <option value="CUSTOM">Custom Range</option>
        </select>
      </div>

      {/* Custom Range Controls */}
      {isCustomRange && (
        <>
          <div className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor="analytics-from-date"
              className={labelClasses}
            >
              From
            </label>

            <input
              id="analytics-from-date"
              type="date"
              value={customFromDate}
              max={customToDate || undefined}
              onChange={(e) =>
                setCustomFromDate(e.target.value)
              }
              className={inputClasses}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor="analytics-to-date"
              className={labelClasses}
            >
              To
            </label>

            <input
              id="analytics-to-date"
              type="date"
              value={customToDate}
              min={customFromDate || undefined}
              onChange={(e) =>
                setCustomToDate(e.target.value)
              }
              className={inputClasses}
            />
          </div>

          <button
            type="button"
            onClick={handleApplyCustomRange}
            disabled={
              !customFromDate ||
              !customToDate ||
              customFromDate > customToDate
            }
            className="inline-flex items-center justify-center rounded-xl bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
};

export default AnalyticsDateFilter;
