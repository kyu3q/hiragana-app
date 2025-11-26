import React, { useState, useEffect, useRef } from 'react';
import { playOK1Sound, playNGSound } from '../../utils/soundPlayer';

const TraceGame = ({ config, onComplete, onAddScore }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePoint, setActivePoint] = useState(0);
  const [boatPos, setBoatPos] = useState({ x: 0, y: 0 });
  const points = config.pathPoints || [];

  useEffect(() => {
    if (points.length > 0) {
      setBoatPos({ x: points[0][0], y: points[0][1] });
    }
  }, [points]);

  const handlePointEnter = (index) => {
    if (!isPlaying) return;
    
    if (index === activePoint + 1) {
      // Correct next point
      setActivePoint(index);
      setBoatPos({ x: points[index][0], y: points[index][1] });
      onAddScore(20);
      playOK1Sound();
      
      if (index === points.length - 1) {
        onComplete(true);
      }
    } else if (index === activePoint) {
      // Current point, do nothing
    } else {
      // Wrong point
      playNGSound();
      // onAddScore(-5);
    }
  };

  return (
    <div className="game-area trace-game" style={{ background: config.bg, position: 'relative' }}>
      {!isPlaying && (
        <div className="game-instruction-overlay">
          <h3>{config.title}</h3>
          <p>{config.instruction}</p>
          <button className="start-btn" onClick={() => {
            setIsPlaying(true);
            setActivePoint(0);
            if (points.length > 0) setBoatPos({ x: points[0][0], y: points[0][1] });
          }}>スタート！</button>
        </div>
      )}

      {/* Draw Path Lines */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <polyline 
          points={points.map(p => p.join(',')).join(' ')} 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="10" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Progress Line */}
        <polyline 
          points={points.slice(0, activePoint + 1).map(p => p.join(',')).join(' ')} 
          fill="none" 
          stroke="rgba(255,255,255,0.8)" 
          strokeWidth="10" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Points */}
      {points.map((p, i) => (
        <div
          key={i}
          className={`trace-point ${i <= activePoint ? 'active' : ''}`}
          style={{ left: p[0], top: p[1] }}
          onMouseEnter={() => handlePointEnter(i)}
          onTouchMove={(e) => {
             // Basic touch support - elementFromPoint might be needed for proper drag
             // For now, simpler point-to-point click/hover
          }}
          onClick={() => handlePointEnter(i)}
        >
          {i + 1}
        </div>
      ))}
      
      {/* Moving Character/Boat */}
      <div 
        className="trace-boat" 
        style={{ left: boatPos.x, top: boatPos.y }}
      >
        ⛵
      </div>
      
    </div>
  );
};

export default TraceGame;
