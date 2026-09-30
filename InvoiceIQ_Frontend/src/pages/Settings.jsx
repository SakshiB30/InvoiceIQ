import SettingsHeader from '../components/settings/SettingsHeader'
import ProfileSettings from '../components/settings/ProfileSettings'
import PreferencesSettings from '../components/settings/PreferencesSettings'

function Settings() {
  return (
    <div className="space-y-6">
      <SettingsHeader />

      <ProfileSettings />

      <PreferencesSettings />
    </div>
  )
}

export default Settings