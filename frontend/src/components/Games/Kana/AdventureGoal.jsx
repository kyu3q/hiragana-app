import React from 'react';

// 山頂の旗（ゴール）。高さは 100px（ラベル 20px + 山 80px）。
// 道の終点は、この山の底（下端）に合わせる。
export const GOAL_HEIGHT = 100;

const AdventureGoal = ({ top }) => (
  <div className="adventure-goal" style={{ top: `${top}px` }}>
    <span className="goal-label">ゴール</span>
    <svg className="goal-peak" viewBox="0 0 90 80" aria-hidden="true">
      <path d="M5 78 L45 22 L85 78Z" fill="#a9b9e6" />
      <path d="M33 40 L45 22 L57 40 Q51 36 45 42 Q39 36 33 40Z" fill="#fff" />
      <rect x="44" y="0" width="3" height="26" fill="#795548" />
      <path d="M47 2 L72 10 L47 18Z" fill="#ef5350" />
    </svg>
  </div>
);

export default AdventureGoal;
