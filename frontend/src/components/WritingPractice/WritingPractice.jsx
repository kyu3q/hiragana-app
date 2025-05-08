import React, { useState, useRef, useEffect } from 'react';
import './WritingPractice.css';

const WritingPractice = ({ character, onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#FF6B6B');
  const [strokeWidth, setStrokeWidth] = useState(8);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // キャンバスのサイズを設定
    canvas.width = 300;
    canvas.height = 300;
    
    // 背景を白に設定
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // ガイドラインを描画
    drawGuidelines(ctx);
    
    // 文字を薄い色で表示
    drawCharacter(ctx);
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

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
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
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidelines(ctx);
    drawCharacter(ctx);
  };

  const evaluateDrawing = () => {
    // ここで採点ロジックを実装
    // 実際の実装では、より複雑な評価アルゴリズムを使用する
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

  const handleComplete = () => {
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();
    const { score, comment } = evaluateDrawing();
    onComplete(drawingData, score, comment);
  };

  // タッチ開始
  const startTouch = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  // タッチ移動
  const moveTouch = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
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
    e.preventDefault(); // スクロール防止
  };

  // タッチ終了
  const endTouch = () => {
    setIsDrawing(false);
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
          onTouchStart={startTouch}
          onTouchMove={moveTouch}
          onTouchEnd={endTouch}
        />
      </div>
      <div className="writing-controls">
        <button className="clear-button" onClick={clearCanvas}>
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