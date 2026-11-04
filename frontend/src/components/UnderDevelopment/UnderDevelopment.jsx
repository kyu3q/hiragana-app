import React from 'react';
import './UnderDevelopment.css';

const UnderDevelopment = ({ grade }) => {
  return (
    <div className="under-development">
      <div className="under-development-content">
        <div className="construction-icons">
          <span className="construction-icon">🚧</span>
          <span className="construction-icon">👷</span>
          <span className="construction-icon">🔨</span>
          <span className="construction-icon">🏗️</span>
        </div>
        <h2 className="development-message">
          {grade}年生の漢字は開発中です
        </h2>
      </div>
    </div>
  );
};

export default UnderDevelopment;
