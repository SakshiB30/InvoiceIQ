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
    if (!customFromDate || !customToDate) {
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

  const isCustomRange =
    value.type === "CUSTOM";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="analytics-date-range"
          className="text-sm font-medium text-gray-700"
        >
          Date Range
        </label>

        <select
          id="analytics-date-range"
          value={value.type}
          onChange={handleRangeChange}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL_TIME">
            All Time
          </option>

          <option value="THIS_MONTH">
            This Month
          </option>

          <option value="LAST_MONTH">
            Last Month
          </option>

          <option value="THIS_QUARTER">
            This Quarter
          </option>

          <option value="THIS_YEAR">
            This Year
          </option>

          <option value="CUSTOM">
            Custom Range
          </option>
        </select>
      </div>

      {isCustomRange && (
        <>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="analytics-from-date"
              className="text-xs font-medium text-gray-500"
            >
              From
            </label>

            <input
              id="analytics-from-date"
              type="date"
              value={customFromDate}
              max={customToDate || undefined}
              onChange={(e) =>
                setCustomFromDate(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="analytics-to-date"
              className="text-xs font-medium text-gray-500"
            >
              To
            </label>

            <input
              id="analytics-to-date"
              type="date"
              value={customToDate}
              min={customFromDate || undefined}
              onChange={(e) =>
                setCustomToDate(
                  e.target.value
                )
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyCustomRange}
            disabled={
              !customFromDate ||
              !customToDate
            }
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
          >
            Reset
          </button>
        </>
      )}
    </div>
  );
};

export default AnalyticsDateFilter;
