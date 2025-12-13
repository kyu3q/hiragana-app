import React, { useState, useEffect, useRef } from 'react';
import { GRADE1_KANJI, SIMILAR_PAIRS } from '../../../data/kanjiData';
import { playJumpSound, playOK1Sound, playNGSound, playHappy1Sound, playHappy2Sound } from '../../../utils/soundPlayer';

const JumpGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost
  const [score, setScore] = useState(0);
  const [gameOverReason, setGameOverReason] = useState('');
  const requestRef = useRef();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const MOVE_SPEED = 4.0;
  const GROUND_Y = 500;
  const PLAYER_SIZE = 40;

  const stateRef = useRef({
    player: { x: 100, y: GROUND_Y - PLAYER_SIZE, vy: 0, grounded: true, jumpCount: 0 },
    cameraX: 0,
    score: 0,
    lives: 3,
    invincible: 0,
    items: [], // 漢字アイテム
    enemies: [],
    obstacles: [],
    clouds: [],
    particles: []
  });

  const initGame = () => {
    const items = [];
    const enemies = [];
    const obstacles = [];
    const clouds = [];
    
    // Background Clouds
    for(let i=0; i<20; i++) {
        clouds.push({
            x: Math.random() * 6000,
            y: Math.random() * 300,
            size: 30 + Math.random() * 50,
            speed: 0.2 + Math.random() * 0.3
        });
    }

    // Level Generation
    let currentX = 600;
    const levelLength = 6000; 

    while (currentX < levelLength) {
      const type = Math.random();
      
      // 1. 漢字アイテム配置 (正しい漢字 or 間違った漢字)
      const isTarget = Math.random() < 0.4; // 40% 正解
      let char = config.targetChar;
      
      if (!isTarget) {
          // 間違った漢字を選択
          let distractor = '';
          if (SIMILAR_PAIRS[config.targetChar]) {
              const similars = SIMILAR_PAIRS[config.targetChar];
              distractor = similars[Math.floor(Math.random() * similars.length)];
          }
          if (!distractor) {
              distractor = GRADE1_KANJI[Math.floor(Math.random() * GRADE1_KANJI.length)];
              if (distractor === config.targetChar) distractor = 'Ｘ';
          }
          char = distractor;
      }

      // 配置パターン
      if (type < 0.3) {
        // 空中にアイテム配置
        items.push({
            x: currentX,
            y: GROUND_Y - 120 - Math.random() * 100,
            w: 40,
            h: 40,
            char: char,
            type: isTarget ? 'target' : 'bad',
            active: true
        });
        currentX += 300;
      } else if (type < 0.5) {
        // 敵配置
        enemies.push({
            x: currentX,
            y: GROUND_Y - 40,
            w: 40,
            h: 40,
            active: true,
            type: 'slime'
        });
        // 敵を飛び越えた先にアイテム
        items.push({
            x: currentX + 50,
            y: GROUND_Y - 150,
            w: 40,
            h: 40,
            char: char,
            type: isTarget ? 'target' : 'bad',
            active: true
        });
        currentX += 400;
      } else if (type < 0.7) {
        // ブロックとアイテム
        obstacles.push({
            x: currentX,
            y: GROUND_Y - 80,
            w: 60,
            h: 80,
            type: 'block'
        });
        items.push({
            x: currentX + 10,
            y: GROUND_Y - 130,
            w: 40,
            h: 40,
            char: char,
            type: isTarget ? 'target' : 'bad',
            active: true
        });
        currentX += 400;
      } else if (type < 0.85) {
         // トゲ
         obstacles.push({
            x: currentX,
            y: GROUND_Y - 40,
            w: 40,
            h: 40,
            type: 'spike'
        });
        currentX += 350;
      } else {
         // 何もない区間
         currentX += 200;
      }
    }

    // Add Goal
    obstacles.push({
      x: levelLength,
      y: GROUND_Y - 200,
      w: 20,
      h: 200,
      type: 'goal'
    });

    stateRef.current = {
      player: { x: 100, y: GROUND_Y - PLAYER_SIZE, vy: 0, grounded: true, jumpCount: 0 },
      cameraX: 0,
      score: 0,
      lives: 3,
      invincible: 0,
      items: items,
      enemies: enemies,
      obstacles: obstacles,
      clouds: clouds,
      particles: []
    };
    setScore(0);
    setGameOverReason('');
  };

  const jump = () => {
    const { player } = stateRef.current;
    // 2段ジャンプまで許可
    if (player.grounded || player.jumpCount < 2) {
      player.vy = JUMP_STRENGTH;
      player.grounded = false;
      player.jumpCount++;
      
      // パーティクル発生
      for(let i=0; i<5; i++) {
        stateRef.current.particles.push({
            x: player.x + PLAYER_SIZE/2, 
            y: player.y + PLAYER_SIZE,
            vx: (Math.random() - 0.5) * 5,
            vy: Math.random() * 2,
            color: '#fff',
            life: 10
        });
      }
      playJumpSound();
    }
  };

  const update = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const { player } = state;

    // 1. Player Movement (Auto Run)
    let intendedMove = MOVE_SPEED;
    
    // Invincibility
    if (state.invincible > 0) state.invincible--;

    // 2. Physics
    player.vy += GRAVITY;
    player.y += player.vy;

    // Ground Collision
    if (player.y + PLAYER_SIZE >= GROUND_Y) {
      player.y = GROUND_Y - PLAYER_SIZE;
      player.vy = 0;
      player.grounded = true;
      player.jumpCount = 0; // ジャンプ回数リセット
    }

    // 3. Interactions
    // Check Goal
    const goal = state.obstacles.find(o => o.type === 'goal');
    if (goal) {
        if (player.x > goal.x || rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, goal.x, goal.y, goal.w, goal.h)) {
            playHappy2Sound();
            setGameState('won');
            onComplete(true);
            return;
        }
    }

    // Obstacles Collision
    state.obstacles.forEach(obs => {
      if (obs.type === 'goal') return;

      if (rectIntersect(player.x + intendedMove, player.y, PLAYER_SIZE, PLAYER_SIZE, obs.x, obs.y, obs.w, obs.h)) {
        if (obs.type === 'spike') {
            // Spike: Damage
            if (state.invincible <= 0) {
                state.lives--;
                state.invincible = 60;
                playNGSound();
                if (state.lives <= 0) {
                    setGameOverReason('トゲに当たっちゃった！');
                    setGameState('lost');
                }
            }
        } else {
            // Block: Solid
            // 上から乗る判定
            if (player.vy >= 0 && player.y + PLAYER_SIZE - player.vy <= obs.y + 10) {
                player.y = obs.y - PLAYER_SIZE;
                player.vy = 0;
                player.grounded = true;
                player.jumpCount = 0;
            } else {
                // 横からの衝突
                if (player.x + PLAYER_SIZE <= obs.x + 10) {
                    intendedMove = 0; // 進めない
                }
            }
        }
      }
    });
    
    // Apply movement
    player.x += intendedMove;
    state.cameraX = player.x - 200;
    
    // 落下判定
    if (player.y > CANVAS_HEIGHT) {
        setGameOverReason('落ちちゃった！');
        setGameState('lost');
        return;
    }

    // Enemy Collision
    state.enemies.forEach(enemy => {
      if (!enemy.active) return;
      
      if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, enemy.x, enemy.y, enemy.w, enemy.h)) {
        // 踏みつけ判定: プレイヤーが落下中かつ、敵の上半分にいる
        if (player.vy > 0 && player.y + PLAYER_SIZE < enemy.y + enemy.h * 0.8) {
          // Kill enemy
          enemy.active = false;
          player.vy = JUMP_STRENGTH * 0.7; // 踏みつけジャンプ
          onAddScore(50);
          state.score += 50;
          setScore(state.score);
          playHappy1Sound();
          // Spawn particles
          for(let i=0; i<8; i++) {
            state.particles.push({
              x: enemy.x + enemy.w/2, y: enemy.y + enemy.h/2, 
              vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
              color: '#9C27B0',
              life: 30
            });
          }
        } else {
          // Hurt player
          if (state.invincible <= 0) {
              state.lives--;
              state.invincible = 60;
              playNGSound();
              if (state.lives <= 0) {
                  setGameOverReason('敵に当たっちゃった！');
                  setGameState('lost');
              }
          }
        }
      }
    });

    // Item Collection (Kanji)
    state.items.forEach(item => {
        if (!item.active) return;
        if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, item.x, item.y, item.w, item.h)) {
            item.active = false;
            
            if (item.type === 'target') {
                // 正解！
                onAddScore(100);
                state.score += 100;
                setScore(state.score);
                playOK1Sound();
                // Sparkle
                for(let i=0; i<8; i++) {
                    state.particles.push({
                      x: item.x + item.w/2, y: item.y + item.h/2, 
                      vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
                      color: '#FFD700',
                      life: 20
                    });
                }
            } else {
                // 不正解！
                if (state.invincible <= 0) {
                    state.lives--;
                    state.invincible = 60;
                    playNGSound();
                    if (state.lives <= 0) {
                        setGameOverReason('間違った漢字を取っちゃった！');
                        setGameState('lost');
                    }
                }
            }
        }
    });

    // Update particles
    state.particles = state.particles.filter(p => p.life > 0);
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });

    // Draw
    draw(ctx, state);
    requestRef.current = requestAnimationFrame(update);
  };

  const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
  };

  const draw = (ctx, state) => {
    // Ensure identity matrix for clearRect
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.save();
    ctx.translate(-state.cameraX, 0);

    // Draw Background
    ctx.fillStyle = config.bg || '#87CEEB';
    ctx.fillRect(state.cameraX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    state.clouds.forEach(cloud => {
        const parallaxX = cloud.x - (state.cameraX * 0.5); 
        ctx.beginPath();
        ctx.arc(state.cameraX + parallaxX % (CANVAS_WIDTH * 3), cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Ground
    ctx.fillStyle = '#654321';
    ctx.fillRect(state.cameraX, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    // Grass
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(state.cameraX, GROUND_Y, CANVAS_WIDTH, 20);

    // Draw Goal
    const goal = state.obstacles.find(o => o.type === 'goal');
    if (goal) {
      ctx.fillStyle = '#ddd';
      ctx.fillRect(goal.x, goal.y, 10, 200);
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(goal.x+5, goal.y, 10, 0, Math.PI*2); ctx.fill();
      
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.moveTo(goal.x + 10, goal.y + 10);
      ctx.lineTo(goal.x + 80, goal.y + 40);
      ctx.lineTo(goal.x + 10, goal.y + 70);
      ctx.fill();
      // Draw Target Char
      ctx.font = "bold 40px 'Zen Maru Gothic'";
      ctx.fillStyle = "white";
      ctx.fillText(config.targetChar || '★', goal.x + 25, goal.y + 55);
    }

    // Draw Obstacles
    state.obstacles.forEach(obs => {
      if (obs.type === 'block') {
        ctx.fillStyle = '#8D6E63'; 
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
      } else if (obs.type === 'spike') {
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.h);
        ctx.lineTo(obs.x + obs.w/2, obs.y);
        ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
        ctx.fill();
      }
    });

    // Draw Items (Kanji)
    state.items.forEach(item => {
        if (!item.active) return;
        const wobble = Math.sin(Date.now() / 200) * 5;
        
        // Bubble background
        ctx.fillStyle = item.type === 'target' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(200, 200, 200, 0.9)';
        ctx.beginPath();
        ctx.arc(item.x + item.w/2, item.y + item.h/2 + wobble, item.w/2 + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = item.type === 'target' ? '#FFD700' : '#555';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Kanji text
        ctx.font = `bold ${item.w * 0.7}px serif`;
        ctx.fillStyle = item.type === 'target' ? '#E65100' : '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.char, item.x + item.w/2, item.y + item.h/2 + wobble);
    });

    // Draw Enemies
    state.enemies.forEach(enemy => {
      if (enemy.active) {
        const bounce = Math.abs(Math.sin(Date.now() / 150)) * 5;
        ctx.fillStyle = '#9C27B0'; 
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.w/2, enemy.y + enemy.h/2 + bounce, enemy.w/2, Math.PI, 0);
        ctx.rect(enemy.x, enemy.y + enemy.h/2 + bounce, enemy.w, enemy.h/2 - bounce);
        ctx.fill();
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(enemy.x + 10, enemy.y + 15 + bounce, 5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(enemy.x + 30, enemy.y + 15 + bounce, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(enemy.x + 12, enemy.y + 15 + bounce, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(enemy.x + 28, enemy.y + 15 + bounce, 2, 0, Math.PI*2); ctx.fill();
      }
    });

    // Draw Particles
    state.particles.forEach(p => {
      ctx.fillStyle = p.color || "orange";
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0, p.life/2), 0, Math.PI*2);
      ctx.fill();
    });

    // Draw Player
    const px = state.player.x;
    const py = state.player.y;
    
    // Blink if invincible
    if (state.invincible > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
        // Skip
    } else {
        // Body
        ctx.fillStyle = '#FF9F43';
        ctx.beginPath();
        ctx.ellipse(px + 20, py + 20, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (Running Animation)
        const time = Date.now() / 100;
        const legOffset1 = Math.sin(time) * 10;
        const legOffset2 = Math.sin(time + Math.PI) * 10;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        // Adjust legs based on grounded
        if (!state.player.grounded) {
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 10, py + 45); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 30, py + 50); ctx.stroke();
        } else {
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 20 + legOffset1, py + 50); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 20 + legOffset2, py + 50); ctx.stroke();
        }

        // Head band
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(px + 5, py + 5, 30, 8);
        
        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(px + 28, py + 15, 3, 0, Math.PI*2); ctx.fill();
    }

    ctx.restore();

    // UI Overlay
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText(`スコア: ${state.score}`, CANVAS_WIDTH - 20, 40);
    
    // Draw Hearts
    ctx.textAlign = "left";
    let hearts = "";
    for(let i=0; i<state.lives; i++) hearts += "❤ ";
    ctx.fillStyle = "#ff4757";
    ctx.fillText(hearts, 20, 40);
    
    // Target display
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(CANVAS_WIDTH/2 - 60, 10, 120, 40);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`ターゲット: ${config.targetChar}`, CANVAS_WIDTH/2, 38);
  };

  const handleInput = (e) => {
    if (e.type === 'mousedown' || e.type === 'touchstart') {
      if (gameState === 'playing') {
        jump();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    initGame();
    if(canvas) {
       draw(canvas.getContext('2d'), stateRef.current);
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
    <div className="game-area jump-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '漢字ラン'}</h3>
          <p>{config.instruction || '正しい漢字を集めながらゴールを目指そう！'}</p>
          <div className="instruction-icons" style={{display:'flex', gap:'20px', justifyContent:'center', margin:'10px 0'}}>
             <div style={{textAlign:'center'}}>
                <div style={{fontSize:'30px', color:'#FF9F43', fontWeight:'bold'}}>{config.targetChar}</div>
                <small>正解</small>
             </div>
             <div style={{textAlign:'center'}}>
                <div style={{fontSize:'30px', color:'#333'}}>×</div>
                <small>ハズレ（ダメージ）</small>
             </div>
          </div>
          <p style={{fontSize: '0.9em', marginTop: '10px'}}>画面タップでジャンプ（2段ジャンプ可）</p>
          <button className="start-btn" onClick={() => {
              initGame();
              setGameState('playing');
          }}>スタート！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ゲームオーバー</h2>
          <p>{gameOverReason || '残念...'}</p>
          <button className="start-btn" onClick={() => {
            initGame();
            setGameState('playing');
          }}>リトライ</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: '#87CEEB', touchAction: 'none' }}
        onMouseDown={handleInput}
        onTouchStart={handleInput}
      />
    </div>
  );
};

export default JumpGame;
