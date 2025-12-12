import React, { useState, useEffect } from 'react';
import './WritingGrid.css';
import WritingPractice from '../WritingPractice/WritingPractice';
import { characterService } from '../../api/characterService';
import { progressService } from '../../api/progressService';
import { useAuth } from '../../context/AuthContext';

const PRACTICE_CANVAS_SIZE = 300; // 練習用キャンバスのサイズ
const GRID_CANVAS_SIZE = 180;     // グリッド用キャンバスのサイズ
const GUIDE_FONT_FAMILY = "'HG教科書体', 'HGKyokashotai', 'Yu Kyokasho', 'YuKyokasho', 'やさしさゴシック手書き', 'YasashisaGothic', 'AnzuMoji', 'あんずもじ', 'Yu Mincho', '游明朝', 'Noto Serif JP', 'M PLUS Rounded 1c', sans-serif";
 
const WritingGrid = ({ character, onClose, type = 'HIRAGANA' }) => {
  const [gridItems, setGridItems] = useState(Array(9).fill(null).map(() => ({
    strokes: [],
    score: 0,
    comment: '',
    isEditing: false
  })));
  const { isAuthenticated, currentUser: user } = useAuth();
  const [characterId, setCharacterId] = useState(character.id);

  useEffect(() => {
    setCharacterId(character.id);
  }, [character]);

  useEffect(() => {
    const ensureCharacterId = async () => {
      if (type === 'KANJI' && isAuthenticated && !characterId && character.char) {
        try {
          // IDがない場合（KanjiChartの読み込みタイミングの問題など）は文字からIDを取得を試みる
          const charData = await characterService.getCharacterByTypeAndCharacter('KANJI', character.char);
          if (charData && charData.id) {
            console.log('Fetched missing character ID:', charData.id);
            setCharacterId(charData.id);
          }
        } catch (error) {
          console.error('Failed to fetch character ID:', error);
        }
      }
    };
    ensureCharacterId();
  }, [type, isAuthenticated, character, characterId]);

  useEffect(() => {
    const fetchStrokeResults = async () => {
      // 漢字の場合はストローク結果を取得しない
      if (type === 'KANJI') return;

      try {
        if (!isAuthenticated) {
          console.log('ユーザーが認証されていません');
          return;
        }

        // すべてのなぞり書き結果を取得
        if (characterId) {
          const results = await characterService.getAllStrokeResults(characterId);
          if (results && Array.isArray(results)) {
            const newGridItems = Array(9).fill(null).map((_, index) => {
              const strokeResult = results.find(r => r.position === index);
              return strokeResult ? {
                strokes: strokeResult.strokes || [],
                score: strokeResult.score || 0,
                comment: strokeResult.comment || '',
                isEditing: false
              } : {
                strokes: [],
                score: 0,
                comment: '',
                isEditing: false
              };
            });
            setGridItems(newGridItems);
          }
        }
      } catch (error) {
        console.error('Error fetching stroke results:', error);
      }
    };

    fetchStrokeResults();
  }, [characterId, isAuthenticated, type]);

  const handleGridItemClick = (index) => {
    const newGridItems = [...gridItems];
    newGridItems[index] = {
      ...newGridItems[index],
      isEditing: true
    };
    setGridItems(newGridItems);
  };

  const handleClose = async () => {
    if (type === 'KANJI' && isAuthenticated && user) {
      let targetId = characterId;
      
      // IDがまだない場合は取得を試みる（フォールバック）
      if (!targetId && character.char) {
        try {
           const charData = await characterService.getCharacterByTypeAndCharacter('KANJI', character.char);
           if (charData && charData.id) {
             targetId = charData.id;
           }
        } catch (e) {
          console.error('Failed to fetch character ID in handleClose:', e);
        }
      }

      if (targetId) {
        // 9文字すべてが埋まっているかチェック（strokesがあるか、または編集済みか）
        const allFilled = gridItems.every(item => item.strokes && item.strokes.length > 0);
        
        if (allFilled) {
          try {
            await progressService.markAsCompleted(user.id, targetId);
            console.log('漢字練習完了を保存しました');
          } catch (error) {
            console.error('漢字練習完了の保存に失敗しました:', error);
          }
        } else {
            console.log('全てのグリッドが埋まっていません。完了判定をスキップします。');
        }
      } else {
          console.error('Character ID could not be determined. Saving skipped.');
      }
    }
    onClose();
  };

  const handleWritingComplete = async (strokes, score, comment, position) => {
    try {
      if (position === undefined || position === null) {
        throw new Error('位置情報が設定されていません');
      }

      // 他のグリッドの内容はそのまま維持し、該当グリッドだけ更新
      const updatedGridItems = gridItems.map((item, idx) =>
        idx === position
          ? {
              strokes: strokes,
              score: score || 0,
              comment: comment || '',
              isEditing: false
            }
          : item
      );
      setGridItems(updatedGridItems);

      // 漢字の場合はストローク結果をDBに保存しない
      if (type === 'KANJI') {
        return;
      }

      // 認証されている場合のみ保存を試みる
      if (isAuthenticated && characterId) {
        const strokeData = {
          position: position,
          strokes: strokes,
          score: score || 0,
          comment: comment || ''
        };
        await characterService.saveStrokeResult(characterId, strokeData);
      } else {
        console.log('ログインしていないため、結果は保存されません。');
      }
    } catch (error) {
      console.error('Error saving stroke result:', error);
      if (!isAuthenticated) {
        console.log('練習結果は保存されませんでした。保存するにはログインしてください。');
      } else {
        alert(error.message || 'ストローク結果の保存に失敗しました。もう一度お試しください。');
      }
    }
  };

  const drawGuideCharacter = (ctx, char, width, height) => {
    // 拗音の場合は文字サイズを大きくする
    const fontSize = char.length > 1 ? width * 0.55 : width * 0.7;
    ctx.font = `${fontSize}px ${GUIDE_FONT_FAMILY}`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, width / 2, height / 2);
  };

  const renderGridItem = (item, index) => {
    if (item.isEditing) {
      return (
        <WritingPractice
          character={character}
          onComplete={(strokes, score, comment) => 
            handleWritingComplete(strokes, score, comment, index)
          }
          initialStrokes={item.strokes}
          score={item.score}
          comment={item.comment}
          type={type}
        />
      );
    }

    return (
      <div 
        className="grid-item-content"
        onClick={() => handleGridItemClick(index)}
      >
        {item.strokes.length > 0 ? (
          <>
            <div className="preview-canvas-wrapper">
              <canvas 
                className="preview-canvas"
                width={GRID_CANVAS_SIZE}
                height={GRID_CANVAS_SIZE}
                ref={canvas => {
                  if (canvas && item.strokes) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, GRID_CANVAS_SIZE, GRID_CANVAS_SIZE);
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, GRID_CANVAS_SIZE, GRID_CANVAS_SIZE);
                    drawGuideCharacter(ctx, character.char, GRID_CANVAS_SIZE, GRID_CANVAS_SIZE);
                    const scale = GRID_CANVAS_SIZE / PRACTICE_CANVAS_SIZE;
                    item.strokes.forEach(stroke => {
                      if (stroke.points && stroke.points.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(stroke.points[0].x * scale, stroke.points[0].y * scale);
                        stroke.points.forEach(point => {
                          ctx.lineTo(point.x * scale, point.y * scale);
                        });
                        ctx.strokeStyle = '#FF6B6B';
                        ctx.lineWidth = 4 * scale;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.stroke();
                      }
                    });
                  }
                }}
              />
            </div>
            {item.score > 0 && (
              <div className="score-display">
                <div className="score">{item.score}点</div>
                <div className="comment">{item.comment}</div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-grid-item">
            <span>クリックして練習</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="writing-grid-container">
      <div className="writing-grid-header">
        <h2>{character.char}を練習しよう！</h2>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      <div className="writing-grid">
        {gridItems.map((item, index) => (
          <div key={index} className="grid-item">
            {renderGridItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WritingGrid;
