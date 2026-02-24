import LegalLayout from '../components/LegalLayout';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-emerald-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="February 21, 2026">
      <p>
        Evryday Solutions ("we", "our", or "us") operates the Daily Quranic Wisdom application
        (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard
        your information when you use our App. Please read this policy carefully. By using
        the App, you agree to the collection and use of information in accordance with this policy.
      </p>

      <Section title="1. Information We Collect">
        <p className="mb-3">We collect the following types of information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-900/80">Account Information:</strong> When you create an account,
            we collect your email address and an encrypted password.
          </li>
          <li>
            <strong className="text-emerald-900/80">Payment Information:</strong> When you purchase Lifetime
            Access, payment is processed securely through Razorpay. We do not store your credit card
            or bank details. We only retain the transaction ID and payment status for our records.
          </li>
          <li>
            <strong className="text-emerald-900/80">Usage Data:</strong> We may collect information about
            how you access and use the App, including your device type, operating system, and general
            interaction patterns to improve the experience.
          </li>
          <li>
            <strong className="text-emerald-900/80">Notification Preferences:</strong> If you enable
            notifications, we store your preferred notification time locally on your device.
          </li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p className="mb-3">We use the information we collect to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide, maintain, and improve the App</li>
          <li>Process transactions and send related confirmations</li>
          <li>Manage your account and provide customer support</li>
          <li>Send daily wisdom notifications if you have opted in</li>
          <li>Protect against fraudulent or unauthorized activity</li>
        </ul>
      </Section>

      <Section title="3. Data Storage and Security">
        <p>
          Your data is stored securely using Supabase, a trusted cloud database provider, with
          encryption at rest and in transit. We implement industry-standard security measures
          including Row Level Security policies to ensure your data is only accessible to you.
          While no method of electronic storage is 100% secure, we strive to use commercially
          acceptable means to protect your personal information.
        </p>
      </Section>

      <Section title="4. Third-Party Services">
        <p className="mb-3">We use the following third-party services:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-900/80">Supabase:</strong> For authentication and data storage.
            Their privacy policy can be found at supabase.com/privacy.
          </li>
          <li>
            <strong className="text-emerald-900/80">Razorpay:</strong> For payment processing. Their privacy
            policy can be found at razorpay.com/privacy.
          </li>
        </ul>
        <p className="mt-3">
          We do not sell, trade, or otherwise transfer your personal information to third parties
          for marketing or advertising purposes.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain your personal information for as long as your account is active or as needed
          to provide you services. If you wish to delete your account and associated data, please
          contact us at the email address below. We will delete your data within 30 days of
          receiving your request, except where retention is required by law.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p className="mb-3">Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to or restrict the processing of your data</li>
          <li>Request portability of your data</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us using the details below.
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>
          The App is not intended for use by individuals under the age of 13. We do not knowingly
          collect personal information from children under 13. If we become aware that we have
          collected personal data from a child under 13 without parental consent, we will take
          steps to delete that information.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by posting the new policy within the App and updating the "Last updated" date above.
          You are advised to review this policy periodically for any changes.
        </p>
      </Section>

      <Section title="9. Contact Us">
        <p>
          If you have any questions about this Privacy Policy or your personal data, please
          contact us at:
        </p>
        <div className="mt-3 p-5 rounded-2xl bg-emerald-900/[0.04] border border-emerald-900/[0.06]">
          <p className="font-display text-emerald-900/80">Evryday Solutions</p>
          <p className="mt-1">Email: privacy@evrydaysolutions.com</p>
        </div>
      </Section>
    </LegalLayout>
  );
}
