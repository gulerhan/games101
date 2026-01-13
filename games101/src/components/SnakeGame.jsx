import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AiFillBackward   } from 'react-icons/ai';
import './SnakeGame.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };

const SnakeGame = ({ difficulty, onGameOver, onBack }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      const v = window.localStorage.getItem('snake-highscore');
      return v ? parseInt(v, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const scoreRef = useRef(0);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) {
      return generateFood();
    }
    
    return newFood;
  }, [snake]);

  const checkCollision = useCallback((head, snakeBody) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Self collision
    for (let segment of snakeBody) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    
    return false;
  }, []);

  const moveSnake = useCallback(() => {
    if (direction.x === 0 && direction.y === 0) return;
    if (gameOver || paused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check collision
      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        console.log('Yem yendi! Mevcut skor:', score);
        setScore(prev => prev + 5);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, paused, checkCollision, generateFood]);

  // Persist high score whenever score exceeds it
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        window.localStorage.setItem('snake-highscore', String(score));
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [score, highScore]);

  useEffect(() => {
    if (gameOver) {
      onGameOverRef.current(scoreRef.current);
      return;
    }

    const gameInterval = setInterval(moveSnake, difficulty.speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameOver, difficulty.speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setScore(0);
    setGameOver(false);
    setPaused(false);
  };

  return (
    <div className="snake-game-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          <AiFillBackward   />
        </button>
        <div>
          <div className="score">Skor: {score}</div>
        </div>
        <button className="pause-button" onClick={() => setPaused(!paused)}>
          {paused ? 'Başlat' : 'Durdur'}
        </button>
      </div>
      
      <div className="game-board">
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const isSnakeHead = snake[0]?.x === col && snake[0]?.y === row;
            const isSnakeBody = snake.slice(1).some(segment => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;

            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${
                  isSnakeHead
                    ? 'snake-head'
                    : isSnakeBody
                    ? 'snake-body'
                    : isFood
                    ? 'food'
                    : ''
                }`}
              />
            );
          })
        )}
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Oyun Bitti!</h2>
            <p>Skorun: {score}</p>
            <p className="high-score-overlay">En Yüksek Skor: {highScore}</p>
            <div className="game-over-buttons">
              <button onClick={resetGame}>Tekrar Oyna</button>
              <button onClick={onBack}>Menüye Dön</button>
            </div>
          </div>
        </div>
      )}

      {paused && !gameOver && (
        <div className="paused-overlay">
          <div className="paused-content">
            <h2>Durduruldu</h2>
            <p>Devam etmek için boşluğu kullan</p>
          </div>
        </div>
      )}

      <div className="game-instructions">
        <p>Hareket etmek için ok tuşlarını kullanın</p>
      </div>
    </div>
  );
};

export default SnakeGame;
