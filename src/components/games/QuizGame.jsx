import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '../../utils/challengeData';

const QUESTION_TIME = 15; // seconds per question

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizGame({ onGameEnd }) {
  const [questions] = useState(() => shuffle(QUIZ_QUESTIONS).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [phase, setPhase] = useState('question'); // question | feedback | done
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  const q = questions[current];

  useEffect(() => {
    if (!started || phase !== 'question') return;
    setTimeLeft(QUESTION_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null); // timeout = wrong
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, phase, started]);

  const handleAnswer = (idx) => {
    clearInterval(timerRef.current);
    setSelected(idx);
    const isCorrect = idx === q.correct;
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);
    setPhase('feedback');

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setPhase('done');
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
        setPhase('question');
      }
    }, 1200);
  };

  const finalScore = Math.round((correct / questions.length) * 100);

  const getOptionStyle = (idx) => {
    if (phase === 'question') {
      return 'border-mist/30 text-ghost hover:border-plasma/50 hover:text-white hover:bg-plasma/10 cursor-pointer';
    }
    if (idx === q.correct) return 'border-nova/60 bg-nova/15 text-nova';
    if (idx === selected && idx !== q.correct) return 'border-pulse/60 bg-pulse/15 text-pulse';
    return 'border-mist/20 text-ghost/40';
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-7xl mb-6 animate-float">🧠</div>
        <h2 className="font-display text-3xl text-plasma mb-3">KNOWLEDGE NEXUS</h2>
        <p className="text-ghost mb-2">10 questions · 15 seconds each</p>
        <p className="text-ghost/60 text-sm mb-8">IEEE · Technology · General Knowledge</p>
        <button
          onClick={() => setStarted(true)}
          className="btn-plasma px-10 py-4 rounded-xl text-sm"
        >
          BEGIN TRANSMISSION →
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
        <div className="text-6xl mb-6">
          {finalScore >= 80 ? '🏆' : finalScore >= 50 ? '⭐' : '💡'}
        </div>
        <h2 className="font-display text-3xl text-gradient-plasma mb-6">QUIZ COMPLETE</h2>
        <div className="glass-card rounded-2xl p-8 mb-8 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="font-display text-3xl text-nova">{correct}</div>
              <div className="font-mono-tech text-ghost text-xs">CORRECT</div>
            </div>
            <div>
              <div className="font-display text-3xl text-pulse">{wrong}</div>
              <div className="font-mono-tech text-ghost text-xs">WRONG</div>
            </div>
            <div>
              <div className="font-display text-3xl text-star">{finalScore}%</div>
              <div className="font-mono-tech text-ghost text-xs">ACCURACY</div>
            </div>
          </div>
          <div className="w-full h-2 bg-ash rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${finalScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-plasma to-ion rounded-full"
            />
          </div>
        </div>
        <button
          onClick={() => onGameEnd(finalScore)}
          className="btn-star-solid px-10 py-4 rounded-xl text-sm"
        >
          SUBMIT RESULTS →
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono-tech text-ghost text-xs">
          {current + 1} / {questions.length}
        </span>
        <div className="flex-1 mx-4 h-1.5 bg-ash rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-plasma to-ion rounded-full"
          />
        </div>
        {/* Timer */}
        <div className={`font-display text-sm w-8 text-center ${timeLeft <= 5 ? 'text-pulse animate-pulse' : 'text-ion'}`}>
          {timeLeft}
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1 bg-ash rounded-full overflow-hidden mb-8">
        <motion.div
          key={current}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: QUESTION_TIME, ease: 'linear' }}
          className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-pulse' : 'bg-ion'}`}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass-card-plasma rounded-2xl p-6 mb-6">
            <div className="font-mono-tech text-plasma text-xs mb-3 tracking-widest">QUESTION {current + 1}</div>
            <h3 className="font-display text-lg text-white leading-relaxed">{q.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={phase === 'question' ? { x: 4 } : {}}
                onClick={() => phase === 'question' && handleAnswer(idx)}
                className={`glass-card rounded-xl px-5 py-4 text-left border transition-all duration-200 ${getOptionStyle(idx)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs w-6 h-6 rounded-md border border-current flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {phase === 'feedback' && idx === q.correct && (
                    <span className="ml-auto text-nova">✓</span>
                  )}
                  {phase === 'feedback' && idx === selected && idx !== q.correct && (
                    <span className="ml-auto text-pulse">✗</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Score tracker */}
      <div className="flex justify-center gap-8 mt-8">
        <div className="text-center">
          <div className="font-display text-xl text-nova">{correct}</div>
          <div className="font-mono-tech text-ghost text-xs">CORRECT</div>
        </div>
        <div className="text-center">
          <div className="font-display text-xl text-pulse">{wrong}</div>
          <div className="font-mono-tech text-ghost text-xs">WRONG</div>
        </div>
      </div>
    </div>
  );
}
