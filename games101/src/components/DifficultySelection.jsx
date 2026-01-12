import React, { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import './DifficultySelection.css';

const DifficultySelection = ({ onSelectDifficulty, onBack }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  
  const difficulties = [
    { level: 'easy', label: 'Kolay', speed: 150 },
    { level: 'normal', label: 'Normal', speed: 100 },
    { level: 'hard', label: 'Zor', speed: 60 }
  ];

  const handlePlay = () => {
    if (selectedDifficulty) {
      onSelectDifficulty(selectedDifficulty);
    }
  };

  return (
    <div className="difficulty-selection">
      <h1 className="difficulty-title">Zorluk Seç</h1>
      <div className="difficulty-buttons">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.level}
            className={`difficulty-button ${selectedDifficulty?.level === difficulty.level ? 'selected' : ''}`}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            {difficulty.label}
          </button>
        ))}
      </div>
      {selectedDifficulty && (
        <button className="play-button" onClick={handlePlay}>
          Oyna
        </button>
      )}
      {onBack && (
        <button className="back-button" onClick={onBack}>
          <AiOutlineArrowLeft />
        </button>
      )}
    </div>
  );
};

export default DifficultySelection;
