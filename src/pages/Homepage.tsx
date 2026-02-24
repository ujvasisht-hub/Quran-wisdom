import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Quote, Lightbulb, Sparkles } from 'lucide-react';

// Public site: https://quranwisdom.evrydaysolutions.com (domain is evrydaysolutions, not everydaysolutions)
// Main app is hosted on Bolt; custom URL: app.evrydaysolutions.com
const BOLT_APP_URL = 'https://app.evrydaysolutions.com/';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.evrydaysolutions.wisdom';
const APP_STORE_URL = '#'; // TODO: Add App Store link when available

export default function Homepage() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Stay inside the native app: go to the bundled in-app experience (no redirect to web)
      window.location.href = '/app';
    }
  }, []);

  return (
    <div className="min-h-screen bg-pattern-emerald text-ivory relative overflow-hidden">
      {/* Soft orbs over pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-emerald-700/30 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 pt-3 pb-4 px-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Quran Wisdom"
              className="h-10 w-10 rounded-xl object-contain flex-shrink-0"
            />
            <span className="font-display text-lg text-ivory">Quran Wisdom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-ivory/50 text-xs hover:text-ivory/80 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-ivory/50 text-xs hover:text-ivory/80 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-5 pb-24">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-6 pb-10"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden border border-gold/30 shadow-lg"
          >
            <img
              src="/logo.png"
              alt="Daily Quranic Wisdom"
              className="w-full h-full object-contain"
            />
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl text-ivory mb-4 tracking-wide">
            Daily Quranic Wisdom
          </h1>
          <p className="text-ivory/70 text-lg max-w-md mx-auto mb-10">
            Begin each day with timeless reflection — a verse, its meaning, and one good thing to live by.
          </p>

          {/* Get the app — primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 py-3.5 px-6 rounded-3xl bg-ivory/10 border border-ivory/20 hover:bg-ivory/15 transition-colors text-ivory text-sm font-medium"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              Google Play
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 py-3.5 px-6 rounded-3xl border text-sm font-medium transition-colors ${
                APP_STORE_URL === '#'
                  ? 'bg-ivory/5 border-ivory/10 text-ivory/40 cursor-not-allowed'
                  : 'bg-ivory/10 border-ivory/20 hover:bg-ivory/15 text-ivory'
              }`}
              onClick={e => APP_STORE_URL === '#' && e.preventDefault()}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store {APP_STORE_URL === '#' && '(coming soon)'}
            </a>
          </div>
        </motion.section>

        {/* App screenshot — status bar cropped out via object-position */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="rounded-3xl overflow-hidden border border-gold/20 shadow-2xl max-w-sm mx-auto bg-emerald-900/50">
            <div className="aspect-[9/19.5] overflow-hidden">
              <img
                src="/app-screenshot.png"
                alt="Daily Quranic Wisdom app"
                className="w-full h-full object-cover object-[center_12%]"
              />
            </div>
          </div>
        </motion.section>

        {/* What you get */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="font-display text-2xl md:text-3xl text-ivory text-center mb-10">
            What you get every day
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-emerald-900/60 border border-gold/10 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Quote className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-lg text-ivory mb-2">A verse from the Quran</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                A carefully chosen verse to start your day with clarity and purpose.
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-900/60 border border-gold/10 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-lg text-ivory mb-2">What it means</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                A clear explanation of the verse so you can reflect on its wisdom.
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-900/60 border border-gold/10 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gold/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-lg text-ivory mb-2">One good thing today</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                A simple, actionable step to bring the verse into your day.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-ivory/10 text-center">
          <p className="text-ivory/40 text-xs mb-4">Evryday Solutions — Building tools for mindful living</p>
          <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
            <Link to="/privacy" className="text-ivory/40 hover:text-ivory/70 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-ivory/20">|</span>
            <Link to="/terms" className="text-ivory/40 hover:text-ivory/70 transition-colors">
              Terms of Service
            </Link>
            <span className="text-ivory/20">|</span>
            <Link to="/delete-account" className="text-ivory/40 hover:text-ivory/70 transition-colors">
              Delete account
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
