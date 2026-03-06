import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import AdminShell from './components/admin/AdminShell'

// Loading spinner shown while lazy chunks load
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-3 border-coral-200 border-t-coral-500 rounded-full animate-spin" />
    </div>
  )
}

// Public pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const VerifyPage = lazy(() => import('./pages/VerifyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

// Onboarding
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))

// App pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'))
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'))
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'))
const ApplicationFormPage = lazy(() => import('./pages/ApplicationFormPage'))
const ApplicationDetailPage = lazy(() => import('./pages/ApplicationDetailPage'))
const DepositAidPage = lazy(() => import('./pages/DepositAidPage'))
const DepositCalculatorPage = lazy(() => import('./pages/DepositCalculatorPage'))
const DepositApplyPage = lazy(() => import('./pages/DepositApplyPage'))
const DepositConfirmPage = lazy(() => import('./pages/DepositConfirmPage'))
const DepositDetailPage = lazy(() => import('./pages/DepositDetailPage'))
const RoundUpPage = lazy(() => import('./pages/RoundUpPage'))
const RoundUpSetupPage = lazy(() => import('./pages/RoundUpSetupPage'))
const HouseholdPage = lazy(() => import('./pages/HouseholdPage'))
const CreateHouseholdPage = lazy(() => import('./pages/CreateHouseholdPage'))
const ManageHouseholdPage = lazy(() => import('./pages/ManageHouseholdPage'))
const BillsPage = lazy(() => import('./pages/BillsPage'))
const AddBillPage = lazy(() => import('./pages/AddBillPage'))
const BillDetailPage = lazy(() => import('./pages/BillDetailPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Rewards pages
const RewardsPage = lazy(() => import('./pages/RewardsPage'))
const RewardsHistoryPage = lazy(() => import('./pages/RewardsHistoryPage'))
const ReferralPage = lazy(() => import('./pages/ReferralPage'))
const RentDayPage = lazy(() => import('./pages/RentDayPage'))
const RedeemPage = lazy(() => import('./pages/RedeemPage'))
const RedeemDetailPage = lazy(() => import('./pages/RedeemDetailPage'))
const RedemptionsPage = lazy(() => import('./pages/RedemptionsPage'))
const NeighbourhoodPage = lazy(() => import('./pages/NeighbourhoodPage'))
const PartnerDetailPage = lazy(() => import('./pages/PartnerDetailPage'))
const TierUpgradePage = lazy(() => import('./pages/TierUpgradePage'))

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage'))
const AdminApplicationDetailPage = lazy(() => import('./pages/admin/AdminApplicationDetailPage'))
const AdminDepositsPage = lazy(() => import('./pages/admin/AdminDepositsPage'))
const AdminDepositDetailPage = lazy(() => import('./pages/admin/AdminDepositDetailPage'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminRewardsPage = lazy(() => import('./pages/admin/AdminRewardsPage'))
const AdminPointsPage = lazy(() => import('./pages/admin/AdminPointsPage'))
const AdminRentDayPage = lazy(() => import('./pages/admin/AdminRentDayPage'))
const AdminPartnersPage = lazy(() => import('./pages/admin/AdminPartnersPage'))
const AdminRedemptionsPage = lazy(() => import('./pages/admin/AdminRedemptionsPage'))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Protected — onboarding (no AppShell, no onboarding requirement) */}
        <Route element={<ProtectedRoute requireOnboarding={false} />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Protected — main app (requires completed onboarding) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/apply" element={<ApplicationsPage />} />
            <Route path="/apply/new/:propertyId" element={<ApplicationFormPage />} />
            <Route path="/apply/:id" element={<ApplicationDetailPage />} />
            <Route path="/deposit-aid" element={<DepositAidPage />} />
            <Route path="/deposit-calculator" element={<DepositCalculatorPage />} />
            <Route path="/deposit-aid/apply" element={<DepositApplyPage />} />
            <Route path="/deposit-aid/confirm/:id" element={<DepositConfirmPage />} />
            <Route path="/deposit-aid/:id" element={<DepositDetailPage />} />
            <Route path="/round-up" element={<RoundUpPage />} />
            <Route path="/round-up/setup" element={<RoundUpSetupPage />} />
            <Route path="/household" element={<HouseholdPage />} />
            <Route path="/household/create" element={<CreateHouseholdPage />} />
            <Route path="/household/:id/manage" element={<ManageHouseholdPage />} />
            <Route path="/household/bills" element={<BillsPage />} />
            <Route path="/household/bills/add" element={<AddBillPage />} />
            <Route path="/household/bills/:id" element={<BillDetailPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/rewards/history" element={<RewardsHistoryPage />} />
            <Route path="/rewards/refer" element={<ReferralPage />} />
            <Route path="/rewards/rent-day" element={<RentDayPage />} />
            <Route path="/rewards/redeem" element={<RedeemPage />} />
            <Route path="/rewards/redeem/:id" element={<RedeemDetailPage />} />
            <Route path="/rewards/redemptions" element={<RedemptionsPage />} />
            <Route path="/rewards/upgrade" element={<TierUpgradePage />} />
            <Route path="/rewards/neighbourhood" element={<NeighbourhoodPage />} />
            <Route path="/rewards/neighbourhood/:id" element={<PartnerDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<AdminShell />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/applications" element={<AdminApplicationsPage />} />
            <Route path="/admin/applications/:id" element={<AdminApplicationDetailPage />} />
            <Route path="/admin/deposits" element={<AdminDepositsPage />} />
            <Route path="/admin/deposits/:id" element={<AdminDepositDetailPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/rewards" element={<AdminRewardsPage />} />
            <Route path="/admin/rewards/points" element={<AdminPointsPage />} />
            <Route path="/admin/rewards/rent-day" element={<AdminRentDayPage />} />
            <Route path="/admin/rewards/partners" element={<AdminPartnersPage />} />
            <Route path="/admin/rewards/redemptions" element={<AdminRedemptionsPage />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
