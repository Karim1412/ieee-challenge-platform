import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const W = CELL * COLS;
const H = CELL * ROWS;
const TICK = 120;

const randCell = () => ({
  x: Math.floor(Math.random() * COLS),
  y: Math.floor(Math.random() * ROWS),
});

export default function SnakeGame({ onGameEnd }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const intervalRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [counting, setCounting] = useState(false);

  const initState = () => ({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: randCell(),
    score: 0,
    running: true,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    // Background
    ctx.fillStyle = '#04050a';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,212,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // Food
    const fx = s.food.x * CELL + CELL / 2;
    const fy = s.food.y * CELL + CELL / 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff2d7e';
    ctx.fillStyle = '#ff2d7e';
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const ratio = i / s.snake.length;
      const r = Math.floor(0 + ratio * 123);
      const g = Math.floor(212 + ratio * 43);
      const b = Math.floor(255 - ratio * 58);
      ctx.shadowBlur = i === 0 ? 20 : 8;
      ctx.shadowColor = `rgb(${r},${g},${b})`;
      ctx.fillStyle = `rgb(${r},${g},${b})`;

      const padding = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL + padding,
        seg.y * CELL + padding,
        CELL - padding * 2,
        CELL - padding * 2,
        i === 0 ? 4 : 2
      );
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s?.running) return;

    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      s.running = false;
      setGameOver(true);
      setScore(s.score);
      setHighScore(prev => Math.max(prev, s.score));
      clearInterval(intervalRef.current);
      return;
    }

    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.running = false;
      setGameOver(true);
      setScore(s.score);
      setHighScore(prev => Math.max(prev, s.score));
      clearInterval(intervalRef.current);
      return;
    }

    s.snake.unshift(head);

    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 10;
      setScore(s.score);
      let newFood;
      do { newFood = randCell(); }
      while (s.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
      s.food = newFood;
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw]);

  const startGame = () => {
    setCounting(true);
    setCountdown(3);
    setGameOver(false);
    stateRef.current = initState();
    setScore(0);

    let c = 3;
    const countInterval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(countInterval);
        setCounting(false);
        setStarted(true);
        intervalRef.current = setInterval(tick, TICK);
      }
    }, 1000);
  };

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKey = (e) => {
      const s = stateRef.current;
      if (!s) return;
      const d = s.dir;
      switch (e.key) {
        case 'ArrowUp':    if (d.y !== 1)  s.nextDir = { x: 0, y: -1 }; break;
        case 'ArrowDown':  if (d.y !== -1) s.nextDir = { x: 0, y: 1 };  break;
        case 'ArrowLeft':  if (d.x !== 1)  s.nextDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (d.x !== -1) s.nextDir = { x: 1, y: 0 };  break;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDpad = (dir) => {
    const s = stateRef.current;
    if (!s) return;
    const d = s.dir;
    switch (dir) {
      case 'up':    if (d.y !== 1)  s.nextDir = { x: 0, y: -1 }; break;
      case 'down':  if (d.y !== -1) s.nextDir = { x: 0, y: 1 };  break;
      case 'left':  if (d.x !== 1)  s.nextDir = { x: -1, y: 0 }; break;
      case 'right': if (d.x !== -1) s.nextDir = { x: 1, y: 0 };  break;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="glass-card rounded-lg px-4 py-2">
          <div className="font-mono-tech text-ghost text-xs">SCORE</div>
          <div className="font-display text-nova text-xl">{score}</div>
        </div>
        <h2 className="font-display text-nova text-lg">SERPENT</h2>
        <div className="glass-card rounded-lg px-4 py-2">
          <div className="font-mono-tech text-ghost text-xs">BEST</div>
          <div className="font-display text-star text-xl">{highScore}</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-nova/20 rounded-xl overflow-hidden shadow-nova">
        <canvas ref={canvasRef} width={W} height={H} className="block max-w-full" />

        {/* Overlays */}
        {!started && !counting && (
          <div className="absolute inset-0 bg-void/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="text-6xl mb-4 animate-float">🐍</div>
            <p className="font-display text-nova text-lg mb-2">SERPENT PROTOCOL</p>
            <p className="text-ghost text-sm mb-6 text-center px-8">Use arrow keys or D-pad.<br />Eat data packets. Don't crash.</p>
            <button onClick={startGame} className="btn-nova px-8 py-3 rounded-xl text-sm">
              INITIALIZE →
            </button>
          </div>
        )}

        {counting && (
          <div className="absolute inset-0 bg-void/90 flex items-center justify-center">
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="font-display text-8xl text-nova"
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.div>
          </div>
        )}

        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-void/90 flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <div className="font-display text-pulse text-2xl mb-2">SYSTEM CRASH</div>
            <div className="font-mono-tech text-ghost text-sm mb-4">Final Score: <span className="text-nova">{score}</span></div>
            <div className="flex gap-3">
              <button onClick={startGame} className="btn-nova px-6 py-2 rounded-lg text-xs">
                RETRY
              </button>
              <button
                onClick={() => onGameEnd(score)}
                className="btn-star-solid px-6 py-2 rounded-lg text-xs"
              >
                SUBMIT SCORE
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* D-pad for mobile */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onTouchStart={() => handleDpad('up')} onClick={() => handleDpad('up')}
          className="bg-ash border border-nova/30 rounded-lg p-4 text-nova text-lg active:bg-nova/20">▲</button>
        <div />
        <button onTouchStart={() => handleDpad('left')} onClick={() => handleDpad('left')}
          className="bg-ash border border-nova/30 rounded-lg p-4 text-nova text-lg active:bg-nova/20">◄</button>
        <button onTouchStart={() => handleDpad('down')} onClick={() => handleDpad('down')}
          className="bg-ash border border-nova/30 rounded-lg p-4 text-nova text-lg active:bg-nova/20">▼</button>
        <button onTouchStart={() => handleDpad('right')} onClick={() => handleDpad('right')}
          className="bg-ash border border-nova/30 rounded-lg p-4 text-nova text-lg active:bg-nova/20">►</button>
      </div>

      {started && !gameOver && (
        <button
          onClick={() => {
            clearInterval(intervalRef.current);
            setGameOver(true);
            setScore(stateRef.current?.score || 0);
          }}
          className="btn-pulse px-6 py-2 rounded-lg text-xs"
        >
          ABORT MISSION
        </button>
      )}
    </div>
  );
}
