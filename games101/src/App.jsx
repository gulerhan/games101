import React, { useState } from 'react';
import GameSelection from './components/GameSelection';
import DifficultySelection from './components/DifficultySelection';
import SnakeGame from './components/SnakeGame';
import './App.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleBackToGameSelection = () => {
    setSelectedGame(null);
    setSelectedDifficulty(null);
  };

  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
  };

  const handleGameOver = (finalScore) => {
    console.log('Game Over! Final Score:', finalScore);
  };

  return (
    <div className="app">
      {!selectedGame ? (
        <GameSelection onSelectGame={handleGameSelect} />
      ) : !selectedDifficulty ? (
        <DifficultySelection 
          onSelectDifficulty={handleDifficultySelect}
          onBack={handleBackToGameSelection}
        />
      ) : selectedGame === 'snake' ? (
        <SnakeGame
          difficulty={selectedDifficulty}
          onGameOver={handleGameOver}
          onBack={handleBackToDifficulty}
        />
      ) : null}
    </div>
  );
}

export default App;
