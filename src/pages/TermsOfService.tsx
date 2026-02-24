import LegalLayout from '../components/LegalLayout';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-emerald-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="February 21, 2026">
      <p>
        Welcome to Daily Quranic Wisdom, operated by Evryday Solutions ("we", "our", or "us").
        These Terms of Service ("Terms") govern your access to and use of the Daily Quranic Wisdom
        application (the "App"). By accessing or using the App, you agree to be bound by these Terms.
        If you do not agree, please do not use the App.
      </p>

      <Section title="1. Account Registration">
        <p className="mb-3">
          To use the App, you must create an account by providing a valid email address and password.
          You are responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized access or use of your account</li>
        </ul>
        <p className="mt-3">
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>
      </Section>

      <Section title="2. Free Trial and Subscription">
        <p className="mb-3">
          The App offers a 21-day free trial period starting from the date of account creation.
          During the trial, you have full access to all features. After the trial period:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access to daily content will require a Lifetime Access purchase</li>
          <li>
            The Lifetime Access is a one-time payment that grants you permanent access to the App
            and all its features
          </li>
          <li>Pricing is displayed in the App at the time of purchase</li>
        </ul>
      </Section>

      <Section title="3. Payments and Refunds">
        <p className="mb-3">
          All payments are processed securely through Razorpay. By making a purchase, you agree to
          Razorpay's terms of service. The Lifetime Access fee is ₹899 — a single, one-time payment.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-900/80">One-Time Payment:</strong> Lifetime Access is a
            single, non-recurring charge of ₹899. You will not be billed again.
          </li>
          <li>
            <strong className="text-emerald-900/80">Refund Policy:</strong> Due to the immediate
            digital nature of the Quranic Wisdom content, all lifetime access purchases are final
            and non-refundable. Please use the 21-day free trial to ensure the app meets your needs
            before purchasing. In cases of demonstrable technical errors or duplicate charges, please
            contact us within 7 days for individual review.
          </li>
          <li>
            <strong className="text-emerald-900/80">Currency:</strong> All prices are displayed in
            Indian Rupees (INR) unless otherwise noted.
          </li>
        </ul>
      </Section>

      <Section title="4. Intellectual Property &amp; Personal Use">
        <p className="mb-3">
          All content in the App — including but not limited to the curated verses, reflections,
          translations, commentary, design elements, and software — is the property of
          Evryday Solutions or its licensors. Quranic text is in the public domain, but our curated
          reflections, inner meanings, daily actions, and overall presentation are protected by
          copyright.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-900/80">Personal Use Only:</strong> All content within
            Daily Quranic Wisdom is provided for personal spiritual use only. You may not reproduce,
            distribute, sell, or use any content for commercial purposes without prior written
            consent from Evryday Solutions.
          </li>
          <li>
            You may not create derivative works from any content in the App without our prior
            written consent.
          </li>
        </ul>
      </Section>

      <Section title="5. Acceptable Use &amp; Account Sharing">
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the App for any unlawful or prohibited purpose</li>
          <li>Attempt to gain unauthorized access to the App or its systems</li>
          <li>Reverse engineer, decompile, or disassemble any part of the App</li>
          <li>Scrape, harvest, or collect data from the App using automated means</li>
          <li>Interfere with or disrupt the App or its infrastructure</li>
          <li>
            <strong className="text-emerald-900/80">Account Sharing is Prohibited:</strong> Your
            account is for your personal use only. Sharing your account credentials with others, or
            allowing multiple users to access the App through a single account, is strictly
            prohibited. We reserve the right to suspend or terminate accounts found in violation
            of this policy.
          </li>
        </ul>
      </Section>

      <Section title="6. Content Disclaimer">
        <p>
          The reflections, inner meanings, and actions provided in the App are curated for general
          spiritual and personal development purposes. They are not intended as religious rulings
          (fatwa) or as a substitute for guidance from qualified religious scholars. We encourage
          you to consult knowledgeable scholars for specific religious questions. We make reasonable
          efforts to ensure the accuracy of Quranic text and translations, but we do not guarantee
          the absence of errors.
        </p>
      </Section>

      <Section title="7. Availability and Modifications">
        <p className="mb-3">
          We strive to maintain continuous availability of the App, but do not guarantee
          uninterrupted access.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-900/80">Right to Update Features:</strong> Evryday
            Solutions reserves the right to update, modify, or change app features, content, and
            functionality at any time. Lifetime Access holders will continue to receive access to
            the app and its core features as they evolve. Material changes will be communicated
            through the App or via email.
          </li>
          <li>
            We reserve the right to modify, suspend, or discontinue any part of the App at any
            time with reasonable notice. In the event we permanently discontinue the App, Lifetime
            Access holders will be offered a reasonable resolution.
          </li>
        </ul>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, Evryday Solutions shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages arising from
          your use of the App. Our total liability to you for any claims arising from or related
          to the App shall not exceed the amount you paid for your Lifetime Access.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India.
          Any disputes arising from these Terms or your use of the App shall be subject to the
          exclusive jurisdiction of the courts in India.
        </p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>
          We may revise these Terms from time to time. Material changes will be communicated
          through the App or via email. Your continued use of the App after such changes
          constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          If you have questions, concerns, or requests regarding these Terms, please contact us at:
        </p>
        <div className="mt-3 p-5 rounded-2xl bg-emerald-900/[0.04] border border-emerald-900/[0.06]">
          <p className="font-display text-emerald-900/80">Evryday Solutions</p>
          <p className="mt-1">Email: contact@evrydaysolutions.com</p>
        </div>
      </Section>
    </LegalLayout>
  );
}
