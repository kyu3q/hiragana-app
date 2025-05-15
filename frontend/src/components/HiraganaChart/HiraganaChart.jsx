import React, { useState, useEffect } from 'react';
import './HiraganaChart.css';
import WritingGrid from '../WritingGrid/WritingGrid';
import { useAuth } from '../../context/AuthContext';
import { characterService } from '../../api/characterService';

// 画像のような表形式の2次元配列データ
const mainTable = [
  ['ん','わ','ら','や','ま','は','な','た','さ','か','あ'],
  ['','','り','','み','ひ','に','ち','し','き','い'],
  ['','','る','ゆ','む','ふ','ぬ','つ','す','く','う'],
  ['','','れ','','め','へ','ね','て','せ','け','え'],
  ['','を','ろ','よ','も','ほ','の','と','そ','こ','お'],
];

// 濁音・半濁音テーブル（空白セルなし）
const dakuonTable = [
  ['が','ざ','だ','ば','ぱ'],
  ['ぎ','じ','ぢ','び','ぴ'],
  ['ぐ','ず','づ','ぶ','ぷ'],
  ['げ','ぜ','で','べ','ぺ'],
  ['ご','ぞ','ど','ぼ','ぽ'],
];

// 拗音テーブル（きゃ〜びょう）
const youonTable = [
  ['きゃ','ぎゃ','しゃ','じゃ','ちゃ','にゃ','ひゃ','びゃ','ぴゃ','みゃ','りゃ'],
  ['きゅ','ぎゅ','しゅ','じゅ','ちゅ','にゅ','ひゅ','びゅ','ぴゅ','みゅ','りゅ'],
  ['きょ','ぎょ','しょ','じょ','ちょ','にょ','ひょ','びょ','ぴょ','みょ','りょ'],
];

