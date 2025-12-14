import React, { useState, useEffect } from 'react';
import './HiraganaDisplay.css';
import CharacterItem from '../CharacterItem';
import { hiraganaGroups } from '../../data/hiraganaData';
import WritingGrid from '../WritingGrid/WritingGrid';
import HiraganaChart from '../HiraganaChart/HiraganaChart';
import GameMode from '../Games/Kana/GameMode';

const HiraganaDisplay = ({ showGameMode, setShowGameMode }) => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showChart, setShowChart] = useState(false);

  // 文字がクリックされたときの処理
  const handleCharacterClick = (char) => {
    setSelectedCharacter(char);
    setShowWritingGrid(true);
  };

  const handleCloseWritingGrid = () => {
    setShowWritingGrid(false);
    setSelectedCharacter(null);
  };

  // 行を切り替える
  const changeGroup = (index) => {
    setCurrentGroup(index);
  };

  // コンポーネントがアンマウントされるときに音声を停止
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // 5文字ごとに配列を分割する関数
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // 2行に分割
  const half = Math.ceil(hiraganaGroups.length / 2);
  const groupRows = [
    hiraganaGroups.slice(0, half),
    hiraganaGroups.slice(half)
  ];

  return (
    <div className="hiragana-display">
      <div className="header-row">
        <h1 className="title stylish-title">ひらがなであそぼう！</h1>
        <div className="mode-toggle-inline">
          <button
            className="chart-button"
            onClick={() => setShowGameMode(true)}
          >
            ゲーム
          </button>
          <button 
            className="chart-button"
            onClick={() => setShowChart(true)}
          >
            ひらがな表
          </button>
        </div>
      </div>

      <div className="shinkansen-wrapper">
        <div className="group-rail-rows">
          {groupRows.map((row, rowIdx) => (
            <div className="group-tabs-rail" key={rowIdx}>
              <button
                className={`group-rail-btn shinkansen-head ${rowIdx === 0 ? 'hayabusa-head' : 'komachi-head'}`}
                disabled
                aria-hidden="true"
              />
              {row.map((group, index) => (
                <React.Fragment key={group.name}>
                  <button
                    className={`group-rail-btn ${currentGroup === hiraganaGroups.indexOf(group) ? 'active' : ''}`}
                    onClick={() => changeGroup(hiraganaGroups.indexOf(group))}
                  >
                    {group.name}
                  </button>
                  {index < row.length - 1 && <span className="rail-connector" />}
                </React.Fragment>
              ))}
              <div className="rail-track" />
            </div>
          ))}
        </div>
      </div>

      <div className="characters-area">
        <div className="characters-grid">
          {chunkArray(hiraganaGroups[currentGroup].characters, 5).map((row, rowIndex) => (
            <div className="characters-row" key={rowIndex}>
              {row.map((char, index) => (
                <CharacterItem
                  key={index}
                  character={char}
                  onClick={handleCharacterClick}
                  className="hiragana-character-item"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {showWritingGrid && selectedCharacter && (
        <WritingGrid
          character={selectedCharacter}
          onClose={handleCloseWritingGrid}
        />
      )}

      {showChart && (
        <div className="chart-modal-overlay">
          <HiraganaChart onClose={() => setShowChart(false)} />
        </div>
      )}
    </div>
  );
};

export default HiraganaDisplay;
