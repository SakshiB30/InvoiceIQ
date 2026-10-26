import LandingNavbar from '../components/LandingPage/LandingNavbar'

import CurGlow from '../components/LandingPage/CurGlow'
import LandingHero from '../components/LandingPage/LandingHero'
import LandingHighlights from '../components/LandingPage/LandingHighlights'
import LandingFeatures from '../components/LandingPage/LandingFeatures'
import LandingWorkflow from '../components/LandingPage/LandingWorkflow'
import LandingCTA from '../components/LandingPage/LandingCTA'
import LandingFooter from '../components/LandingPage/LandingFooter'

import '../components/LandingPage/landing.css'

function LandingPage() {
  return (
    <div className="iq-landing relative min-h-screen overflow-x-clip bg-[#070A12] text-[#F1F5F9]">
      <CurGlow />
      <LandingNavbar />

      <main className="relative z-10">
        <LandingHero />
        <LandingHighlights />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  )
}

export default LandingPage