import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playJumpSound, playOK1Sound, playNGSound, playHappy1Sound, playFinishSound } from '../../../utils/soundPlayer';
import { STAGES, pickItemType } from './airplaneStages';
import { isLastStage, stageTitle, stageProgress, nextStageStart, retryStageStart } from './stageFlow';
import { StageIntro, StageClear } from './StageOverlays';
import { computeSteps, isPauseKey } from './jumpGameLogic';
import {
  isThrustKey,
  buildCheckpoints,
  updateCheckpoints,
  lastReachedCheckpoint,
  respawnAt,
} from './airplaneLogic';

const AirplaneGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, intro, playing, stageClear, won, lost
  const [paused, setPaused] = useState(false);
  const requestRef = useRef();
  const lastFrameRef = useRef(null); // 前回の描画の時刻
  const accumulatorRef = useRef(0); // まだ更新に使っていない経過時間（ミリ秒）
  const [stageIndex, setStageIndex] = useState(0);
  const stageStartScoreRef = useRef(0); // そのステージを始めたときのスコア（リトライで戻す）

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.4;
  const THRUST = -0.8;
  const MAX_SPEED = 8;
  const PLAYER_SIZE = 50;

  const stateRef = useRef({
    player: { x: 100, y: CANVAS_HEIGHT / 2, vy: 0, angle: 0 },
    items: [], // {x, y, type, char, w, h}
    particles: [],
    clouds: [],
    score: 0,
    fuel: 100,
    distance: 0,
    isThrusting: false,
    combo: 0,
    invincible: 0,
    stage: STAGES[0],
    stageIndex: 0,
    stars: [],
    levelLength: STAGES[0].levelLength, // Distance to fly to win
    checkpoints: [],
    tick: 0, // 更新した回数（鳥のゆれ方に使う。一時停止中は進まない）
    noticeText: '',
    noticeTimer: 0
  });

  const initGame = (index = 0, startScore = 0) => {
    const stage = STAGES[index];
    // Generate initial clouds
    const clouds = [];
    for(let i=0; i<10; i++) {
        clouds.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: 40 + Math.random() * 60,
            speed: 0.5 + Math.random() * 1.5
        });
    }

    // 夜空の星（よぞらのときだけ使う）
    const stars = [];
    if (stage.theme.stars) {
      for (let i = 0; i < 60; i++) {
        stars.push({ x: Math.random() * CANVAS_WIDTH, y: Math.random() * CANVAS_HEIGHT, r: 0.5 + Math.random() * 1.5 });
      }
    }

    stateRef.current = {
      player: { x: 100, y: CANVAS_HEIGHT / 2, vy: 0, angle: 0 },
      items: [],
      particles: [],
      clouds: clouds,
      score: startScore,
      fuel: 100,
      distance: 0,
      isThrusting: false,
      combo: 0,
      invincible: 0,
      stage,
      stageIndex: index,
      stars,
      levelLength: stage.levelLength,
      checkpoints: buildCheckpoints({ levelLength: stage.levelLength }),
      tick: 0,
      noticeText: '',
      noticeTimer: 0
    };
  };

  // ステージを始める。名前を出すとき（最初・つぎへ）は intro、リトライはすぐ playing
  const startStage = ({ index, startScore, withIntro }) => {
    stageStartScoreRef.current = startScore;
    setStageIndex(index);
    setPaused(false);
    initGame(index, startScore);
    const canvas = canvasRef.current;
    if (canvas) draw(canvas.getContext('2d'), stateRef.current);
    setGameState(withIntro ? 'intro' : 'playing');
  };

  const handleIntroDone = useCallback(() => setGameState('playing'), []);

  const spawnItem = () => {
    const state = stateRef.current;
    const type = pickItemType({ weights: state.stage.weights, r: Math.random() });
    
    let item = {
        x: CANVAS_WIDTH + 50,
        y: 50 + Math.random() * (CANVAS_HEIGHT - 100),
        w: 50,
        h: 50,
        vx: -state.stage.scrollSpeed
    };

    // 種類の割合はステージ設定（weights）。あおぞらは 正解50% / ハズレ25% / 障害物15% / コイン10%

    if (type === 'good') {
        item.type = 'good';
        item.char = config.targetChar || '○';
        item.color = '#4CAF50';
    } else if (type === 'bad') {
        item.type = 'bad';
        item.char = config.badChar || '×';
        item.color = '#F44336';
    } else if (type === 'obstacle') {
        item.type = 'obstacle';
        item.subType = Math.random() > 0.5 ? 'bird' : 'storm';
        item.w = 60;
        item.h = 40;
    } else {
        item.type = 'coin';
        item.w = 30;
        item.h = 30;
    }

    state.items.push(item);
  };

  // 通過済みの旗があればそこから再開し、なければ墜落（ゲームオーバー）にする。続けられるなら true
  const crashOrRespawn = () => {
    const state = stateRef.current;
    const checkpoint = lastReachedCheckpoint(state.checkpoints);
    if (!checkpoint) {
        setGameState('lost');
        playNGSound();
        return false;
    }

    const respawn = respawnAt({ distance: checkpoint.distance });
    state.distance = respawn.distance;
    state.fuel = respawn.fuel;
    state.invincible = respawn.invincible;
    state.combo = 0;
    state.player.y = CANVAS_HEIGHT / 2;
    state.player.vy = 0;
    state.isThrusting = false;
    // 再開した場所のアイテムは、いったん消す（すぐぶつかるのを防ぐ）
    state.items = [];
    state.noticeText = 'チェックポイントから再開！';
    state.noticeTimer = 120;
    createParticles(state.player.x, state.player.y, '#FFD700', 12);
    return true;
  };

  // 物理の更新を1回（1/60秒ぶん）進める。ステージが終わったら false を返す
  const step = () => {
    const state = stateRef.current;
    const { player } = state;

    state.tick++;
    if (state.noticeTimer > 0) state.noticeTimer--;

    // 0. Invincibility
    if (state.invincible > 0) state.invincible--;

    // 1. Physics
    if (state.isThrusting) {
        player.vy += THRUST;
    } else {
        player.vy += GRAVITY;
    }

    // Limit speed
    player.vy = Math.max(Math.min(player.vy, MAX_SPEED), -MAX_SPEED);
    
    player.y += player.vy;
    
    // Angle based on velocity
    player.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (player.vy * 0.1)));

    // Boundaries
    if (player.y < 0) { player.y = 0; player.vy = 0; }
    if (player.y > CANVAS_HEIGHT - PLAYER_SIZE) { 
        player.y = CANVAS_HEIGHT - PLAYER_SIZE; 
        player.vy = 0; 
        // Hitting ground damage?
        if (state.invincible <= 0) {
            state.fuel -= 0.5;
        }
    }

    // 2. Game Progress
    state.distance += state.stage.scrollSpeed / 10;
    state.fuel -= 0.02; // Reduced constant fuel drain from 0.05

    // Win Condition
    if (state.distance >= state.levelLength) {
        playFinishSound();
        if (isLastStage(STAGES, state.stageIndex)) {
            setGameState('won');
            onComplete(true);
        } else {
            setGameState('stageClear');
        }
        return false;
    }

    // チェックポイントの旗を通ったら、通過済みにする
    const checkpointResult = updateCheckpoints({ checkpoints: state.checkpoints, distance: state.distance });
    state.checkpoints = checkpointResult.checkpoints;
    if (checkpointResult.newlyReached.length > 0) {
        state.noticeText = 'チェックポイント！';
        state.noticeTimer = 90;
        playHappy1Sound();
    }

    // Lose Condition
    if (state.fuel <= 0) {
        return crashOrRespawn();
    }

    // 3. Spawning
    if (Math.random() < state.stage.spawnRate) {
        spawnItem();
    }
    // Cloud spawning
    if (Math.random() < 0.01) {
        state.clouds.push({
            x: CANVAS_WIDTH + 100,
            y: Math.random() * CANVAS_HEIGHT,
            size: 40 + Math.random() * 60,
            speed: 0.5 + Math.random() * 1.5
        });
    }

    // 4. Updates & Collisions
    // Update Items
    state.items.forEach(item => {
        item.x += item.vx;
        // Sine wave movement for birds
        if (item.type === 'obstacle' && item.subType === 'bird') {
            item.y += Math.sin(state.tick / 12) * 2; // 一時停止中は止まるよう、時刻ではなく更新回数で動かす
        }
    });

    // Check Collisions
    state.items = state.items.filter(item => {
        // Off screen
        if (item.x + item.w < -100) return false;

        // Collision with player
        if (rectIntersect(player.x, player.y + 10, PLAYER_SIZE, PLAYER_SIZE - 20, item.x, item.y, item.w, item.h)) {
            // handleCollision returns true if item should be removed
            return !handleCollision(item, state);
        }
        return true;
    });

    // Update Clouds
    state.clouds.forEach(c => c.x -= c.speed);
    state.clouds = state.clouds.filter(c => c.x + c.size > -100);

    // Update Particles
    state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.1; // gravity
    });
    state.particles = state.particles.filter(p => p.life > 0);

    return true;
  };

  // 描画のたびに、経過時間ぶんだけ更新を進めてから描く（60Hzでも120Hzでも同じ速さになる）
  const update = (now) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const deltaMs = lastFrameRef.current === null ? 0 : now - lastFrameRef.current;
    lastFrameRef.current = now;
    const result = computeSteps({ accumulatorMs: accumulatorRef.current, deltaMs });
    accumulatorRef.current = result.accumulatorMs;

    let running = true;
    for (let i = 0; i < result.steps && running; i++) {
      running = step();
    }

    draw(ctx, stateRef.current);
    if (running) requestRef.current = requestAnimationFrame(update);
  };

  const handleCollision = (item, state) => {
    if (item.type === 'good') {
        // Correct Kanji
        playHappy1Sound();
        state.score += 100;
        state.fuel = Math.min(100, state.fuel + 20); // Increased recovery
        state.combo++;
        onAddScore(100);
        createParticles(item.x, item.y, '#4CAF50', 10);
        return true; // remove item
    } else if (item.type === 'coin') {
        playOK1Sound();
        state.score += 50;
        onAddScore(50);
        createParticles(item.x, item.y, '#FFD700', 5);
        return true; // remove item
    } else {
        // Bad things (Bad Kanji, Obstacle)
        if (state.invincible <= 0) {
            playNGSound();
            state.score = Math.max(0, state.score - 50);
            state.fuel -= 10; // Reduced damage
            state.combo = 0;
            state.player.vy = 5; // Knockback down
            state.invincible = 60; // 1 second invincibility
            createParticles(item.x, item.y, '#555', 8);
            return true; // remove item only if hit (to prevent multi-hit?) 
            // Actually usually obstacles don't disappear in some games but in this case let's make them disappear to avoid multi-hit confusion
        }
        return false; // Don't remove if invincible (pass through)
    }
  };

  const createParticles = (x, y, color, count) => {
    for(let i=0; i<count; i++) {
        stateRef.current.particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30,
            color: color
        });
    }
  };

  const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
  };

  const draw = (ctx, state) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky Background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    const theme = state.stage.theme;
    gradient.addColorStop(0, theme.sky[0]);
    gradient.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Stars
    if (theme.stars) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        state.stars.forEach(st => {
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw Clouds
    ctx.fillStyle = theme.cloud;
    state.clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.5, c.y - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
        ctx.arc(c.x - c.size * 0.5, c.y - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
    });

    // チェックポイントの旗（通過前は灰色、通過後は緑）。アイテムと同じ速さで流れる（1距離 = 10px）
    state.checkpoints.forEach(c => {
        const x = state.player.x + (c.distance - state.distance) * 10;
        if (x < -60 || x > CANVAS_WIDTH + 60) return;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(x, 0, 4, CANVAS_HEIGHT); // Pole
        ctx.fillStyle = c.reached ? '#4CAF50' : '#9E9E9E';
        ctx.beginPath();
        ctx.moveTo(x + 4, 60);
        ctx.lineTo(x + 54, 80);
        ctx.lineTo(x + 4, 100);
        ctx.fill();
    });

    // Draw Goal Line (if close)
    const remaining = state.levelLength - state.distance;
    if (remaining < CANVAS_WIDTH) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(remaining + 200, 0, 50, CANVAS_HEIGHT); // Finish line visual
        // Checkered pattern
        for(let i=0; i<CANVAS_HEIGHT; i+=50) {
            ctx.fillStyle = (i/50)%2===0 ? 'black' : 'white';
            ctx.fillRect(remaining + 200, i, 20, 50);
        }
    }

    // Draw Items
    state.items.forEach(item => {
        if (item.type === 'good' || item.type === 'bad') {
            // Circle background
            ctx.fillStyle = item.type === 'good' ? '#81C784' : '#E57373';
            ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/2, 0, Math.PI * 2);
            ctx.fill();
            // Ring
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            // Text
            ctx.fillStyle = 'white';
            ctx.font = "bold 30px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.char, item.x + item.w/2, item.y + item.h/2);
        } else if (item.type === 'coin') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFF59D';
            ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/3, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'obstacle') {
            const skin = state.stage.obstacleSkin && state.stage.obstacleSkin[item.subType];
            if (skin) {
                // ステージの絵文字
                ctx.font = '44px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(skin, item.x + item.w/2, item.y + item.h/2);
            } else if (item.subType === 'bird') {
                // Bird
                ctx.fillStyle = '#5D4037';
                ctx.beginPath();
                ctx.moveTo(item.x, item.y + item.h/2);
                ctx.quadraticCurveTo(item.x + item.w/4, item.y, item.x + item.w/2, item.y + item.h/2);
                ctx.quadraticCurveTo(item.x + item.w*3/4, item.y, item.x + item.w, item.y + item.h/2);
                ctx.lineTo(item.x + item.w/2, item.y + item.h);
                ctx.fill();
                // Wing
                ctx.fillStyle = '#8D6E63';
                ctx.beginPath();
                ctx.ellipse(item.x + item.w/2, item.y + item.h/2, 10, 5, 0, 0, Math.PI*2);
                ctx.fill();
            } else {
                // Storm
                ctx.fillStyle = '#78909C';
                ctx.beginPath();
                ctx.arc(item.x + 20, item.y + 20, 20, 0, Math.PI * 2);
                ctx.arc(item.x + 40, item.y + 15, 25, 0, Math.PI * 2);
                ctx.arc(item.x + 10, item.y + 25, 15, 0, Math.PI * 2);
                ctx.fill();
                // Lightning
                if (Math.random() < 0.2) {
                    ctx.strokeStyle = '#FFEB3B';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(item.x + 20, item.y + 30);
                    ctx.lineTo(item.x + 10, item.y + 50);
                    ctx.lineTo(item.x + 30, item.y + 45);
                    ctx.lineTo(item.x + 20, item.y + 65);
                    ctx.stroke();
                }
            }
        }
    });

    // Draw Particles
    state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life / 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Player (Airplane)
    ctx.save();
    ctx.translate(state.player.x + PLAYER_SIZE/2, state.player.y + PLAYER_SIZE/2);
    ctx.rotate(state.player.angle);
    
    // Invincibility Blink
    if (state.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Body
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI*2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-25, -5);
    ctx.lineTo(-35, -20);
    ctx.lineTo(-30, 0);
    ctx.fill();
    // Wing
    ctx.fillStyle = '#FF8A80';
    ctx.beginPath();
    ctx.ellipse(5, 5, 20, 8, 0.5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#D32F2F'; // Propeller
    ctx.fillRect(25, -15, 5, 30);
    // Cockpit
    ctx.fillStyle = '#E0F7FA';
    ctx.beginPath();
    ctx.arc(10, -5, 8, 0, Math.PI, true);
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1.0;

    // UI Overlay
    // Fuel Bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(20, 20, 200, 20);
    ctx.fillStyle = state.fuel > 30 ? '#76FF03' : '#FF1744';
    ctx.fillRect(22, 22, 196 * (state.fuel / 100), 16);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText("FUEL", 25, 35);

    // Score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH - 20, 40);

    // Progress
    const progress = Math.min(1, state.distance / state.levelLength);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(CANVAS_WIDTH/2 - 100, 20, 200, 10);
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(CANVAS_WIDTH/2 - 100, 20, 200 * progress, 10);
    // ステージ番号（1/3）
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(stageProgress(STAGES, state.stageIndex), CANVAS_WIDTH/2, 50);
    // Icon on progress bar
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH/2 - 100 + 200 * progress, 25, 8, 0, Math.PI*2);
    ctx.fill();

    // お知らせ（チェックポイントなど）
    if (state.noticeTimer > 0) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 4;
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(state.noticeText, CANVAS_WIDTH / 2, 150);
        ctx.fillText(state.noticeText, CANVAS_WIDTH / 2, 150);
    }
  };

  // エンジンを吹かす・止める。一時停止中は操作を受けつけない
  const startThrust = () => {
    if (gameState === 'playing' && !paused) {
        stateRef.current.isThrusting = true;
        playJumpSound(); // Use jump sound as engine rev
    }
  };

  const stopThrust = () => {
    stateRef.current.isThrusting = false;
  };

  // マウス・タッチ・ペンを pointer イベントにまとめる（タッチで二重に反応しないように）
  const handleInputStart = (e) => {
    e.preventDefault();
    startThrust();
  };

  const handleInputEnd = (e) => {
    e.preventDefault();
    stopThrust();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        stageStartScoreRef.current = 0;
        setStageIndex(0);
        initGame(0, 0);
        draw(canvas.getContext('2d'), stateRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  // ループは playing の間だけ動く。stageClear・intro・lost に入るとき、ここで必ず止まる
  // （次の playing で1本だけ始まる。ステージを切り替えても二重にならない）
  // 一時停止中もループを止める。再開したときは時間を数え直す（止めていた間の時間を、まとめて進めないため）
  useEffect(() => {
    if (gameState === 'playing' && !paused) {
      lastFrameRef.current = null;
      accumulatorRef.current = 0;
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, paused]);

  // 一時停止にしたら、エンジンも止める（再開したとき、押しっぱなしの状態が残らないように）
  useEffect(() => {
    if (paused) stateRef.current.isThrusting = false;
  }, [paused]);

  // ほかのタブやアプリに切り替えたら、自動で止める
  useEffect(() => {
    if (gameState !== 'playing') return undefined;
    const handleVisibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [gameState]);

  // キーボードでも操作できる（スペース・↑・W で上昇、Esc・P で一時停止）。長押しの連続入力は無視する
  useEffect(() => {
    if (gameState !== 'playing') return undefined;
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (isPauseKey(e.key)) {
        setPaused((p) => !p);
        return;
      }
      if (!isThrustKey(e.key)) return;
      e.preventDefault(); // スペースキーで画面がスクロールしないようにする
      startThrust();
    };
    const handleKeyUp = (e) => {
      if (isThrustKey(e.key)) stopThrust();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, paused]);

  return (
    <div className="game-area airplane-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '空の旅'}</h3>
          <p>{config.instruction || '画面を押して上昇！燃料（漢字）を集めて飛び続けよう！'}</p>
          <p style={{ fontSize: '0.9em' }}>スペース・↑キーでも上昇できるよ</p>
          <p style={{ fontSize: '0.9em', color: '#69F0AE' }}>旗を通ると、燃料がなくなってもそこから再開できるよ</p>
          <div className="instruction-icons" style={{display:'flex', gap:'20px', justifyContent:'center', margin:'10px 0'}}>
             <div style={{textAlign:'center'}}>
                <div style={{width:'30px', height:'30px', background:'#4CAF50', borderRadius:'50%', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>{config.targetChar}</div>
                <small>正解</small>
             </div>
             <div style={{textAlign:'center'}}>
                <div style={{width:'30px', height:'30px', background:'#F44336', borderRadius:'50%', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>{config.badChar}</div>
                <small>ハズレ</small>
             </div>
          </div>
          <button className="start-btn" onClick={() => startStage({ index: 0, startScore: 0, withIntro: true })}>フライト開始！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>墜落...</h2>
          <p>燃料がなくなっちゃった！</p>
          <p>Score: {stateRef.current.score}</p>
          <button className="start-btn" onClick={() => startStage(retryStageStart({ index: stageIndex, startScore: stageStartScoreRef.current }))}>リトライ</button>
        </div>
      )}

      {gameState === 'intro' && (
        <StageIntro
          title={stageTitle(STAGES, stageIndex)}
          message={`${STAGES[stageIndex].name}を飛んでいこう！`}
          onDone={handleIntroDone}
        />
      )}

      {gameState === 'stageClear' && (
        <StageClear
          score={stateRef.current.score}
          onNext={() => startStage(nextStageStart({ index: stageIndex, score: stateRef.current.score }))}
        />
      )}

      {gameState === 'playing' && !paused && (
        <button
          type="button"
          aria-label="一時停止"
          onClick={() => setPaused(true)}
          style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 50, padding: '4px 10px', fontSize: '1.2rem', background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 8 }}
        >⏸</button>
      )}

      {gameState === 'playing' && paused && (
        <div className="game-instruction-overlay">
          <h3>⏸ 一時停止</h3>
          <p style={{ fontSize: '0.9em' }}>Esc / P キーでも、つづけられるよ</p>
          <button className="start-btn" onClick={() => setPaused(false)}>つづける</button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: '#4FC3F7', touchAction: 'none' }}
        onPointerDown={handleInputStart}
        onPointerUp={handleInputEnd}
        onPointerLeave={handleInputEnd}
        onPointerCancel={handleInputEnd}
      />
    </div>
  );
};

export default AirplaneGame;
