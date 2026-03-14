import React, { useState, useEffect } from 'react';
import './MemoryGame.css';
import { playMemoryOKSound, playMemoryNGSound, playHappy1Sound } from '../../../utils/soundPlayer';
import { kanjiByGrade } from '../../../data/kanjiData';

const MemoryGame = ({ onClose, type, grade }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  // typeがkanjiの場合はgradeを使用、それ以外は'main'
  const [selectedType, setSelectedType] = useState(type === 'kanji' ? grade : 'main');
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('lion'); // 'lion' or 'dog'
  const [playerPairs, setPlayerPairs] = useState({ lion: 0, dog: 0 });
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState(null);
  const [matchedColors, setMatchedColors] = useState({}); // マッチしたカードの色を保持
  const [clickQueue, setClickQueue] = useState([]); // クリックキュー処理用

  // ひらがな文字データの定義
  const hiraganaMainTable = [
    ['ん','わ','ら','や','ま','は','な','た','さ','か','あ'],
    ['','','り','','み','ひ','に','ち','し','き','い'],
    ['','','る','ゆ','む','ふ','ぬ','つ','す','く','う'],
    ['','','れ','','め','へ','ね','て','せ','け','え'],
    ['','を','ろ','よ','も','ほ','の','と','そ','こ','お'],
  ];

  const hiraganaDakuonTable = [
    ['が','ざ','だ','ば','ぱ'],
    ['ぎ','じ','ぢ','び','ぴ'],
    ['ぐ','ず','づ','ぶ','ぷ'],
    ['げ','ぜ','で','べ','ぺ'],
    ['ご','ぞ','ど','ぼ','ぽ'],
  ];

  const hiraganaYouonTable = [
    ['きゃ','ぎゃ','しゃ','じゃ','ちゃ','にゃ','ひゃ','びゃ','ぴゃ','みゃ','りゃ'],
    ['きゅ','ぎゅ','しゅ','じゅ','ちゅ','にゅ','ひゅ','びゅ','ぴゅ','みゅ','りゅ'],
    ['きょ','ぎょ','しょ','じょ','ちょ','にょ','ひょ','びょ','ぴょ','みょ','りょ'],
  ];

  // カタカナ文字データの定義
  const katakanaMainTable = [
    ['ン','ワ','ラ','ヤ','マ','ハ','ナ','タ','サ','カ','ア'],
    ['','','リ','','ミ','ヒ','ニ','チ','シ','キ','イ'],
    ['','','ル','ユ','ム','フ','ヌ','ツ','ス','ク','ウ'],
    ['','','レ','','メ','ヘ','ネ','テ','セ','ケ','エ'],
    ['','ヲ','ロ','ヨ','モ','ホ','ノ','ト','ソ','コ','オ'],
  ];

  const katakanaDakuonTable = [
    ['ガ','ザ','ダ','バ','パ'],
    ['ギ','ジ','ヂ','ビ','ピ'],
    ['グ','ズ','ヅ','ブ','プ'],
    ['ゲ','ゼ','デ','ベ','ペ'],
    ['ゴ','ゾ','ド','ボ','ポ'],
  ];

  const katakanaYouonTable = [
    ['キャ','ギャ','シャ','ジャ','チャ','ニャ','ヒャ','ビャ','ピャ','ミャ','リャ'],
    ['キュ','ギュ','シュ','ジュ','チュ','ニュ','ヒュ','ビュ','ピュ','ミュ','リュ'],
    ['キョ','ギョ','ショ','ジョ','チョ','ニョ','ヒョ','ビョ','ピョ','ミョ','リョ'],
  ];

  // アンパンマン画像データ（1-20まで）
  const anpanmanImages = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    src: `/assets/images/memory/anpanman${i + 1}.png`
  }));

  // 文字の種類に応じて文字を取得
  const getCharacters = (type) => {
    // アンパンマンモードの場合
    if (selectedType === 'anpanman') {
      return anpanmanImages.map(img => img.id);
    }

    if (type === 'kanji') {
      // propのgradeを使用 (selectedType stateは使用しないか、初期値として使用)
      const targetGrade = grade || Number(selectedType);
      const gradeData = kanjiByGrade.find(g => g.grade === targetGrade);
      if (gradeData) {
        return gradeData.items.map(item => item.char);
      }
      return [];
    }

    let characters = [];
    const table = type === 'hiragana' ?
      { main: hiraganaMainTable, dakuon: hiraganaDakuonTable, youon: hiraganaYouonTable } :
      { main: katakanaMainTable, dakuon: katakanaDakuonTable, youon: katakanaYouonTable };

    switch (selectedType) {
      case 'main':
        characters = table.main.flat().filter(char => char !== '');
        break;
      case 'dakuon':
        characters = table.dakuon.flat();
        break;
      case 'youon':
        characters = table.youon.flat();
        break;
      default:
        characters = table.main.flat().filter(char => char !== '');
    }
    return characters;
  };

  // ランダムに12文字を選択
  const getRandomCharacters = (characters) => {
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  };

  // カードペアを作成
  const createCardPairs = () => {
    const allCharacters = getCharacters(type);
    const selectedCharacters = getRandomCharacters(allCharacters);

    const cardType = selectedType === 'anpanman' ? 'anpanman' : type;

    const pairs = selectedCharacters.map((char, index) => [
      {
        id: index * 2,
        value: char,
        type: cardType,
        isFlipped: false,
        isMatched: false
      },
      {
        id: index * 2 + 1,
        value: char,
        type: cardType,
        isFlipped: false,
        isMatched: false
      }
    ]).flat();

    return pairs.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setCards(createCardPairs());
  }, [selectedType, type, grade]);

  const handleBattleModeToggle = () => {
    setIsBattleMode((prev) => !prev);
    setCurrentPlayer('lion');
    setPlayerPairs({ lion: 0, dog: 0 });
    setCards(createCardPairs());
    setFlippedCards([]);
    setMatchedPairs([]);
    setMatchedColors({});
    setShowResult(false);
    setWinner(null);
    setClickQueue([]);
  };

  const handleCardClick = (clickedCard) => {
    if (
      clickedCard.isMatched ||
      flippedCards.includes(clickedCard) ||
      (flippedCards.length === 1 && flippedCards[0].id === clickedCard.id)
    ) {
      return;
    }
    setClickQueue(prev => [...prev, clickedCard]);
  };

  // クリックキューを監視して順次処理
  useEffect(() => {
    if (clickQueue.length < 1) return;
    if (flippedCards.length >= 2) return; // 2枚めくり中は待つ

    const nextCard = clickQueue[0];
    setClickQueue(prev => prev.slice(1));

    const updatedCards = cards.map(card =>
      card.id === nextCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    const newFlippedCards = [...flippedCards, nextCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (first.value === second.value) {
        playMemoryOKSound();
        setTimeout(() => {
          const matchedCards = updatedCards.map(card =>
            card.id === first.id || card.id === second.id ? { ...card, isMatched: true } : card
          );
          setCards(matchedCards);
          const newMatchedPairs = [...matchedPairs];
          if (!newMatchedPairs.includes(first.id)) newMatchedPairs.push(first.id);
          if (!newMatchedPairs.includes(second.id)) newMatchedPairs.push(second.id);
          setMatchedPairs(newMatchedPairs);
          const currentPlayerAtMatch = currentPlayer;
          setMatchedColors(prev => ({
            ...prev,
            [first.id]: currentPlayerAtMatch,
            [second.id]: currentPlayerAtMatch
          }));
          setFlippedCards([]);
          if (isBattleMode) {
            const newPlayerPairs = { ...playerPairs, [currentPlayerAtMatch]: playerPairs[currentPlayerAtMatch] + 1 };
            setPlayerPairs(newPlayerPairs);
            if (newMatchedPairs.length === cards.length) {
              playHappy1Sound();
              const lionScore = newPlayerPairs.lion;
              const dogScore = newPlayerPairs.dog;
              if (lionScore > dogScore) setWinner('lion');
              else if (dogScore > lionScore) setWinner('dog');
              else setWinner('draw');
              setShowResult(true);
            }
          } else {
            // シングルモードの場合も終了チェック
            if (newMatchedPairs.length === cards.length) {
              playHappy1Sound();
              setWinner('single');
              setShowResult(true);
            }
          }
        }, 500);
      } else {
        playMemoryNGSound();
        setTimeout(() => {
          const resetCards = updatedCards.map(card =>
            card.id === first.id || card.id === second.id ? { ...card, isFlipped: false } : card
          );
          setCards(resetCards);
          setFlippedCards([]);
          if (isBattleMode) {
            setCurrentPlayer(prev => (prev === 'lion' ? 'dog' : 'lion'));
          }
        }, 700);
      }
    }
  }, [clickQueue, flippedCards, cards, matchedPairs, isBattleMode, playerPairs, currentPlayer]);

  const handleRetry = () => {
    setCards(createCardPairs());
    setFlippedCards([]);
    setMatchedPairs([]);
    setCurrentPlayer('lion');
    setPlayerPairs({ lion: 0, dog: 0 });
    setShowResult(false);
    setWinner(null);
    setMatchedColors({}); // マッチした色もリセット
    setClickQueue([]); // クリックキューもリセット
  };

  return (
    <div className={`memory-game ${type === 'kanji' ? 'kanji-mode' : ''}`}>
      {showResult ? (
        <div className="memory-result-area">
          <div className="result-content">
            <div className="winner-emoji" style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>
              {winner === 'single' ? '🎉' : winner === 'draw' ? '🤝' : winner === 'lion' ? '🦁' : '🐶'}
            </div>
            <div className="winner-announcement" style={{
              color: winner === 'single' ? '#5eb5fc' : winner === 'lion' ? '#fbbc5d' : winner === 'dog' ? '#5eb5fc' : '#888',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              letterSpacing: '0.1em',
              textShadow: '0 2px 8px #fff3'
            }}>
              {winner === 'single' ? '🎉クリア！' : winner === 'draw' ? '🎉引き分け！' : `🎉${winner === 'lion' ? '🦁' : '🐶'}の勝ち！`}
            </div>
            {winner !== 'single' && (
              <div className="result-scores">
                <div className="result-score-row">
                  <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🦁</span>
                  <span style={{ fontWeight: 'bold', color: '#fbbc5d' }}>{playerPairs.lion * 2} 枚</span>
                </div>
                <div className="result-score-row">
                  <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🐶</span>
                  <span style={{ fontWeight: 'bold', color: '#5eb5fc' }}>{playerPairs.dog * 2} 枚</span>
                </div>
              </div>
            )}
            {winner === 'single' && (
              <div style={{ fontSize: '1.5rem', color: '#666', marginTop: '1rem' }}>
                すべてのペアを見つけました！
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <h2>{type === 'kanji' ? '漢字記憶ゲーム' : '文字記憶ゲーム'}</h2>
            <div className="character-type-selector">
              {type !== 'kanji' && (
                // ひらがな・カタカナの場合は従来通り
                <>
                  <button
                    className={`type-button ${selectedType === 'main' ? 'active' : ''}`}
                    onClick={() => setSelectedType('main')}
                  >
                    清音
                  </button>
                  <button
                    className={`type-button ${selectedType === 'dakuon' ? 'active' : ''}`}
                    onClick={() => setSelectedType('dakuon')}
                  >
                    濁音・半濁音
                  </button>
                  <button
                    className={`type-button ${selectedType === 'youon' ? 'active' : ''}`}
                    onClick={() => setSelectedType('youon')}
                  >
                    拗音
                  </button>
                  <button
                    className={`type-button ${selectedType === 'anpanman' ? 'active' : ''}`}
                    onClick={() => setSelectedType('anpanman')}
                  >
                    アンパンマン
                  </button>
                </>
              )}
              <button className="battle-mode-button" onClick={handleBattleModeToggle}>
                {isBattleMode ? 'ひとりで遊び' : '対決'}
              </button>
            </div>
          </div>
          <div className="game-board">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                <div className="card-inner">
                  <div className={`card-front ${isBattleMode ? (card.isMatched ? `${matchedColors[card.id]}-turn` : `${currentPlayer}-turn`) : ''}`}>?</div>
                  <div className={`card-back ${isBattleMode ? (card.isMatched ? `${matchedColors[card.id]}-turn` : `${currentPlayer}-turn`) : ''}`}>
                    {card.type === 'anpanman' ? (
                      <img
                        src={anpanmanImages.find(img => img.id === card.value)?.src}
                        alt={`アンパンマン${card.value}`}
                        onError={(e) => {
                          // 画像が見つからない場合は番号を表示
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span style="font-size: 2rem; font-weight: bold;">🎭${card.value}</span>`;
                        }}
                      />
                    ) : (
                      card.value
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {isBattleMode && (
            <div className="battle-info-bottom">
              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <span className={`player-emoji ${currentPlayer === 'lion' ? 'current' : ''}`}>🦁</span>
                <span className={`player-score lion`}>{playerPairs.lion * 2} 枚</span>
              </div>
              <span style={{fontSize:'1.5rem',color:'#888'}}>vs</span>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <span className={`player-emoji ${currentPlayer === 'dog' ? 'current' : ''}`}>🐶</span>
                <span className={`player-score dog`}>{playerPairs.dog * 2} 枚</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryGame;
