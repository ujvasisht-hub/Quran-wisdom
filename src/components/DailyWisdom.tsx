import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Sparkles, BookOpen, Heart, ChevronDown, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getWisdomForDate, getFormattedDate } from '../data';
import type { DailyWisdom as DailyWisdomType } from '../data';

const NATURE_GRADIENTS = [
  'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #0f766e 100%)',
  'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #115e59 100%)',
  'linear-gradient(150deg, #064e3b 0%, #0d9488 50%, #022c22 100%)',
  'linear-gradient(135deg, #065f46 0%, #022c22 60%, #047857 100%)',
  'linear-gradient(160deg, #022c22 0%, #064e3b 30%, #0f766e 70%, #022c22 100%)',
  'linear-gradient(135deg, #0f766e 0%, #064e3b 50%, #022c22 100%)',
  'linear-gradient(145deg, #064e3b 0%, #047857 40%, #022c22 100%)',
];

interface UnsplashImage {
  url: string;
  photographer: string;
  photographerUrl: string;
}

interface Props {
  onOpenSettings: () => void;
  onOpenArchive: () => void;
}

function getTodayKey() {
  const today = new Date();
  return `unsplash_daily_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export default function DailyWisdom({ onOpenSettings, onOpenArchive }: Props) {
  const { signOut, trialDaysLeft, profile, isTrialExpired } = useAuth();
  const [wisdom] = useState<DailyWisdomType>(getWisdomForDate());
  const [bgImage, setBgImage] = useState<UnsplashImage | null>(null);
  const [expanded, setExpanded] = useState(false);

  const gradient = NATURE_GRADIENTS[wisdom.day % NATURE_GRADIENTS.length];
  const isContentLocked = isTrialExpired && !profile?.is_premium;

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return;

    const cacheKey = getTodayKey();
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setBgImage(JSON.parse(cached));
        return;
      } catch { /* ignore */ }
    }

    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const searchTermWithDate = `${wisdom.searchTerm} ${dateString}`;

    fetch(`${supabaseUrl}/functions/v1/unsplash-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm: searchTermWithDate }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.url) {
          setBgImage(data);
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, [wisdom.searchTerm]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: gradient }} />

      {bgImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={bgImage.url}
            alt="Nature background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-950/60" />
        </motion.div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-950/50 to-transparent" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex-shrink-0 flex items-center justify-between px-5 pt-10 pb-4 bg-emerald-950/20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold" />
          <span className="text-ivory/70 text-xs font-medium tracking-widest uppercase">
            Quranic Wisdom
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!profile?.is_premium && trialDaysLeft > 0 && (
            <span className="text-gold/70 text-xs mr-2 bg-gold/10 px-3 py-1 rounded-full whitespace-nowrap">
              {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
            </span>
          )}
          {profile?.is_premium && (
            <span className="text-gold text-xs mr-2 bg-gold/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Lifetime
            </span>
          )}
          <button
            onClick={onOpenArchive}
            className="p-2.5 rounded-full hover:bg-ivory/10 transition-colors"
          >
            <History className="w-4 h-4 text-ivory/60" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full hover:bg-ivory/10 transition-colors"
          >
            <Settings className="w-4 h-4 text-ivory/60" />
          </button>
          <button
            onClick={signOut}
            className="p-2.5 rounded-full hover:bg-ivory/10 transition-colors"
          >
            <LogOut className="w-4 h-4 text-ivory/60" />
          </button>
        </div>
      </motion.header>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="px-5 pt-6 pb-8 max-w-2xl mx-auto w-full space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <p className="text-gold/80 text-xs font-medium tracking-[0.3em] uppercase mb-2">
              Message for Today
            </p>
            <p className="text-ivory/60 text-sm font-light">
              {getFormattedDate()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="glass-dark rounded-4xl p-8 md:p-10 relative"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-[1px] bg-gold/40" />
              <span className="text-gold/70 text-xs tracking-widest uppercase">
                {wisdom.reference}
              </span>
              <div className="flex-1 h-[1px] bg-gold/40" />
            </div>

            <p className={`font-display text-xl md:text-2xl lg:text-3xl text-ivory leading-relaxed italic ${isContentLocked ? 'blur-md select-none' : ''}`}>
              "{wisdom.verse}"
            </p>

            {isContentLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/80 rounded-4xl backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-gold mb-3" />
                <p className="text-gold font-medium text-lg mb-2">Premium Content</p>
                <p className="text-ivory/60 text-sm mb-4">Upgrade to access all wisdom</p>
                <button
                  onClick={onOpenSettings}
                  className="px-6 py-2.5 bg-gold text-emerald-950 rounded-full text-sm font-medium hover:bg-gold/90 transition-colors"
                >
                  Get Lifetime Access
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="glass rounded-4xl overflow-hidden relative"
          >
            <button
              onClick={() => !isContentLocked && setExpanded(!expanded)}
              className="w-full"
              disabled={isContentLocked}
            >
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-gold" />
                  <span className={`text-emerald-950 text-sm font-medium ${isContentLocked ? 'blur-sm' : ''}`}>
                    The Inner Meaning
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className={`w-4 h-4 text-emerald-950/40 ${isContentLocked ? 'blur-sm' : ''}`} />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="inner"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-5">
                    <div className="h-[1px] bg-emerald-950/10" />
                    <div>
                      <p className="text-emerald-950/50 text-xs font-medium tracking-widest uppercase mb-2">
                        The Inner Meaning
                      </p>
                      <p className="text-emerald-950 text-sm leading-relaxed">
                        {wisdom.innerMeaning}
                      </p>
                    </div>
                    <div className="h-[1px] bg-emerald-950/10" />
                    <div>
                      <p className="text-emerald-950/50 text-xs font-medium tracking-widest uppercase mb-2">
                        Today's Action
                      </p>
                      <p className="text-emerald-950 text-sm leading-relaxed">
                        {wisdom.todaysAction}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isContentLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory/90 backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-gold mb-2" />
                <p className="text-emerald-950 font-medium text-sm mb-1">Premium Content</p>
                <button
                  onClick={onOpenSettings}
                  className="text-gold text-xs font-medium hover:underline"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </motion.div>

          <div className="h-4" />
        </div>
      </div>

      {bgImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-4 right-5 z-20 pointer-events-none"
        >
          <a
            href={bgImage.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ivory/30 text-[10px] hover:text-ivory/50 transition-colors pointer-events-auto"
          >
            Photo by {bgImage.photographer} on Unsplash
          </a>
        </motion.div>
      )}
    </div>
  );
}
