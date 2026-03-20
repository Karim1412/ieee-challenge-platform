import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROUNDS = 5;
const MIN_DELAY = 1500;
const MAX_DELAY = 4500;

function getRating(avg) {
  if (avg < 180) return { label: 'SUPERHUMAN', color: 'text-star', emoji: '⚡' };
  if (avg < 220) return { label: 'ELITE REFLEX', color: 'text-nova', emoji: '🔥' };
  if (avg < 280) return { label: 'SHARP MIND', color: 'text-ion', emoji: '💫' };
  if (avg < 350) return { label: 'AVERAGE', color: 'text-ghost', emoji: '👍' };
  return { label: 'NEEDS TRAINING', color: 'text-pulse', emoji: '😅' };
}

export default function ReactionGame({ onGameEnd }) {
  const [phase, setPhase] = useState('idle'); // idle | waiting | ready | clicked | done | toosoon
  const [times, setTimes] = useState([]);
  const [round, setRound] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const [started, setStarted] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const startRound = () => {
    setPhase('waiting');
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    timeoutRef.current = setTimeout(() => {
      setPhase('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (phase === 'waiting') {
      clearTimeout(timeoutRef.current);
      setPhase('toosoon');
      return;
    }

    if (phase === 'ready') {
      const elapsed = Date.now() - startTime;
      setLastTime(elapsed);
      const newTimes = [...times, elapsed];
      setTimes(newTimes);

      const newRound = round + 1;
      setRound(newRound);

      if (newRound >= ROUNDS) {
        setPhase('done');
      } else {
        setPhase('clicked');
      }
      return;
    }

    if (phase === 'clicked' || phase === 'toosoon') {
      startRound();
    }
  };

  const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = times.length > 0 ? Math.min(...times) : 0;
  const score = times.length > 0 ? Math.max(0, Math.round(1000 - avg)) : 0;
  const rating = getRating(avg);

  const getBgColor = () => {
    switch (phase) {
      case 'waiting': return 'bg-ash border-mist/20';
      case 'ready': return 'bg-nova/10 border-nova/50 shadow-nova cursor-pointer';
      case 'toosoon': return 'bg-pulse/10 border-pulse/50';
      default: return 'bg-ash/50 border-ion/20';
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-7xl mb-6 animate-float">⚡</div>
        <h2 className="font-display text-3xl text-pulse mb-3">SYNAPSE RUSH</h2>
        <p className="text-ghost mb-2">{ROUNDS} rounds · Click when it turns green</p>
        <p className="text-ghost/60 text-sm mb-8">Don't click too early or you'll lose a round!</p>
        <button onClick={() => { setStarted(true); startRound(); }} className="btn-pulse px-10 py-4 rounded-xl text-sm">
          CALIBRATE REFLEXES →
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      >
        <div className="text-6xl mb-4">{rating.emoji}</div>
        <h2 className="font-display text-3xl text-gradient-plasma mb-6">CALIBRATION COMPLETE</h2>

        <div className="glass-card rounded-2xl p-8 mb-8 w-full max-w-sm">
          <div className={`font-display text-2xl mb-1 ${rating.color}`}>{rating.label}</div>
          <div className="font-mono-tech text-ghost text-xs mb-6 tracking-widest">REFLEX RATING</div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="font-display text-2xl text-pulse">{avg}ms</div>
              <div className="font-mono-tech text-ghost text-xs">AVG</div>
            </div>
            <div>
              <div className="font-display text-2xl text-nova">{best}ms</div>
              <div className="font-mono-tech text-ghost text-xs">BEST</div>
            </div>
            <div>
              <div className="font-display text-2xl text-star">{score}</div>
              <div className="font-mono-tech text-ghost text-xs">SCORE</div>
            </div>
          </div>

          <div className="space-y-2">
            {times.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono-tech text-ghost text-xs w-16">Round {i + 1}</span>
                <div className="flex-1 h-1.5 bg-ash rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (t / 500) * 100)}%` }}
                    transition={{ delay: i * 0.1 }}
                    className={`h-full rounded-full ${t < 250 ? 'bg-nova' : t < 350 ? 'bg-ion' : 'bg-pulse'}`}
                  />
                </div>
                <span className={`font-mono-tech text-xs w-14 text-right ${t < 250 ? 'text-nova' : t < 350 ? 'text-ion' : 'text-pulse'}`}>{t}ms</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => onGameEnd(score)} className="btn-star-solid px-10 py-4 rounded-xl text-sm">
          SUBMIT SCORE →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 gap-8">
      {/* Progress */}
      <div className="flex gap-2">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div key={i} className={`w-8 h-2 rounded-full transition-all ${
            i < round ? 'bg-nova' : i === round ? 'bg-ion animate-pulse' : 'bg-ash'
          }`} />
        ))}
      </div>

      {/* Main reaction target */}
      <motion.div
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        className={`w-72 h-72 rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-100 ${getBgColor()}`}
      >
        <AnimatePresence mode="wait">
          {phase === 'waiting' && (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="text-5xl mb-4">⏳</div>
              <div className="font-display text-ghost text-sm">WAIT FOR GREEN...</div>
            </motion.div>
          )}
          {phase === 'ready' && (
            <motion.div key="go" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="text-6xl mb-4">🟢</div>
              <div className="font-display text-nova text-xl">CLICK NOW!</div>
            </motion.div>
          )}
          {phase === 'clicked' && (
            <motion.div key="clicked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="font-display text-3xl text-ion mb-2">{lastTime}ms</div>
              <div className="font-mono-tech text-ghost text-xs mb-4">
                {lastTime < 200 ? '⚡ LIGHTNING FAST!' : lastTime < 300 ? '🔥 GREAT!' : '👍 GOOD'}
              </div>
              <div className="font-display text-ghost/60 text-xs">CLICK TO CONTINUE</div>
            </motion.div>
          )}
          {phase === 'toosoon' && (
            <motion.div key="toosoon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="text-5xl mb-3">⚠️</div>
              <div className="font-display text-pulse text-sm mb-2">TOO SOON!</div>
              <div className="font-mono-tech text-ghost text-xs mb-4">Wait for the green signal</div>
              <div className="font-display text-ghost/60 text-xs">CLICK TO RETRY</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="text-center">
        <div className="font-display text-ghost text-xs">
          ROUND {round + 1} / {ROUNDS}
          {times.length > 0 && <span className="ml-4 text-ion">AVG: {Math.round(times.reduce((a,b)=>a+b,0)/times.length)}ms</span>}
        </div>
      </div>
    </div>
  );
}
