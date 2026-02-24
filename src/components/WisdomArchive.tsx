import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, Lock, Sparkles, Heart } from 'lucide-react';
import { DailyWisdom } from '../data/types';

interface WisdomArchiveProps {
  allWisdom: DailyWisdom[];
  isPremium: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function WisdomArchive({ allWisdom, isPremium, onClose, onUpgrade }: WisdomArchiveProps) {
  const today = useMemo(() => new Date(), []);

  const availableDates = useMemo(() => {
    const start = new Date(today.getFullYear(), 0, 1);
    const dates: Date[] = [];
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates.reverse();
  }, [today]);

  const [selectedDate, setSelectedDate] = useState<Date>(availableDates[0]);
  const stripRef = useRef<HTMLDivElement>(null);

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getWisdomForDate = (date: Date): DailyWisdom => {
    const dayOfYear = getDayOfYear(date);
    const index = ((dayOfYear - 1) % 366 + 366) % 366;
    return allWisdom[index];
  };

  const isDateLocked = (date: Date): boolean => {
    if (isPremium) return false;
    return getDayOfYear(date) < getDayOfYear(today) - 2;
  };

  const selectedWisdom = getWisdomForDate(selectedDate);
  const isLocked = isDateLocked(selectedDate);

  useEffect(() => {
    if (stripRef.current) {
      const selectedIndex = availableDates.findIndex(
        (d) => d.toDateString() === selectedDate.toDateString()
      );
      const itemWidth = 72;
      const offset = selectedIndex * itemWidth - stripRef.current.clientWidth / 2 + itemWidth / 2;
      stripRef.current.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [selectedDate, availableDates]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-emerald-950"
    >
      <div className="h-full flex flex-col max-w-lg mx-auto">
        <header className="flex-shrink-0 flex items-center gap-3 px-5 pt-10 pb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-ivory/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-ivory/70" />
          </motion.button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            <h1 className="font-display text-xl text-ivory">Wisdom Archive</h1>
          </div>
        </header>

        <div
          ref={stripRef}
          className="flex-shrink-0 flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {availableDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const locked = isDateLocked(date);

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                disabled={locked}
                className={`flex-shrink-0 w-16 flex flex-col items-center py-3 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-gold/20 border-gold/40'
                    : 'bg-emerald-900/40 border-ivory/10 hover:bg-emerald-900/60'
                } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${isSelected ? 'text-gold' : 'text-ivory/50'}`}>
                  {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-lg font-bold leading-none ${isSelected ? 'text-gold' : 'text-ivory/80'}`}>
                  {date.getDate()}
                </span>
                <span className={`text-[10px] mt-1 ${isSelected ? 'text-gold/70' : 'text-ivory/40'}`}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </span>
                {locked && <Lock className="w-2.5 h-2.5 text-ivory/30 mt-1" />}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center text-center py-16 px-8"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-ivory text-lg font-semibold mb-2">Premium Content</h3>
                <p className="text-ivory/60 text-sm mb-6 max-w-xs">
                  Trial users can browse the last 3 days. Upgrade for the complete archive of 365+ days.
                </p>
                <button
                  onClick={onUpgrade}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-amber-400 text-emerald-950 rounded-3xl text-sm font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Lifetime Access
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-2"
              >
                <div className="mb-2">
                  <p className="text-gold/80 text-xs font-medium tracking-[0.25em] uppercase">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="glass-dark rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-[1px] bg-gold/40" />
                    <span className="text-gold/70 text-xs tracking-widest uppercase">
                      {selectedWisdom.reference}
                    </span>
                    <div className="flex-1 h-[1px] bg-gold/40" />
                  </div>
                  <p className="font-display text-xl text-ivory leading-relaxed italic">
                    "{selectedWisdom.verse}"
                  </p>
                </div>

                <div className="glass rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gold" />
                    <p className="text-emerald-950/60 text-xs font-medium tracking-widest uppercase">
                      The Inner Meaning
                    </p>
                  </div>
                  <p className="text-emerald-950 text-sm leading-relaxed">
                    {selectedWisdom.innerMeaning}
                  </p>
                  <div className="h-[1px] bg-emerald-950/10" />
                  <p className="text-emerald-950/60 text-xs font-medium tracking-widest uppercase">
                    Today's Action
                  </p>
                  <p className="text-emerald-950 text-sm leading-relaxed">
                    {selectedWisdom.todaysAction}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
