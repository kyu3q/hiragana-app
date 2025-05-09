import React, { useState, useRef, useEffect } from 'react';
import './WritingPractice.css';
import { characterService } from '../../api/characterService';

const WritingPractice = ({ character, onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#FF6B6B');
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [allStrokes, setAllStrokes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // キャンバスの初期化
    canvas.width = 300;
    canvas.height = 300;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // ガイドラインと文字の描画
    drawGuidelines(ctx);
    drawCharacter(ctx);

    // 保存されたストロークの取得
    const fetchSavedStrokes = async () => {
      try {
        const data = await characterService.getStrokeResult(character.id);
        if (data && data.strokes) {
          setAllStrokes(data.strokes);
          drawSavedStrokes(data.strokes);
        }
      } catch (error) {
        console.error('なぞり結果の取得に失敗しました:', error);
      }
    };

    fetchSavedStrokes();
  }, [character]);

  const drawGuidelines = (ctx) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // 十字線
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current.height / 2);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
    ctx.moveTo(canvasRef.current.width / 2, 0);
    ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
    ctx.stroke();
  };

  const drawCharacter = (ctx) => {
    ctx.font = '200px "M PLUS Rounded 1c"';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character.char, canvasRef.current.width / 2, canvasRef.current.height / 2);
  };

  const drawSavedStrokes = (strokes) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidelines(ctx);
    drawCharacter(ctx);

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidelines(ctx);
    drawCharacter(ctx);
    setAllStrokes([]);
    setCurrentStroke([]);
  };

  const evaluateDrawing = () => {
    const score = Math.floor(Math.random() * 41) + 60; // 60-100点のランダムなスコア
    const comments = [
      '上手に書けました！',
      'もう少し練習しましょう',
      '形がきれいです',
      'バランスが良いです',
      '書き順に気をつけましょう'
    ];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    return { score, comment };
  };

  const handleComplete = async () => {
    try {
      const { score, comment } = evaluateDrawing();
      const strokeData = {
        strokes: allStrokes.map(stroke => ({
          points: stroke.points,
          score: score,
          comment: comment
        }))
      };
      onComplete(strokeData, score, comment);
    } catch (error) {
      console.error('なぞり結果の保存に失敗しました:', error);
      alert('なぞり結果の保存に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="writing-practice">
      <div className="writing-header">
        <h2>{character.char}をなぞって書いてみよう</h2>
      </div>
      <div className="writing-canvas-container">
        <canvas
          ref={canvasRef}
          className="writing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
      <div className="writing-controls">
        <button className="cancel-button" onClick={clearCanvas}>
          取り消し
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