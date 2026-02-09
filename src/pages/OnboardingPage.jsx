import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ProfileSetupStep from '../components/onboarding/ProfileSetupStep'
import KYCVerificationStep from '../components/onboarding/KYCVerificationStep'
import BankConnectionStep from '../components/onboarding/BankConnectionStep'
import CreditAssessmentStep from '../components/onboarding/CreditAssessmentStep'

const steps = [
  { label: 'Profile', number: 1 },
  { label: 'Verify ID', number: 2 },
  { label: 'Bank', number: 3 },
  { label: 'Assessment', number: 4 },
]

export default function OnboardingPage() {
  const { profile, isOnboardingComplete, refreshProfile } = useAuth()
  const navigate = useNavigate()

  // Start from where the user left off (clamped to 1-4)
  const savedStep = profile?.onboarding_step || 0
  const [currentStep, setCurrentStep] = useState(Math.max(1, Math.min(savedStep + 1, 4)))

  useEffect(() => {
    if (isOnboardingComplete) {
      navigate('/dashboard', { replace: true })
    }
  }, [isOnboardingComplete, navigate])

  async function handleStepComplete() {
    await refreshProfile()
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-navy">LATR</span>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
      </header>

      {/* Progress stepper */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep > step.number
                      ? 'bg-emerald-500 text-white'
                      : currentStep === step.number
                        ? 'bg-coral-500 text-white shadow-coral'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium ${
                    currentStep >= step.number ? 'text-navy' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-[-18px] transition-colors ${
                    currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
          {currentStep === 1 && (
            <ProfileSetupStep onComplete={handleStepComplete} />
          )}
          {currentStep === 2 && (
            <KYCVerificationStep onComplete={handleStepComplete} />
          )}
          {currentStep === 3 && (
            <BankConnectionStep onComplete={handleStepComplete} />
          )}
          {currentStep === 4 && (
            <CreditAssessmentStep onComplete={handleStepComplete} />
          )}
        </div>
      </div>
    </div>
  )
}
