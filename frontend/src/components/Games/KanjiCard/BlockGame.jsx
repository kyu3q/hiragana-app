import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playOK1Sound, playNGSound, playCollisionSound, playHappy1Sound, playHappy2Sound } from '../../../utils/soundPlayer';
import { BLOCK_STAGES, buildBricks } from './blockStages';
import { isLastStage, stageTitle, stageProgress, nextStageStart, retryStageStart } from './stageFlow';
import { StageIntro, StageClear } from './StageOverlays';

const BlockGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, intro, playing, stageClear, won, lost
  const [stageIndex, setStageIndex] = useState(0);
  const stageStartScoreRef = useRef(0); // そのステージを始めたときのスコア（リトライで戻す）
  const requestRef = useRef();

  // Game Constants
  const BALL_RADIUS = 10;
  
  // State refs for animation loop
  const stateRef = useRef({
    paddleX: 0,
    paddleWidth: 120,
    balls: [], // {x, y, dx, dy, active}
    bricks: [],
    items: [], // {x, y, type, dy, char, color}
    score: 0,
    lives: BLOCK_STAGES[0].lives,
    ballAttached: true,
    particles: [],
    stage: BLOCK_STAGES[0],
    stageIndex: 0
  });

  const initGame = (index = 0, startScore = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const stage = BLOCK_STAGES[index];

    const bricks = buildBricks({
      stage,
      width,
      padding: 10,
      offsetTop: 60,
      offsetLeft: 30,
      offsetRight: 30,
      brickHeight: 30
    });

    stateRef.current = {
      paddleX: (width - 120) / 2,
      paddleWidth: 120,
      balls: [{ x: width / 2, y: height - 40, dx: stage.ballSpeed, dy: -stage.ballSpeed, active: true }],
      bricks: bricks,
      items: [],
      score: startScore,
      lives: stage.lives,
      ballAttached: true,
      particles: [],
      stage,
      stageIndex: index
    };
  };

  // ステージを始める。名前を出すとき（最初・つぎへ）は intro、リトライはすぐ playing
  const startStage = ({ index, startScore, withIntro }) => {
    stageStartScoreRef.current = startScore;
    setStageIndex(index);
    initGame(index, startScore);
    const canvas = canvasRef.current;
    if (canvas) draw(canvas.getContext('2d'), canvas.width, canvas.height, stateRef.current);
    setGameState(withIntro ? 'intro' : 'playing');
  };

  const resetBall = () => {
    stateRef.current.ballAttached = true;
    const speed = stateRef.current.stage.ballSpeed;
    stateRef.current.balls = [{ x: 0, y: 0, dx: speed, dy: -speed, active: true }];
    stateRef.current.items = []; // Clear items
  };

  const createParticles = (x, y, color) => {
      for(let i=0; i<10; i++) {
          stateRef.current.particles.push({
              x: x, y: y,
              vx: (Math.random()-0.5)*8,
              vy: (Math.random()-0.5)*8,
              life: 20,
              color: color
          });
      }
  };

  const update = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const state = stateRef.current;
    
    const PADDLE_HEIGHT = 20;

    // Update Balls
    if (state.ballAttached) {
        state.balls[0].x = state.paddleX + state.paddleWidth / 2;
        state.balls[0].y = height - PADDLE_HEIGHT - BALL_RADIUS - 2;
    } else {
        state.balls.forEach(ball => {
            if (!ball.active) return;
            
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Wall Collision
            if (ball.x + ball.dx > width - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) {
                ball.dx = -ball.dx;
                playCollisionSound();
            }
            // Ceiling
            if (ball.y + ball.dy < BALL_RADIUS) {
                ball.dy = -ball.dy;
                playCollisionSound();
            }

            // Paddle Collision
            if (ball.dy > 0 && ball.y + BALL_RADIUS >= height - PADDLE_HEIGHT) {
                if (ball.x + BALL_RADIUS > state.paddleX && ball.x - BALL_RADIUS < state.paddleX + state.paddleWidth) {
                    ball.dy = -Math.abs(ball.dy);
                    ball.y = height - PADDLE_HEIGHT - BALL_RADIUS - 1;
                    playCollisionSound();
                    
                    // Control
                    const hitPoint = ball.x - (state.paddleX + state.paddleWidth / 2);
                    ball.dx += hitPoint * 0.05;
                    
                    // Speed up
                    const speedMultiplier = 1.02;
                    ball.dx *= speedMultiplier;
                    ball.dy *= speedMultiplier;
                    
                    // Clamp
                    const maxSpeed = 12;
                    if (Math.abs(ball.dx) > maxSpeed) ball.dx = maxSpeed * Math.sign(ball.dx);
                    if (Math.abs(ball.dy) > maxSpeed) ball.dy = maxSpeed * Math.sign(ball.dy);
                }
            }

            // Floor (Ball Lost)
            if (ball.y - BALL_RADIUS > height) {
                ball.active = false;
            }

            // Brick Collision
            state.bricks.forEach(b => {
                if (b.status === 1) {
                    if (
                        ball.x > b.x &&
                        ball.x < b.x + b.width &&
                        ball.y > b.y &&
                        ball.y < b.y + b.height
                    ) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        onAddScore(10);
                        state.score += 10;
                        playOK1Sound();
                        createParticles(b.x + b.width/2, b.y + b.height/2, b.color);
                        
                        // Drop Item
                        if (b.itemType) {
                            state.items.push({
                                x: b.x + b.width/2,
                                y: b.y + b.height/2,
                                type: b.itemType,
                                dy: 3,
                                char: b.itemType === 'heart' ? '❤' : (b.itemType === 'wide' ? '↔' : '⚇'),
                                color: b.itemType === 'heart' ? '#FF5252' : (b.itemType === 'wide' ? '#4CAF50' : '#2196F3')
                            });
                        }
                    }
                }
            });
        });
        
        // Check active balls
        const activeCount = state.balls.filter(b => b.active).length;
        if (activeCount === 0) {
            state.lives -= 1;
            playNGSound();
            if (state.lives <= 0) {
                setGameState('lost');
            } else {
                state.paddleWidth = 120; // Reset paddle size
                resetBall();
            }
        }
    }

    // Update Items
    state.items.forEach(item => {
        item.y += item.dy;
    });
    // Check item pickup
    state.items = state.items.filter(item => {
        if (item.y > height - PADDLE_HEIGHT && item.y < height) {
            if (item.x > state.paddleX && item.x < state.paddleX + state.paddleWidth) {
                // Picked up
                if (item.type === 'heart') {
                    state.lives++;
                    playHappy1Sound();
                } else if (item.type === 'wide') {
                    state.paddleWidth = Math.min(200, state.paddleWidth + 40);
                    playOK1Sound();
                } else if (item.type === 'multi') {
                    // Spawn extra ball
                    if (state.balls.length > 0 && state.balls[0].active) {
                        state.balls.push({
                            x: state.balls[0].x,
                            y: state.balls[0].y,
                            dx: -state.balls[0].dx,
                            dy: state.balls[0].dy,
                            active: true
                        });
                        playHappy2Sound();
                    }
                }
                return false;
            }
        }
        return item.y < height;
    });

    // Check Win
    if (state.bricks.every(b => b.status === 0)) {
      playHappy1Sound();
      // ここでループを止める（次のフレームを予約しないので、クリア処理は1回だけ）
      if (isLastStage(BLOCK_STAGES, state.stageIndex)) {
        setGameState('won');
        onComplete(true);
      } else {
        setGameState('stageClear');
      }
      return;
    }

    // Update Particles
    state.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.life--; p.vy+=0.5; });
    state.particles = state.particles.filter(p => p.life > 0);

    // Draw
    draw(ctx, width, height, state);
    
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = (ctx, width, height, state) => {
    ctx.clearRect(0, 0, width, height);
    const PADDLE_HEIGHT = 20;
    const theme = state.stage.theme;

    // Background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);
    ctx.font = "300px serif";
    ctx.fillStyle = theme.kanjiColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.targetChar || '', width / 2, height / 2);

    // Bricks
    state.bricks.forEach(b => {
      if (b.status === 1) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        else ctx.rect(b.x, b.y, b.width, b.height);
        ctx.fillStyle = b.color;
        ctx.fill();
        
        // Shine
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(b.x, b.y, b.width, b.height/2);
        
        ctx.closePath();

        // ステージの絵文字
        if (theme.brickEmoji) {
          ctx.font = `${Math.floor(b.height * 0.7)}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(theme.brickEmoji, b.x + b.width / 2, b.y + b.height / 2);
        }
      }
    });

    // Items
    state.items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 15, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.char, item.x, item.y);
    });

    // Paddle
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(state.paddleX, height - PADDLE_HEIGHT, state.paddleWidth, PADDLE_HEIGHT, 8);
    else ctx.rect(state.paddleX, height - PADDLE_HEIGHT, state.paddleWidth, PADDLE_HEIGHT);
    ctx.fillStyle = "#FF9F43";
    ctx.fill();
    // Paddle Detail
    ctx.fillStyle = "#F57C00";
    ctx.fillRect(state.paddleX + 10, height - PADDLE_HEIGHT + 5, state.paddleWidth - 20, 10);
    ctx.closePath();

    // Balls
    state.balls.forEach(ball => {
        if (!ball.active) return;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = theme.ballColor;
        ctx.fill();
        ctx.closePath();
    });

    // Particles
    state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
    });

    // Lives
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ff4757";
    ctx.textAlign = "left";
    let hearts = "";
    for(let i=0; i<state.lives; i++) hearts += "❤ ";
    ctx.fillText(hearts, 20, 40);
    
    // ステージ番号（1/3 など）
    ctx.font = "20px Arial";
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(stageProgress(BLOCK_STAGES, state.stageIndex), width - 20, 35);

    // Hint
    if (state.ballAttached) {
      ctx.font = "20px Arial";
      ctx.fillStyle = theme.textColor;
      ctx.textAlign = "center";
      ctx.fillText("クリックしてスタート", width / 2, height / 2 + 100);
    }
  };

  const launchBall = () => {
    if (gameState !== 'playing') return;
    if (stateRef.current.ballAttached) {
      stateRef.current.ballAttached = false;
      const speed = stateRef.current.stage.ballSpeed;
      // Launch all balls (usually just one at start)
      stateRef.current.balls.forEach(b => {
          b.dx = speed * (Math.random() > 0.5 ? 1 : -1);
          b.dy = -speed;
      });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const canvasX = (relativeX / rect.width) * canvas.width;
    const paddleWidth = stateRef.current.paddleWidth;
    
    let newPaddleX = canvasX - paddleWidth / 2;
    if (newPaddleX < 0) newPaddleX = 0;
    if (newPaddleX > canvas.width - paddleWidth) newPaddleX = canvas.width - paddleWidth;
    
    stateRef.current.paddleX = newPaddleX;
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const canvasX = (relativeX / rect.width) * canvas.width;
    const paddleWidth = stateRef.current.paddleWidth;
    
    let newPaddleX = canvasX - paddleWidth / 2;
    if (newPaddleX < 0) newPaddleX = 0;
    if (newPaddleX > canvas.width - paddleWidth) newPaddleX = canvas.width - paddleWidth;
    
    stateRef.current.paddleX = newPaddleX;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    setStageIndex(0);
    stageStartScoreRef.current = 0;
    initGame(0, 0);
    if(canvas) draw(canvas.getContext('2d'), 800, 600, stateRef.current);
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  const handleIntroDone = useCallback(() => setGameState('playing'), []);

  return (
    <div className="game-area block-game" style={{ background: '#f0f9ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || 'ブロック崩し'}</h3>
          <p>{config.instruction || 'ブロックをくずして漢字を完成させよう！'}</p>
          <div className="instruction-icons" style={{display:'flex', gap:'20px', justifyContent:'center', margin:'10px 0'}}>
             <div style={{textAlign:'center'}}><small>アイテム</small></div>
             <div style={{textAlign:'center', color:'#FF5252'}}>❤ <small>ライフ</small></div>
             <div style={{textAlign:'center', color:'#4CAF50'}}>↔ <small>ワイド</small></div>
             <div style={{textAlign:'center', color:'#2196F3'}}>⚇ <small>マルチ</small></div>
          </div>
          <p style={{fontSize: '0.9em'}}>{BLOCK_STAGES.length}つのステージを、つづけてクリアしよう！</p>
          <button className="start-btn" onClick={() => startStage({ index: 0, startScore: 0, withIntro: true })}>スタート！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ざんねん...</h2>
          <p>もういちどチャレンジ！</p>
          <button className="start-btn" onClick={() => startStage(retryStageStart({ index: stageIndex, startScore: stageStartScoreRef.current }))}>リトライ</button>
        </div>
      )}

      {gameState === 'intro' && (
        <StageIntro
          title={stageTitle(BLOCK_STAGES, stageIndex)}
          message="ブロックを全部くずそう！"
          onDone={handleIntroDone}
        />
      )}

      {gameState === 'stageClear' && (
        <StageClear
          score={stateRef.current.score}
          onNext={() => startStage(nextStageStart({ index: stageIndex, score: stateRef.current.score }))}
        />
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
