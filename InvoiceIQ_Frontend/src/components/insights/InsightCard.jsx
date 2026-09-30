const insights = [
  {
    type: 'warning',
    icon: '⚠️',
    title: 'Inventory spending increased',
    description:
      'Your inventory expenses increased by 18% compared with the previous month.',
    action: 'Review inventory expenses',
  },
  {
    type: 'success',
    icon: '💡',
    title: 'Potential savings opportunity',
    description:
      'You may be able to reduce monthly expenses by approximately ₹12,500 by reviewing recurring purchases.',
    action: 'View savings analysis',
  },
  {
    type: 'info',
    icon: '🔍',
    title: 'Possible duplicate invoices',
    description:
      '2 invoices have similar vendor, amount, and date information and may require verification.',
    action: 'Review duplicates',
  },
]

function InsightCard({ insight }) {
  const styles = {
    warning: {
      container: 'border-orange-200 bg-orange-50',
      icon: 'bg-orange-100',
      title: 'text-orange-900',
      text: 'text-orange-700',
      button: 'text-orange-700 hover:text-orange-800',
    },

    success: {
      container: 'border-green-200 bg-green-50',
      icon: 'bg-green-100',
      title: 'text-green-900',
      text: 'text-green-700',
      button: 'text-green-700 hover:text-green-800',
    },

    info: {
      container: 'border-blue-200 bg-blue-50',
      icon: 'bg-blue-100',
      title: 'text-blue-900',
      text: 'text-blue-700',
      button: 'text-blue-700 hover:text-blue-800',
    },
  }

  const style = styles[insight.type] || styles.info

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${style.container}`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${style.icon}`}
        >
          {insight.icon}
        </div>

        <div className="flex-1">
          <h3 className={`font-semibold ${style.title}`}>
            {insight.title}
          </h3>

          <p className={`mt-2 text-sm leading-6 ${style.text}`}>
            {insight.description}
          </p>

          <button
            type="button"
            className={`mt-3 text-sm font-semibold transition ${style.button}`}
          >
            {insight.action} →
          </button>
        </div>
      </div>
    </div>
  )
}

function InsightList() {
  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <InsightCard
          key={insight.title}
          insight={insight}
        />
      ))}
    </div>
  )
}

export { InsightList }

export default InsightCard