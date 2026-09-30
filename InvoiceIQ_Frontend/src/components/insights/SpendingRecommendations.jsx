const recommendations = [
  {
    icon: '📦',
    title: 'Review inventory purchases',
    description:
      'Inventory is currently your highest spending category. Review frequently purchased items and supplier prices.',
    impact: 'High Impact',
  },
  {
    icon: '📣',
    title: 'Optimize marketing expenses',
    description:
      'Compare marketing expenses with the revenue generated from each campaign to identify less effective spending.',
    impact: 'Medium Impact',
  },
  {
    icon: '🔄',
    title: 'Review recurring expenses',
    description:
      'Identify recurring subscriptions and services that may no longer be necessary for your business.',
    impact: 'Medium Impact',
  },
]

function SpendingRecommendations() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending Recommendations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Practical recommendations based on your expense patterns.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.title}
            className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-lg">
              {recommendation.icon}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {recommendation.title}
                </h3>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  {recommendation.impact}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {recommendation.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpendingRecommendations