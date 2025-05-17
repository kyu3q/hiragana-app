import React, { useEffect } from 'react';
import './GameMode.css';
import ShiritoriGame from './ShiritoriGame';

const GameMode = ({ onClose, type }) => {
  // しりとりゲームのみ
  return (
    <div className="game-container">
      <ShiritoriGame onClose={onClose} type={type} />
    </div>
  );
};

export default GameMode; 