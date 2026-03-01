export const SUPABASE_URL = 'https://pblmlpjzowlicjevqgir.supabase.co'

export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
export const TEST_ADMIN_ID = '00000000-0000-0000-0000-000000000099'

export const TEST_USER = {
  id: TEST_USER_ID,
  phone: '+61412345678',
  created_at: '2025-01-15T00:00:00Z',
  app_metadata: { provider: 'phone' },
  user_metadata: { first_name: 'Jane', last_name: 'Doe' },
  aud: 'authenticated',
  role: 'authenticated',
}

export const TEST_PROFILE = {
  id: TEST_USER_ID,
  first_name: 'Jane',
  last_name: 'Doe',
  phone: '+61412345678',
  date_of_birth: '1995-06-15',
  onboarding_step: 5,
  role: 'user',
  kyc_status: 'verified',
  basiq_user_id: 'basiq_test_user',
  stripe_customer_id: 'cus_test_123',
  created_at: '2025-01-15T00:00:00Z',
}

export const TEST_PROFILE_NEW = {
  ...TEST_PROFILE,
  onboarding_step: 0,
  kyc_status: null,
  basiq_user_id: null,
  stripe_customer_id: null,
}

export const TEST_PROFILE_PARTIAL_ONBOARDING = {
  ...TEST_PROFILE,
  onboarding_step: 1,
  kyc_status: null,
  basiq_user_id: null,
}

export const TEST_ADMIN_PROFILE = {
  ...TEST_PROFILE,
  id: TEST_ADMIN_ID,
  first_name: 'Admin',
  last_name: 'User',
  role: 'admin',
}

export const TEST_SESSION = {
  access_token: 'test-access-token-xyz',
  refresh_token: 'test-refresh-token-xyz',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: TEST_USER,
}

export const TEST_APPLICATIONS = [
  {
    id: 'app-001',
    user_id: TEST_USER_ID,
    property_address_line_1: '42 Harbour Street',
    property_suburb: 'Sydney',
    property_state: 'NSW',
    property_postcode: '2000',
    deposit_amount: 2400,
    weekly_rent: 600,
    status: 'approved',
    created_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'app-002',
    user_id: TEST_USER_ID,
    property_address_line_1: '10 Collins Street',
    property_suburb: 'Melbourne',
    property_state: 'VIC',
    property_postcode: '3000',
    deposit_amount: 3200,
    weekly_rent: 800,
    status: 'pending',
    created_at: '2025-02-10T00:00:00Z',
  },
]

export const TEST_DEPOSIT_APPLICATIONS = [
  {
    id: 'dep-001',
    user_id: TEST_USER_ID,
    application_id: 'app-001',
    applicant_type: 'personal',
    deposit_amount: 2400,
    plan_weeks: 52,
    weekly_payment: 50.77,
    total_repayment: 2640,
    setup_fee: 99,
    interest_rate: 0.1,
    status: 'active',
    credit_score: 75,
    credit_limit: 50000,
    created_at: '2025-02-05T00:00:00Z',
  },
]

export const TEST_BANK_ACCOUNTS = [
  {
    id: 'acc-001',
    name: 'Everyday Account',
    institution: 'Commonwealth Bank',
    accountNo: '****1234',
    balance: 4520.5,
    availableFunds: 4520.5,
    type: 'transaction',
  },
  {
    id: 'acc-002',
    name: 'Savings Account',
    institution: 'Commonwealth Bank',
    accountNo: '****5678',
    balance: 12300.0,
    availableFunds: 12300.0,
    type: 'savings',
  },
]

export const TEST_TRANSACTIONS = [
  {
    id: 'txn-001',
    description: 'Woolworths',
    amount: -85.4,
    postDate: '2025-02-20',
    account: 'acc-001',
  },
  {
    id: 'txn-002',
    description: 'Salary - Acme Corp',
    amount: 3200.0,
    postDate: '2025-02-15',
    account: 'acc-001',
  },
  {
    id: 'txn-003',
    description: 'Netflix',
    amount: -22.99,
    postDate: '2025-02-14',
    account: 'acc-001',
  },
]

export const TEST_ASSESSMENT = {
  approved: true,
  score: 75,
  creditLimit: 50000,
  monthlyIncome: 6400,
  monthlyExpenses: 3200,
  netCashFlow: 3200,
  factors: [
    { label: 'Income stability', rating: 'good' },
    { label: 'Savings ratio', rating: 'good' },
    { label: 'Expense patterns', rating: 'fair' },
    { label: 'Account tenure', rating: 'neutral' },
  ],
}

export const TEST_BUSINESS_VERIFICATION = {
  overallStatus: 'passed',
  overallScore: 85,
  abn: { status: 'active', entityName: 'Test Pty Ltd', abn: '12345678901' },
  asic: { status: 'registered', entityType: 'Australian Proprietary Company' },
  equifax: { score: 700, riskLevel: 'low' },
  creditorWatch: { score: 800, riskLevel: 'very_low' },
}
