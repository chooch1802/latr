import StaticPageLayout from '../components/layout/StaticPageLayout'

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy" lastUpdated="9 February 2026">
      <p>
        LATR Payments Pty Ltd (ABN 36 695 396 386, ACN 695 396 386) ("LATR", "we", "us", or "our") is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your personal information when you use the LATR platform and services.
      </p>
      <p>
        We comply with the Australian Privacy Principles (APPs) under the Privacy Act 1988
        (Cth).
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>Name, email address, phone number, and date of birth.</li>
        <li>Residential address and rental history.</li>
        <li>Employment and income details (for deposit aid eligibility).</li>
        <li>Identity documents for KYC verification.</li>
        <li>Rental application details and preferences.</li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>Device information, browser type, and IP address.</li>
        <li>Usage data such as pages visited and features used.</li>
        <li>Cookies and similar technologies (see our Cookie Policy).</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your personal information to:</p>
      <ul>
        <li>Provide, maintain, and improve the LATR platform.</li>
        <li>Process deposit aid applications and manage repayments.</li>
        <li>Facilitate rental applications to property managers.</li>
        <li>Verify your identity (KYC/AML compliance).</li>
        <li>Send you notifications about your account, applications, and payments.</li>
        <li>Respond to your enquiries and provide customer support.</li>
        <li>Analyse usage patterns to improve our services.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>We may share your information with:</p>
      <ul>
        <li><strong>Property managers and agents</strong> — when you submit a rental application.</li>
        <li><strong>Identity verification providers</strong> — to complete KYC checks.</li>
        <li><strong>Payment processors</strong> — to facilitate deposit aid and repayments.</li>
        <li><strong>Household members</strong> — limited information shared within your household group for bill splitting.</li>
        <li><strong>Legal authorities</strong> — when required by law or to protect our rights.</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>4. Data Security</h2>
      <p>
        We implement industry-standard security measures including encryption in transit
        (TLS) and at rest, access controls, and regular security audits. While we strive
        to protect your data, no method of transmission over the Internet is 100% secure.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is active or as
        needed to provide services, comply with legal obligations, resolve disputes, and
        enforce our agreements. When no longer required, data is securely deleted or
        de-identified.
      </p>

      <h2>6. Your Rights</h2>
      <p>Under Australian privacy law, you have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Request correction of inaccurate information.</li>
        <li>Request deletion of your personal information (subject to legal obligations).</li>
        <li>Opt out of marketing communications.</li>
        <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC).</li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        We use cookies and similar technologies to enhance your experience. For details,
        see our <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for individuals under 18 years of age. We do not
        knowingly collect personal information from children.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of
        significant changes via email or in-app notification. The "Last updated" date
        at the top indicates the most recent revision.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For privacy-related enquiries, contact our Privacy Officer at{' '}
        <a href="mailto:privacy@latrpayments.com">privacy@latrpayments.com</a> or
        visit our <a href="/contact">contact page</a>.
      </p>
    </StaticPageLayout>
  )
}
