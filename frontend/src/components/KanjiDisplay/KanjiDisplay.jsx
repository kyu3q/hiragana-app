import React, { useMemo, useState, useEffect } from 'react';
import './KanjiDisplay.css';
import { kanjiByGrade } from '../../data/kanjiData';
import KanjiGameContainer from '../KanjiGames/KanjiGameContainer';
import KanjiChart from '../KanjiChart/KanjiChart';
import MemoryGame from '../Games/MemoryGame';
import KanjiQuizGame from '../Games/KanjiQuizGame';
import '../Games/GameMode.css';

const randomPick = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
};

const KanjiCard = ({ item, themeColor, onClick }) => (
  <div 
    className="kanji-card clickable" 
    style={{ borderColor: themeColor, cursor: 'pointer' }}
    onClick={() => onClick(item)}
  >
    <div className="kanji-top">
      <span className="kanji-char" style={{ color: themeColor }}>{item.char}</span>
      <div className="badge" style={{ background: themeColor }}>{item.strokes}画</div>
    </div>
    <p className="reading">訓: {item.kunyomi || '—'} / 音: {item.onyomi || '—'}</p>
    <p className="meaning">{item.meaning}</p>
  </div>
);

const KanjiDisplay = () => {
  const [grade, setGrade] = useState(1);
  const [gameTarget, setGameTarget] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [activeGameType, setActiveGameType] = useState(null); // 'memory' | 'quiz'
  const [gameKey, setGameKey] = useState(0);
  const [activeGameMode, setActiveGameMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizResult, setQuizResult] = useState('');
  const [score, setScore] = useState(0);
  
  // For old mini game fallback
  const [miniResult, setMiniResult] = useState('');
  const [miniOptions, setMiniOptions] = useState([]);

  const data = useMemo(() => kanjiByGrade.find((g) => g.grade === grade), [grade]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data.items;
    const lower = searchTerm.toLowerCase();
    return data.items.filter(item => 
      item.char.includes(lower) ||
      (item.kunyomi && item.kunyomi.includes(lower)) ||
      (item.onyomi && item.onyomi.includes(lower)) ||
      (item.meaning && item.meaning.includes(lower))
    );
  }, [data, searchTerm]);

  const refreshQuiz = () => {
    if (!data) return;
    const target = randomPick(data.items, 1)[0];
    const distract = randomPick(data.items.filter((k) => k.char !== target.char), 3);
    const options = randomPick([...distract, target], 4);
    setQuizQuestion(target);
    setQuizOptions(options);
    setQuizResult('');
  };

  useEffect(() => {
    refreshQuiz();
  }, [data]);

  const handleAnswer = (kanji) => {
    if (!quizQuestion) return;
    if (kanji.char === quizQuestion.char) {
      setQuizResult('せいかい！');
      setScore((s) => s + 10);
      setTimeout(refreshQuiz, 900);
    } else {
      setQuizResult('おしい…もう一回');
      setScore((s) => Math.max(0, s - 1));
    }
  };

  // Fallback Mini Game
  const makeMiniGame = (kanji) => {
    if (!data) return [];
    const options = randomPick(
      data.items.filter((k) => k.char !== kanji.char),
      3
    );
    const all = randomPick([...options, kanji], 4);
    return all.map((k) => ({
      char: k.char,
      label: `${k.meaning} / ${k.kunyomi || '—'}`
    }));
  };

  const handleGameStart = (item) => {
    setGameTarget(item);
    if (item.gameType) {
      setActiveGameMode(true);
    } else {
      // Fallback
      setMiniOptions(makeMiniGame(item));
      setMiniResult('');
    }
  };

  const handleCardClick = (item) => {
    handleGameStart(item);
  };

  const closeGame = () => {
    setGameTarget(null);
    setActiveGameMode(false);
  };

  const handleRetry = () => {
    setGameKey(prev => prev + 1);
  };

  const handleGameSwitch = () => {
    setActiveGameType(prev => prev === 'memory' ? 'quiz' : 'memory');
    setGameKey(0);
  };

  if (activeGameType) {
    return (
      <div className="kanji-full-game-wrapper" style={{ height: '100vh', padding: 0 }}>
        <div className="game-header-buttons" style={{ position: 'absolute' }}>
          <button className="game-button" onClick={handleRetry}>
            リセット
          </button>
          <button className="game-button" onClick={handleGameSwitch}>
            ゲーム切替
          </button>
          <button className="game-button" onClick={() => setActiveGameType(null)}>
            終了
          </button>
        </div>
        <div className="game-container">
          <div className="game-content">
            {activeGameType === 'memory' ? (
              <MemoryGame key={gameKey} onClose={() => setActiveGameType(null)} type="kanji" grade={grade} />
            ) : (
              <KanjiQuizGame key={gameKey} onClose={() => setActiveGameType(null)} type="kanji" grade={grade} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeGameMode && gameTarget) {
    return (
      <div className="kanji-full-game-wrapper" style={{ height: 'calc(100vh - 100px)', padding: '20px' }}>
        <KanjiGameContainer kanji={gameTarget} onClose={closeGame} />
      </div>
    );
  }

  return (
    <div className="kanji-page" style={{ '--theme-color': data?.themeColor || '#111827' }}>
      <div className="kanji-hero" style={{ background: `linear-gradient(135deg, ${data?.themeColor}22 0%, #ffffff 80%)` }}>
        <div className="header-row">
          <h1 className="title kanji-stylish-title">漢字であそぼう！</h1>
          <div className="mode-toggle-inline">
            <button 
              className="kanji-mode-btn game-btn"
              onClick={() => setActiveGameType('memory')}
            >
              🎮 ゲーム
            </button>
            <button 
              className="kanji-mode-btn chart-btn"
              onClick={() => setShowChart(true)}
            >
              📊 漢字表
            </button>
          </div>
        </div>
        
        <div className="controls-row">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="kanji-search-input"
              placeholder="漢字、読み、意味でさがす..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grade-tabs">
            {kanjiByGrade.map((g) => (
              <button
                key={g.grade}
                className={`grade-tab ${grade === g.grade ? 'active' : ''}`}
                onClick={() => setGrade(g.grade)}
              >
                {g.grade}年
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="kanji-grid-wrap">
        <div className="section-head">
          <h2>{grade}年の漢字ワールド</h2>
          <p className="sub">漢字をえらんで冒険をはじめよう！</p>
        </div>
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <p>「{searchTerm}」は見つかりませんでした。</p>
          </div>
        ) : (
          <div className="kanji-grid">
            {filteredItems.map((item) => (
              <KanjiCard
                key={item.char}
                item={item}
                themeColor={data.themeColor}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </section>

      <section className="quiz-section">
        <div className="section-head">
          <h2>クイッククイズ</h2>
          <p className="sub">意味をタップして正解を当てよう（スコア: {score}）</p>
        </div>
        {quizQuestion && (
          <div className="quiz-card">
            <div className="quiz-q">
              <span className="quiz-char">{quizQuestion.char}</span>
              <span className="quiz-read">訓:{quizQuestion.kunyomi || '—'} / 音:{quizQuestion.onyomi || '—'}</span>
            </div>
            <div className="quiz-options">
              {quizOptions.map((opt) => (
                <button
                  key={opt.char + opt.meaning}
                  className="option"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt.meaning}
                </button>
              ))}
            </div>
            {quizResult && <p className="quiz-result">{quizResult}</p>}
          </div>
        )}
      </section>


      {/* Kanji Chart Modal */}
      {showChart && (
        <KanjiChart 
          onClose={() => setShowChart(false)} 
          initialGrade={grade}
        />
      )}

      {/* Fallback Legacy Mini Game Modal (Only if no gameType) */}
      {!activeGameMode && gameTarget && (
        <div className="story-modal" onClick={() => setGameTarget(null)}>
          <div className="story-card" onClick={(e) => e.stopPropagation()}>
            <div className="story-head">
              <div>
                <p className="pill">ミニゲーム</p>
                <h3>{gameTarget.char} にチャレンジ</h3>
              </div>
              <button className="ghost" onClick={() => setGameTarget(null)}>×</button>
            </div>
            <p className="story-meaning">{gameTarget.meaning}</p>
            <p className="story-hint">ヒント: {gameTarget.hint}</p>
            <div className="mini-grid">
              {miniOptions.map((opt) => (
                <button
                  key={opt.char + opt.label}
                  className="option"
                  onClick={() => {
                    if (opt.char === gameTarget.char) {
                      setMiniResult('せいかい！');
                    } else {
                      setMiniResult('はずれ…');
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {miniResult && <p className="quiz-result" style={{ color: miniResult.includes('せい') ? '#16a34a' : '#dc2626' }}>{miniResult}</p>}
            <div className="modal-actions">
              <button className="secondary" onClick={() => {
                setMiniOptions(makeMiniGame(gameTarget));
                setMiniResult('');
              }}>もう一問</button>
              <button className="primary" onClick={() => setGameTarget(null)}>とじる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanjiDisplay;
