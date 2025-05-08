import React, { useState, useEffect } from 'react';
import './WritingGrid.css';
import WritingPractice from '../WritingPractice/WritingPractice';
import { characterService } from '../../api/characterService';

const WritingGrid = ({ character, onClose }) => {
  const [gridItems, setGridItems] = useState(
    Array(9).fill(null).map(() => ({
      drawing: null,
      score: null,
      comment: '',
      isEditing: false
    }))
  );

  // 初回マウント時にAPIからデータを取得
  useEffect(() => {
    const fetchSavedStrokes = async () => {
      try {
        const data = await characterService.getStrokeResult(character.id);
        if (data && data.strokes) {
          const newGridItems = gridItems.map((item, index) => {
            if (index < data.strokes.length) {
              const stroke = data.strokes[index];
              return {
                drawing: stroke.points,
                score: stroke.score || null,
                comment: stroke.comment || '',
                isEditing: false
              };
            }
            return item;
          });
          setGridItems(newGridItems);
        }
      } catch (error) {
        console.error('なぞり結果の取得に失敗しました:', error);
      }
    };

    fetchSavedStrokes();
  }, [character.id]);

  const handleGridItemClick = (index) => {
    const newGridItems = [...gridItems];
    newGridItems[index] = {
      ...newGridItems[index],
      isEditing: true
    };
    setGridItems(newGridItems);
  };

  const handleWritingComplete = async (index, drawingData, score, comment) => {
    const newGridItems = [...gridItems];
    newGridItems[index] = {
      drawing: drawingData,
      score,
      comment,
      isEditing: false
    };
    setGridItems(newGridItems);

    // APIに保存
    try {
      const strokes = newGridItems
        .filter(item => item.drawing)
        .map(item => ({
          points: item.drawing,
          score: item.score,
          comment: item.comment
        }));

      await characterService.saveStrokeResult(character.id, { strokes });
    } catch (error) {
      console.error('なぞり結果の保存に失敗しました:', error);
    }
  };

  return (
    <div className="writing-grid-container">
      <div className="writing-grid-header">
        <h2>{character.char}を練習しよう！</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="writing-grid">
        {gridItems.map((item, index) => (
          <div key={index} className="grid-item">
            {item.isEditing ? (
              <WritingPractice
                character={character}
                onComplete={(drawingData, score, comment) => 
                  handleWritingComplete(index, drawingData, score, comment)
                }
              />
            ) : (
              <div 
                className="grid-item-content"
                onClick={() => handleGridItemClick(index)}
              >
                {item.drawing ? (
                  <>
                    <div className="preview-canvas-wrapper">
                      <canvas 
                        className="preview-canvas"
                        width="200"
                        height="200"
                        ref={canvas => {
                          if (canvas && item.drawing) {
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, 200, 200);
                            const img = new Image();
                            img.onload = () => {
                              ctx.drawImage(img, 0, 0, 200, 200);
                            };
                            img.src = item.drawing;
                          }
                        }}
                      />
                    </div>
                    {item.score !== null && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WritingGrid; 