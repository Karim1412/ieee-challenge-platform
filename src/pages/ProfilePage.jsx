import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ACHIEVEMENTS, CHALLENGES } from '../utils/challengeData';
import AchievementBadge from '../components/ui/AchievementBadge';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const ITEM = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const { user, userProfile, refreshProfile, updateProfile } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.name || '');
  const [saving, setSaving] = useState(false);

  const completed = userProfile?.completedChallenges || [];
  const achievements = userProfile?.achievements || [];
  const totalPoints = userProfile?.totalPoints || 0;

  const handleSaveName = async () => {
    if (!newName.trim() || newName === userProfile?.name) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: newName.trim() });
      toast.success('Name updated!');
      setEditingName(false);
    } catch {
      toast.error('Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const getLevel = (pts) => {
    if (pts >= 300) return { label: 'LEGEND', color: 'text-star', icon: '👑' };
    if (pts >= 200) return { label: 'MASTER', color: 'text-plasma', icon: '🔮' };
    if (pts >= 100) return { label: 'EXPERT', color: 'text-ion', icon: '⚡' };
    if (pts >= 50)  return { label: 'ACTIVE', color: 'text-nova', icon: '🌟' };
    return { label: 'INITIATE', color: 'text-ghost', icon: '🎮' };
  };

  const level = getLevel(totalPoints);

  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-2xl mx-auto"
    >
      {/* Profile Card */}
      <motion.div variants={ITEM} className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-ion/5 rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ion/30 to-plasma/30 border-2 border-ion/40 flex items-center justify-center shadow-ion">
              <span className="font-display text-ion text-3xl">
                {userProfile?.name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 text-lg">{level.icon}</div>
          </div>

          {/* Info */}
          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  className="input-field px-3 py-1.5 rounded-lg text-sm font-display"
                  autoFocus
                />
                <button onClick={handleSaveName} disabled={saving} className="btn-nova px-3 py-1.5 rounded-lg text-xs">
                  {saving ? '...' : '✓'}
                </button>
                <button onClick={() => setEditingName(false)} className="btn-pulse px-3 py-1.5 rounded-lg text-xs">
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-xl text-white">{userProfile?.name}</h1>
                <button
                  onClick={() => { setNewName(userProfile?.name || ''); setEditingName(true); }}
                  className="text-ghost hover:text-ion transition-colors text-xs"
                  title="Edit name"
                >
                  ✎
                </button>
              </div>
            )}
            <p className="font-mono-tech text-ghost text-xs mb-3">{user?.email}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-ash border border-mist/30 ${level.color}`}>
              <span className="font-display text-xs">{level.label}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={ITEM} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL POINTS', value: totalPoints, color: 'text-star' },
          { label: 'CHALLENGES', value: `${completed.length}/${CHALLENGES.length}`, color: 'text-nova' },
          { label: 'ACHIEVEMENTS', value: achievements.length, color: 'text-plasma' },
          { label: 'LEVEL', value: level.label, color: level.color, small: true },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <div className={`font-display ${stat.small ? 'text-sm' : 'text-2xl'} ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="font-mono-tech text-ghost text-xs">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Challenge History */}
      <motion.div variants={ITEM} className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-sm text-ghost tracking-widest mb-5">CHALLENGE HISTORY</h2>
        <div className="space-y-3">
          {CHALLENGES.map(c => {
            const done = completed.includes(c.id);
            const score = userProfile?.challengeScores?.[c.id];
            const rank = userProfile?.challengeRanks?.[c.id];
            return (
              <div
                key={c.id}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all
                  ${done ? 'border-nova/20 bg-nova/5' : 'border-mist/10 bg-ash/20'}`}
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="flex-1">
                  <div className={`font-display text-xs ${done ? 'text-nova' : 'text-ghost'}`}>{c.title}</div>
                  <div className="font-mono-tech text-ghost/50 text-xs">{c.subtitle}</div>
                </div>
                {done ? (
                  <div className="text-right">
                    <div className="font-display text-nova text-sm">✓</div>
                    {score != null && <div className="font-mono-tech text-star text-xs">{score} pts</div>}
                  </div>
                ) : (
                  <div className="font-mono-tech text-ghost/40 text-xs">PENDING</div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={ITEM} className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-sm text-ghost tracking-widest mb-5">
          ACHIEVEMENTS ({achievements.length}/{ACHIEVEMENTS.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-xl p-4 border text-center transition-all ${
                  unlocked
                    ? 'border-opacity-40 bg-opacity-10'
                    : 'border-mist/10 bg-ash/30 opacity-40 grayscale'
                }`}
                style={unlocked ? { borderColor: ach.color + '60', backgroundColor: ach.color + '10' } : {}}
              >
                <div className="text-3xl mb-2">{ach.icon}</div>
                <div className="font-display text-xs mb-1" style={{ color: unlocked ? ach.color : '#4a5568' }}>
                  {ach.title}
                </div>
                <div className="font-mono-tech text-ghost/60 text-xs leading-tight">{ach.description}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
