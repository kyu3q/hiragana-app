import React, { useState, useRef } from 'react';
import './GameMode.css';
import ShiritoriGame from './ShiritoriGame';
import MemoryGame from './MemoryGame';

// ゲームの設定を管理するオブジェクト
const GAMES = {
  shiritori: {
    component: ShiritoriGame,
    name: 'しりとりゲーム'
  },
  memory: {
    component: MemoryGame,
    name: '文字記憶ゲーム'
  }
};

const GameMode = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState(() => {
    const gameKeys = Object.keys(GAMES);
    return gameKeys[Math.floor(Math.random() * gameKeys.length)];
  });
  const gameRef = useRef(null);

  const handleRetry = () => {
    // 現在のゲームのコンポーネントを強制的に再マウント
    const currentGame = selectedGame;
    setSelectedGame(null);
    setTimeout(() => {
      setSelectedGame(currentGame);
    }, 0);
  };

  const handleGameSwitch = () => {
    const gameKeys = Object.keys(GAMES);
    const currentIndex = gameKeys.indexOf(selectedGame);
    const nextIndex = (currentIndex + 1) % gameKeys.length;
    setSelectedGame(gameKeys[nextIndex]);
  };

  const CurrentGame = GAMES[selectedGame]?.component;

  return (
    <div className="game-container">
      <div className="game-content">
        {CurrentGame && <CurrentGame ref={gameRef} onClose={onClose} />}
      </div>
      <div className="game-footer">
        <button className="game-button" onClick={handleRetry}>
          やり直す
        </button>
        <button className="game-button" onClick={handleGameSwitch}>
          ゲーム切替
        </button>
        <button className="game-button" onClick={onClose}>
          終了
        </button>
      </div>
    </div>
  );
};

export default GameMode; 