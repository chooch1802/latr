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
import RoundUpSection from '../components/sections/RoundUpSection'
import SocialProofSection from '../components/sections/SocialProofSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" role="main">
        <Hero />

        {/* Curved wave transition from hero to trust banner */}
        <div className="-mt-px" style={{ background: 'linear-gradient(to right, #FF8A65, #FFB4A3)' }}>
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="w-full h-12 md:h-16 lg:h-20 block"
          >
            <defs>
              <linearGradient id="hero-trust-wave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF5A3D" />
                <stop offset="100%" stopColor="#FF8A65" />
              </linearGradient>
            </defs>
            <path d="M0,50 Q720,0 1440,50 L1440,100 L0,100 Z" fill="url(#hero-trust-wave)" />
          </svg>
        </div>

        <TrustBanner />
        <SimplifySection />
        <FeaturesSection />
        <AllPropertiesSection />
        <AppMockupSection />
        <SmartApplySection />
        <ApprovalsSection />
        <MoveInSection />
        <CalculatorSection />
        <RoundUpSection />
        <SocialProofSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
