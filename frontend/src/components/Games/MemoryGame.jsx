import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

const MemoryGame = ({ onClose, type }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedType, setSelectedType] = useState('main'); // 'main', 'dakuon', 'youon'

  const SUCCESS_SOUND = '/music/success.mp3';
  const FAILURE_SOUND = '/music/failure.mp3';

  const playSound = (url) => {
    const audio = new window.Audio(url);
    audio.play();
  };

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

  // 文字の種類に応じて文字を取得
  const getCharacters = (type) => {
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
    
    const pairs = selectedCharacters.map((char, index) => [
      {
        id: index * 2,
        value: char,
        type: type,
        isFlipped: false,
        isMatched: false
      },
      {
        id: index * 2 + 1,
        value: char,
        type: type,
        isFlipped: false,
        isMatched: false
      }
    ]).flat();
    
    return pairs.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setCards(createCardPairs());
  }, [selectedType, type]);

  const handleCardClick = (clickedCard) => {
    if (isChecking || flippedCards.length >= 2 || clickedCard.isMatched || flippedCards.includes(clickedCard)) {
      return;
    }

    // カードを裏返す
    const updatedCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      const [first, second] = newFlippedCards;
      
      // ペアの判定
      if (first.value === second.value) {
        // マッチした場合
        playSound(SUCCESS_SOUND);
        const matchedCards = updatedCards.map(card => 
          card.id === first.id || card.id === second.id ? { ...card, isMatched: true } : card
        );
        setCards(matchedCards);
        setMatchedPairs([...matchedPairs, first.id, second.id]);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // マッチしなかった場合
        playSound(FAILURE_SOUND);
        setTimeout(() => {
          const resetCards = updatedCards.map(card => 
            card.id === first.id || card.id === second.id ? { ...card, isFlipped: false } : card
          );
          setCards(resetCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createCardPairs());
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  return (
    <div className="memory-game">
      <div className="game-header">
        <h2>
          同じ文字のカードを見つけよう！ </h2>
        <div className="character-type-selector">
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
              <div className="card-front">?</div>
              <div className="card-back">{card.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame; 