import React, { useState, useEffect, useRef } from 'react';
import { playOK1Sound, playNGSound, playCollisionSound, playHappy1Sound } from '../../utils/soundPlayer';

const BlockGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost
  const requestRef = useRef();

  // Game Constants
  const PADDLE_WIDTH = 120;
  const PADDLE_HEIGHT = 20;
  const BALL_RADIUS = 10;
  const BRICK_ROW_COUNT = 5;
  const BRICK_COLUMN_COUNT = 8;
  
  // State refs for animation loop
  const stateRef = useRef({
    paddleX: 0,
    ball: { x: 0, y: 0, dx: 0, dy: 0 },
    bricks: [],
    score: 0,
    lives: 5,
    ballAttached: true
  });

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    // Create Bricks
    const bricks = [];
    const padding = 10;
    const offsetTop = 60;
    const offsetLeft = 30;
    const offsetRight = 30;
    const availableWidth = width - offsetLeft - offsetRight;
    const totalPadding = padding * (BRICK_COLUMN_COUNT - 1);
    const brickWidth = (availableWidth - totalPadding) / BRICK_COLUMN_COUNT;
    const brickHeight = 30;

    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks.push({
          x: offsetLeft + (c * (brickWidth + padding)),
          y: offsetTop + (r * (brickHeight + padding)),
          width: brickWidth,
          height: brickHeight,
          status: 1, // 1 = active
          color: `hsl(${c * 45}, 70%, 60%)`
        });
      }
    }

    stateRef.current = {
      paddleX: (width - PADDLE_WIDTH) / 2,
      ball: { x: width / 2, y: height - 40, dx: 5, dy: -5 },
      bricks: bricks,
      score: 0,
      lives: 5,
      ballAttached: true
    };
  };

  const resetBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    
    stateRef.current.ballAttached = true;
    // Position update happens in loop
  };

  const update = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const state = stateRef.current;
    
    if (state.ballAttached) {
      // Stick ball to paddle
      state.ball.x = state.paddleX + PADDLE_WIDTH / 2;
      state.ball.y = height - PADDLE_HEIGHT - BALL_RADIUS - 2;
    } else {
      // Move Ball
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;
    }

    // Wall Collision (Left/Right)
    if (state.ball.x + state.ball.dx > width - BALL_RADIUS || state.ball.x + state.ball.dx < BALL_RADIUS) {
      state.ball.dx = -state.ball.dx;
      playCollisionSound();
    }
    // Ceiling Collision
    if (state.ball.y + state.ball.dy < BALL_RADIUS) {
      state.ball.dy = -state.ball.dy;
      playCollisionSound();
    } 
    
    // Paddle Collision & Floor Logic
    // Check if ball is low enough to hit paddle
    if (state.ball.dy > 0 && state.ball.y + BALL_RADIUS >= height - PADDLE_HEIGHT) {
       // Hit Paddle?
       // Check if ball center is within paddle horizontal range (plus radius for edge hits)
       if (state.ball.x + BALL_RADIUS > state.paddleX && state.ball.x - BALL_RADIUS < state.paddleX + PADDLE_WIDTH) {
         state.ball.dy = -Math.abs(state.ball.dy); // Ensure it bounces UP
         state.ball.y = height - PADDLE_HEIGHT - BALL_RADIUS - 1; // Prevent sticking
         playCollisionSound();
         
         // Add some English/Control based on where it hit the paddle
         const hitPoint = state.ball.x - (state.paddleX + PADDLE_WIDTH / 2);
         // hitPoint ranges from -PADDLE_WIDTH/2 to +PADDLE_WIDTH/2
         // Adjust dx slightly
         state.ball.dx += hitPoint * 0.05;

         // Speed up slightly on hit
         const speedMultiplier = 1.02;
         state.ball.dx *= speedMultiplier;
         state.ball.dy *= speedMultiplier;
         
         // Clamp speed
         const maxSpeed = 12;
         if (Math.abs(state.ball.dx) > maxSpeed) state.ball.dx = maxSpeed * Math.sign(state.ball.dx);
         if (Math.abs(state.ball.dy) > maxSpeed) state.ball.dy = maxSpeed * Math.sign(state.ball.dy);
       }
    }

    // Floor Collision (Miss)
    if (state.ball.y + BALL_RADIUS > height) {
      state.lives -= 1;
      playNGSound();
      if (state.lives <= 0) {
        setGameState('lost');
      } else {
        resetBall();
      }
    }

    // Brick Collision
    let activeBricks = 0;
    state.bricks.forEach(b => {
      if (b.status === 1) {
        activeBricks++;
        if (
          state.ball.x > b.x &&
          state.ball.x < b.x + b.width &&
          state.ball.y > b.y &&
          state.ball.y < b.y + b.height
        ) {
          state.ball.dy = -state.ball.dy;
          b.status = 0;
          onAddScore(10);
          state.score += 10;
          playOK1Sound();
        }
      }
    });

    if (activeBricks === 0) {
      playHappy1Sound();
      setGameState('won');
      onComplete(true);
      return;
    }

    // Draw
    draw(ctx, width, height, state);
    
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = (ctx, width, height, state) => {
    ctx.clearRect(0, 0, width, height);

    // Draw Background Kanji
    ctx.font = "300px serif";
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.targetChar || '', width / 2, height / 2);

    // Draw Bricks
    state.bricks.forEach(b => {
      if (b.status === 1) {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        } else {
          ctx.rect(b.x, b.y, b.width, b.height);
        }
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.closePath();
      }
    });

    // Draw Paddle
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(state.paddleX, height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
    } else {
      ctx.rect(state.paddleX, height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    }
    ctx.fillStyle = "#FF9F43";
    ctx.fill();
    ctx.closePath();

    // Draw Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();

    // Draw Lives (Hearts)
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ff4757";
    ctx.textAlign = "left";
    let hearts = "";
    for(let i=0; i<state.lives; i++) hearts += "❤ ";
    ctx.fillText(hearts, 20, 40);

    // Draw Launch Hint
    if (state.ballAttached) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.fillText("クリックしてスタート", width / 2, height / 2 + 100);
    }
  };

  const launchBall = () => {
    if (stateRef.current.ballAttached) {
      stateRef.current.ballAttached = false;
      stateRef.current.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
      stateRef.current.ball.dy = -5;
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const canvasX = (relativeX / rect.width) * canvas.width;
    
    let newPaddleX = canvasX - PADDLE_WIDTH / 2;
    // Clamp paddle within bounds
    if (newPaddleX < 0) newPaddleX = 0;
    if (newPaddleX > canvas.width - PADDLE_WIDTH) newPaddleX = canvas.width - PADDLE_WIDTH;
    
    stateRef.current.paddleX = newPaddleX;
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const canvasX = (relativeX / rect.width) * canvas.width;
    
    let newPaddleX = canvasX - PADDLE_WIDTH / 2;
    // Clamp paddle within bounds
    if (newPaddleX < 0) newPaddleX = 0;
    if (newPaddleX > canvas.width - PADDLE_WIDTH) newPaddleX = canvas.width - PADDLE_WIDTH;
    
    stateRef.current.paddleX = newPaddleX;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    // Enlarge effective area
    canvas.width = 800;
    canvas.height = 600;
    
    initGame();
    
    // Initial Draw
    if(canvas) {
       draw(canvas.getContext('2d'), 800, 600, stateRef.current);
    }
    
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  return (
    <div className="game-area block-game" style={{ background: '#f0f9ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || 'ブロック崩し'}</h3>
          <p>{config.instruction || 'ブロックをくずして漢字を完成させよう！'}</p>
          <button className="start-btn" onClick={() => {
            setGameState('playing');
          }}>スタート！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ざんねん...</h2>
          <p>もういちどチャレンジ！</p>
          <button className="start-btn" onClick={() => {
            initGame();
            setGameState('playing');
          }}>リトライ</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: 'white', touchAction: 'none' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={launchBall}
        onTouchStart={launchBall}
      />
    </div>
  );
};

export default BlockGame;
