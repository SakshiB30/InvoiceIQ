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

  // Format using local calendar dates to avoid UTC timezone shifts.
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
      const quarterStartMonth =
        Math.floor(today.getMonth() / 3) * 3;

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
      "en-IN",
      {
        day: "numeric",
        month: "short",
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
    <div className="min-h-full animate-pulse space-y-6 bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-3 w-40 rounded bg-[#22D3EE]/20" />
        <div className="h-8 w-56 rounded-lg bg-[#1E293B]" />
        <div className="h-4 w-72 max-w-full rounded bg-[#1E293B]" />
      </div>

      {/* Date Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#151B2B] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-64 max-w-full rounded bg-[#1E293B]" />
        <div className="h-10 w-40 rounded-xl bg-[#1E293B]" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-[#151B2B] p-5"
          >
            <div className="h-4 w-32 rounded bg-[#1E293B]" />
            <div className="mt-5 h-8 w-36 max-w-full rounded bg-[#1E293B]" />
            <div className="mt-3 h-3 w-28 rounded bg-[#1E293B]" />
            <div className="mt-4 h-3 w-36 max-w-full rounded bg-[#1E293B]" />
          </div>
        ))}
      </div>

      {/* Monthly Spending */}
      <div className="rounded-2xl border border-white/10 bg-[#151B2B] p-5">
        <div className="mb-6 space-y-2">
          <div className="h-5 w-48 rounded bg-[#1E293B]" />
          <div className="h-3 w-72 max-w-full rounded bg-[#1E293B]" />
        </div>
        <div className="h-72 rounded-xl bg-[#0F172A]" />
      </div>

      {/* Category + Distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-[#151B2B] p-5"
          >
            <div className="mb-6 space-y-2">
              <div className="h-5 w-48 rounded bg-[#1E293B]" />
              <div className="h-3 w-64 max-w-full rounded bg-[#1E293B]" />
            </div>

            <div className="h-72 rounded-xl bg-[#0F172A]" />
          </div>
        ))}
      </div>

      {/* Top Vendors */}
      <div className="rounded-2xl border border-white/10 bg-[#151B2B] p-5">
        <div className="mb-6 space-y-2">
          <div className="h-5 w-32 rounded bg-[#1E293B]" />
          <div className="h-3 w-72 max-w-full rounded bg-[#1E293B]" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#1E293B]" />

                <div className="space-y-2">
                  <div className="h-4 w-32 max-w-full rounded bg-[#1E293B]" />
                  <div className="h-3 w-24 rounded bg-[#1E293B]" />
                </div>
              </div>

              <div className="h-4 w-24 shrink-0 rounded bg-[#1E293B]" />
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
      <div className="flex min-h-[500px] items-center justify-center bg-[#0B0F19] p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-400/20 bg-[#151B2B] p-6 text-center shadow-xl shadow-black/10 sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-2xl">
            ⚠️
          </div>

          <h2 className="text-lg font-semibold text-[#F1F5F9]">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            We couldn't retrieve your analytics data right now.
            Please try again.
          </p>

          <p className="mt-4 break-words rounded-xl border border-rose-400/10 bg-rose-400/5 px-3 py-3 text-left text-xs leading-5 text-rose-300">
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

              const { fromDate, toDate } = getDateRange(
                dateRange.type
              );

              dispatch(
                fetchAnalytics({
                  fromDate,
                  toDate,
                })
              );
            }}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B]"
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
    <div className="min-h-full space-y-6 bg-[#0B0F19] p-4 sm:p-6 lg:p-8">
      <AnalyticsHeader />

      {/* Date Range Controls */}
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#151B2B] p-4 shadow-lg shadow-black/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm leading-6 text-[#CBD5E1]">
            {getDateRangeLabel(dateRange)}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            Filter your financial performance by period.
          </p>
        </div>

        <AnalyticsDateFilter
          value={dateRange}
          onChange={setDateRange}
        />
      </section>

      {!hasAnalyticsData ? (
        <section className="flex min-h-[400px] items-center justify-center rounded-2xl border border-white/10 bg-[#151B2B] p-6 shadow-lg shadow-black/5 sm:p-8">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-2xl">
              📊
            </div>

            <h2 className="text-lg font-semibold text-[#F1F5F9]">
              No analytics data available
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
              There are no invoice records available for the selected
              date range. Try selecting a different date range or
              add some invoices.
            </p>
          </div>
        </section>
      ) : (
        <>
          <AnalyticsKPICards
            kpis={kpis}
            comparison={comparison}
          />

          <MonthlySpendingChart data={monthlySpending} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CategorySpendingChart data={categorySpending} />

            <SpendingDistribution data={categorySpending} />
          </div>

          <TopVendors data={topVendors} />
        </>
      )}
    </div>
  );
};

export default Analytics;
