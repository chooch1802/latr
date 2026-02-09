import StaticPageLayout from '../components/layout/StaticPageLayout'

export default function CookiePolicyPage() {
  return (
    <StaticPageLayout title="Cookie Policy" lastUpdated="9 February 2026">
      <p>
        This Cookie Policy explains how LATR Payments Pty Ltd ("LATR", "we", "us") uses
        cookies and similar technologies when you visit or use our platform.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They
        help the site remember your preferences and understand how you interact with it.
      </p>

      <h2>2. Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>
        Required for the platform to function. These handle authentication, security tokens,
        and session management. You cannot opt out of these cookies.
      </p>
      <h3>Analytics Cookies</h3>
      <p>
        Help us understand how visitors interact with LATR so we can improve the experience.
        These collect anonymous usage data such as pages visited and time spent.
      </p>
      <h3>Preference Cookies</h3>
      <p>
        Remember your settings and preferences (e.g. notification preferences, theme
        selection) so you don&apos;t have to re-enter them each visit.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        We may use third-party services that set their own cookies, including:
      </p>
      <ul>
        <li><strong>Supabase</strong> — authentication and session management.</li>
        <li><strong>Google Fonts</strong> — font delivery (no tracking cookies).</li>
      </ul>
      <p>
        We do not use advertising or tracking cookies.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Most browsers allow you to
        block or delete cookies. Note that disabling essential cookies may prevent parts of
        the platform from functioning correctly.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Changes will be posted on this
        page with an updated "Last updated" date.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about our use of cookies? Contact us at{' '}
        <a href="mailto:privacy@latrpayments.com">privacy@latrpayments.com</a>.
      </p>
    </StaticPageLayout>
  )
}
