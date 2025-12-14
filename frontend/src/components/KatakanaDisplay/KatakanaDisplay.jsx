import React, { useState, useEffect } from 'react';
import './KatakanaDisplay.css';
import CharacterItem from '../CharacterItem';
import { katakanaGroups } from '../../data/katakanaData';
import WritingGrid from '../WritingGrid/WritingGrid';
import KatakanaChart from '../KatakanaChart';
import GameMode from '../Games/Kana/GameMode';

const KatakanaDisplay = ({ showGameMode, setShowGameMode }) => {
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
  const half = Math.ceil(katakanaGroups.length / 2);
  const groupRows = [
    katakanaGroups.slice(0, half),
    katakanaGroups.slice(half)
  ];

  return (
    <div className="katakana-display">
      <div className="header-row">
        <h1 className="title stylish-title">カタカナであそぼう！</h1>
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
            カタカナ表
          </button>
        </div>
      </div>

      <div className="shinkansen-wrapper">
        <div className="group-rail-rows">
          {groupRows.map((row, rowIdx) => (
            <div className="katakana-train-row" key={rowIdx} style={{position: 'relative'}}>
              <div className="train-rail"></div>
              {/* 先頭車両 */}
              <div className="katakana-train-head">
                <div className="train-head-body">
                  <div className="train-window"></div>
                  {rowIdx === 0 ? (
                    <img src="/img/kabutomushi.png" alt="カブトムシ" className="train-driver-img" />
                  ) : (
                    <img src="/img/kuwagata.png" alt="クワガタ" className="train-driver-img" />
                  )}
                  <div className="train-smoke"></div>
                </div>
                <div className="train-wheel train-wheel-left"></div>
                <div className="train-wheel train-wheel-right"></div>
              </div>
              {/* 各車両 */}
              {row.map((group, index) => (
                <React.Fragment key={group.name}>
                  <div className="katakana-train-car" style={{ position: 'relative' }}>
                    <button
                      className={`train-car-body ${currentGroup === katakanaGroups.indexOf(group) ? 'active' : ''}`}
                      onClick={() => changeGroup(katakanaGroups.indexOf(group))}
                    >
                      <div className="train-window"><span>{group.name}</span></div>
                    </button>
                    <div className="train-wheel train-wheel-left"></div>
                    <div className="train-wheel train-wheel-right"></div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="characters-area">
        <div className="characters-grid">
          {chunkArray(katakanaGroups[currentGroup].characters, 5).map((row, rowIndex) => (
            <div className="characters-row" key={rowIndex}>
              {row.map((char, index) => (
                <CharacterItem
                  key={index}
                  character={char}
                  onClick={handleCharacterClick}
                  className="katakana-character-item"
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
          type="KATAKANA"
        />
      )}

      {showChart && (
        <KatakanaChart onClose={() => setShowChart(false)} />
      )}
    </div>
  );
};

export default KatakanaDisplay;
