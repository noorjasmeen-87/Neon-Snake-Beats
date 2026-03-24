import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving up
const BASE_SPEED = 100;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  const lastProcessedDirectionRef = useRef(direction);

  // Sync direction state to ref for the game loop
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) startGame();
        else setIsPaused((p) => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = lastProcessedDirectionRef.current;
      let newDir = { ...directionRef.current };

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }

      setDirection(newDir);
    },
    [isPaused, gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const currentDir = directionRef.current;
      lastProcessedDirectionRef.current = currentDir;

      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, isPaused, gameOver, highScore]);

  useEffect(() => {
    const speed = Math.max(40, BASE_SPEED - Math.floor(score / 50) * 8);
    const interval = setInterval(gameLoop, speed);
    return () => clearInterval(interval);
  }, [gameLoop, score]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Board */}
      <div className="flex items-center justify-between w-full max-w-[400px] bg-zinc-900/80 border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-400 uppercase tracking-wider font-bold">Score</span>
          <span className="text-3xl font-mono font-bold text-white neon-text-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-pink-400 uppercase tracking-wider font-bold flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High Score
          </span>
          <span className="text-3xl font-mono font-bold text-white neon-text-pink">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div 
          className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-zinc-950 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {/* Grid Background Lines (Optional, for aesthetic) */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
               style={{
                 backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)',
                 backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
               }}
          />

          {/* Food */}
          <div
            className="bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,1)] z-10 animate-pulse"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              transform: 'scale(0.8)',
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            const progress = index / snake.length;
            const opacity = Math.max(0.2, 1 - progress);
            const scale = isHead ? 1.1 : Math.max(0.4, 0.95 - progress * 0.5);
            
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`${
                  isHead ? 'bg-cyan-400 z-20' : 'bg-cyan-400 z-10'
                } rounded-sm transition-all duration-75`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  opacity: opacity,
                  boxShadow: isHead 
                    ? '0 0 20px rgba(34,211,238,1)' 
                    : `0 0 ${15 * (1 - progress)}px rgba(34,211,238,${opacity})`,
                  transform: `scale(${scale})`,
                }}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-30">
            {gameOver ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <h2 className="text-4xl font-black text-pink-500 mb-2 neon-text-pink tracking-widest">GAME OVER</h2>
                <p className="text-zinc-400 mb-6 font-mono">Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 mx-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-current" /> Start Game
                </button>
                <p className="mt-6 text-sm text-zinc-400 font-mono">Use Arrow Keys or WASD to move</p>
                <p className="mt-2 text-sm text-zinc-500 font-mono">Press Space to pause</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
