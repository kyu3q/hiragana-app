import React, { useState, useRef, useEffect } from 'react';
import './WritingPractice.css';
import { characterService } from '../../api/characterService';
import { characterShapes, strokeTypes, evaluationCriteria } from '../../data/characterShapes';
import { playHappy1Sound, playNGSound } from '../../utils/soundPlayer';

const WritingPractice = ({ character, onComplete, initialStrokes, type = 'HIRAGANA' }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#FF6B6B');
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [allStrokes, setAllStrokes] = useState([]);
  const GUIDE_FONT_FAMILY = "'HG教科書体', 'HGKyokashotai', 'Yu Kyokasho', 'YuKyokasho', 'やさしさゴシック手書き', 'YasashisaGothic', 'AnzuMoji', 'あんずもじ', 'Yu Mincho', '游明朝', 'Noto Serif JP', 'M PLUS Rounded 1c', sans-serif";
  const [hasSoundPlayed, setHasSoundPlayed] = useState(false);

  // 正解データを生成する関数
  const generateCorrectStrokes = (char, canvasSize) => {
    const shape = characterShapes[char];
    if (!shape) return null;

    return shape.strokes.map(stroke => {
      const points = [];
      const startX = stroke.start.x * canvasSize;
      const startY = stroke.start.y * canvasSize;
      const endX = stroke.end.x * canvasSize;
      const endY = stroke.end.y * canvasSize;

      // ストロークの種類に応じてポイントを生成
      switch (stroke.type) {
        case strokeTypes.VERTICAL:
        case strokeTypes.HORIZONTAL:
          points.push({ x: startX, y: startY });
          points.push({ x: endX, y: endY });
          break;
        case strokeTypes.CURVE:
          // 曲線の場合は中間点を追加
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          points.push({ x: startX, y: startY });
          points.push({ x: midX, y: midY });
          points.push({ x: endX, y: endY });
          break;
      }

      return { points };
    });
  };

  // ストロークの評価関数
  const evaluateStroke = (userStroke, correctStroke) => {
    if (!userStroke.points || !correctStroke.points) return 0;
    
    // 開始点と終了点の距離を計算
    const startDiff = Math.sqrt(
      Math.pow(userStroke.points[0].x - correctStroke.points[0].x, 2) +
      Math.pow(userStroke.points[0].y - correctStroke.points[0].y, 2)
    );
    
    const endDiff = Math.sqrt(
      Math.pow(userStroke.points[userStroke.points.length - 1].x - correctStroke.points[correctStroke.points.length - 1].x, 2) +
      Math.pow(userStroke.points[userStroke.points.length - 1].y - correctStroke.points[correctStroke.points.length - 1].y, 2)
    );
    
    // 距離が大きいほど減点（キャンバスサイズで正規化）
    const canvasSize = canvasRef.current.width;
    const normalizedStartDiff = (startDiff / canvasSize) * 100;
    const normalizedEndDiff = (endDiff / canvasSize) * 100;
    const positionScore = 100 - (normalizedStartDiff + normalizedEndDiff) / 2;
    
    // ストロークの長さの比率を計算
    const userLength = calculateStrokeLength(userStroke.points);
    const correctLength = calculateStrokeLength(correctStroke.points);
    const lengthRatio = Math.min(userLength, correctLength) / Math.max(userLength, correctLength);
    
    // 最終スコアを計算（位置と長さの重み付け）
    return (positionScore * evaluationCriteria.POSITION_WEIGHT + 
            lengthRatio * 100 * evaluationCriteria.LENGTH_WEIGHT);
  };

  // ストロークの長さを計算する関数
  const calculateStrokeLength = (points) => {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      length += Math.sqrt(
        Math.pow(points[i].x - points[i-1].x, 2) +
        Math.pow(points[i].y - points[i-1].y, 2)
      );
    }
    return length;
  };

  // 書き順の評価関数
  const evaluateStrokeOrder = (userStrokes, correctStrokes) => {
    if (userStrokes.length !== correctStrokes.length) return 0;
    
    let orderScore = 100;
    for (let i = 0; i < userStrokes.length; i++) {
      const userStroke = userStrokes[i];
      const correctStroke = correctStrokes[i];
      
      // 各ストロークの評価
      const strokeScore = evaluateStroke(userStroke, correctStroke);
      orderScore = Math.min(orderScore, strokeScore);
    }
    
    return orderScore;
  };

  // 採点関数
  const evaluateDrawing = () => {
    const canvasSize = canvasRef.current.width;
    const correctStrokes = generateCorrectStrokes(character.char, canvasSize);
    
    if (!correctStrokes) {
      return { score: 0, comment: 'この文字の正解データがありません' };
    }

    // 書き順の評価
    const orderScore = evaluateStrokeOrder(allStrokes, correctStrokes);
    console.log('評価スコア:', orderScore);
    
    // コメントの生成
    let comment = '';
    if (orderScore >= evaluationCriteria.EXCELLENT_THRESHOLD) {
      comment = 'とても上手に書けました！';
    } else if (orderScore >= evaluationCriteria.GOOD_THRESHOLD) {
      comment = '形がきれいです';
    } else if (orderScore >= evaluationCriteria.FAIR_THRESHOLD) {
      comment = 'もう少し練習しましょう';
    } else {
      comment = '書き順に気をつけましょう';
    }

    return { score: Math.round(orderScore), comment };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    // キャンバスの初期化
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    // ガイドラインと文字の描画
    drawGuidelines(ctx, size);
    drawGuideCharacter(ctx, character.char, size, type);
  }, [character]);

  useEffect(() => {
    if (initialStrokes && initialStrokes.length > 0) {
      setAllStrokes(initialStrokes);
      drawSavedStrokes(initialStrokes);
    }
  }, [initialStrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // パッシブでないイベントリスナーでpreventDefaultを有効にする
    const handleTouchStartPassive = (e) => handleTouchStart(e);
    const handleTouchMovePassive = (e) => handleTouchMove(e);
    const handleTouchEndPassive = (e) => handleTouchEnd(e);

    canvas.addEventListener('touchstart', handleTouchStartPassive, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMovePassive, { passive: false });
    canvas.addEventListener('touchend', handleTouchEndPassive, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStartPassive);
      canvas.removeEventListener('touchmove', handleTouchMovePassive);
      canvas.removeEventListener('touchend', handleTouchEndPassive);
    };
  }, []);

  // ガイド文字をcanvasサイズに合わせて描画する共通関数
  const drawGuideCharacter = (ctx, char, size, type) => {
    // 拗音の場合は文字サイズを大きくする
    const fontSize = char.length > 1 ? size * 0.55 : size * 0.7;
    ctx.font = `${fontSize}px ${GUIDE_FONT_FAMILY}`;
    ctx.fillStyle = type === 'KATAKANA' ? 'rgba(0, 0, 128, 0.10)' : 'rgba(0, 0, 0, 0.08)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, size / 2, size / 2);
  };

  const drawGuidelines = (ctx, size) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
  };

  const drawSavedStrokes = (strokes) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    drawGuidelines(ctx, size);
    drawGuideCharacter(ctx, character.char, size, type);

    strokes.forEach(stroke => {
      if (stroke.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    });
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
    setCurrentStroke([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastX(x);
    setLastY(y);
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setAllStrokes(prev => [...prev, { points: currentStroke }]);
    setCurrentStroke([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    drawGuidelines(ctx, size);
    drawGuideCharacter(ctx, character.char, size, type);
    setAllStrokes([]);
    setCurrentStroke([]);
  };

  const handleComplete = async () => {
    try {
      const { score, comment } = evaluateDrawing();
      console.log('採点結果:', { score, comment });
      const strokesArray = allStrokes.map(stroke => ({
        points: stroke.points,
        score: score,
        comment: comment
      }));
      onComplete(strokesArray, score, comment);

      // 音声を再生
      if (!hasSoundPlayed) {
          setHasSoundPlayed(true);
          if (score >= evaluationCriteria.CELEBRATION_THRESHOLD) {
            setTimeout(() => {
              playHappy1Sound();
            }, 500);
          }else{
            setTimeout(() => {
              playNGSound();
            }, 500);
          }
        }
    } catch (error) {
      console.error('なぞり結果の保存に失敗しました:', error);
      alert('なぞり結果の保存に失敗しました。もう一度お試しください。');
    }
  };

  const getTouchPos = (touch, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    };
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const touch = e.touches[0];
    const { x, y } = getTouchPos(touch, canvas);
    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
    setCurrentStroke([{ x, y }]);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const touch = e.touches[0];
    const { x, y } = getTouchPos(touch, canvas);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastX(x);
    setLastY(y);
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const handleTouchEnd = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setAllStrokes(prev => [...prev, { points: currentStroke }]);
    setCurrentStroke([]);
  };

  return (
    <div className="writing-practice">
      <div className="writing-header">
        <h2>{character.char}（{type === 'KATAKANA' ? 'カタカナ' : 'ひらがな'}）</h2>
      </div>
      <div className="writing-canvas-container">
        <canvas
          ref={canvasRef}
          className="writing-canvas"
          width={300}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      <div className="writing-controls">
        <button className="cancel-button" onClick={clearCanvas}>
          消す
        </button>
        <div className="color-picker">
          <button 
            className="color-button red"
            onClick={() => setStrokeColor('#FF6B6B')}
          />
          <button 
            className="color-button blue"
            onClick={() => setStrokeColor('#4ECDC4')}
          />
          <button 
            className="color-button green"
            onClick={() => setStrokeColor('#45B7D1')}
          />
        </div>
        <button className="complete-button" onClick={handleComplete}>
          完了
        </button>
      </div>
    </div>
  );
};

export default WritingPractice;
