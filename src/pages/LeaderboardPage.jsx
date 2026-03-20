import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection, query, orderBy, limit, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { CHALLENGES } from '../utils/challengeData';

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const ITEM = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

const RANK_STYLES = [
  'border-star/40 bg-star/5 shadow-star',
  'border-ghost/40 bg-ghost/5',
  'border-[#cd7f32]/40 bg-[#cd7f32]/5',
];

const RANK_ICONS = ['👑', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('totalPoints', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc, i) => ({
        uid: doc.id,
        rank: i + 1,
        ...doc.data(),
      }));
      setUsers(data);
      const myIdx = data.findIndex(u => u.uid === user?.uid);
      setMyRank(myIdx >= 0 ? myIdx + 1 : null);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const top10 = users.slice(0, 10);
  const isInTop10 = myRank !== null && myRank <= 10;
  const myEntry = users.find(u => u.uid === user?.uid);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gradient-gold">GLOBAL RANKINGS</h1>
          <p className="font-mono-tech text-ghost text-sm mt-1">
            LIVE · {users.length} AGENTS REGISTERED
          </p>
        </div>
        {myRank && (
          <div className="glass-card rounded-xl px-5 py-3 border border-ion/20">
            <div className="font-mono-tech text-ghost text-xs">YOUR RANK</div>
            <div className="font-display text-2xl text-ion">#{myRank}</div>
          </div>
        )}
      </div>

      {/* Podium */}
      {top10.length >= 3 && (
        <div className="flex items-end justify-center gap-3 h-44 mb-8">
          {/* 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2 w-28"
          >
            <div className="w-10 h-10 rounded-full bg-ghost/20 border border-ghost/40 flex items-center justify-center font-display text-ghost text-sm">
              {top10[1]?.name?.[0]?.toUpperCase()}
            </div>
            <div className="font-display text-xs text-ghost text-center truncate w-full px-1">{top10[1]?.name}</div>
            <div className="font-mono-tech text-ghost text-xs">{top10[1]?.totalPoints} pts</div>
            <div className="w-full h-24 bg-ghost/10 border border-ghost/20 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl">🥈</span>
            </div>
          </motion.div>

          {/* 1st */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-2 w-28"
          >
            <div className="w-12 h-12 rounded-full bg-star/20 border-2 border-star/60 flex items-center justify-center font-display text-star text-base shadow-star">
              {top10[0]?.name?.[0]?.toUpperCase()}
            </div>
            <div className="font-display text-xs text-star text-center truncate w-full px-1">{top10[0]?.name}</div>
            <div className="font-mono-tech text-star text-xs">{top10[0]?.totalPoints} pts</div>
            <div className="w-full h-36 bg-star/10 border border-star/30 rounded-t-lg flex items-center justify-center shadow-star">
              <span className="text-3xl">👑</span>
            </div>
          </motion.div>

          {/* 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2 w-28"
          >
            <div className="w-10 h-10 rounded-full bg-[#cd7f32]/20 border border-[#cd7f32]/40 flex items-center justify-center font-display text-[#cd7f32] text-sm">
              {top10[2]?.name?.[0]?.toUpperCase()}
            </div>
            <div className="font-display text-xs text-[#cd7f32] text-center truncate w-full px-1">{top10[2]?.name}</div>
            <div className="font-mono-tech text-[#cd7f32] text-xs">{top10[2]?.totalPoints} pts</div>
            <div className="w-full h-16 bg-[#cd7f32]/10 border border-[#cd7f32]/20 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl">🥉</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-ion/10 text-ghost font-mono-tech text-xs tracking-widest">
          <div className="col-span-1">#</div>
          <div className="col-span-5">AGENT</div>
          <div className="col-span-3 text-right">CHALLENGES</div>
          <div className="col-span-3 text-right">POINTS</div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-ion/30 border-t-ion rounded-full"
            />
          </div>
        ) : (
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            {top10.map((u, i) => {
              const isMe = u.uid === user?.uid;
              const rankStyle = i < 3 ? RANK_STYLES[i] : '';
              const rankIcon = i < 3 ? RANK_ICONS[i] : `#${i + 1}`;

              return (
                <motion.div
                  key={u.uid}
                  variants={ITEM}
                  className={`grid grid-cols-12 px-5 py-4 border-b border-mist/10 items-center transition-all
                    ${isMe ? 'bg-ion/5 border-l-2 border-l-ion' : 'hover:bg-ash/30'}
                    ${i < 3 ? 'border border-opacity-20 ' + rankStyle : ''}
                  `}
                >
                  <div className="col-span-1">
                    {i < 3 ? (
                      <span className="text-lg">{rankIcon}</span>
                    ) : (
                      <span className={`font-display text-sm ${isMe ? 'text-ion' : 'text-ghost'}`}>#{i+1}</span>
                    )}
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm shrink-0
                      ${isMe ? 'bg-ion/20 border border-ion/50 text-ion' : 'bg-ash border border-mist/30 text-ghost'}
                    `}>
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className={`font-display text-xs ${isMe ? 'text-ion' : 'text-white'}`}>
                        {u.name || 'Unknown Agent'}
                        {isMe && <span className="ml-2 text-ion/60 text-[10px]">YOU</span>}
                      </div>
                      <div className="font-mono-tech text-ghost/50 text-xs">
                        {u.achievements?.length || 0} badges
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="flex justify-end gap-1">
                      {CHALLENGES.map(c => (
                        <div
                          key={c.id}
                          className={`w-5 h-5 rounded-sm flex items-center justify-center text-xs
                            ${u.completedChallenges?.includes(c.id) ? 'bg-nova/20 text-nova' : 'bg-ash text-ghost/30'}
                          `}
                          title={c.title}
                        >
                          {u.completedChallenges?.includes(c.id) ? '✓' : '○'}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className={`font-display text-sm ${isMe ? 'text-star' : i < 3 ? 'text-white' : 'text-ghost'}`}>
                      {u.totalPoints || 0}
                    </span>
                    <span className="font-mono-tech text-ghost/50 text-xs ml-1">pts</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* My rank if not in top 10 */}
      {!isInTop10 && myEntry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 border border-ion/20 bg-ion/5"
        >
          <div className="font-mono-tech text-ion text-xs mb-2 tracking-widest">YOUR POSITION</div>
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-1">
              <span className="font-display text-ion text-sm">#{myRank}</span>
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ion/20 border border-ion/50 flex items-center justify-center font-display text-ion text-sm">
                {myEntry.name?.[0]?.toUpperCase()}
              </div>
              <span className="font-display text-xs text-ion">{myEntry.name}</span>
            </div>
            <div className="col-span-3 text-right font-mono-tech text-ghost text-xs">
              {myEntry.completedChallenges?.length || 0} / {CHALLENGES.length}
            </div>
            <div className="col-span-3 text-right">
              <span className="font-display text-star text-sm">{myEntry.totalPoints || 0}</span>
              <span className="font-mono-tech text-ghost/50 text-xs ml-1">pts</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
