import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ currentType, onTypeChange }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  console.log('Header - currentUser:', currentUser);

  const handleTypeChange = (type) => {
    if (onTypeChange) {
      onTypeChange(type);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="type-tabs">
          <button
            className={`type-tab ${currentType === 'hiragana' ? 'active' : ''}`}
            onClick={() => handleTypeChange('hiragana')}
          >
            ひらがな
          </button>
          <button
            className={`type-tab ${currentType === 'katakana' ? 'active' : ''}`}
            onClick={() => handleTypeChange('katakana')}
          >
            カタカナ
          </button>
          <button
            className={`type-tab ${currentType === 'kanji' ? 'active' : ''}`}
            onClick={() => handleTypeChange('kanji')}
          >
            漢字
          </button>
        </div>
      </div>
      <div className="header-right">
        {currentUser && (
          <div className="user-info">
            <span className="user-name">{currentUser.username}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 