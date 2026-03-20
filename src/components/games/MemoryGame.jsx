import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ICONS = ['⚡', '🔮', '🌐', '🧬', '🔭', '⚙️', '🛸', '🌊', '🔬', '💎', '🌀', '🎯'];
const GRID_SIZE = 4; // 4x4 = 16 cards = 8 pairs

function createCards() {
  const pairs = ICONS.slice(0, (GRID_SIZE * GRID_SIZE) / 2);
  const deck = [...pairs, ...pairs].map((icon, i) => ({
    id: i,
    icon,
    flipped: false,
    matched: false,
  }));
  return deck.sort(() => Math.random() - 0.5);
}

export default function MemoryGame({ onGameEnd }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [errors, setErrors] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | preview | play | done
  const [canClick, setCanClick] = useState(true);
  const [previewCount, setPreviewCount] = useState(3);
  const totalPairs = (GRID_SIZE * GRID_SIZE) / 2;
  const previewTimerRef = useRef(null);

  const startGame = () => {
    const deck = createCards();
    setCards(deck.map(c => ({ ...c, flipped: true })));
    setPhase('preview');
    setStarted(true);
    setFlipped([]);
    setMatched(0);
    setMoves(0);
    setErrors(0);
    setPreviewCount(3);

    // Show all cards for 3 seconds
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setPreviewCount(count);
      if (count <= 0) {
        clearInterval(interval);
        setCards(prev => prev.map(c => ({ ...c, flipped: false })));
        setPhase('play');
        setCanClick(true);
      }
    }, 1000);
  };

  const handleCardClick = (card) => {
    if (!canClick || card.flipped || card.matched || phase !== 'play') return;

    const newCards = cards.map(c => c.id === card.id ? { ...c, flipped: true } : c);
    setCards(newCards);

    const newFlipped = [...flipped, card];

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setCanClick(false);

      const [a, b] = newFlipped;
      if (a.icon === b.icon) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.icon === a.icon ? { ...c, matched: true, flipped: true } : c
          ));
          const newMatched = matched + 1;
          setMatched(newMatched);
          setFlipped([]);
          setCanClick(true);
          if (newMatched >= totalPairs) {
            setPhase('done');
          }
        }, 400);
      } else {
        // No match
        setErrors(e => e + 1);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            (c.id === a.id || c.id === b.id) && !c.matched ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setCanClick(true);
        }, 900);
      }

      if (newFlipped.length < 2) setFlipped(newFlipped);
      else setFlipped([]);
    } else {
      setFlipped(newFlipped);
    }
  };

  const score = Math.max(0, Math.round(1000 - errors * 50 - moves * 5));

  if (phase === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      >
        <div className="text-6xl mb-4">{errors === 0 ? '🧠' : matched >= totalPairs ? '🔮' : '💡'}</div>
        <h2 className="font-display text-3xl text-gradient-ion mb-6">MATRIX DECODED</h2>

        <div className="glass-card rounded-2xl p-8 mb-8 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="font-display text-2xl text-star">{score}</div>
              <div className="font-mono-tech text-ghost text-xs">SCORE</div>
            </div>
            <div>
              <div className="font-display text-2xl text-ion">{moves}</div>
              <div className="font-mono-tech text-ghost text-xs">MOVES</div>
            </div>
            <div>
              <div className="font-display text-2xl text-pulse">{errors}</div>
              <div className="font-mono-tech text-ghost text-xs">ERRORS</div>
            </div>
          </div>
          {errors === 0 && (
            <div className="bg-nova/10 border border-nova/30 rounded-lg p-3 text-nova font-mono-tech text-xs">
              ✨ PERFECT MEMORY — No errors!
            </div>
          )}
        </div>

        <button onClick={() => onGameEnd(score)} className="btn-star-solid px-10 py-4 rounded-xl text-sm">
          SUBMIT SCORE →
        </button>
      </motion.div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-7xl mb-6 animate-float">🔮</div>
        <h2 className="font-display text-3xl text-ion mb-3">MEMORY MATRIX</h2>
        <p className="text-ghost mb-2">Match all {totalPairs} pairs to win</p>
        <p className="text-ghost/60 text-sm mb-8">Cards will be shown for 3 seconds. Memorize them!</p>
        <button onClick={startGame} className="btn-ion px-10 py-4 rounded-xl text-sm">
          INITIALIZE MATRIX →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 px-4">
      {/* Stats */}
      <div className="flex items-center gap-6 w-full max-w-lg justify-center">
        <div className="glass-card rounded-lg px-4 py-2 text-center">
          <div className="font-display text-nova text-lg">{matched}/{totalPairs}</div>
          <div className="font-mono-tech text-ghost text-xs">PAIRS</div>
        </div>
        <div className="glass-card rounded-lg px-4 py-2 text-center">
          <div className="font-display text-ion text-lg">{moves}</div>
          <div className="font-mono-tech text-ghost text-xs">MOVES</div>
        </div>
        <div className="glass-card rounded-lg px-4 py-2 text-center">
          <div className="font-display text-pulse text-lg">{errors}</div>
          <div className="font-mono-tech text-ghost text-xs">ERRORS</div>
        </div>
      </div>

      {/* Preview countdown */}
      {phase === 'preview' && (
        <div className="font-display text-star text-sm">
          MEMORIZE! {previewCount}s...
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg w-full">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card)}
            whileHover={!card.flipped && !card.matched && canClick ? { scale: 1.05 } : {}}
            whileTap={!card.flipped && !card.matched && canClick ? { scale: 0.95 } : {}}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center cursor-pointer select-none
              transition-all duration-300 text-2xl sm:text-3xl
              ${card.matched
                ? 'border-nova/40 bg-nova/10 opacity-60'
                : card.flipped
                ? 'border-ion/50 bg-ion/10 shadow-ion'
                : 'border-mist/30 bg-ash hover:border-ion/30 hover:bg-ash/80'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span
                  key="front"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.icon}
                </motion.span>
              ) : (
                <motion.span
                  key="back"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 0.3 }}
                  transition={{ duration: 0.2 }}
                  className="text-ion text-sm font-display"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
