import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-emerald-900 text-ivory relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-emerald-700/30 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 bg-emerald-900/80 backdrop-blur-xl border-b border-ivory/10 pt-safe-top">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-2xl bg-ivory/10 flex items-center justify-center hover:bg-ivory/20 transition-colors"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-ivory" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-gold" />
            </div>
            <span className="font-display text-sm text-ivory/80">Quran Wisdom</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-5 py-8 pb-safe-bottom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden bg-ivory/95 backdrop-blur shadow-2xl border border-gold/10"
        >
          <div className="p-6 md:p-10">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-900/10 mb-4">
                <span className="text-[10px] tracking-[0.2em] uppercase text-emerald-900/60 font-medium">
                  Legal
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-emerald-900 mb-2 leading-tight">
                {title}
              </h1>
              <p className="text-emerald-900/50 text-sm">
                Last updated: {lastUpdated}
              </p>
            </div>

            <div className="legal-content space-y-8 text-emerald-900/80 text-[15px] leading-relaxed">
              {children}
            </div>

            <div className="mt-12 pt-8 border-t border-emerald-900/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-emerald-900/90">Evryday Solutions</p>
                  <p className="text-emerald-900/50 text-xs mt-1">Building tools for mindful living</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Link
                    to="/privacy"
                    className="text-sm text-emerald-900/60 hover:text-emerald-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-emerald-900/30">|</span>
                  <Link
                    to="/terms"
                    className="text-sm text-emerald-900/60 hover:text-emerald-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <span className="text-emerald-900/30">|</span>
                  <Link
                    to="/delete-account"
                    className="text-sm text-emerald-900/60 hover:text-emerald-900 transition-colors"
                  >
                    Delete account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
