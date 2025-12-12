import React, { useState, useEffect } from 'react';
import './KanjiChart.css';
import WritingGrid from '../WritingGrid/WritingGrid';
import { useAuth } from '../../context/AuthContext';
import { characterService } from '../../api/characterService';
import { progressService } from '../../api/progressService';
import ProgressStack from '../HiraganaChart/ProgressStack';
import HanamaruSVG from '../HiraganaChart/HanamaruSVG';
import { kanjiByGrade } from '../../data/kanjiData';

const PAGE_SIZE = 40;

const KanjiChart = ({ onClose, initialGrade }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const { isAuthenticated, currentUser: user } = useAuth();
  const [progressData, setProgressData] = useState({});
  const [kanjiMap, setKanjiMap] = useState({}); // char -> id mapping
  const [page, setPage] = useState(0);

  // Fetch Kanji IDs from backend
  useEffect(() => {
    const fetchKanjiIds = async () => {
      if (!isAuthenticated) return;
      try {
        const characters = await characterService.getCharactersByType('KANJI');
        if (characters && Array.isArray(characters)) {
          const map = {};
          characters.forEach(c => {
            map[c.character] = c.id;
          });
          setKanjiMap(map);
        }
      } catch (error) {
        console.error('Failed to fetch kanji IDs:', error);
      }
    };
    fetchKanjiIds();
  }, [isAuthenticated]);

  const gradeItems = kanjiByGrade.find(g => g.grade === initialGrade)?.items || [];
  const totalPages = Math.ceil(gradeItems.length / PAGE_SIZE);
  
  // Calculate items for current page
  const currentItems = gradeItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Fetch progress data for current page items
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!isAuthenticated || !user || Object.keys(kanjiMap).length === 0) return;
      
      try {
        // 全漢字の進捗を一度に取得（ページングしても良いが、データ量がそれほど多くなければ一括取得が楽）
        const progressList = await progressService.getUserProgressByType(user.id, 'KANJI');
        
        const progressDataTemp = {};
        
        // 進捗リストをマップに変換
        if (progressList && Array.isArray(progressList)) {
          progressList.forEach(progress => {
            const charId = progress.character.id;
            const char = progress.character.character;
            
            progressDataTemp[char] = {
              total: progress.practiceCount,
              goodCount: progress.correctCount,
              status: progress.isCompleted ? 'completed' : (progress.practiceCount > 0 ? 'in-progress' : 'not-started'),
              isCompleted: progress.isCompleted
            };
          });
        }
        
        setProgressData(progressDataTemp);
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };
    
    fetchProgressData();
  }, [isAuthenticated, user, kanjiMap, initialGrade]); // ページ依存を削除（一括取得のため）

  const getProgressStatus = (progress) => {
    if (!progress) return 'not-started';
    if (progress.isCompleted) return 'completed';
    if (progress.total > 0) return 'in-progress';
    return 'not-started';
  };

  const handleCharClick = (item) => {
    const id = kanjiMap[item.char];
    setSelectedChar({
      ...item,
      id: id // Add ID if available
    });
    setShowWritingGrid(true);
  };

  const handleCloseWritingGrid = () => {
    setShowWritingGrid(false);
    
    // 練習終了時に進捗を再取得して画面を更新
    if (isAuthenticated && user) {
      const fetchCharProgress = async () => {
        try {
          // 全進捗を再取得するのが確実
          const progressList = await progressService.getUserProgressByType(user.id, 'KANJI');
          
           if (progressList && Array.isArray(progressList)) {
            const progressDataTemp = {};
             progressList.forEach(progress => {
              const char = progress.character.character;
              progressDataTemp[char] = {
                total: progress.practiceCount,
                goodCount: progress.correctCount,
                status: progress.isCompleted ? 'completed' : (progress.practiceCount > 0 ? 'in-progress' : 'not-started'),
                isCompleted: progress.isCompleted
              };
            });
            setProgressData(progressDataTemp);
          }
        } catch (error) {
          console.error('Char progress update error:', error);
        }
      };
      fetchCharProgress();
    }
    
    setSelectedChar(null);
  };

  const chunkItems = (items, size) => {
    const chunks = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  };

  const rows = chunkItems(currentItems, 10);

  return (
    <div className="kanji-chart-modal-bg">
      <div className="kanji-chart-modal">
        <div className="kanji-chart-header">
          <h2>{initialGrade}年の漢字表</h2>
              {totalPages > 1 && (
                <div className="chart-page-tabs-horizontal">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      className={`chart-page-tab ${page === idx ? 'active' : ''}`}
                      onClick={() => setPage(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
              </div>
              )} 
          <button className="kanji-chart-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="chart-table-wrap">
          <div className="kanji-chart-content">
            <table className="kanji-table">
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((item, j) => {
                      const progress = progressData[item.char];
                      const status = progress ? progress.status : 'not-started';
                      const progressClass = `char-cell progress-${status}`;
                      const isCompleted = progress ? progress.isCompleted : false;
                      
                      return (
                        <td 
                          key={item.char} 
                          className={progressClass}
                          onClick={() => handleCharClick(item)}
                        >
                          <div className="cell-content">
                            {isCompleted && (
                              <HanamaruSVG className="hanamaru-overlay" />
                            )}
                            <div className="kanji-char-box">{item.char}</div>
                            <div className="kanji-reading-box">{item.kunyomi?.split('・')[0] || item.onyomi?.split('・')[0] || ''}</div>
                            <div className="kanji-bento-box">
                              <ProgressStack count={progress ? progress.goodCount : 0} icon="⭐" />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    {/* Fill empty cells if row < 10 */}
                    {[...Array(10 - row.length)].map((_, k) => (
                      <td key={`empty-${k}`} className="empty"></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showWritingGrid && selectedChar && (
        <WritingGrid
          character={selectedChar}
          onClose={handleCloseWritingGrid}
          type="KANJI"
        />
      )}
    </div>
  );
};

export default KanjiChart;
