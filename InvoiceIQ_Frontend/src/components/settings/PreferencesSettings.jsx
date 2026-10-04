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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customize how InvoiceIQ works for you.
        </p>
      </div>

      <div className="space-y-5">
        {/* Email Notifications */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-900">
              Email Notifications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Receive important invoice and expense notifications.
            </p>
          </div>

          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={() =>
              handleToggle('emailNotifications')
            }
            className="h-4 w-4 accent-yellow-400"
          />
        </div>

        {/* AI Insights */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-slate-900">
                AI Insights
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Receive AI-generated spending insights and recommendations.
              </p>
            </div>

            <input
              type="checkbox"
              checked={preferences.aiInsights}
              onChange={() =>
                handleToggle('aiInsights')
              }
              className="h-4 w-4 accent-yellow-400"
            />
          </div>
        </div>

        {/* Invoice Processing Alerts */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-slate-900">
                Invoice Processing Alerts
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Get notified when invoice processing requires your attention.
              </p>
            </div>

            <input
              type="checkbox"
              checked={preferences.invoiceAlerts}
              onChange={() =>
                handleToggle('invoiceAlerts')
              }
              className="h-4 w-4 accent-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center justify-end gap-4">
        {saved && (
          <p className="text-sm font-medium text-green-600">
            Preferences saved.
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}

export default PreferencesSettings