import React from 'react';
import { DIFFICULTIES } from './adventureConfig';

const DifficultySelect = ({ onSelect }) => (
  <div className="difficulty-select">
    <div className="difficulty-title">むずかしさを えらんでね</div>
    <div className="difficulty-list">
      {Object.entries(DIFFICULTIES).map(([key, difficulty]) => (
        <button key={key} className="difficulty-btn" onClick={() => onSelect(key)}>
          <span className="difficulty-emoji">{difficulty.emoji}</span>
          <span className="difficulty-label">{difficulty.label}</span>
          <span className="difficulty-hearts" role="img" aria-label={`ハート ${difficulty.hearts} こ`}>{'❤️'.repeat(difficulty.hearts)}</span>
        </button>
      ))}
    </div>
  </div>
);

export default DifficultySelect;
