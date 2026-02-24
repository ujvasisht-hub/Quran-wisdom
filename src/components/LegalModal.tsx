import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type LegalType = 'terms' | 'refund';

interface LegalModalProps {
  type: LegalType;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const isTerms = type === 'terms';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-emerald-950/80 backdrop-blur-sm flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="bg-stone-50 rounded-t-3xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-emerald-900/10 flex-shrink-0">
            <h2 className="font-display text-lg text-emerald-900">
              {isTerms ? 'Terms & Conditions' : 'Refund Policy'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-emerald-900/5 transition-colors"
            >
              <X className="w-4 h-4 text-emerald-900/50" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-emerald-900/70 text-sm leading-relaxed">
            {isTerms ? (
              <>
                <p className="text-emerald-900/50 text-xs uppercase tracking-widest font-medium">
                  Effective: February 2026 — Evryday Solutions
                </p>

                <div>
                  <h3 className="text-emerald-900 font-semibold text-sm mb-1">Personal Use Only</h3>
                  <p>
                    All content within Daily Quranic Wisdom — including verses, reflections, inner meanings,
                    and daily actions — is provided for personal spiritual use only. You may not reproduce,
                    distribute, sell, or use any content for commercial purposes without prior written consent
                    from Evryday Solutions.
                  </p>
                </div>

                <div className="h-[1px] bg-emerald-900/8" />

                <div>
                  <h3 className="text-emerald-900 font-semibold text-sm mb-1">No Account Sharing</h3>
                  <p>
                    Your account is for your personal use only. Sharing your account credentials with others,
                    or allowing multiple users to access the app through a single account, is strictly
                    prohibited. We reserve the right to suspend accounts found in violation of this policy.
                  </p>
                </div>

                <div className="h-[1px] bg-emerald-900/8" />

                <div>
                  <h3 className="text-emerald-900 font-semibold text-sm mb-1">App Updates & Changes</h3>
                  <p>
                    Evryday Solutions reserves the right to update, modify, or change app features, content,
                    and functionality at any time. Lifetime Access holders will continue to receive access
                    to the app and its core features as they evolve. Material changes will be communicated
                    through the app.
                  </p>
                </div>

                <div className="h-[1px] bg-emerald-900/8" />

                <div>
                  <h3 className="text-emerald-900 font-semibold text-sm mb-1">Payments</h3>
                  <p>
                    The Lifetime Access fee is ₹899, a single one-time payment. All transactions are
                    processed securely via Razorpay. By completing your purchase, you also agree to
                    Razorpay's terms of service.
                  </p>
                </div>

                <div className="h-[1px] bg-emerald-900/8" />

                <div>
                  <h3 className="text-emerald-900 font-semibold text-sm mb-1">Governing Law</h3>
                  <p>
                    These terms are governed by the laws of India. Any disputes arising from use of this
                    app shall be subject to the jurisdiction of courts in India.
                  </p>
                </div>

                <p className="text-emerald-900/40 text-xs">
                  Questions? Contact us at contact@evrydaysolutions.com
                </p>
              </>
            ) : (
              <>
                <p className="text-emerald-900/50 text-xs uppercase tracking-widest font-medium">
                  Refund Policy — Evryday Solutions
                </p>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60">
                  <p className="text-amber-800 text-sm leading-relaxed font-medium">
                    Due to the immediate digital nature of the Quranic Wisdom content, all lifetime
                    access purchases are final and non-refundable.
                  </p>
                </div>

                <p>
                  We encourage you to take full advantage of the 21-day free trial to explore all
                  features — the daily verse, inner meaning, today's action, and the wisdom archive —
                  before making your purchase decision.
                </p>

                <p>
                  The free trial is designed specifically so you can ensure the app meets your spiritual
                  and personal needs before committing to lifetime access.
                </p>

                <div className="h-[1px] bg-emerald-900/8" />

                <div>
                  <h3 className="text-emerald-900 font-semibold text-sm mb-1">Exceptional Circumstances</h3>
                  <p>
                    In cases of duplicate charges or demonstrable technical errors on our part, please
                    reach out within 7 days of purchase and we will review your case individually.
                  </p>
                </div>

                <p className="text-emerald-900/40 text-xs">
                  Questions? Contact us at contact@evrydaysolutions.com
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
