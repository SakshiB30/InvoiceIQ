import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateProfile } from '../../redux/slices/authSlice'

function ProfileSettings() {
  const dispatch = useDispatch()

  const { user, loading, error } = useSelector(
    (state) => state.auth,
  )

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        businessName: user.businessName || '',
      })
    }
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setSaved(false)
  }

  const handleSave = async () => {
    const result = await dispatch(
      updateProfile({
        name: formData.name,
        businessName: formData.businessName,
      }),
    )

    if (updateProfile.fulfilled.match(result)) {
      setSaved(true)

      setTimeout(() => {
        setSaved(false)
      }, 3000)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View and manage your personal and business information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 outline-none"
          />

          <p className="mt-1 text-xs text-slate-400">
            Email cannot be changed here.
          </p>
        </div>

        {/* Business Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Business Name
          </label>

          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter business name"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {typeof error === 'string'
            ? error
            : 'Failed to update profile.'}
        </p>
      )}

      {/* Save */}
      <div className="mt-6 flex items-center justify-end gap-4">
        {saved && (
          <p className="text-sm font-medium text-green-600">
            Profile updated successfully.
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default ProfileSettings