
import LandingNavbar from '../components/LandingPage/LandingNavbar'

import LandingHero from '../components/LandingPage/LandingHero'
import LandingHighlights from '../components/LandingPage/LandingHighlights'
import LandingFeatures from '../components/LandingPage/LandingFeatures'
import LandingWorkflow from '../components/LandingPage/LandingWorkflow'
import LandingCTA from '../components/LandingPage/LandingCTA'
import LandingFooter from '../components/LandingPage/LandingFooter'

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B0F19] text-[#F1F5F9]">
      {/* Navigation */}
      <LandingNavbar />

      <main>
        {/* Hero section with dashboard preview */}
        <LandingHero />

        {/* Main value propositions */}
        <LandingHighlights />

        {/* Product features */}
        <LandingFeatures />

        {/* How InvoiceIQ works */}
        <LandingWorkflow />

        {/* Final call to action */}
        <LandingCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}

export default LandingPage