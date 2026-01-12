import React from 'react';
import './DifficultySelection.css';

const DifficultySelection = ({ onSelectDifficulty }) => {
  const difficulties = [
    { level: 'easy', label: 'Easy', speed: 150 },
    { level: 'normal', label: 'Normal', speed: 100 },
    { level: 'hard', label: 'Hard', speed: 60 }
  ];

  return (
    <div className="difficulty-selection">
      <h1 className="difficulty-title">Choose Difficulty</h1>
      <div className="difficulty-buttons">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.level}
            className="difficulty-button"
            onClick={() => onSelectDifficulty(difficulty)}
          >
            {difficulty.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelection;
