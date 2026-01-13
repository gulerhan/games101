import React from 'react';
import './TetrisGame.css';

const TetrisGame = ({ onBack }) => {
  return (
    <div className="tetris-game-container">
      <div className="tetris-header">
        <button className="back-button" onClick={onBack}>Geri</button>
        <h1 className="tetris-title">Tetris (Yakında)</h1>
      </div>

      <div className="tetris-placeholder">
        <p>Bu oyun yakında eklenecek. Şimdilik bu bir yer tutucudur.</p>
      </div>
    </div>
  );
};

export default TetrisGame;
