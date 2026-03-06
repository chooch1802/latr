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
import RewardsSection from '../components/sections/RewardsSection'
import SocialProofSection from '../components/sections/SocialProofSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" role="main">
        <Hero />

        {/* Multi-layer organic wave transition */}
        <div
          className="relative -mt-1 overflow-hidden"
          style={{ background: 'linear-gradient(to bottom right, #FF5A3D, #FF8A65, #FFB4A3)' }}
        >
          {/* Soft center glow for depth */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
          />

          <svg
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            className="relative w-full h-20 sm:h-28 md:h-36 lg:h-44 block"
          >
            <defs>
              <linearGradient id="wave-back" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF5A3D" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#FF7050" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FF8A65" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="wave-mid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF5A3D" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#FF7050" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF8A65" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="wave-front" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF5A3D" />
                <stop offset="100%" stopColor="#FF8A65" />
              </linearGradient>
            </defs>

            {/* Layer 1 — furthest back, sweeping organic curve */}
            <path
              d="M0,100 C240,40 480,140 720,60 C960,0 1200,80 1440,40 L1440,200 L0,200 Z"
              fill="url(#wave-back)"
            />

            {/* Layer 2 — mid-depth, flowing S-curve */}
            <path
              d="M0,130 C180,80 420,160 720,100 C1020,40 1260,120 1440,80 L1440,200 L0,200 Z"
              fill="url(#wave-mid)"
            />

            {/* Layer 3 — front, full opacity, gentle clean edge */}
            <path
              d="M0,160 C300,130 540,180 780,140 C1020,100 1260,160 1440,130 L1440,200 L0,200 Z"
              fill="url(#wave-front)"
            />
          </svg>
        </div>

        <TrustBanner />

        {/* Wave: TrustBanner → SimplifySection (coral → white) */}
        <div
          className="relative -mt-px overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #FF5A3D 0%, #FF8A65 100%)' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,255,255,0.14) 0%, transparent 60%)' }}
          />
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="relative w-full h-20 sm:h-28 md:h-36 lg:h-44 block">
            <path d="M0,90 C320,150 640,30 960,110 C1120,150 1320,40 1440,80 L1440,200 L0,200 Z" fill="#FFFFFF" fillOpacity="0.15" />
            <path d="M0,120 C240,70 540,160 840,90 C1080,30 1320,110 1440,70 L1440,200 L0,200 Z" fill="#FFFFFF" fillOpacity="0.4" />
            <path d="M0,155 C360,125 660,180 960,140 C1140,115 1340,160 1440,130 L1440,200 L0,200 Z" fill="#FFFFFF" fillOpacity="1" />
          </svg>
        </div>

        <SimplifySection />
        <FeaturesSection />
        <AllPropertiesSection />
        <AppMockupSection />
        <SmartApplySection />
        <ApprovalsSection />
        <MoveInSection />
        <CalculatorSection />

        {/* Wave: CalculatorSection → RewardsSection (white → deep purple) */}
        <div className="relative -mt-px overflow-hidden bg-white">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(11,5,23,0.06) 0%, transparent 60%)' }}
          />
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="relative w-full h-20 sm:h-28 md:h-36 lg:h-44 block">
            <path d="M0,80 C360,140 720,20 1080,100 C1260,140 1380,60 1440,90 L1440,200 L0,200 Z" fill="#0B0517" fillOpacity="0.07" />
            <path d="M0,110 C280,60 560,150 840,80 C1080,20 1300,100 1440,60 L1440,200 L0,200 Z" fill="#0B0517" fillOpacity="0.25" />
            <path d="M0,150 C240,170 480,125 780,155 C1020,175 1200,135 1440,145 L1440,200 L0,200 Z" fill="#0B0517" fillOpacity="1" />
          </svg>
        </div>

        <RewardsSection />

        {/* Gradient transition: Rewards → RoundUp */}
        <div className="relative h-16 md:h-24" style={{ background: 'linear-gradient(180deg, #0B0517 0%, #060D1B 100%)' }}>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-40 h-px bg-gradient-to-r from-transparent via-coral-500/20 to-transparent" />
        </div>

        <RoundUpSection />

        {/* Wave: RoundUpSection → SocialProofSection (navy → white) */}
        <div
          className="relative -mt-px overflow-hidden"
          style={{ background: '#060D1B' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
          />
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="relative w-full h-20 sm:h-28 md:h-36 lg:h-44 block">
            <path d="M0,110 C200,30 500,150 780,50 C1000,0 1240,100 1440,60 L1440,200 L0,200 Z" fill="#FFFFFF" fillOpacity="0.1" />
            <path d="M0,140 C300,90 600,170 900,110 C1100,60 1350,130 1440,90 L1440,200 L0,200 Z" fill="#FFFFFF" fillOpacity="0.3" />
            <path d="M0,165 C280,140 560,185 840,150 C1060,125 1300,170 1440,145 L1440,200 L0,200 Z" fill="#FFFFFF" fillOpacity="1" />
          </svg>
        </div>

        <SocialProofSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
