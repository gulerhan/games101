import React from 'react';
import './DifficultySelection.css';

const DifficultySelection = ({ onSelectDifficulty, onBack }) => {
  const difficulties = [
    { level: 'easy', label: 'Easy', speed: 150 },
    { level: 'normal', label: 'Normal', speed: 100 },
    { level: 'hard', label: 'Hard', speed: 60 }
  ];

  return (
    <div className="difficulty-selection">
      <h1 className="difficulty-title">Zorluk Seç</h1>
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
      {onBack && (
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      )}
    </div>
  );
};

export default DifficultySelection;
