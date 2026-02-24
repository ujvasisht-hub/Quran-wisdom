import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-emerald-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold/30 border-t-gold"
        />
        <h1 className="font-display text-2xl text-ivory tracking-wide">
          Daily Quranic Wisdom
        </h1>
        <p className="text-ivory/50 text-sm mt-2 font-light tracking-widest uppercase">
          Loading your reflection
        </p>
      </motion.div>
    </div>
  );
}
