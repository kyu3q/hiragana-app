import React, { useMemo, useState, useEffect } from 'react';
import './KanjiDisplay.css';
import { kanjiByGrade } from '../../data/kanjiData';
import KanjiGameContainer from '../KanjiGames/KanjiGameContainer';

const randomPick = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
};

const KanjiCard = ({ item, themeColor, onGame, onSelect }) => (
  <div className="kanji-card" style={{ borderColor: themeColor }}>
    <div className="kanji-top">
      <span className="kanji-char" style={{ color: themeColor }}>{item.char}</span>
      <div className="badge" style={{ background: themeColor }}>{item.strokes}画</div>
    </div>
    <p className="reading">訓: {item.kunyomi || '—'} / 音: {item.onyomi || '—'}</p>
    <p className="meaning">{item.meaning}</p>
    <div className="card-actions">
      <button className="secondary" onClick={() => onSelect(item)}>くわしく</button>
      <button className="primary" onClick={() => onGame(item)}>
        {item.gameType ? '🎮 ゲーム' : 'ミニゲーム'}
      </button>
    </div>
  </div>
);

const KanjiDisplay = () => {
  const [grade, setGrade] = useState(1);
  const [selected, setSelected] = useState(null);
  const [gameTarget, setGameTarget] = useState(null);
  const [activeGameMode, setActiveGameMode] = useState(false);
  
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizResult, setQuizResult] = useState('');
  const [score, setScore] = useState(0);
  
  // For old mini game fallback
  const [miniResult, setMiniResult] = useState('');
  const [miniOptions, setMiniOptions] = useState([]);

  const data = useMemo(() => kanjiByGrade.find((g) => g.grade === grade), [grade]);

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

  const featured = useMemo(
    () => (data ? randomPick(data.items, 1)[0] : null),
    [data]
  );

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

  const closeGame = () => {
    setGameTarget(null);
    setActiveGameMode(false);
  };

  if (activeGameMode && gameTarget) {
    return (
      <div className="kanji-full-game-wrapper" style={{ height: 'calc(100vh - 100px)', padding: '20px' }}>
        <KanjiGameContainer kanji={gameTarget} onClose={closeGame} />
      </div>
    );
  }

  return (
    <div className="kanji-page">
      <div className="kanji-hero" style={{ background: `linear-gradient(135deg, ${data?.themeColor || '#fff'} 0%, #ffffff 80%)` }}>
        <div>
          <p className="pill">漢字アドベンチャー</p>
          <h1>学年べつに、楽しく漢字をマスター！</h1>
          <p className="sub">ストーリー・ミニゲーム・クイズで、今日の漢字をものにしよう。</p>
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
        {featured && (
          <div className="featured-card" style={{ borderColor: data.themeColor }}>
            <p className="pill light">今日のおすすめ</p>
            <div className="featured-char" style={{ color: data.themeColor }}>{featured.char}</div>
            <p className="featured-meaning">{featured.meaning}</p>
            <p className="featured-hint">{featured.story}</p>
            <button className="primary" onClick={() => handleGameStart(featured)}>
              冒険に出る (ゲーム)
            </button>
          </div>
        )}
      </div>

      <section className="kanji-grid-wrap">
        <div className="section-head">
          <h2>{grade}年の漢字ワールド</h2>
          <p className="sub">漢字をえらんで冒険をはじめよう！</p>
        </div>
        <div className="kanji-grid">
          {data?.items.map((item) => (
            <KanjiCard
              key={item.char}
              item={item}
              themeColor={data.themeColor}
              onSelect={setSelected}
              onGame={handleGameStart}
            />
          ))}
        </div>
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

      {/* Story Modal */}
      {selected && (
        <div className="story-modal" onClick={() => setSelected(null)}>
          <div className="story-card" onClick={(e) => e.stopPropagation()}>
            <div className="story-head">
              <div>
                <p className="pill">ストーリー</p>
                <h3>{selected.char} の世界</h3>
              </div>
              <button className="ghost" onClick={() => setSelected(null)}>×</button>
            </div>
            <p className="story-reading">訓: {selected.kunyomi || '—'} / 音: {selected.onyomi || '—'}</p>
            <p className="story-meaning">{selected.meaning}</p>
            <p className="story-hint">ヒント: {selected.hint}</p>
            <p className="story-text">{selected.story}</p>
            <p className="story-example">例: {selected.example || '—'}</p>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setSelected(null)}>閉じる</button>
              <button className="primary" onClick={() => {
                setSelected(null);
                handleGameStart(selected);
              }}>ゲームであそぶ</button>
            </div>
          </div>
        </div>
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
