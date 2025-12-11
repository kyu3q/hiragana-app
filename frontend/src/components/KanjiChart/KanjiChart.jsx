import React, { useState, useEffect } from 'react';
import './KanjiChart.css';
import WritingGrid from '../WritingGrid/WritingGrid';
import { useAuth } from '../../context/AuthContext';
import { characterService } from '../../api/characterService';
import ProgressStack from '../HiraganaChart/ProgressStack';
import HanamaruSVG from '../HiraganaChart/HanamaruSVG';
import { kanjiByGrade } from '../../data/kanjiData';

const PAGE_SIZE = 40;

const KanjiChart = ({ onClose, initialGrade }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const { isAuthenticated } = useAuth();
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
      if (!isAuthenticated || Object.keys(kanjiMap).length === 0) return;
      
      try {
        const progressDataTemp = {};
        
        for (const item of currentItems) {
          const char = item.char;
          const id = kanjiMap[char];
          if (id) {
            try {
              const results = await characterService.getAllStrokeResults(id);
              if (results && Array.isArray(results)) {
                const goodScoresCount = results.filter(r => r.score >= 60).length;
                const totalResults = results.length;
                
                progressDataTemp[char] = {
                  total: totalResults,
                  goodCount: goodScoresCount,
                  status: getProgressStatus(goodScoresCount, totalResults)
                };
              }
            } catch (error) {
              // Silent fail
            }
          }
        }
        
        setProgressData(prev => ({...prev, ...progressDataTemp}));
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };
    
    fetchProgressData();
  }, [isAuthenticated, kanjiMap, initialGrade, page]); // Depend on page to fetch for new items

  const getProgressStatus = (goodScoresCount, totalResults) => {
    if (totalResults === 0) return 'not-started';
    if (goodScoresCount === 0) return 'attempted';
    if (goodScoresCount >= 9) return 'completed';
    return 'in-progress';
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
    
    if (isAuthenticated && selectedChar && selectedChar.id) {
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
                      const status = progress ? progress.status : '';
                      const progressClass = `char-cell progress-${status}`;
                      
                      return (
                        <td 
                          key={item.char} 
                          className={progressClass}
                          onClick={() => handleCharClick(item)}
                        >
                          <div className="cell-content">
                            {status === 'completed' && (
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
