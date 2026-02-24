import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Star, BookOpen, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LegalModal } from './LegalModal';
import { useRazorpay } from '../hooks/useRazorpay';

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center justify-center text-center px-8 py-12"
    >
      <div className="relative mb-8">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: Math.cos((i / 8) * Math.PI * 2) * 60,
              y: Math.sin((i / 8) * Math.PI * 2) * 60,
            }}
            transition={{ delay: 0.3 + i * 0.08, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
            className="absolute w-2 h-2 rounded-full bg-gold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 12 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-amber-400/20 border-2 border-gold/50 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-gold" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gold/80 text-xs font-medium tracking-[0.3em] uppercase mb-3">
          Welcome to the Family
        </p>
        <h2 className="font-display text-3xl text-ivory mb-4 leading-tight">
          Lifetime Access<br />Unlocked
        </h2>
        <p className="text-ivory/50 text-sm leading-relaxed max-w-xs mx-auto">
          Barak Allahu feek. You now have unlimited access to every verse, reflection, and action — today and every day, forever.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/20"
      >
        <Star className="w-3.5 h-3.5 text-gold fill-gold" />
        <span className="text-gold/80 text-xs font-medium">Lifetime Member</span>
        <Star className="w-3.5 h-3.5 text-gold fill-gold" />
      </motion.div>
    </motion.div>
  );
}

export default function Paywall() {
  const { signOut, user, refreshProfile, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'refund' | null>(null);
  const { scriptReady } = useRazorpay();

  if (profile?.is_premium) {
    return (
      <div className="min-h-screen bg-emerald-900 relative overflow-hidden flex items-center justify-center p-5">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-40 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-md w-full">
          <SuccessScreen />
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!scriptReady || !window.Razorpay) {
      alert('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      console.error('[Razorpay] VITE_RAZORPAY_KEY_ID is missing from environment variables. Add it to your .env file.');
      alert('Payment is not configured. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('[Razorpay] Creating order...');

      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id, email: user?.email }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[Razorpay] create-checkout failed:', response.status, errorBody);
        alert('Failed to initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      const { orderId, amount, currency } = await response.json();
      console.log('[Razorpay] Order created:', orderId);

      const options = {
        key: razorpayKeyId,
        amount,
        currency,
        name: 'Daily Quranic Wisdom',
        description: 'Lifetime Access — ₹899',
        order_id: orderId,
        handler: async (resp: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          console.log('[Razorpay] Payment captured, verifying...');
          const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${anonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'verify',
              userId: user?.id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpayOrderId: resp.razorpay_order_id,
              razorpaySignature: resp.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            console.log('[Razorpay] Payment verified successfully.');
            if (user?.id) {
              await supabase.from('profiles').update({ is_premium: true }).eq('id', user.id);
            }
            await refreshProfile();
          } else {
            const verifyError = await verifyResponse.text();
            console.error('[Razorpay] Verification failed:', verifyResponse.status, verifyError);
            alert('Payment verification failed. Please contact support at contact@evrydaysolutions.com');
          }
          setLoading(false);
        },
        prefill: {
          email: user?.email ?? '',
        },
        theme: {
          color: '#064e3b',
        },
        modal: {
          ondismiss: () => {
            console.log('[Razorpay] Checkout modal dismissed.');
            setLoading(false);
          },
          confirm_close: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('[Razorpay] Unexpected error during checkout:', err);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const benefits = [
    { icon: BookOpen, text: "Every day's verse, forever — past, present & every year ahead" },
    { icon: Heart, text: 'Daily life-application steps to live the wisdom, not just read it' },
    { icon: Star, text: 'A royal, ad-free sanctuary — yours for life' },
    { icon: Sparkles, text: 'Pay once, receive guidance every single day, forever' },
  ];

  return (
    <div className="min-h-screen bg-emerald-900 relative overflow-hidden flex items-center justify-center p-5 pt-safe-top pb-safe-bottom">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-40 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center"
          >
            <Lock className="w-8 h-8 text-gold" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl text-ivory mb-3">
            Unlock Lifetime Wisdom
          </h1>
          <p className="text-ivory/50 text-sm max-w-xs mx-auto leading-relaxed">
            Your 21-day journey has shown you a glimpse. Unlock the complete experience forever.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-gold rounded-4xl p-8 text-center"
        >
          <div className="mb-6">
            <p className="text-ivory/50 text-xs tracking-widest uppercase mb-2">
              Lifetime Premium Access
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-display text-5xl text-ivory">₹899</span>
            </div>
            <p className="text-ivory/40 text-xs mt-2">One-time payment only</p>
          </div>

          <div className="space-y-3 mb-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-3.5 h-3.5 text-gold" />
                </div>
                <p className="text-ivory/80 text-sm text-left">{benefit.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={loading || !scriptReady}
            className="w-full py-4 bg-gradient-to-r from-gold to-amber-400 text-emerald-950 rounded-3xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || !scriptReady ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Lifetime Access — ₹899
              </>
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setLegalModal('terms')}
              className="text-ivory/30 text-xs hover:text-ivory/55 transition-colors underline underline-offset-2"
            >
              Terms & Conditions
            </button>
            <span className="text-ivory/15 text-xs">•</span>
            <button
              onClick={() => setLegalModal('refund')}
              className="text-ivory/30 text-xs hover:text-ivory/55 transition-colors underline underline-offset-2"
            >
              Refund Policy
            </button>
          </div>

          <p className="text-ivory/20 text-[10px] mt-3">
            Secure payment powered by Razorpay
          </p>
        </motion.div>

        <button
          onClick={signOut}
          className="w-full text-center text-ivory/30 text-xs mt-6 hover:text-ivory/50 transition-colors"
        >
          Sign out
        </button>
      </motion.div>

      <AnimatePresence>
        {legalModal && (
          <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
