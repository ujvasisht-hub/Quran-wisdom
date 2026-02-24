import { useState } from 'react';
import LegalLayout from '../components/LegalLayout';
import { Mail, ArrowRight } from 'lucide-react';

const SUPPORT_EMAIL = 'contact@evrydaysolutions.com';
const SUBJECT = 'Account deletion request - Quran Wisdom';

export default function DeleteAccount() {
  const [email, setEmail] = useState('');

  const body = email.trim()
    ? `Please delete my Quran Wisdom account and associated data.\n\nRegistered email address: ${email.trim()}\n\nI understand that this action is permanent and cannot be undone.`
    : 'Please delete my Quran Wisdom account and associated data. I understand that this action is permanent and cannot be undone.';

  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`;

  return (
    <LegalLayout title="Request account deletion" lastUpdated="February 2026">
      <p>
        You can request deletion of your Quran Wisdom account and the personal data we hold at any time.
        We will process your request within 30 days as described in our{' '}
        <a href="/privacy" className="text-emerald-700 underline hover:no-underline">Privacy Policy</a>.
      </p>

      <section>
        <h2 className="font-display text-xl text-emerald-900 mb-3">How to request deletion</h2>
        <p className="mb-4">
          Send an email to us with the subject &quot;Account deletion request&quot; and include the
          email address associated with your account. You can use the button below to open your
          email client with a pre-filled message.
        </p>

        <div className="rounded-2xl bg-emerald-900/[0.06] border border-emerald-900/10 p-5 space-y-4">
          <label htmlFor="delete-account-email" className="block text-sm font-medium text-emerald-900/80">
            Your registered email (optional but recommended)
          </label>
          <input
            id="delete-account-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-emerald-900/20 bg-ivory/80 text-emerald-900 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm"
          />
          <a
            href={mailtoUrl}
            className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-emerald-900 text-ivory text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Open email to request deletion
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-emerald-900 mb-3">What happens after you request</h2>
        <ul className="list-disc pl-5 space-y-2 text-emerald-900/80">
          <li>We will confirm receipt of your request.</li>
          <li>We will delete your account and associated data within 30 days, except where we must retain data by law.</li>
          <li>Once deleted, you will not be able to recover your account or data.</li>
        </ul>
      </section>

      <section>
        <p className="text-emerald-900/70 text-sm">
          If you prefer not to use email, you may also contact us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-700 underline hover:no-underline">
            {SUPPORT_EMAIL}
          </a>{' '}
          through any channel you have used to reach us before.
        </p>
      </section>
    </LegalLayout>
  );
}
