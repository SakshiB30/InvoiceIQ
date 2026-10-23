import SettingsHeader from '../components/settings/SettingsHeader'
import ProfileSettings from '../components/settings/ProfileSettings'
import PreferencesSettings from '../components/settings/PreferencesSettings'

function Settings() {
  return (
    <main className="min-h-full space-y-6 pb-8 text-slate-100">
      <SettingsHeader />

      <section aria-label="Profile settings">
        <ProfileSettings />
      </section>

      <section aria-label="Preference settings">
        <PreferencesSettings />
      </section>
    </main>
  )
}

export default Settings
