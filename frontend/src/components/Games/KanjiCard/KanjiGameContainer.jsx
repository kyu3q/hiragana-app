import React, { useState, useEffect } from 'react';
import './KanjiGames.css';
import SnakeGame from './SnakeGame';
import CatchGame from './CatchGame';
import BlockGame from './BlockGame';
import JumpGame from './JumpGame';
import AirplaneGame from './AirplaneGame';
import BattleGame from './BattleGame';
import { playFinishSound } from '../../../utils/soundPlayer';
import { bgm } from '../../../utils/bgm/bgmPlayer';
import { BGM_TRACK_IDS } from '../../../utils/bgm/bgmTracks';
import { createBrowserMuteStore } from '../../../utils/bgm/bgmSettings';

const muteStore = createBrowserMuteStore();

const KanjiGameContainer = ({ kanji, onClose }) => {
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [muted, setMuted] = useState(() => muteStore.get());

  // ミュート設定を BGM に反映する（再生を始める前に設定しておく）
  useEffect(() => {
    bgm.setMuted(muted);
  }, [muted]);

  // ゲームを開いている間だけ、そのゲームのBGMを流す。クリアしたら止める（クリア音と重ならないように）
  const { gameType } = kanji;
  useEffect(() => {
    if (completed || !BGM_TRACK_IDS.includes(gameType)) return undefined;
    bgm.play(gameType);
    return () => bgm.stop();
  }, [gameType, completed]);

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    muteStore.set(next);
  };

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
        <div>
          <button className="ghost" onClick={onClose} style={{fontSize: '1.2rem', padding: '4px 12px'}}>← もどる</button>
          <span className="game-title" style={{marginLeft: '12px'}}>{kanji.char} のゲーム</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="ghost"
            onClick={toggleMuted}
            aria-label={muted ? 'BGMをつける' : 'BGMを消す'}
            style={{ fontSize: '1.2rem', padding: '4px 12px' }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <div className="game-score">
            {score} pt
          </div>
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
