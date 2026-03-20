import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CHALLENGES } from '../utils/challengeData';
import { submitChallengeScore, getLeaderboard } from '../utils/firestoreHelpers';
import SnakeGame from '../components/games/SnakeGame';
import QuizGame from '../components/games/QuizGame';
import ReactionGame from '../components/games/ReactionGame';
import MemoryGame from '../components/games/MemoryGame';
import PostGameScreen from '../components/games/PostGameScreen';
import toast from 'react-hot-toast';
import ReactConfetti from 'react-confetti';

const GAME_MAP = {
  snake: SnakeGame,
  quiz: QuizGame,
  reaction: ReactionGame,
  memory: MemoryGame,
};

export default function ChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useAuth();

  const challenge = CHALLENGES.find(c => c.id === id);
  const [phase, setPhase] = useState('intro'); // intro | game | result
  const [gameScore, setGameScore] = useState(0);
  const [rank, setRank] = useState(null);
  const [points, setPoints] = useState(0);
  const [newAchievements, setNewAchievements] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!challenge) navigate('/dashboard');
    if (userProfile?.completedChallenges?.includes(id)) {
      toast.error('Challenge already completed!');
      navigate('/dashboard');
    }
  }, [challenge, userProfile]);

  if (!challenge) return null;

  const GameComponent = GAME_MAP[challenge.game];

  const handleGameEnd = async (score) => {
    if (submitting) return;
    setSubmitting(true);
    setGameScore(score);

    try {
      // Compute rank after submission
      const leaderboard = await getLeaderboard(100);
      const currentScores = leaderboard
        .filter(u => u.uid !== user.uid)
        .map(u => u[`challengeScores`]?.[id] ?? 0);

      currentScores.push(score);
      currentScores.sort((a, b) => b - a);
      const userRank = currentScores.indexOf(score) + 1;

      let pts = 20;
      if (userRank === 1) pts = 100;
      else if (userRank === 2) pts = 80;
      else if (userRank === 3) pts = 60;

      setRank(userRank);
      setPoints(pts);

      const achievements = await submitChallengeScore(user.uid, id, pts, userRank);
      setNewAchievements(achievements || []);

      await refreshProfile();

      if (userRank <= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 6000);
      }

      setPhase('result');
    } catch (err) {
      console.error(err);
      toast.error('Error saving score. Check Firebase config.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          colors={['#00d4ff', '#7b2fff', '#ff2d7e', '#00ff9d', '#ffd700']}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              {challenge.icon}
            </motion.div>
            <h1 className={`font-display text-3xl lg:text-5xl text-${challenge.color} mb-2`}>
              {challenge.title}
            </h1>
            <p className="font-mono-tech text-ghost tracking-widest mb-4 text-sm">{challenge.subtitle}</p>
            <p className="text-ghost/80 max-w-md mb-10 text-base">{challenge.description}</p>

            <div className="flex gap-4 mb-8 flex-wrap justify-center">
              {[['🥇 1ST', '100 PTS'], ['🥈 2ND', '80 PTS'], ['🥉 3RD', '60 PTS'], ['🎮 OTHER', '20 PTS']].map(([pos, pts]) => (
                <div key={pos} className="glass-card rounded-lg px-4 py-3 text-center min-w-[80px]">
                  <div className="text-sm mb-1">{pos}</div>
                  <div className="font-display text-xs text-star">{pts}</div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhase('game')}
              className="btn-star-solid px-10 py-4 rounded-xl text-base"
            >
              ⚡ INITIATE CHALLENGE
            </motion.button>
          </motion.div>
        )}

        {phase === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameComponent onGameEnd={handleGameEnd} challenge={challenge} />
            {submitting && (
              <div className="fixed inset-0 bg-void/80 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-ion/30 border-t-ion rounded-full mx-auto mb-4"
                  />
                  <p className="font-display text-ion text-sm">CALCULATING RANK...</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PostGameScreen
              challenge={challenge}
              gameScore={gameScore}
              rank={rank}
              points={points}
              newAchievements={newAchievements}
              onContinue={() => navigate('/dashboard')}
              onLeaderboard={() => navigate('/leaderboard')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
