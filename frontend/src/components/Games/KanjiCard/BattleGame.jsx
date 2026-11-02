import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playCorrectSound, playNGSound, playFinishSound } from '../../../utils/soundPlayer';
import { SIMILAR_PAIRS } from '../../../data/kanjiData';
import { BATTLE_STAGES, buildOptions, pickDamage } from './battleStages';
import { isLastStage, stageProgress, stageTitle, nextStageStart, retryStageStart } from './stageFlow';
import { StageIntro, StageClear } from './StageOverlays';

const PLAYER_MAX_HP = 100;

const BattleGame = ({ config, onComplete, onAddScore }) => {
  const [gameState, setGameState] = useState('start'); // start, intro, playing, stageClear, lost
  const [stageIndex, setStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [enemyHp, setEnemyHp] = useState(BATTLE_STAGES[0].enemyHp);
  const [message, setMessage] = useState('モンスターがあらわれた！');
  const [options, setOptions] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionId, setQuestionId] = useState(0); // 問題ごとに増やす（タイマーのやり直し用）
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isDamaged, setIsDamaged] = useState(false);

  // 非同期の途中でも最新の値を読めるよう、ref にも持つ
  const stageIndexRef = useRef(0);
  const playerHpRef = useRef(PLAYER_MAX_HP);
  const enemyHpRef = useRef(BATTLE_STAGES[0].enemyHp);
  const scoreRef = useRef(0);
  const stageStartScoreRef = useRef(0); // そのステージを始めたときのスコア（リトライで戻す）
  const timersRef = useRef([]);

  const stage = BATTLE_STAGES[stageIndex];

  // コンフィグから設定を取得（なければデフォルト）
  const targetChar = config.targetChar || '漢';
  const instruction = config.instruction || '正しい漢字を選んで攻撃だ！';

  // 予約した setTimeout を、まとめて片付けられるようにする
  const later = (fn, ms) => {
    timersRef.current.push(setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const generateQuestion = () => {
    const current = BATTLE_STAGES[stageIndexRef.current];
    setOptions(buildOptions({
      targetChar,
      similarChars: SIMILAR_PAIRS[targetChar],
      count: current.optionCount,
    }));
    setTimeLeft(current.timeLimit);
    setQuestionId((id) => id + 1);
    setShowQuestion(true);
    setMessage(instruction);
  };

  // ステージを始める。名前を出すとき（最初・つぎへ）は intro、リトライはすぐ playing
  const startStage = ({ index, startScore, withIntro }) => {
    clearTimers();
    stageIndexRef.current = index;
    stageStartScoreRef.current = startScore;
    scoreRef.current = startScore;
    playerHpRef.current = PLAYER_MAX_HP;
    enemyHpRef.current = BATTLE_STAGES[index].enemyHp;
    setStageIndex(index);
    setScore(startScore);
    setPlayerHp(PLAYER_MAX_HP);
    setEnemyHp(BATTLE_STAGES[index].enemyHp);
    setIsAttacking(false);
    setIsDamaged(false);
    setShowQuestion(false);
    setMessage('モンスターがあらわれた！');
    if (withIntro) {
      setGameState('intro');
    } else {
      setGameState('playing');
      generateQuestion();
    }
  };

  const handleIntroDone = useCallback(() => {
    setGameState('playing');
    generateQuestion();
    // generateQuestion は ref と props だけを読むので、ステージ開始時の1回だけ呼べばよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // option が null のときは、時間切れ（まちがい扱い）
  const answer = (option) => {
    setShowQuestion(false);

    if (option && option.isCorrect) {
      // 正解：プレイヤーの攻撃
      playCorrectSound();
      setMessage('正解！プレイヤーの攻撃！');
      setIsAttacking(true);

      later(() => {
        setIsAttacking(false);
        const newEnemyHp = Math.max(0, enemyHpRef.current - pickDamage({ kind: 'attack', r: Math.random() }));
        enemyHpRef.current = newEnemyHp;
        setEnemyHp(newEnemyHp);
        scoreRef.current += 100;
        setScore(scoreRef.current);
        onAddScore(100);

        if (newEnemyHp === 0) {
          playFinishSound();
          setMessage('モンスターをたおした！');
          later(() => {
            if (isLastStage(BATTLE_STAGES, stageIndexRef.current)) {
              onComplete(true);
            } else {
              setGameState('stageClear');
            }
          }, 1000);
        } else {
          later(generateQuestion, 1000);
        }
      }, 500);
    } else {
      // 不正解：モンスターの攻撃
      playNGSound();
      setMessage(option ? `ちがうよ... 正解は「${targetChar}」だよ` : `じかんぎれ！ 正解は「${targetChar}」だよ`);

      later(() => {
        setMessage('モンスターの攻撃！');
        setIsDamaged(true);

        later(() => {
          setIsDamaged(false);
          const newPlayerHp = Math.max(0, playerHpRef.current - pickDamage({ kind: 'hit', r: Math.random() }));
          playerHpRef.current = newPlayerHp;
          setPlayerHp(newPlayerHp);

          if (newPlayerHp === 0) {
            setMessage('目の前が真っ暗になった...');
            later(() => setGameState('lost'), 1000);
          } else {
            later(generateQuestion, 1000);
          }
        }, 500);
      }, 1000);
    }
  };

  const handleOptionClick = (option) => {
    if (!showQuestion || gameState !== 'playing') return;
    answer(option);
  };

  // 時間切れ用に、いつも最新の answer を呼べるようにする
  const answerRef = useRef(answer);
  answerRef.current = answer;

  // 制限時間：1秒ごとに減らし、問題が変わる・画面を離れるときは必ず止める
  useEffect(() => {
    if (!showQuestion || gameState !== 'playing' || stage.timeLimit === null) return undefined;
    const timerId = setInterval(() => setTimeLeft((t) => (t === null ? t : t - 1)), 1000);
    return () => clearInterval(timerId);
  }, [showQuestion, gameState, questionId, stage.timeLimit]);

  useEffect(() => {
    if (showQuestion && gameState === 'playing' && timeLeft !== null && timeLeft <= 0) {
      answerRef.current(null);
    }
  }, [timeLeft, showQuestion, gameState]);

  return (
    <div className="battle-game" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `linear-gradient(to bottom, ${stage.background[0]} 0%, ${stage.background[1]} 100%)`,
      padding: '20px',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: '"M PLUS Rounded 1c", sans-serif'
    }}>
      {/* ステージ番号と残り時間 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
        <span>{stageProgress(BATTLE_STAGES, stageIndex)}</span>
        {gameState === 'playing' && showQuestion && timeLeft !== null && <span>のこり {Math.max(0, timeLeft)} びょう</span>}
      </div>

      {/* バトルフィールド */}
      <div className="battle-field" style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* プレイヤー */}
        <div className={`player ${isDamaged ? 'shake' : ''} ${isAttacking ? 'attack-action' : ''}`} style={{
          textAlign: 'center',
          transition: 'transform 0.2s'
        }}>
          <div style={{fontSize: '4rem'}}>🦸</div>
          <div className="hp-bar-container" style={{
            width: '100px', height: '10px', background: '#555', borderRadius: '5px', margin: '0 auto'
          }}>
            <div className="hp-bar" style={{
              width: `${playerHp}%`,
              height: '100%',
              background: playerHp > 30 ? '#4CAF50' : '#F44336',
              borderRadius: '5px',
              transition: 'width 0.5s'
            }}></div>
          </div>
          <p style={{fontWeight: 'bold', color: '#333'}}>ゆうしゃ HP: {playerHp}</p>
        </div>

        {/* モンスター */}
        <div className={`enemy ${isAttacking ? 'shake' : ''} ${isDamaged ? 'attack-action' : ''}`} style={{
          textAlign: 'center',
          transition: 'transform 0.2s'
        }}>
          <div style={{fontSize: '5rem'}}>{stage.enemyEmoji}</div>
          <div className="hp-bar-container" style={{
            width: '100px', height: '10px', background: '#555', borderRadius: '5px', margin: '0 auto'
          }}>
            <div className="hp-bar" style={{
              width: `${(enemyHp / stage.enemyHp) * 100}%`,
              height: '100%',
              background: enemyHp / stage.enemyHp > 0.3 ? '#FF9800' : '#F44336',
              borderRadius: '5px',
              transition: 'width 0.5s'
            }}></div>
          </div>
          <p style={{fontWeight: 'bold', color: '#333'}}>{stage.name} HP: {enemyHp}</p>
        </div>
      </div>

      {/* メッセージウィンドウ */}
      <div className="message-window" style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        {message}
      </div>

      {/* コマンド/選択肢エリア */}
      <div className="command-area" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        height: stage.optionCount > 4 ? '230px' : '150px'
      }}>
        {gameState === 'playing' && (
          showQuestion && options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                fontSize: '2rem',
                background: 'white',
                border: '4px solid #4CAF50',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                color: '#333',
                fontWeight: 'bold',
                boxShadow: '0 4px 0 #388E3C'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {option.char}
            </button>
          ))
        )}
      </div>
      
      {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>漢字バトル</h3>
          <p>{instruction}</p>
          <p style={{ fontSize: '0.9em' }}>3つのステージを、つづけてたおそう！</p>
          <button className="start-btn" onClick={() => startStage({ index: 0, startScore: 0, withIntro: true })}>スタート！</button>
        </div>
      )}

      {gameState === 'intro' && (
        <StageIntro
          title={stageTitle(BATTLE_STAGES, stageIndex)}
          message={`${stage.name}をたおそう！`}
          onDone={handleIntroDone}
        />
      )}

      {gameState === 'stageClear' && (
        <StageClear
          score={score}
          onNext={() => startStage(nextStageStart({ index: stageIndex, score: scoreRef.current }))}
        />
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ゲームオーバー</h2>
          <div style={{ fontSize: '2rem', margin: '10px 0' }}>スコア: {score}</div>
          <button
            className="start-btn"
            onClick={() => startStage(retryStageStart({ index: stageIndex, startScore: stageStartScoreRef.current }))}
          >
            もういちど チャレンジ！
          </button>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .shake {
          animation: shake 0.4s;
        }
        .attack-action {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default BattleGame;
