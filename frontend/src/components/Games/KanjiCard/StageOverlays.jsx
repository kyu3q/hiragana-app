import React, { useEffect } from 'react';

// ステージの名前を見せてから、onDone を呼ぶ（既定は2秒）
export const StageIntro = ({ title, message, onDone, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  return (
    <div className="game-instruction-overlay">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
};

export const StageClear = ({ score, onNext }) => (
  <div className="game-result-modal">
    <h2>ステージクリア！</h2>
    <div style={{ fontSize: '2rem', margin: '10px 0' }}>スコア: {score}</div>
    <button className="start-btn" onClick={onNext}>つぎへ</button>
  </div>
);
