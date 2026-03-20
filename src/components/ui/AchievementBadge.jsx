import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '../../utils/challengeData';

export default function AchievementBadge({ achievementId, animate = false, size = 'md' }) {
  const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!ach) return null;

  const sizes = {
    sm: { wrapper: 'px-2 py-1 gap-1.5', icon: 'text-base', text: 'text-xs' },
    md: { wrapper: 'px-3 py-2 gap-2', icon: 'text-xl', text: 'text-xs' },
    lg: { wrapper: 'px-4 py-3 gap-3', icon: 'text-2xl', text: 'text-sm' },
  };

  const s = sizes[size] || sizes.md;

  const badge = (
    <div
      className={`inline-flex items-center ${s.wrapper} rounded-lg border bg-opacity-10 backdrop-blur-sm`}
      style={{
        borderColor: ach.color + '50',
        backgroundColor: ach.color + '15',
      }}
      title={ach.description}
    >
      <span className={s.icon}>{ach.icon}</span>
      <span
        className={`font-display ${s.text} tracking-wider`}
        style={{ color: ach.color }}
      >
        {ach.title}
      </span>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}