const HiraganaChart = ({ onClose }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const { isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // 0: 清音ページ, 1: 濁音・半濁音ページ, 2: 拗音ページ
  const totalPages = 3;

  // ひらがなからIDへの変換マッピング
  const hiraganaToIds = {
    'あ': 1, 'い': 2, 'う': 3, 'え': 4, 'お': 5,
    'か': 6, 'き': 7, 'く': 8, 'け': 9, 'こ': 10,
    'さ': 11, 'し': 12, 'す': 13, 'せ': 14, 'そ': 15,
    'た': 16, 'ち': 17, 'つ': 18, 'て': 19, 'と': 20,
    'な': 21, 'に': 22, 'ぬ': 23, 'ね': 24, 'の': 25,
    'は': 26, 'ひ': 27, 'ふ': 28, 'へ': 29, 'ほ': 30,
    'ま': 31, 'み': 32, 'む': 33, 'め': 34, 'も': 35,
    'や': 36, 'ゆ': 37, 'よ': 38,
    'ら': 39, 'り': 40, 'る': 41, 'れ': 42, 'ろ': 43,
    'わ': 44, 'を': 45, 'ん': 46,
    // 濁音・半濁音・拗音のIDも必要に応じて追加
    'が': 47, 'ぎ': 48, 'ぐ': 49, 'げ': 50, 'ご': 51,
    'ざ': 52, 'じ': 53, 'ず': 54, 'ぜ': 55, 'ぞ': 56,
    'だ': 57, 'ぢ': 58, 'づ': 59, 'で': 60, 'ど': 61,
    'ば': 62, 'び': 63, 'ぶ': 64, 'べ': 65, 'ぼ': 66,
    'ぱ': 67, 'ぴ': 68, 'ぷ': 69, 'ぺ': 70, 'ぽ': 71,
    'きゃ': 72, 'きゅ': 73, 'きょ': 74,
    'しゃ': 75, 'しゅ': 76, 'しょ': 77,
    'ちゃ': 78, 'ちゅ': 79, 'ちょ': 80,
    'にゃ': 81, 'にゅ': 82, 'にょ': 83,
    'ひゃ': 84, 'ひゅ': 85, 'ひょ': 86,
    'みゃ': 87, 'みゅ': 88, 'みょ': 89,
    'りゃ': 90, 'りゅ': 91, 'りょ': 92,
    'ぎゃ': 93, 'ぎゅ': 94, 'ぎょ': 95,
    'じゃ': 96, 'じゅ': 97, 'じょ': 98,
    'びゃ': 99, 'びゅ': 100, 'びょ': 101,
    'ぴゃ': 102, 'ぴゅ': 103, 'ぴょ': 104
  };

  // ひらがなからローマ字への変換マッピング (補助的に残しておく)
  const hiraganaToRomaji = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n'
  };

  // 進捗データを取得する関数
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!isAuthenticated) return;
      
      try {
        // 各ひらがなの進捗状況を取得
        const progressDataTemp = {};
        
        for (const [char, id] of Object.entries(hiraganaToIds)) {
          try {
            const results = await characterService.getAllStrokeResults(id);
            if (results && Array.isArray(results)) {
              // 60点以上のストロークの数をカウント
              const goodScoresCount = results.filter(r => r.score >= 60).length;
              // なぞり書き結果の総数
              const totalResults = results.length;
              
              progressDataTemp[char] = {
                total: totalResults,
                goodCount: goodScoresCount,
                status: getProgressStatus(goodScoresCount, totalResults)
              };
            }
          } catch (error) {
            console.log(`${char}の進捗取得エラー:`, error);
          }
        }
        
        setProgressData(progressDataTemp);
      } catch (error) {
        console.error('進捗データの取得に失敗しました:', error);
      }
    };
    
    fetchProgressData();
  }, [isAuthenticated]);

  // 進捗状態を判定する関数
  const getProgressStatus = (goodScoresCount, totalResults) => {
    if (totalResults === 0) return 'not-started';        // 結果なし
    if (goodScoresCount === 0) return 'attempted';       // 結果あり、60点以上なし
    if (goodScoresCount >= 9) return 'completed';        // 9件すべて60点以上
    if (goodScoresCount >= 1) return 'in-progress';      // 1件以上9件未満
    return 'not-started';
  };

  const handleCharClick = (char) => {
    if (char) {
      const id = hiraganaToIds[char] || null;
      const romaji = hiraganaToRomaji[char] || '';
      
      setSelectedChar({
        id: id,  // 数値IDを設定
        char: char,
        romaji: romaji,
        image: ''
      });
      setShowWritingGrid(true);
    }
  };

  const handleCloseWritingGrid = () => {
    setShowWritingGrid(false);
    setSelectedChar(null);
    
    // WritingGrid閉じた後に進捗データを更新
    if (isAuthenticated && selectedChar) {
      const fetchCharProgress = async () => {
        try {
          const id = selectedChar.id;
          const char = selectedChar.char;
          const results = await characterService.getAllStrokeResults(id);
          
          if (results && Array.isArray(results)) {
            const goodScoresCount = results.filter(r => r.score >= 60).length;
            const totalResults = results.length;
            
            setProgressData(prev => ({
              ...prev,
              [char]: {
                total: totalResults,
                goodCount: goodScoresCount,
                status: getProgressStatus(goodScoresCount, totalResults)
              }
            }));
          }
        } catch (error) {
          console.error('文字の進捗更新エラー:', error);
        }
      };
      
      fetchCharProgress();
    }
  };

  // お弁当アイコンを文字の下部に5+4の2段で表示（空白プレースホルダーで高さを揃える）
  const renderBentoStack = (count) => {
    const topRow = [];
    const bottomRow = [];
    for (let i = 0; i < 5; i++) {
      topRow.push(
        <span key={i} className="bento-stack-item">
          {i < count ? '🍱' : <span className="bento-placeholder"></span>}
        </span>
      );
    }
    for (let i = 5; i < 9; i++) {
      bottomRow.push(
        <span key={i} className="bento-stack-item">
          {i < count ? '🍱' : <span className="bento-placeholder"></span>}
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

  return (
    <div className="hiragana-chart-modal-bg">
      <div className="hiragana-chart-modal">
        <div className="hiragana-chart-header">
          <h2>ひらがな表</h2>
          <div className="chart-page-tabs-horizontal">
            {[1,2,3].map((num, idx) => (
              <button
                key={num}
                className={`chart-page-tab${currentPage === idx ? ' active' : ''}`}
                onClick={() => setCurrentPage(idx)}
              >
                {num}
              </button>
            ))}
          </div>
          <button className="hiragana-chart-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="chart-table-wrap">
          <div className="hiragana-chart-content">
            {currentPage === 0 ? (
              // 清音ページ
              <table className="hiragana-table">
                <tbody>
                  {mainTable.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => {
                        // 進捗状態のクラスを取得
                        const progressStatus = cell && progressData[cell] ? progressData[cell].status : '';
                        const progressClass = cell ? `char-cell progress-${progressStatus}` : 'empty';
                        
                        return (
                          <td 
                            key={j} 
                            className={progressClass} 
                            onClick={() => cell ? handleCharClick(cell) : null}
                          >
                            {cell ? (
                              <div className="cell-content">
                                <div className="char-box">{cell}</div>
                                <div className="char-bento-divider"></div>
                                <div className="bento-box">
                                  {renderBentoStack(progressData[cell] ? progressData[cell].goodCount : 0)}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : currentPage === 1 ? (
              // 濁音・半濁音ページ
              <table className="hiragana-table dakuon-table">
                <tbody>
                  {dakuonTable.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => {
                        // 進捗状態のクラスを取得
                        const progressStatus = cell && progressData[cell] ? progressData[cell].status : '';
                        const progressClass = `char-cell progress-${progressStatus}`;
                        
                        return (
                          <td 
                            key={j} 
                            className={progressClass}
                            onClick={() => handleCharClick(cell)}
                          >
                            {cell ? (
                              <div className="cell-content">
                                <div className="char-box">{cell}</div>
                                <div className="char-bento-divider"></div>
                                <div className="bento-box">
                                  {renderBentoStack(progressData[cell] ? progressData[cell].goodCount : 0)}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // 3ページ目：拗音
              <table className="hiragana-table youon-table">
                <tbody>
                  {youonTable.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => {
                        const progressStatus = cell && progressData[cell] ? progressData[cell].status : '';
                        const progressClass = `char-cell progress-${progressStatus}`;
                        return (
                          <td 
                            key={j} 
                            className={progressClass}
                            onClick={() => handleCharClick(cell)}
                          >
                            {cell ? (
                              <div className="cell-content">
                                <div className="char-box">{cell}</div>
                                <div className="char-bento-divider"></div>
                                <div className="bento-box">
                                  {renderBentoStack(progressData[cell] ? progressData[cell].goodCount : 0)}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showWritingGrid && selectedChar && (
        <WritingGrid
          character={selectedChar}
          onClose={handleCloseWritingGrid}
        />
      )}
    </div>
  );
};

export default HiraganaChart; 