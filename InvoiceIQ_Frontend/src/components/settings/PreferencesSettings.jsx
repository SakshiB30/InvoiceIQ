function PreferencesSettings() {
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
            defaultChecked
            className="h-4 w-4 accent-yellow-400"
          />
        </div>

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
              defaultChecked
              className="h-4 w-4 accent-yellow-400"
            />
          </div>
        </div>

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
              defaultChecked
              className="h-4 w-4 accent-yellow-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreferencesSettings