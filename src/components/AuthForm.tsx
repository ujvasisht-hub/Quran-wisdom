import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Valid format: local-part@domain.tld (domain and TLD at least 2 chars)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return EMAIL_REGEX.test(trimmed);
}

export default function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    const result = mode === 'login'
      ? await signIn(trimmedEmail, password)
      : await signUp(trimmedEmail, password);

    if (result.error) {
      setError(result.error);
    } else if (mode === 'signup') {
      setSuccess('Account created successfully. You can now sign in.');
      setMode('login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-4 pt-safe-top pb-safe-bottom relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-700/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-gold/10 border border-gold/30 flex items-center justify-center"
          >
            <BookOpen className="w-8 h-8 text-gold" />
          </motion.div>
          <h1 className="font-display text-3xl text-ivory mb-2 tracking-wide">
            Daily Quranic Wisdom
          </h1>
          <p className="text-ivory/50 text-sm font-light">
            Begin each day with timeless reflection
          </p>
        </div>

        <div className="glass rounded-4xl p-8 shadow-2xl">
          <div className="flex mb-8 bg-emerald-900/20 rounded-3xl p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-3xl text-sm font-medium transition-all duration-300 ${
                  mode === m
                    ? 'bg-emerald-900 text-ivory shadow-lg'
                    : 'text-emerald-900/60 hover:text-emerald-900'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-ivory/80 rounded-3xl text-emerald-900 placeholder:text-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900/40" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3.5 bg-ivory/80 rounded-3xl text-emerald-900 placeholder:text-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 text-xs px-2"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald-700 text-xs px-2"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-900 text-ivory rounded-3xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-ivory/30 text-xs mt-8">
          {mode === 'signup' ? '21-day free trial included' : 'Welcome back'}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <Link to="/privacy" className="text-ivory/20 text-[10px] hover:text-ivory/40 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-ivory/10 text-[10px]">|</span>
          <Link to="/terms" className="text-ivory/20 text-[10px] hover:text-ivory/40 transition-colors">
            Terms of Service
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
