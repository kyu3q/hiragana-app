import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ score }) => {
  // 星の数を計算（5点ごとに1つ）
  const stars = Math.floor(score / 5);
  
  return (
    <div className="score-board">
      <div className="score-label">せいかい：</div>
      <div className="score-value">{score}</div>
      <div className="score-stars">
        {[...Array(stars)].map((_, i) => (
          <span key={i} className="star">⭐</span>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard; 