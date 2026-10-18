import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAnalytics } from "../redux/slices/analyticsSlice";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsDateFilter from "../components/analytics/AnalyticsDateFilter";
import AnalyticsKPICards from "../components/analytics/AnalyticsKPICards";
import MonthlySpendingChart from "../components/analytics/MonthlySpendingChart";
import CategorySpendingChart from "../components/analytics/CategorySpendingChart";
import TopVendors from "../components/analytics/TopVendors";
import SpendingDistribution from "../components/analytics/SpendingDistribution";

const getDateRange = (range) => {
  const today = new Date();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  switch (range) {
    case "THIS_MONTH": {
      const fromDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      return {
        fromDate: formatDate(fromDate),
        toDate: formatDate(today),
      };
    }

    case "LAST_MONTH": {
      const fromDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      const toDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      return {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };
    }

    case "THIS_QUARTER": {
      const currentMonth = today.getMonth();

      const quarterStartMonth =
        Math.floor(currentMonth / 3) * 3;

      const fromDate = new Date(
        today.getFullYear(),
        quarterStartMonth,
        1
      );

      return {
        fromDate: formatDate(fromDate),
        toDate: formatDate(today),
      };
    }

    case "THIS_YEAR": {
      const fromDate = new Date(
        today.getFullYear(),
        0,
        1
      );

      return {
        fromDate: formatDate(fromDate),
        toDate: formatDate(today),
      };
    }

    case "ALL_TIME":
    default:
      return {
        fromDate: null,
        toDate: null,
      };
  }
};

const getDateRangeLabel = (dateRange) => {
  const formatDisplayDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  if (dateRange.type === "ALL_TIME") {
    return "Showing analytics for all available data";
  }

  if (dateRange.type === "CUSTOM") {
    if (!dateRange.fromDate || !dateRange.toDate) {
      return "Select a date range to view analytics";
    }

    return `Showing analytics from ${formatDisplayDate(
      dateRange.fromDate
    )} to ${formatDisplayDate(dateRange.toDate)}`;
  }

  const labels = {
    THIS_MONTH: "Showing analytics for this month",
    LAST_MONTH: "Showing analytics for last month",
    THIS_QUARTER: "Showing analytics for this quarter",
    THIS_YEAR: "Showing analytics for this year",
  };

  return labels[dateRange.type] || "Showing analytics";
};

const AnalyticsLoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-lg bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
      </div>

      {/* Date Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-64 rounded bg-gray-200" />

        <div className="h-10 w-40 rounded-lg bg-gray-200" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-gray-200" />

            <div className="mt-4 h-8 w-36 rounded bg-gray-200" />

            <div className="mt-3 h-3 w-24 rounded bg-gray-100" />

            <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Monthly Spending */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-6 space-y-2">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-3 w-72 rounded bg-gray-100" />
        </div>

        <div className="h-72 rounded-lg bg-gray-100" />
      </div>

      {/* Category + Distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-6 space-y-2">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-3 w-72 rounded bg-gray-100" />
          </div>

          <div className="h-72 rounded-lg bg-gray-100" />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-6 space-y-2">
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-3 w-72 rounded bg-gray-100" />
          </div>

          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-2 flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-4 w-12 rounded bg-gray-200" />
                </div>

                <div className="h-2 rounded-full bg-gray-100" />

                <div className="mt-2 flex justify-end">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-6 space-y-2">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-3 w-72 rounded bg-gray-100" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gray-200" />

                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state) => state.analytics
  );

  const [dateRange, setDateRange] = useState({
    type: "ALL_TIME",
    fromDate: null,
    toDate: null,
  });

  useEffect(() => {
    if (dateRange.type === "CUSTOM") {
      if (!dateRange.fromDate || !dateRange.toDate) {
        return;
      }

      dispatch(
        fetchAnalytics({
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
        })
      );

      return;
    }

    const { fromDate, toDate } = getDateRange(
      dateRange.type
    );

    dispatch(
      fetchAnalytics({
        fromDate,
        toDate,
      })
    );
  }, [dispatch, dateRange]);

  if (loading) {
    return <AnalyticsLoadingSkeleton />;
  }


if (error) {
  return (
    <div className="flex min-h-125 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
          ⚠️
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Unable to load analytics
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          We couldn't retrieve your analytics data
          right now. Please try again.
        </p>

        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            if (dateRange.type === "CUSTOM") {
              if (
                !dateRange.fromDate ||
                !dateRange.toDate
              ) {
                return;
              }

              dispatch(
                fetchAnalytics({
                  fromDate: dateRange.fromDate,
                  toDate: dateRange.toDate,
                })
              );

              return;
            }

            const { fromDate, toDate } =
              getDateRange(dateRange.type);

            dispatch(
              fetchAnalytics({
                fromDate,
                toDate,
              })
            );
          }}
          className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}


  const kpis = data?.kpis || {};
  const monthlySpending = data?.monthlySpending || [];
  const categorySpending = data?.categorySpending || [];
  const topVendors = data?.topVendors || [];
  const comparison = data?.comparison || null;

  const hasAnalyticsData =
    monthlySpending.length > 0 ||
    categorySpending.length > 0 ||
    topVendors.length > 0 ||
    Number(kpis.transactionCount || 0) > 0 ||
    Number(kpis.totalSpending || 0) > 0;

  return (
    <div className="space-y-6 p-6">
      <AnalyticsHeader />

      <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {getDateRangeLabel(dateRange)}
        </p>

        <AnalyticsDateFilter
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      {!hasAnalyticsData ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📊
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              No analytics data available
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              There are no invoice records available for
              the selected date range. Try selecting a
              different date range or add some invoices.
            </p>
          </div>
        </div>
      ) : (
        <>
          <AnalyticsKPICards
            kpis={kpis}
            comparison={comparison}
          />

          <MonthlySpendingChart data={monthlySpending} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CategorySpendingChart data={categorySpending} />

            <SpendingDistribution
              data={categorySpending}
            />
          </div>

          <TopVendors data={topVendors} />
        </>
      )}
    </div>
  );
};

export default Analytics;