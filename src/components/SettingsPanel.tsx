import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, Clock, Check, AlertCircle, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../hooks/useNotifications';
import { LegalModal } from './LegalModal';

interface Props {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: Props) {
  const { profile, updateNotificationTime, user, refreshProfile, trialDaysLeft, isTrialExpired } = useAuth();
  const { permission, requestPermission, scheduleNotification } = useNotifications();
  const [time, setTime] = useState(profile?.notification_time ?? '08:00');
  const [saved, setSaved] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'refund' | null>(null);

  const handleSave = async () => {
    await updateNotificationTime(time);

    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') {
        setNotifError('Notification permission denied. Please enable in browser settings.');
        return;
      }
    }

    setNotifError('');
    await scheduleNotification(time);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEnableNotifications = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      setNotifError('');
      await scheduleNotification(time);
    } else {
      setNotifError('Permission denied. Check your browser notification settings.');
    }
  };

  const handleUpgrade = async () => {
    if (processingPayment || !user) return;

    setProcessingPayment(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { orderId, amount, currency } = await response.json();

      const options = {
        key: razorpayKeyId,
        amount,
        currency,
        name: 'Daily Quranic Wisdom',
        description: 'Lifetime Premium Access',
        order_id: orderId,
        handler: async (response: any) => {
          const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${anonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'verify',
              userId: user.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            if (user?.id) {
              await supabase.from('profiles').update({ is_premium: true }).eq('id', user.id);
            }
            await refreshProfile();
            setPaymentSuccess(true);
            setProcessingPayment(false);
          } else {
            alert('Payment verification failed. Please contact support.');
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          },
        },
        theme: {
          color: '#d4af37',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-emerald-900"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gold/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-screen flex flex-col max-w-lg mx-auto">
        <header className="flex-shrink-0 flex items-center gap-4 px-5 pt-10 pb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-ivory/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-ivory/70" />
          </motion.button>
          <h1 className="font-display text-xl text-ivory">Settings</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-gold rounded-4xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center">
                <Bell className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h3 className="text-ivory font-medium text-sm">Daily Notification</h3>
                <p className="text-ivory/40 text-xs">Receive your daily verse reminder</p>
              </div>
            </div>

            {permission === 'default' && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleEnableNotifications}
                className="w-full py-3 bg-gold/20 text-gold rounded-3xl text-sm font-medium mb-4 hover:bg-gold/30 transition-colors"
              >
                Enable Notifications
              </motion.button>
            )}

            {permission === 'denied' && (
              <div className="flex items-start gap-2 bg-red-500/10 rounded-2xl p-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-xs leading-relaxed">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-ivory/40" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 bg-ivory/10 text-ivory rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 [color-scheme:dark]"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  saved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-ivory text-emerald-900 hover:bg-ivory/90'
                }`}
              >
                {saved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  'Save'
                )}
              </motion.button>
            </div>

            {notifError && (
              <p className="text-red-300 text-xs mt-3">{notifError}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-gold rounded-4xl p-6"
          >
            <h3 className="text-ivory font-medium text-sm mb-3">Account</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-ivory/40 text-xs">Email</span>
                <span className="text-ivory/70 text-xs">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ivory/40 text-xs">Member since</span>
                <span className="text-ivory/70 text-xs">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ivory/40 text-xs">Plan</span>
                <span className="text-gold text-xs font-medium">
                  {profile?.is_premium
                    ? 'Lifetime Premium'
                    : isTrialExpired
                    ? 'Trial Expired'
                    : `Free Trial — ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left`}
                </span>
              </div>
            </div>

            {profile?.is_premium && paymentSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-gold/10 border border-gold/20 flex items-center gap-3"
              >
                <div className="relative flex-shrink-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.cos((i / 6) * Math.PI * 2) * 16,
                        y: Math.sin((i / 6) * Math.PI * 2) * 16,
                      }}
                      transition={{ delay: i * 0.08, duration: 0.8 }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-gold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                  ))}
                  <Star className="w-5 h-5 text-gold fill-gold relative z-10" />
                </div>
                <div>
                  <p className="text-gold text-xs font-semibold">Lifetime Unlocked</p>
                  <p className="text-ivory/50 text-[11px]">Barak Allahu feek. Welcome to the family.</p>
                </div>
              </motion.div>
            )}

            {!profile?.is_premium && (
              <div className="mt-6 space-y-4">
                <div className="h-[1px] bg-ivory/10" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-ivory/70 text-sm font-medium">Lifetime Premium</span>
                    <span className="text-gold text-lg font-bold">₹899</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-ivory/60 text-xs">Every day's verse, forever — past, present & every year ahead</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-ivory/60 text-xs">Daily life-application steps to live the wisdom, not just read it</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-ivory/60 text-xs">A royal, ad-free sanctuary — yours for life</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-ivory/60 text-xs">Pay once, receive guidance every single day, forever</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpgrade}
                    disabled={processingPayment}
                    className="w-full mt-3 py-4 bg-gradient-to-r from-gold to-amber-400 text-emerald-950 rounded-3xl text-sm font-bold hover:shadow-lg hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {processingPayment ? 'Processing...' : 'Get Lifetime Access — ₹899'}
                  </motion.button>

                  <div className="flex items-center justify-center gap-4 pt-1">
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
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center pt-6"
          >
            <p className="text-ivory/20 text-xs">Daily Quranic Wisdom v1.0</p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {legalModal && (
          <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
