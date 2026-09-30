function ProfileSettings() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your personal and business information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            defaultValue="Business Owner"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            defaultValue="owner@example.com"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Business Name
          </label>

          <input
            type="text"
            defaultValue="My Business"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ProfileSettings