import React, { useState } from 'react';
import './KanjiGames.css';
import SnakeGame from './SnakeGame';
import CatchGame from './CatchGame';
import BlockGame from './BlockGame';
import JumpGame from './JumpGame';
import AirplaneGame from './AirplaneGame';
import BattleGame from './BattleGame';
import { playFinishSound } from '../../../utils/soundPlayer';

const KanjiGameContainer = ({ kanji, onClose }) => {
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleComplete = (success) => {
    if (success) {
      setCompleted(true);
      // Play success sound
      playFinishSound();
    }
  };

  const handleAddScore = (points) => {
    setScore(prev => Math.max(0, prev + points));
  };

  const renderGame = () => {
    const { gameType, gameConfig } = kanji;
    
    switch (gameType) {
      case 'snake':
        return <SnakeGame config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'catch':
        return <CatchGame config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'block':
        return <BlockGame config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'jump':
        return <JumpGame config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'airplane':
        return <AirplaneGame config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'battle':
        return <BattleGame config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      default:
        return (
          <div className="game-instruction-overlay">
            <h3>準備中</h3>
            <p>この漢字のゲームはまだ開発中です！</p>
            <button className="start-btn" onClick={onClose}>戻る</button>
          </div>
        );
    }
  };

  return (
    <div className="kanji-game-container">
      <div className="game-header">
        <span className="game-kanji">{kanji.char}</span>
        <span className="game-score">
          {kanji.gameConfig?.targetScore
            ? `${score}/${kanji.gameConfig.targetScore}`
            : `${score} pt`}
        </span>
        <button className="game-close-btn" onClick={onClose}>×</button>
      </div>
      
      {renderGame()}
      
      {completed && (
        <div className="game-result-modal">
          <h2>クリア！🎉</h2>
          <p>すごい！ {kanji.char} マスターだね！</p>
          <p style={{fontSize: '3rem', margin: '20px 0'}}>{kanji.char}</p>
          <button className="start-btn" onClick={onClose}>メニューへ</button>
        </div>
      )}
    </div>
  );
};

export default KanjiGameContainer;
