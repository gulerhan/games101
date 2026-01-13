import React from 'react';
import './GameSelection.css';

const GameSelection = ({ onSelectGame }) => {
  const games = [
    { id: 'snake', name: 'Yılan Oyunu', icon: '🐍' },
    { id: 'tetris', name: 'Tetris', icon: '🧱' }
  ];

  return (
    <div className="game-selection">
      <h1 className="game-selection-title">Oyun Seçin</h1>
      <div className="game-buttons">
        {games.map((game) => (
          <button
            key={game.id}
            className="game-button"
            onClick={() => onSelectGame(game.id)}
          >
            <span className="game-name">{game.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameSelection;
