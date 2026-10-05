const AnalyticsHeader = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track spending patterns, categories, and vendor performance.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600">
          Financial Overview
        </span>
      </div>
    </div>
  );
};

export default AnalyticsHeader;