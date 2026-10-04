import { useSelector } from 'react-redux'

function Recommendations() {
  const {
    aiInsights,
    aiInsightsLoading,
  } = useSelector((state) => state.invoices)

  if (aiInsightsLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Recommendations
        </h2>

        <p className="mt-6 text-center text-sm text-slate-500">
          AI is generating personalized recommendations...
        </p>
      </div>
    )
  }

  if (!aiInsights) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Recommendations
        </h2>

        <p className="mt-4 text-sm text-slate-500">
          Upload invoices to receive AI-powered business recommendations.
        </p>
      </div>
    )
  }

  const recommendations = aiInsights.recommendations || []

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Recommendations
          </h2>

          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
            AI Powered
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Practical suggestions generated from your invoice data.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-3xl">💡</div>

          <p className="mt-3 text-sm text-slate-500">
            No recommendations are available yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={`${index}-${recommendation}`}
              className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xl">
                {index === 0
                  ? '📊'
                  : index === 1
                    ? '🏢'
                    : index === 2
                      ? '📈'
                      : '💡'}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  AI Recommendation {index + 1}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recommendations
