import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/authSlice";

const ProfileSettings = () => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaved(false);

    try {
      const result = await dispatch(
        updateProfile({
          name: formData.name.trim(),
          businessName: formData.businessName.trim(),
        })
      );

      if (updateProfile.fulfilled.match(result)) {
        setSaved(true);
      }
    } catch {
      // Redux handles the update error.
    }
  };

  const inputClasses =
    "mt-2 w-full rounded-xl border border-slate-700/80 bg-[#0B0F19] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#151B2B] shadow-lg shadow-black/10">
      <div className="border-b border-slate-800 px-5 py-5 sm:px-7">
        <h2 className="text-lg font-semibold text-slate-100">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Manage your personal and business details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="profile-name"
              className="text-sm font-medium text-slate-300"
            >
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={inputClasses}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="text-sm font-medium text-slate-300"
            >
              Email Address
            </label>

            <input
              id="profile-email"
              type="email"
              name="email"
              value={formData.email}
              disabled
              className={inputClasses}
              autoComplete="email"
            />

            <p className="mt-2 text-xs text-slate-500">
              Your registered email address cannot be changed here.
            </p>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="profile-business"
              className="text-sm font-medium text-slate-300"
            >
              Business Name
            </label>

            <input
              id="profile-business"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your business name"
              className={inputClasses}
              autoComplete="organization"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          >
            {typeof error === "string"
              ? error
              : error.message || "Unable to update your profile. Please try again."}
          </div>
        )}

        {saved && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            Profile updated successfully.
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#151B2B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}

            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileSettings;

