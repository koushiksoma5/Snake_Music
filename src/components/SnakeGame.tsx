import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  const directionRef = useRef(direction);
  
  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }
    
    if (!hasStarted && !gameOver && e.key !== ' ') {
      setHasStarted(true);
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (directionRef.current !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
        if (directionRef.current !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
        if (directionRef.current !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
        if (directionRef.current !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
        if (gameOver) {
          resetGame();
        } else if (hasStarted) {
          setIsPaused(p => !p);
        } else {
          setHasStarted(true);
        }
        break;
    }
  }, [gameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
    onScoreChange(0);
  };

  const gameLoop = () => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        onScoreChange(newSnake.length - INITIAL_SNAKE.length);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useInterval(gameLoop, (gameOver || isPaused || !hasStarted) ? null : GAME_SPEED);

  return (
    <div className="relative w-full max-w-[500px] aspect-square bg-black border-4 border-[#ff00ff] overflow-hidden">
      {/* Grid rendering */}
      <div 
        className="absolute inset-0 grid" 
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`snake-${index}`}
            className={`
              ${index === 0 ? 'bg-[#00ffff]' : 'bg-[#008888]'}
              border border-black
            `}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}
        
        {/* Food */}
        <div
          className="bg-[#ff00ff] border border-black animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />
      </div>

      {/* Overlays */}
      {(!hasStarted && !gameOver) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center border-2 border-[#00ffff] p-6 bg-black">
            <h2 className="text-xl font-pixel text-[#00ffff] mb-4 glitch" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
            <button 
              onClick={() => setHasStarted(true)}
              className="px-6 py-3 bg-[#ff00ff] text-black font-pixel text-sm hover:bg-[#00ffff] transition-colors cursor-pointer uppercase"
            >
              [ EXECUTE ]
            </button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 screen-tear">
          <div className="text-center border-4 border-[#ff00ff] p-8 bg-black">
            <h2 className="text-2xl font-pixel text-[#ff00ff] mb-4 glitch" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-lg font-terminal text-[#00ffff] mb-6">DATA_CORRUPTION_DETECTED</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-[#00ffff] text-black font-pixel text-sm hover:bg-[#ff00ff] transition-colors cursor-pointer uppercase"
            >
              [ REBOOT ]
            </button>
          </div>
        </div>
      )}

      {isPaused && hasStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <h2 className="text-2xl font-pixel text-[#ff00ff] tracking-widest glitch" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h2>
        </div>
      )}
    </div>
  );
}
