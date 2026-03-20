import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-void flex flex-col items-center justify-center z-50">
      <div className="bg-grid-pattern absolute inset-0 opacity-30" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-2 border-ion/30 border-t-ion"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border-2 border-plasma/30 border-b-plasma"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-ion text-xl font-bold">IE</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-2xl text-gradient-ion mb-1">IEEE EPI</h1>
          <p className="font-mono-tech text-ghost text-sm tracking-widest">INITIALIZING SYSTEMS...</p>
        </div>

        {/* Progress bar */}
        <motion.div className="w-48 h-1 bg-ash rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ion rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
