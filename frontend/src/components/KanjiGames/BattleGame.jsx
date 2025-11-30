import React, { useState, useEffect } from 'react';
import { playCorrectSound, playNGSound, playFinishSound } from '../../utils/soundPlayer';
import { SIMILAR_PAIRS } from '../../data/kanjiData';

const BattleGame = ({ config, onComplete, onAddScore }) => {
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [message, setMessage] = useState('モンスターがあらわれた！');
  const [options, setOptions] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionType, setQuestionType] = useState('find_kanji'); // 'find_kanji'
  const [isAttacking, setIsAttacking] = useState(false);
  const [isDamaged, setIsDamaged] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // コンフィグから設定を取得（なければデフォルト）
  const targetChar = config.targetChar || '漢';
  const instruction = config.instruction || '正しい漢字を選んで攻撃だ！';

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    // 似ている漢字を取得
    let distractors = SIMILAR_PAIRS[targetChar] || '日月火水木金土'; // デフォルト
    distractors = distractors.split('');
    
    // 選択肢を作成 (正解1 + 不正解3)
    const currentOptions = [
      { char: targetChar, isCorrect: true },
      ...Array(3).fill(null).map(() => ({
        char: distractors[Math.floor(Math.random() * distractors.length)],
        isCorrect: false
      }))
    ];

    // シャッフル
    setOptions(currentOptions.sort(() => Math.random() - 0.5));
    setShowQuestion(true);
    setMessage(instruction);
  };

  const handleOptionClick = (option) => {
    if (!showQuestion || gameOver) return;

    setShowQuestion(false);

    if (option.isCorrect) {
      // 正解：プレイヤーの攻撃
      playCorrectSound();
      setMessage('正解！プレイヤーの攻撃！');
      setIsAttacking(true);
      
      setTimeout(() => {
        setIsAttacking(false);
        const damage = 20 + Math.floor(Math.random() * 10);
        const newEnemyHp = Math.max(0, enemyHp - damage);
        setEnemyHp(newEnemyHp);
        onAddScore(100);

        if (newEnemyHp === 0) {
          setMessage('モンスターをたおした！');
          setTimeout(() => {
            onComplete(true);
          }, 1000);
        } else {
          // 次の問題へ
          setTimeout(() => {
             generateQuestion();
          }, 1000);
        }
      }, 500);

    } else {
      // 不正解：モンスターの攻撃
      playNGSound();
      setMessage(`ちがうよ... 正解は「${targetChar}」だよ`);
      
      setTimeout(() => {
        setMessage('モンスターの攻撃！');
        setIsDamaged(true);
        
        setTimeout(() => {
          setIsDamaged(false);
          const damage = 15 + Math.floor(Math.random() * 10);
          const newPlayerHp = Math.max(0, playerHp - damage);
          setPlayerHp(newPlayerHp);

          if (newPlayerHp === 0) {
            setGameOver(true);
            setMessage('目の前が真っ暗になった...');
            // ゲームオーバー処理（リトライなど）
            // ここでは簡易的にリトライボタンを出すなどの処理が必要だが、
            // 今回はonComplete(false)で呼び出し元に任せるか、この場でリトライさせるか
            // 既存のゲームに合わせて onComplete(false) は実装されていない場合が多いので
            // このコンポーネント内でリトライを表示する
          } else {
            // 次の問題へ
            setTimeout(() => {
              generateQuestion();
            }, 1000);
          }
        }, 500);
      }, 1000);
    }
  };

  const handleRetry = () => {
    setPlayerHp(100);
    setEnemyHp(100);
    setGameOver(false);
    generateQuestion();
  };

  return (
    <div className="battle-game" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: '"M PLUS Rounded 1c", sans-serif'
    }}>
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
          <div style={{fontSize: '5rem'}}>👾</div>
          <div className="hp-bar-container" style={{
            width: '100px', height: '10px', background: '#555', borderRadius: '5px', margin: '0 auto'
          }}>
            <div className="hp-bar" style={{
              width: `${enemyHp}%`,
              height: '100%',
              background: enemyHp > 30 ? '#FF9800' : '#F44336',
              borderRadius: '5px',
              transition: 'width 0.5s'
            }}></div>
          </div>
          <p style={{fontWeight: 'bold', color: '#333'}}>モンスター HP: {enemyHp}</p>
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
        height: '150px'
      }}>
        {gameOver ? (
           <button onClick={handleRetry} style={{
             gridColumn: '1 / span 2',
             fontSize: '1.5rem',
             background: '#FF9F43',
             color: 'white',
             border: 'none',
             borderRadius: '10px',
             cursor: 'pointer'
           }}>
             もういちど チャレンジ！
           </button>
        ) : (
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
