import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CHALLENGES } from '../utils/challengeData';
import CountdownTimer from '../components/ui/CountdownTimer';
import AchievementBadge from '../components/ui/AchievementBadge';

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// For demo: all challenges are "unlocked" — set to true.
// In production, set based on dayIndex/date.
const DEMO_MODE = true;

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const completed = userProfile?.completedChallenges || [];
  const allDone = completed.length >= CHALLENGES.length;

  const isChallengeUnlocked = (challenge) => {
    if (DEMO_MODE) return true;
    // In production: compare challenge.dayIndex vs days since event start
    return challenge.dayIndex <= new Date().getDay();
  };

  const colorMap = {
    ion: { text: 'text-ion', border: 'border-ion/30', bg: 'bg-ion/10', shadow: 'shadow-ion', btn: 'btn-ion' },
    plasma: { text: 'text-plasma', border: 'border-plasma/30', bg: 'bg-plasma/10', shadow: 'shadow-plasma', btn: 'btn-plasma' },
    pulse: { text: 'text-pulse', border: 'border-pulse/30', bg: 'bg-pulse/10', shadow: 'shadow-pulse', btn: 'btn-pulse' },
    nova: { text: 'text-nova', border: 'border-nova/30', bg: 'bg-nova/10', shadow: 'shadow-nova', btn: 'btn-nova' },
  };

  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={ITEM} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gradient-ion">
            WELCOME BACK, {userProfile?.name?.toUpperCase() || 'AGENT'}
          </h1>
          <p className="text-ghost font-mono-tech text-sm mt-1">
            {completed.length}/{CHALLENGES.length} CHALLENGES COMPLETED
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card rounded-xl px-5 py-3 text-center">
            <div className="font-display text-2xl text-star">{userProfile?.totalPoints || 0}</div>
            <div className="font-mono-tech text-ghost text-xs">TOTAL POINTS</div>
          </div>
          <div className="glass-card rounded-xl px-5 py-3 text-center">
            <div className="font-display text-2xl text-nova">{userProfile?.achievements?.length || 0}</div>
            <div className="font-mono-tech text-ghost text-xs">ACHIEVEMENTS</div>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div variants={ITEM} className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-xs text-ghost tracking-widest">MISSION PROGRESS</span>
          <span className="font-mono-tech text-ion text-sm">{Math.round((completed.length / CHALLENGES.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-ash rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / CHALLENGES.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-ion to-plasma rounded-full"
          />
        </div>
      </motion.div>

      {/* All done banner */}
      {allDone && (
        <motion.div
          variants={ITEM}
          className="glass-card-plasma rounded-xl p-6 text-center"
        >
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="font-display text-xl text-gradient-gold mb-2">ALL CHALLENGES COMPLETE!</h2>
          <p className="text-ghost text-sm mb-4">You've proven yourself in the arena. Check your final rank.</p>
          <button
            onClick={() => navigate('/final')}
            className="btn-star-solid px-8 py-3 rounded-xl text-sm"
          >
            VIEW FINAL RESULTS →
          </button>
        </motion.div>
      )}

      {/* Challenge Cards */}
      <motion.div variants={STAGGER} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CHALLENGES.map((challenge, idx) => {
          const isComplete = completed.includes(challenge.id);
          const unlocked = isChallengeUnlocked(challenge);
          const c = colorMap[challenge.color] || colorMap.ion;

          return (
            <motion.div
              key={challenge.id}
              variants={ITEM}
              whileHover={unlocked && !isComplete ? { y: -4, scale: 1.01 } : {}}
              className={`glass-card rounded-2xl p-6 relative overflow-hidden cursor-pointer border transition-all duration-300
                ${isComplete ? 'border-nova/20 bg-nova/5' : unlocked ? `${c.border} hover:${c.shadow}` : 'border-mist/20 opacity-60'}
              `}
              onClick={() => unlocked && !isComplete && navigate(`/challenge/${challenge.id}`)}
            >
              {/* BG glow */}
              <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 ${c.bg}`} />

              {/* Day badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`font-mono-tech text-xs ${c.text} tracking-widest`}>
                  DAY {idx + 1}
                </span>
                {isComplete && (
                  <span className="bg-nova/20 text-nova border border-nova/30 font-display text-xs px-2 py-0.5 rounded-md">
                    ✓ COMPLETE
                  </span>
                )}
                {!unlocked && (
                  <span className="bg-ash text-ghost border border-mist/30 font-display text-xs px-2 py-0.5 rounded-md">
                    🔒 LOCKED
                  </span>
                )}
              </div>

              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`text-4xl ${unlocked ? 'animate-float' : ''}`}>{challenge.icon}</div>
                <div>
                  <h3 className={`font-display text-base ${c.text} mb-0.5`}>{challenge.title}</h3>
                  <p className="font-mono-tech text-ghost text-xs">{challenge.subtitle}</p>
                </div>
              </div>

              <p className="text-ghost/80 text-sm mb-5 line-clamp-2">{challenge.description}</p>

              {/* CTA */}
              {isComplete ? (
                <div className="flex items-center gap-2 text-nova text-sm font-display">
                  <span>✓</span> <span>MISSION ACCOMPLISHED</span>
                </div>
              ) : unlocked ? (
                <button className={`${c.btn} px-5 py-2 rounded-lg text-xs w-full`}>
                  ENTER CHALLENGE →
                </button>
              ) : (
                <div className="text-ghost/50 text-xs font-mono-tech">
                  Unlocks on Day {idx + 1}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Achievements */}
      {userProfile?.achievements?.length > 0 && (
        <motion.div variants={ITEM}>
          <h2 className="font-display text-sm text-ghost tracking-widest mb-4">RECENT ACHIEVEMENTS</h2>
          <div className="flex flex-wrap gap-3">
            {userProfile.achievements.slice(0, 6).map((id) => (
              <AchievementBadge key={id} achievementId={id} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
