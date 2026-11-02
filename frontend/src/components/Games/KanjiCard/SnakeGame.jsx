import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GRADE1_KANJI, SIMILAR_PAIRS } from '../../../data/kanjiData';
import { playOK2Sound, playNGSound, playHappy1Sound, playHappy2Sound } from '../../../utils/soundPlayer';
import { SNAKE_STAGES, getMoveInterval, isStageGoalReached } from './snakeStages';
import { isLastStage, stageTitle, stageProgress, nextStageStart, retryStageStart } from './stageFlow';
import { StageIntro, StageClear } from './StageOverlays';

const SnakeGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, intro, playing, paused, stageClear, won, lost
  const [score, setScore] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const stageStartScoreRef = useRef(0); // そのステージを始めたときのスコア（リトライで戻す）
  const [gameOverReason, setGameOverReason] = useState('');
  const requestRef = useRef();
  const lastUpdateRef = useRef(0);
  const badItemTimerRef = useRef(0);

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRID_SIZE = 40;
  const COLS = CANVAS_WIDTH / GRID_SIZE;
  const ROWS = CANVAS_HEIGHT / GRID_SIZE;
  
  const stateRef = useRef({
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    items: [], // { x, y, char, type }
    score: 0,
    startScore: 0,
    stage: SNAKE_STAGES[0],
    stageIndex: 0,
    lives: 3,
    flash: 0
  });

  // ステージの最初の状態を作る。スコアは startScore から始まり、ライフはステージごとに3に戻す
  const initGame = (index = 0, startScore = 0) => {
    stateRef.current = {
      snake: [{ x: Math.floor(COLS/2), y: Math.floor(ROWS/2) }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      items: [],
      score: startScore,
      startScore,
      stage: SNAKE_STAGES[index],
      stageIndex: index,
      lives: 3,
      flash: 0
    };
    badItemTimerRef.current = Date.now();
    setScore(startScore);
    setGameOverReason('');
    spawnItem('target');
    spawnItem('bad');
  };

  // ステージを始める。名前を出すとき（最初・つぎへ）は intro、リトライはすぐ playing
  const startStage = ({ index, startScore, withIntro }) => {
    stageStartScoreRef.current = startScore;
    setStageIndex(index);
    initGame(index, startScore);
    draw();
    setGameState(withIntro ? 'intro' : 'playing');
  };

  const handleIntroDone = useCallback(() => setGameState('playing'), []);

  const spawnItem = (type) => {
    let x, y, valid;
    const { snake, items, stage } = stateRef.current;
    
    // Try to find empty spot
    for (let i = 0; i < 50; i++) {
        x = Math.floor(Math.random() * COLS);
        y = Math.floor(Math.random() * ROWS);
        valid = true;
        
        // Check collision with snake
        for (let segment of snake) {
            if (segment.x === x && segment.y === y) {
                valid = false;
                break;
            }
        }
        // Check collision with other items
        if (valid) {
            for (let item of items) {
                if (item.x === x && item.y === y) {
                    valid = false;
                    break;
                }
            }
        }
        // 障害物の上には出さない
        if (valid && stage.obstacles.some(o => o.x === x && o.y === y)) valid = false;
        // Don't spawn on center (respawn point)
        if (x === Math.floor(COLS/2) && y === Math.floor(ROWS/2)) valid = false;

        if (valid) break;
    }

    if (valid) {
        let char = config.targetChar;
        // Separate Heart logic to avoid replacing target
        if (type === 'heart') {
            char = '❤';
        }
        else if (type === 'bad') {
            // Pick distractor
            const target = config.targetChar;
            let distractor = '';
            if (SIMILAR_PAIRS[target]) {
                const similars = SIMILAR_PAIRS[target];
                distractor = similars[Math.floor(Math.random() * similars.length)];
            }
            if (!distractor) {
                distractor = GRADE1_KANJI[Math.floor(Math.random() * GRADE1_KANJI.length)];
                if (distractor === target) distractor = 'Ｘ';
            }
            char = distractor;
        }
        
        stateRef.current.items.push({ x, y, char, type, spawnedAt: Date.now() });
    }
  };

  const update = (timestamp) => {
    if (gameState !== 'playing') return;

    const currentSpeed = getMoveInterval(stateRef.current.stage, stateRef.current.score - stateRef.current.startScore);

    if (timestamp - lastUpdateRef.current > currentSpeed) {
        const state = stateRef.current;
        state.direction = state.nextDirection;
        if (state.flash > 0) state.flash--;
        
        // Move
        const head = { 
            x: state.snake[0].x + state.direction.x, 
            y: state.snake[0].y + state.direction.y 
        };

        // Wall Collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            playNGSound();
            setGameOverReason('壁にぶつかっちゃった！');
            setGameState('lost');
            return;
        }

        // 障害物にぶつかる
        if (state.stage.obstacles.some(o => o.x === head.x && o.y === head.y)) {
            playNGSound();
            setGameOverReason('いわにぶつかっちゃった！');
            setGameState('lost');
            return;
        }

        // Self Collision
        for (let segment of state.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                playNGSound();
                setGameOverReason('自分にぶつかっちゃった！');
                setGameState('lost');
                return;
            }
        }

        // Item Collision
        let ateTarget = false;
        let ateHeart = false;
        let hitBad = false;
        const newItems = state.items.filter(item => {
            if (item.x === head.x && item.y === head.y) {
                if (item.type === 'target') {
                    ateTarget = true;
                    playOK2Sound();
                    onAddScore(50);
                    state.score += 50;
                    setScore(state.score);
                } else if (item.type === 'heart') {
                    ateHeart = true;
                    playHappy1Sound();
                    state.lives = Math.min(5, state.lives + 1);
                } else {
                    hitBad = true;
                }
                return false; // Remove eaten item
            }
            return true;
        });
        state.items = newItems;

        if (hitBad) {
            state.lives--;
            state.flash = 12; // 画面を赤くする期間
            playNGSound();
            if (state.lives <= 0) {
                setGameOverReason('ライフがなくなっちゃった！');
                setGameState('lost');
                return;
            }
        }

        state.snake.unshift(head);
        
        if (ateTarget) {
             // Spawn new target
            spawnItem('target');
            // Chance for heart
            if (Math.random() < 0.1) spawnItem('heart');
            // Chance for bad
            if (Math.random() < state.stage.badSpawnChance) spawnItem('bad');
        } else if (ateHeart) {
            // If we ate heart, we didn't eat target, so pop tail unless we want to grow
            // Usually eating bonus items doesn't grow snake? Let's say it doesn't.
            state.snake.pop();
            // BUT if there are NO targets left (rare case), spawn one
            const hasTarget = state.items.some(i => i.type === 'target');
            if (!hasTarget) spawnItem('target');
        } else {
            // Moved without eating
            state.snake.pop();
        }
        
        // Ensure there is always a target
        const hasTarget = state.items.some(i => i.type === 'target');
        if (!hasTarget) spawnItem('target');

        // Bad item rotation (disappear every 5s)
        const now = Date.now();
        if (now - badItemTimerRef.current > 5000) {
            state.items = state.items.filter(i => i.type !== 'bad');
            const count = 1 + Math.floor(Math.random() * state.stage.badRotateMax);
            for(let i=0; i<count; i++) spawnItem('bad');
            badItemTimerRef.current = now;
        }

        // Win condition
        // ステージの目標点（ループはここで止める。次のフレームを予約しないので、クリア処理は1回だけ）
        if (isStageGoalReached(state.stage, state.score, state.startScore)) {
             playHappy2Sound();
             if (isLastStage(SNAKE_STAGES, state.stageIndex)) {
                 setGameState('won');
                 onComplete(true);
             } else {
                 setGameState('stageClear');
             }
             return;
        }

        lastUpdateRef.current = timestamp;
    }

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    ctx.save();

    // Clear
    const theme = state.stage.theme;
    ctx.fillStyle = theme.bg || config.bg || '#f0f9ff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]); // Dotted grid
    for(let i=0; i<=COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i*GRID_SIZE, 0); ctx.lineTo(i*GRID_SIZE, CANVAS_HEIGHT); ctx.stroke();
    }
    for(let i=0; i<=ROWS; i++) {
        ctx.beginPath(); ctx.moveTo(0, i*GRID_SIZE); ctx.lineTo(CANVAS_WIDTH, i*GRID_SIZE); ctx.stroke();
    }
    ctx.setLineDash([]); // Reset dash

    // Draw Snake
    // Body
    ctx.fillStyle = theme.snakeBody;
    for (let i = 1; i < state.snake.length; i++) {
        const segment = state.snake[i];
        ctx.beginPath();
        ctx.arc(segment.x * GRID_SIZE + GRID_SIZE/2, segment.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI*2);
        ctx.fill();
    }

    // Head
    const head = state.snake[0];
    ctx.fillStyle = theme.snakeHead;
    
    // Draw Head Background
    ctx.beginPath();
    ctx.arc(head.x * GRID_SIZE + GRID_SIZE/2, head.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2, 0, Math.PI*2);
    ctx.fill();

    // Draw Eyes to show direction
    const eyeOffset = GRID_SIZE * 0.2;
    const eyeSize = GRID_SIZE * 0.1;
    ctx.fillStyle = 'white';
    
    let leftEyeX = head.x * GRID_SIZE + GRID_SIZE/2 - eyeOffset;
    let leftEyeY = head.y * GRID_SIZE + GRID_SIZE/2 - eyeOffset;
    let rightEyeX = head.x * GRID_SIZE + GRID_SIZE/2 + eyeOffset;
    let rightEyeY = head.y * GRID_SIZE + GRID_SIZE/2 - eyeOffset;

    // Adjust eye position based on direction
    if (state.direction.x === 1) { // Right
        leftEyeX += eyeOffset; rightEyeX += eyeOffset;
    } else if (state.direction.x === -1) { // Left
        leftEyeX -= eyeOffset; rightEyeX -= eyeOffset;
    } else if (state.direction.y === 1) { // Down
        leftEyeY += eyeOffset; rightEyeY += eyeOffset;
    } else if (state.direction.y === -1) { // Up
        leftEyeY -= eyeOffset; rightEyeY -= eyeOffset;
    }

    ctx.beginPath(); ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI*2); ctx.fill();
    
    // Draw Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI*2); ctx.fill();

    // 障害物
    ctx.font = `${GRID_SIZE - 6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    state.stage.obstacles.forEach(o => {
        ctx.fillText(theme.obstacleEmoji, o.x * GRID_SIZE + GRID_SIZE/2, o.y * GRID_SIZE + GRID_SIZE/2);
    });

    // Draw Items
    state.items.forEach(item => {
        ctx.font = `bold ${GRID_SIZE - 5}px serif`;
        if (item.type === 'heart') {
            ctx.fillStyle = '#FF5252';
        } else {
            ctx.fillStyle = theme.textColor; // 正しい漢字もハズレも同じ色にする
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.type === 'heart' ? theme.heartEmoji : item.char, item.x * GRID_SIZE + GRID_SIZE/2, item.y * GRID_SIZE + GRID_SIZE/2);
        if (item.type === 'bad') {
            // ハズレには、ステージのおじゃま絵文字を小さく添える
            ctx.font = `${GRID_SIZE * 0.4}px serif`;
            ctx.fillText(theme.badEmoji, item.x * GRID_SIZE + GRID_SIZE * 0.82, item.y * GRID_SIZE + GRID_SIZE * 0.2);
        }
    });

    // Damage Flash
    if (state.flash > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, ${state.flash / 20})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw UI
    ctx.restore();
    
    // Lives
    ctx.font = "24px Arial";
    ctx.fillStyle = "#ff4757";
    ctx.textAlign = "left";
    let hearts = "";
    for(let i=0; i<state.lives; i++) hearts += "❤ ";
    ctx.fillText(hearts, 20, 30);
    
    // Score
    ctx.fillStyle = theme.bg ? theme.textColor : "#333";
    ctx.fillText(`スコア: ${state.score}  (このステージ ${state.score - state.startScore} / ${state.stage.targetScore})`, 20, 60);

    // ステージの番号（1/3）
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = theme.bg ? theme.textColor : "#333";
    ctx.fillText(`${stageProgress(SNAKE_STAGES, state.stageIndex)}  ${state.stage.name}`, CANVAS_WIDTH / 2, 30);

  };

  const handleKeyDown = (e) => {
    const state = stateRef.current;
    // Prevent default scrolling for arrow keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    // Prevent reversing direction directly
    switch(e.key) {
        case 'ArrowUp': 
            if (state.direction.y === 0) state.nextDirection = { x: 0, y: -1 }; 
            break;
        case 'ArrowDown': 
            if (state.direction.y === 0) state.nextDirection = { x: 0, y: 1 }; 
            break;
        case 'ArrowLeft': 
            if (state.direction.x === 0) state.nextDirection = { x: -1, y: 0 }; 
            break;
        case 'ArrowRight': 
            if (state.direction.x === 0) state.nextDirection = { x: 1, y: 0 }; 
            break;
    }
  };

  // Touch controls (Swipe)
  const touchStartRef = useRef({ x: 0, y: 0 });
  
  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const state = stateRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 30) { // Threshold
            if (dx > 0 && state.direction.x === 0) state.nextDirection = { x: 1, y: 0 };
            else if (dx < 0 && state.direction.x === 0) state.nextDirection = { x: -1, y: 0 };
        }
    } else {
        if (Math.abs(dy) > 30) {
            if (dy > 0 && state.direction.y === 0) state.nextDirection = { x: 0, y: 1 };
            else if (dy < 0 && state.direction.y === 0) state.nextDirection = { x: 0, y: -1 };
        }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas) {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        draw();
    }
    initGame();
    stageStartScoreRef.current = 0;
    setStageIndex(0);
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  const togglePause = () => {
      if (gameState === 'playing') setGameState('paused');
      else if (gameState === 'paused') setGameState('playing');
  };

  return (
    <div className="game-area snake-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', touchAction: 'none', position: 'relative' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '漢字スネーク'}</h3>
          <p>{config.instruction || '正しい漢字を食べて長くなろう！'}</p>
          <div className="instruction-icons" style={{display:'flex', gap:'20px', justifyContent:'center', margin:'10px 0'}}>
             <div style={{textAlign:'center'}}>
                <div style={{fontSize:'30px', color:'#FF9F43', fontWeight:'bold'}}>{config.targetChar}</div>
                <small>正解</small>
             </div>
             <div style={{textAlign:'center'}}>
                <div style={{fontSize:'30px', color:'#5D4037'}}>×</div>
                <small>ハズレ（ライフ-1）</small>
             </div>
          </div>
          <p style={{fontSize: '0.9em'}}>3つのステージを、つづけてクリアしよう！</p>
          <button className="start-btn" onClick={() => startStage({ index: 0, startScore: 0, withIntro: true })}>スタート！</button>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="game-instruction-overlay">
          <h3>一時停止</h3>
          <button className="start-btn" onClick={() => setGameState('playing')}>再開</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ゲームオーバー</h2>
          <p>{gameOverReason || 'ライフがなくなっちゃった！'}</p>
          <button className="start-btn" onClick={() => startStage(retryStageStart({ index: stageIndex, startScore: stageStartScoreRef.current }))}>リトライ</button>
        </div>
      )}

      {gameState === 'intro' && (
        <StageIntro
          title={stageTitle(SNAKE_STAGES, stageIndex)}
          message={`${SNAKE_STAGES[stageIndex].name}で、正しい漢字を食べよう！`}
          onDone={handleIntroDone}
        />
      )}

      {gameState === 'stageClear' && (
        <StageClear
          score={score}
          onNext={() => startStage(nextStageStart({ index: stageIndex, score: stateRef.current.score }))}
        />
      )}

      {gameState === 'playing' && (
          <button 
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 20
            }}
            onClick={togglePause}
          >
            ⏸
          </button>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: config.bg || '#f0f9ff' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      
    </div>
  );
};

export default SnakeGame;
