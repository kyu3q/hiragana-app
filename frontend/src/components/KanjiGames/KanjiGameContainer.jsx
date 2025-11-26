import React, { useState } from 'react';
import './KanjiGames.css';
import SnakeGame from './SnakeGame';
import CatchGame from './CatchGame';
import BlockGame from './BlockGame';
import JumpGame from './JumpGame';

const KanjiGameContainer = ({ kanji, onClose }) => {
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleComplete = (success) => {
    if (success) {
      setCompleted(true);
      // Play success sound
      const audio = new Audio('/music/success.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed', e));
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
        <div>
          <button className="ghost" onClick={onClose} style={{fontSize: '1.2rem', padding: '4px 12px'}}>← もどる</button>
          <span className="game-title" style={{marginLeft: '12px'}}>{kanji.char} のゲーム</span>
        </div>
        <div className="game-score">
          {score} pt
        </div>
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
