import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Welcome() {
  const [appLink, setAppLink] = useState('com.evrydaysolutions.wisdom://login-callback');

  useEffect(() => {
    // Grab the secure Supabase tokens from the URL
    const hash = window.location.hash;
    
    if (hash) {
      // Combine your app's deep link with the secure tokens
      const deepLink = `com.evrydaysolutions.wisdom://login-callback${hash}`;
      setAppLink(deepLink);

      // Automatically try to open the app after 5 seconds
      const timer = setTimeout(() => {
        window.location.href = deepLink;
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-700/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10 text-center glass rounded-4xl p-8 shadow-2xl"
      >
        <h1 className="font-display text-3xl text-ivory mb-4 tracking-wide">
          Email Confirmed! 🎉
        </h1>
        <p className="text-ivory/80 text-sm font-light mb-8 leading-relaxed">
          Welcome to <strong>Quran Wisdom</strong>. Your lifetime free subscription is now active, giving you access to daily wisdom and basic features.
        </p>

        <a 
          href={appLink}
          className="w-full block py-4 bg-emerald-950 text-ivory rounded-3xl font-medium text-sm hover:bg-emerald-800 transition-colors border border-gold/30 shadow-lg mb-8"
        >
          Open App to Continue
        </a>

        <div className="p-5 bg-emerald-950/50 rounded-3xl border border-ivory/10">
          <p className="text-gold font-medium mb-2">Ready for more?</p>
          <p className="text-ivory/60 text-xs leading-relaxed">
            Upgrade to <strong>Lifetime Premium</strong> for only ₹899 inside the app to unlock the full library and an ad-free experience forever.
          </p>
        </div>
      </motion.div>
    </div>
  );
}