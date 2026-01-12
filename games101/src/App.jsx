import React, { useState } from 'react';
import DifficultySelection from './components/DifficultySelection';
import SnakeGame from './components/SnakeGame';
import './App.css';

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleBackToMenu = () => {
    setSelectedDifficulty(null);
  };

  const handleGameOver = (finalScore) => {
    // Game over logic can be extended here
    console.log('Game Over! Final Score:', finalScore);
  };

  return (
    <div className="app">
      {!selectedDifficulty ? (
        <DifficultySelection onSelectDifficulty={handleDifficultySelect} />
      ) : (
        <SnakeGame
          difficulty={selectedDifficulty}
          onGameOver={handleGameOver}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
