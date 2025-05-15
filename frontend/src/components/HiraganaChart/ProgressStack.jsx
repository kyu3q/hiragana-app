import React from 'react';

const ProgressStack = ({ count, icon }) => {
  const topRow = [];
  const bottomRow = [];
  for (let i = 0; i < 5; i++) {
    topRow.push(
      <span key={i} className="bento-stack-item">
        {i < count ? icon : <span className="bento-placeholder"></span>}
      </span>
    );
  }
  for (let i = 5; i < 9; i++) {
    bottomRow.push(
      <span key={i} className="bento-stack-item">
        {i < count ? icon : <span className="bento-placeholder"></span>}
      </span>
    );
  }
  return (
    <div className="bento-stack">
      <div className="bento-stack-row">{topRow}</div>
      <div className="bento-stack-row">{bottomRow}</div>
    </div>
  );
};

export default ProgressStack; 