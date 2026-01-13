import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AiFillBackward } from 'react-icons/ai';
import './TetrisGame.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const TETROMINOES = [
  {
    shape: [[1, 1, 1, 1]],
    color: '#ffffff'
  },
  {
    shape: [[1, 1], [1, 1]],
    color: '#ffffff'
  },
  {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#ffffff'
  },
  {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#ffffff'
  },
  {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#ffffff'
  },
  {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#ffffff'
  },
  {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#ffffff'
  }
];

const TetrisGame = ({ difficulty, onGameOver, onBack }) => {
  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const gameLoopRef = useRef(null);
  const onGameOverRef = useRef(onGameOver);
  const scoreRef = useRef(0);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const createPiece = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TETROMINOES.length);
    const tetromino = TETROMINOES[randomIndex];
    return {
      shape: tetromino.shape,
      color: tetromino.color
    };
  }, []);

  const isValidMove = useCallback((piece, x, y, boardState) => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && boardState[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece, x, y, boardState) => {
    const newBoard = boardState.map(row => [...row]);
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newY = y + row;
          const newX = x + col;
          if (newY >= 0) {
            newBoard[newY][newX] = piece.color;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((boardState) => {
    let linesCleared = 0;
    const newBoard = boardState.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) linesCleared++;
      return !isFull;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { board: newBoard, linesCleared };
  }, []);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;

    setPosition(prev => {
      const newY = prev.y + 1;
      if (isValidMove(currentPiece, prev.x, newY, board)) {
        return { ...prev, y: newY };
      } else {
        // Place piece
        const newBoard = placePiece(currentPiece, prev.x, prev.y, board);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        
        setBoard(clearedBoard);
        setScore(prevScore => {
          const newScore = prevScore + linesCleared * 100;
          scoreRef.current = newScore;
          return newScore;
        });
        
        // Check game over
        if (prev.y <= 0) {
          setGameOver(true);
          onGameOverRef.current(scoreRef.current);
        } else {
          const newPiece = createPiece();
          const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2);
          setCurrentPiece(newPiece);
          setPosition({ x: startX, y: 0 });
        }
        
        return prev;
      }
    });
  }, [currentPiece, board, gameOver, paused, isValidMove, placePiece, clearLines, createPiece]);

  const rotatePiece = useCallback((piece) => {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[col][rows - 1 - row] = piece.shape[row][col];
      }
    }
    
    return {
      ...piece,
      shape: rotated
    };
  }, []);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      const newPiece = createPiece();
      const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2);
      setCurrentPiece(newPiece);
      setPosition({ x: startX, y: 0 });
    }
  }, [currentPiece, createPiece, gameOver]);

  useEffect(() => {
    if (gameOver || paused || !currentPiece) return;

    // Tetris için speed değerleri daha yavaş olmalı (ms cinsinden)
    // Kolay: 800ms, Normal: 600ms, Zor: 400ms
    const speedMap = { easy: 800, normal: 600, hard: 400 };
    const speed = difficulty?.level ? speedMap[difficulty.level] || 600 : 600;
    
    gameLoopRef.current = setInterval(() => {
      moveDown();
    }, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveDown, gameOver, paused, currentPiece, difficulty]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || paused || !currentPiece) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setPosition(prev => {
            const newX = prev.x - 1;
            if (isValidMove(currentPiece, newX, prev.y, board)) {
              return { ...prev, x: newX };
            }
            return prev;
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPosition(prev => {
            const newX = prev.x + 1;
            if (isValidMove(currentPiece, newX, prev.y, board)) {
              return { ...prev, x: newX };
            }
            return prev;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setCurrentPiece(prev => {
            const rotated = rotatePiece(prev);
            if (isValidMove(rotated, position.x, position.y, board)) {
              return rotated;
            }
            return prev;
          });
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
  }, [currentPiece, board, gameOver, paused, isValidMove, moveDown, rotatePiece, position]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece && !gameOver) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const newY = position.y + row;
            const newX = position.x + col;
            if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
              displayBoard[newY][newX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(null);
    setPosition({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setPaused(false);
  };

  const displayBoard = renderBoard();

  return (
    <div className="tetris-game-container">
      <div className="tetris-header">
        <button className="back-button" onClick={onBack}>
          <AiFillBackward />
        </button>
        <div className="score">Skor: {score}</div>
        <button className="pause-button" onClick={() => setPaused(!paused)}>
          {paused ? 'Başlat' : 'Durdur'}
        </button>
      </div>

      <div className="tetris-board">
        {displayBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="tetris-cell"
              style={{
                backgroundColor: cell || '#000'
              }}
            />
          ))
        )}
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Oyun Bitti!</h2>
            <p>Skorun: {score}</p>
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
        <p>Hareket: Ok Tuşları | Döndür: Yukarı Ok | Durdur: Boşluk</p>
      </div>
    </div>
  );
};

export default TetrisGame;
