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
  const [failed, setFailed] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [muted, setMuted] = useState(() => muteStore.get());

  // ミュート設定を BGM に反映する（再生を始める前に設定しておく）
  useEffect(() => {
    bgm.setMuted(muted);
  }, [muted]);

  // ゲームを開いている間だけ、そのゲームのBGMを流す。クリア・失敗の画面では止める（クリア音と重ならないように）
  const { gameType } = kanji;
  useEffect(() => {
    if (completed || failed || !BGM_TRACK_IDS.includes(gameType)) return undefined;
    bgm.play(gameType);
    return () => bgm.stop();
  }, [gameType, completed, failed]);

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
    } else {
      setFailed(true);
    }
  };

  const handleAddScore = (points) => {
    setScore(prev => Math.max(0, prev + points));
  };

  const handleRetry = () => {
    setCompleted(false);
    setFailed(false);
    setScore(0);
    setGameKey(prev => prev + 1);
  };

  const renderGame = () => {
    const { gameType, gameConfig } = kanji;

    switch (gameType) {
      case 'snake':
        return <SnakeGame key={gameKey} config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'catch':
        return <CatchGame key={gameKey} config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'block':
        return <BlockGame key={gameKey} config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'jump':
        return <JumpGame key={gameKey} config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'airplane':
        return <AirplaneGame key={gameKey} config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
      case 'battle':
        return <BattleGame key={gameKey} config={gameConfig} onComplete={handleComplete} onAddScore={handleAddScore} />;
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
        <button
          className="game-close-btn"
          onClick={toggleMuted}
          aria-label={muted ? 'BGMをつける' : 'BGMを消す'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button className="game-close-btn" onClick={onClose}>×</button>
      </div>
      
      {renderGame()}
      
      {completed && (
        <div className="game-result-overlay">
          <div className="game-result-modal-new">
            <div className="result-decoration"></div>
            <div className="result-emojis">
              <span className="emoji-float" style={{animationDelay: '0s'}}>✨</span>
              <span className="emoji-float" style={{animationDelay: '0.3s'}}>🌟</span>
              <span className="emoji-float" style={{animationDelay: '0.6s'}}>⭐</span>
              <span className="emoji-float" style={{animationDelay: '0.9s'}}>💫</span>
            </div>
            <h2 className="result-title">クリア！🎉</h2>
            <p className="result-kanji">{kanji.char}</p>
            <p className="result-message">すごい！ {kanji.char} マスターだね！</p>
            {kanji.gameConfig?.targetScore && (
              <p className="result-score">スコア: {score} / {kanji.gameConfig.targetScore}</p>
            )}
            <div className="result-buttons">
              <button className="result-btn secondary" onClick={handleRetry}>リトライ</button>
              <button className="result-btn primary" onClick={onClose}>メニューへ</button>
            </div>
          </div>
        </div>
      )}

      {failed && (
        <div className="game-result-overlay">
          <div className="game-result-modal-new failed">
            <div className="result-decoration-failed"></div>
            <div className="result-emojis">
              <span className="emoji-float" style={{animationDelay: '0s'}}>💧</span>
              <span className="emoji-float" style={{animationDelay: '0.3s'}}>😢</span>
              <span className="emoji-float" style={{animationDelay: '0.6s'}}>💦</span>
              <span className="emoji-float" style={{animationDelay: '0.9s'}}>😓</span>
            </div>
            <h2 className="result-title-failed">ざんねん... 😢</h2>
            <p className="result-kanji-failed">{kanji.char}</p>
            <p className="result-message">もう一度チャレンジしてみよう！</p>
            {kanji.gameConfig?.targetScore && (
              <p className="result-score-failed">スコア: {score} / {kanji.gameConfig.targetScore}</p>
            )}
            <div className="result-buttons">
              <button className="result-btn secondary" onClick={handleRetry}>リトライ</button>
              <button className="result-btn primary" onClick={onClose}>メニューへ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanjiGameContainer;
