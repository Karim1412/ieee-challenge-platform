import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '../../utils/challengeData';
import AchievementBadge from '../ui/AchievementBadge';

const RANK_DATA = {
  1: { emoji: '🥇', label: 'FIRST PLACE', color: 'text-star', bg: 'bg-star/10 border-star/30' },
  2: { emoji: '🥈', label: 'SECOND PLACE', color: 'text-ghost', bg: 'bg-ghost/10 border-ghost/30' },
  3: { emoji: '🥉', label: 'THIRD PLACE', color: 'text-[#cd7f32]', bg: 'bg-[#cd7f32]/10 border-[#cd7f32]/30' },
};

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const ITEM = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function PostGameScreen({ challenge, gameScore, rank, points, newAchievements, onContinue, onLeaderboard }) {
  const rankInfo = RANK_DATA[rank] || { emoji: '🎮', label: `RANK #${rank}`, color: 'text-ion', bg: 'bg-ion/10 border-ion/30' };
  const fact = challenge.ieeeAfterFact;

  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto py-8 px-4 space-y-6"
    >
      {/* Result Banner */}
      <motion.div variants={ITEM} className={`glass-card rounded-2xl p-8 text-center border ${rankInfo.bg}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-7xl mb-4"
        >
          {rankInfo.emoji}
        </motion.div>
        <h2 className={`font-display text-2xl ${rankInfo.color} mb-1`}>{rankInfo.label}</h2>
        <p className="font-mono-tech text-ghost text-sm mb-6">{challenge.title} · COMPLETED</p>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="font-display text-3xl text-star">+{points}</div>
            <div className="font-mono-tech text-ghost text-xs mt-1">POINTS EARNED</div>
          </div>
          <div className="w-px bg-mist/30" />
          <div className="text-center">
            <div className="font-display text-3xl text-ion">{gameScore}</div>
            <div className="font-mono-tech text-ghost text-xs mt-1">GAME SCORE</div>
          </div>
        </div>
      </motion.div>

      {/* New Achievements */}
      {newAchievements && newAchievements.length > 0 && (
        <motion.div variants={ITEM} className="glass-card rounded-2xl p-6">
          <div className="font-mono-tech text-star text-xs tracking-widest mb-4">
            🏅 NEW ACHIEVEMENTS UNLOCKED
          </div>
          <div className="flex flex-wrap gap-3">
            {newAchievements.map(id => (
              <AchievementBadge key={id} achievementId={id} animate />
            ))}
          </div>
        </motion.div>
      )}

      {/* IEEE Fact Card */}
      <motion.div variants={ITEM} className="glass-card-plasma rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-8xl opacity-10">{fact.icon}</div>
        <div className="font-mono-tech text-plasma text-xs tracking-widest mb-3">
          ◈ IEEE SPOTLIGHT
        </div>
        <h3 className="font-display text-lg text-white mb-3">{fact.title}</h3>
        <p className="text-ghost/80 text-sm leading-relaxed">{fact.body}</p>
      </motion.div>

      {/* Actions */}
      <motion.div variants={ITEM} className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={onLeaderboard}
          className="btn-ion flex-1 py-4 rounded-xl text-sm"
        >
          📊 VIEW RANKINGS
        </button>
        <button
          onClick={onContinue}
          className="btn-star-solid flex-1 py-4 rounded-xl text-sm"
        >
          🏠 RETURN TO ARENA
        </button>
      </motion.div>
    </motion.div>
  );
}
