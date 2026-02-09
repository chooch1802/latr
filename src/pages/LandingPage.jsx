import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import TrustBanner from '../components/sections/TrustBanner'
import SimplifySection from '../components/sections/SimplifySection'
import FeaturesSection from '../components/sections/FeaturesSection'
import AllPropertiesSection from '../components/sections/AllPropertiesSection'
import AppMockupSection from '../components/sections/AppMockupSection'
import SmartApplySection from '../components/sections/SmartApplySection'
import ApprovalsSection from '../components/sections/ApprovalsSection'
import MoveInSection from '../components/sections/MoveInSection'
import CalculatorSection from '../components/sections/CalculatorSection'
import SocialProofSection from '../components/sections/SocialProofSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" role="main">
        <Hero />
        <TrustBanner />
        <SimplifySection />
        <FeaturesSection />
        <AllPropertiesSection />
        <AppMockupSection />
        <SmartApplySection />
        <ApprovalsSection />
        <MoveInSection />
        <CalculatorSection />
        <SocialProofSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
