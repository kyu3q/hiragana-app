import React, { useState } from 'react';
import './HiraganaChart.css';
import WritingGrid from '../WritingGrid/WritingGrid';
import { useAuth } from '../../context/AuthContext';

// 画像のような表形式の2次元配列データ
const mainTable = [
  ['ん','わ','ら','や','ま','は','な','た','さ','か','あ'],
  ['','','り','','み','ひ','に','ち','し','き','い'],
  ['','','る','ゆ','む','ふ','ぬ','つ','す','く','う'],
  ['','','れ','','め','へ','ね','て','せ','け','え'],
  ['','を','ろ','よ','も','ほ','の','と','そ','こ','お'],
];

const dakuonTable = [
  ['ぴゃ','びゃ','じゃ','ぎゃ','にゃ','ちゃ','しゃ','きゃ','ぱ','ば','だ','ざ','が'],
  ['ぴゅ','びゅ','じゅ','ぎゅ','にゅ','ちゅ','しゅ','きゅ','ぴ','び','ぢ','じ','ぎ'],
  ['ぴょ','びょ','じょ','ぎょ','にょ','ちょ','しょ','きょ','ぷ','ぶ','づ','ず','ぐ'],
  ['','','','','','','','','ぺ','べ','で','ぜ','げ'],
  ['','','','','','','','','ぽ','ぼ','ど','ぞ','ご'],
];

const HiraganaChart = ({ onClose }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const { isAuthenticated } = useAuth();

  // ひらがなからIDへの変換マッピング
  const hiraganaToIds = {
    'あ': 1, 'い': 2, 'う': 3, 'え': 4, 'お': 5,
    'か': 6, 'き': 7, 'く': 8, 'け': 9, 'こ': 10,
    'さ': 11, 'し': 12, 'す': 13, 'せ': 14, 'そ': 15,
    'た': 16, 'ち': 17, 'つ': 18, 'て': 19, 'と': 20,
    'な': 21, 'に': 22, 'ぬ': 23, 'ね': 24, 'の': 25,
    'は': 26, 'ひ': 27, 'ふ': 28, 'へ': 29, 'ほ': 30,
    'ま': 31, 'み': 32, 'む': 33, 'め': 34, 'も': 35,
    'や': 36, 'ゆ': 37, 'よ': 38,
    'ら': 39, 'り': 40, 'る': 41, 'れ': 42, 'ろ': 43,
    'わ': 44, 'を': 45, 'ん': 46
  };

  // ひらがなからローマ字への変換マッピング (補助的に残しておく)
  const hiraganaToRomaji = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n'
  };

  const handleCharClick = (char) => {
    if (char) {
      const id = hiraganaToIds[char] || null;
      const romaji = hiraganaToRomaji[char] || '';
      
      setSelectedChar({
        id: id,  // 数値IDを設定
        char: char,
        romaji: romaji,
        image: ''
      });
      setShowWritingGrid(true);
    }
  };

  const handleCloseWritingGrid = () => {
    setShowWritingGrid(false);
    setSelectedChar(null);
  };

  return (
    <div className="hiragana-chart-modal-bg">
      <div className="hiragana-chart-modal">
        <div className="hiragana-chart-header">
          <h2>ひらがな表</h2>
          <button className="hiragana-chart-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="chart-table-wrap">
          <table className="hiragana-table">
            <tbody>
              {mainTable.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td 
                      key={j} 
                      className={cell ? 'char-cell' : 'empty'} 
                      onClick={() => cell ? handleCharClick(cell) : null}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table className="hiragana-table dakuon-table">
            <tbody>
              {dakuonTable.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td 
                      key={j} 
                      className="char-cell"
                      onClick={() => handleCharClick(cell)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showWritingGrid && selectedChar && (
        <WritingGrid
          character={selectedChar}
          onClose={handleCloseWritingGrid}
        />
      )}
    </div>
  );
};

export default HiraganaChart; 