import React from 'react';
import './HiraganaChart.css';

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

const HiraganaChart = () => {
  return (
    <div className="hiragana-chart-modal-bg">
      <div className="hiragana-chart-modal">
        <h1 className="chart-title">ひらがな表</h1>
        <div className="chart-table-wrap">
          <table className="hiragana-table">
            <tbody>
              {mainTable.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={cell ? '' : 'empty'}>{cell}</td>
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
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HiraganaChart; 