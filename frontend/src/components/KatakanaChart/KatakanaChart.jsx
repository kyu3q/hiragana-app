import React, { useState, useEffect } from 'react';
import './KatakanaChart.css';
import WritingGrid from '../WritingGrid/WritingGrid';
import { useAuth } from '../../context/AuthContext';
import { characterService } from '../../api/characterService';
import ProgressStack from '../HiraganaChart/ProgressStack';

// 画像のような表形式の2次元配列データ
const mainTable = [
  ['ン','ワ','ラ','ヤ','マ','ハ','ナ','タ','サ','カ','ア'],
  ['','','リ','','ミ','ヒ','ニ','チ','シ','キ','イ'],
  ['','','ル','ユ','ム','フ','ヌ','ツ','ス','ク','ウ'],
  ['','','レ','','メ','ヘ','ネ','テ','セ','ケ','エ'],
  ['','ヲ','ロ','ヨ','モ','ホ','ノ','ト','ソ','コ','オ'],
];

// 濁音・半濁音テーブル（空白セルなし）
const dakuonTable = [
  ['ガ','ザ','ダ','バ','パ'],
  ['ギ','ジ','ヂ','ビ','ピ'],
  ['グ','ズ','ヅ','ブ','プ'],
  ['ゲ','ゼ','デ','ベ','ペ'],
  ['ゴ','ゾ','ド','ボ','ポ'],
];

// 拗音テーブル
const youonTable = [
  ['キャ','ギャ','シャ','ジャ','チャ','ニャ','ヒャ','ビャ','ピャ','ミャ','リャ'],
  ['キュ','ギュ','シュ','ジュ','チュ','ニュ','ヒュ','ビュ','ピュ','ミュ','リュ'],
  ['キョ','ギョ','ショ','ジョ','チョ','ニョ','ヒョ','ビョ','ピョ','ミョ','リョ'],
];

const KatakanaChart = ({ onClose }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const { isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // 0: 清音ページ, 1: 濁音・半濁音ページ, 2: 拗音ページ
  const totalPages = 3;

  // カタカナからIDへの変換マッピング
  const katakanaToIds = {
    'ア': 96, 'イ': 97, 'ウ': 98, 'エ': 99, 'オ': 100,
    'カ': 101, 'キ': 102, 'ク': 103, 'ケ': 104, 'コ': 105,
    'サ': 106, 'シ': 107, 'ス': 108, 'セ': 109, 'ソ': 110,
    'タ': 111, 'チ': 112, 'ツ': 113, 'テ': 114, 'ト': 115,
    'ナ': 116, 'ニ': 117, 'ヌ': 118, 'ネ': 119, 'ノ': 120,
    'ハ': 121, 'ヒ': 122, 'フ': 123, 'ヘ': 124, 'ホ': 125,
    'マ': 126, 'ミ': 127, 'ム': 128, 'メ': 129, 'モ': 130,
    'ヤ': 131, 'ユ': 132, 'ヨ': 133,
    'ラ': 134, 'リ': 135, 'ル': 136, 'レ': 137, 'ロ': 138,
    'ワ': 139, 'ヲ': 140, 'ン': 141,
    'ガ': 142, 'ギ': 143, 'グ': 144, 'ゲ': 145, 'ゴ': 146,
    'ザ': 147, 'ジ': 148, 'ズ': 149, 'ゼ': 150, 'ゾ': 151,
    'ダ': 152, 'ヂ': 153, 'ヅ': 154, 'デ': 155, 'ド': 156,
    'バ': 157, 'ビ': 158, 'ブ': 159, 'ベ': 160, 'ボ': 161,
    'パ': 162, 'ピ': 163, 'プ': 164, 'ペ': 165, 'ポ': 166,
    'キャ': 167, 'キュ': 168, 'キョ': 169,
    'シャ': 170, 'シュ': 171, 'ショ': 172,
    'チャ': 173, 'チュ': 174, 'チョ': 175,
    'ニャ': 176, 'ニュ': 177, 'ニョ': 178,
    'ギャ': 179, 'ギュ': 180, 'ギョ': 181,
    'ジャ': 182, 'ジュ': 183, 'ジョ': 184,
    'ビャ': 185, 'ビュ': 186, 'ビョ': 187,
    'ピャ': 188, 'ピュ': 189, 'ピョ': 190
  };

  // 進捗データを取得する関数
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!isAuthenticated) return;
      
      try {
        // 各カタカナの進捗状況を取得
        const progressDataTemp = {};
        
        for (const [char, id] of Object.entries(katakanaToIds)) {
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
    if (totalResults === 0) return 'not-started';
    if (goodScoresCount === 0) return 'attempted';
    if (goodScoresCount >= 9) return 'completed';
    return 'in-progress';
  };

  const handleCharClick = (char) => {
    if (char) {
      const id = katakanaToIds[char] || null;
      
      setSelectedChar({
        id: id,
        char: char,
        romaji: '',
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

  return (
    <div className="katakana-chart-modal-bg">
      <div className="katakana-chart-modal">
        <div className="katakana-chart-header">
          <h2>カタカナ表</h2>
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
          <button className="katakana-chart-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="chart-table-wrap">
          <div className="katakana-chart-content">
            {currentPage === 0 ? (
              // 清音ページ
              <table className="katakana-table">
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
                                  <ProgressStack count={progressData[cell] ? progressData[cell].goodCount : 0} icon="🍯" />
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
              <table className="katakana-table dakuon-table">
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
                                  <ProgressStack count={progressData[cell] ? progressData[cell].goodCount : 0} icon="🍯" />
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
              <table className="katakana-table youon-table">
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
                                  <ProgressStack count={progressData[cell] ? progressData[cell].goodCount : 0} icon="🍯" />
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
          type="KATAKANA"
        />
      )}
    </div>
  );
};

export default KatakanaChart; 