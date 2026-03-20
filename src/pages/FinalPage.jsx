import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const ITEM = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const IEEE_VALUES = [
  {
    icon: '🌍',
    title: 'Global Community',
    text: '400,000+ engineers in 160+ countries. IEEE is your passport to a worldwide professional network that spans every engineering discipline.',
  },
  {
    icon: '🏆',
    title: 'Competitions & Awards',
    text: 'IEEE members compete in hundreds of global competitions annually — from robotics to AI. Winners get recognition, prizes, and career-defining experience.',
  },
  {
    icon: '📚',
    title: 'World-Class Research',
    text: 'Access to IEEE Xplore — the most cited technical library on earth. Stay ahead with 5+ million research documents at your fingertips.',
  },
  {
    icon: '🚀',
    title: 'Career Launchpad',
    text: 'IEEE alumni work at NASA, Google, Tesla, CERN, and every major tech company. Your student branch is your first professional network.',
  },
  {
    icon: '🔬',
    title: 'Technical Workshops',
    text: 'Exclusive member workshops, seminars, and webinars on AI, robotics, cybersecurity, embedded systems, and emerging technologies.',
  },
  {
    icon: '🤝',
    title: 'Leadership & Growth',
    text: 'Build leadership skills by organizing events, managing teams, and representing your branch on regional and international stages.',
  },
];

export default function FinalPage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [topPlayers, setTopPlayers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchTop = async () => {
      const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'), limit(3));
      const snap = await getDocs(q);
      const data = snap.docs.map((d, i) => ({ uid: d.id, rank: i + 1, ...d.data() }));
      setTopPlayers(data);

      const allQ = query(collection(db, 'users'), orderBy('totalPoints', 'desc'));
      const allSnap = await getDocs(allQ);
      const allIds = allSnap.docs.map(d => d.id);
      const idx = allIds.indexOf(user?.uid);
      if (idx >= 0) setMyRank(idx + 1);

      if (idx === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
    };
    fetchTop();
  }, [user]);

  const allDone = (userProfile?.completedChallenges?.length || 0) >= 4;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#ffd700', '#00d4ff', '#7b2fff', '#ff2d7e', '#00ff9d']}
          numberOfPieces={300}
          recycle={false}
        />
      )}

      <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-10">
        {/* Hero Banner */}
        <motion.div variants={ITEM} className="text-center py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-plasma/10 rounded-full blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-8 right-8 w-16 h-16 border border-ion/20 rounded-full border-t-ion opacity-50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-8 left-8 w-12 h-12 border border-plasma/20 rounded-full border-b-plasma opacity-50"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
              className="text-6xl mb-6"
            >
              ⚡
            </motion.div>
            <h1 className="font-display text-3xl lg:text-5xl text-gradient-gold mb-6 leading-tight">
              IEEE IS NOT JUST A CLUB
            </h1>
            <p className="font-display text-xl lg:text-2xl text-ion mb-3">
              IT'S A LAUNCHPAD FOR YOUR FUTURE.
            </p>
            <p className="text-ghost font-mono-tech text-sm tracking-widest">
              STAY ACTIVE. STAY AHEAD.
            </p>
          </div>
        </motion.div>

        {/* Top 3 Winners */}
        {topPlayers.length > 0 && (
          <motion.div variants={ITEM}>
            <h2 className="font-display text-sm text-ghost tracking-widest mb-5 text-center">ARENA CHAMPIONS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topPlayers.map((p, i) => {
                const medals = ['👑', '🥈', '🥉'];
                const colors = ['border-star/40 bg-star/5 shadow-star', 'border-ghost/30 bg-ghost/5', 'border-[#cd7f32]/30 bg-[#cd7f32]/5'];
                const textColors = ['text-star', 'text-ghost', 'text-[#cd7f32]'];
                return (
                  <motion.div
                    key={p.uid}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className={`glass-card rounded-2xl p-6 text-center border ${colors[i]}`}
                  >
                    <div className="text-4xl mb-3">{medals[i]}</div>
                    <div className={`font-display text-sm ${textColors[i]} mb-1 truncate`}>{p.name}</div>
                    <div className={`font-display text-2xl ${textColors[i]}`}>{p.totalPoints}</div>
                    <div className="font-mono-tech text-ghost text-xs">POINTS</div>
                    {p.uid === user?.uid && (
                      <div className="mt-2 text-ion font-mono-tech text-xs">← YOU</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* My result */}
        {myRank && (
          <motion.div variants={ITEM} className="glass-card rounded-2xl p-6 border border-ion/20 bg-ion/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono-tech text-ion text-xs tracking-widest mb-1">YOUR FINAL RESULT</div>
                <div className="font-display text-white text-lg">{userProfile?.name}</div>
                <div className="font-mono-tech text-ghost text-sm">{userProfile?.completedChallenges?.length || 0} / 4 challenges · {userProfile?.achievements?.length || 0} achievements</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl text-ion">#{myRank}</div>
                <div className="font-display text-xl text-star">{userProfile?.totalPoints || 0} pts</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* IEEE Values */}
        <motion.div variants={ITEM}>
          <h2 className="font-display text-sm text-ghost tracking-widest mb-6 text-center">
            WHY BEING ACTIVE IN IEEE MATTERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {IEEE_VALUES.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="glass-card rounded-xl p-5 hover:border-ion/20 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{val.icon}</div>
                <h3 className="font-display text-sm text-ion mb-2">{val.title}</h3>
                <p className="text-ghost/80 text-sm leading-relaxed">{val.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div variants={ITEM} className="glass-card-plasma rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="font-display text-2xl text-gradient-plasma mb-4">
            YOUR NEXT MISSION STARTS NOW
          </h2>
          <p className="text-ghost mb-6 text-sm leading-relaxed max-w-lg mx-auto">
            The challenge is over, but your IEEE journey is just beginning.
            Show up. Participate. Lead. The skills you build here are the ones
            that will define your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/leaderboard')}
              className="btn-ion px-8 py-4 rounded-xl text-sm"
            >
              📊 FINAL RANKINGS
            </button>
            {!allDone && (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-star-solid px-8 py-4 rounded-xl text-sm"
              >
                ⚡ COMPLETE CHALLENGES
              </button>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={ITEM} className="text-center pb-8">
          <div className="font-mono-tech text-ghost/40 text-xs tracking-widest">
            IEEE EPI STUDENT BRANCH · CHALLENGE ARENA · {new Date().getFullYear()}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
