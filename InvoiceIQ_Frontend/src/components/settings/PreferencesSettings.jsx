import { useState } from 'react'

function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    aiInsights: true,
    invoiceAlerts: true,
  })

  const [saved, setSaved] = useState(false)

  const handleToggle = (name) => {
    setPreferences((previous) => ({
      ...previous,
      [name]: !previous[name],
    }))

    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem(
      'invoiceiq_preferences',
      JSON.stringify(preferences),
    )

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  const preferenceItems = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description:
        'Receive important invoice and expense notifications.',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
    {
      key: 'aiInsights',
      title: 'AI Insights',
      description:
        'Receive AI-generated spending insights and recommendations.',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
          <path d="m19 14 1.1 2.1L22 17l-1.9.9L19 20l-1.1-2.1L16 17l1.9-.9L19 14Z" />
        </svg>
      ),
    },
    {
      key: 'invoiceAlerts',
      title: 'Invoice Processing Alerts',
      description:
        'Get notified when invoice processing requires your attention.',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      ),
    },
  ]

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#151B2B] shadow-lg shadow-black/10">
      {/* Header */}
      <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
              <path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a2 2 0 0 0-1.4-3.4h-.3a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a2 2 0 0 0 3.4-1.4v-.3a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a2 2 0 0 0 1.4 3.4h.3a2 2 0 0 1 0 4h-.2a2 2 0 0 0-1.4 3.4Z" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Preferences
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Customize how InvoiceIQ works for you.
            </p>
          </div>
        </div>
      </div>

      {/* Preference Options */}
      <div className="divide-y divide-slate-800 px-5 sm:px-7">
        {preferenceItems.map((item) => {
          const enabled = preferences[item.key]

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400">
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-slate-100">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Accessible Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={item.title}
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B] ${
                  enabled ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-slate-800 bg-[#111827]/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="min-h-5">
          {saved && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm font-medium text-emerald-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>

              Preferences saved successfully.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7-7 7 7-7 7"
            />
          </svg>

          Save Preferences
        </button>
      </div>
    </section>
  )
}

export default PreferencesSettings
