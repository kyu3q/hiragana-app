// 漢字ブロックのステージ設定。画面や canvas に依存しない、データと純粋関数だけを置く。
// ステージ1の値は、ステージ制を入れる前のゲームと同じ。

export const BLOCK_STAGES = [
  {
    id: 'toybox',
    name: 'おもちゃばこ',
    ballSpeed: 5, // ボールを打ち出すときの速さ（x, y それぞれ）
    rows: 5,
    cols: 8,
    lives: 5,
    theme: {
      background: '#FFFFFF',
      kanjiColor: 'rgba(0,0,0,0.05)',
      textColor: '#333',
      ballColor: '#333',
      brickHue: { start: 0, step: 45, saturation: 70, lightness: 60 },
      brickEmoji: null, // null のときは、今までの色ブロックだけ
    },
  },
  {
    id: 'icecastle',
    name: 'こおりのしろ',
    ballSpeed: 5.5,
    rows: 6,
    cols: 9,
    lives: 4,
    theme: {
      background: '#E3F2FD',
      kanjiColor: 'rgba(21,101,192,0.08)',
      textColor: '#0D47A1',
      ballColor: '#1565C0',
      brickHue: { start: 170, step: 9, saturation: 70, lightness: 72 },
      brickEmoji: '❄️',
    },
  },
  {
    id: 'space',
    name: 'うちゅう',
    ballSpeed: 6,
    rows: 7,
    cols: 10,
    lives: 3,
    theme: {
      background: '#1A1A3E',
      kanjiColor: 'rgba(255,255,255,0.08)',
      textColor: '#FFFFFF',
      ballColor: '#FFEB3B',
      brickHue: { start: 240, step: 12, saturation: 70, lightness: 62 },
      brickEmoji: '⭐',
    },
  },
];

export const isLastBlockStage = (index) => index === BLOCK_STAGES.length - 1;

// ブロックの色。ステージ1は列ごとに 45度ずつ（今までと同じ）
export const brickColor = ({ col, hue }) => `hsl(${hue.start + col * hue.step}, ${hue.saturation}%, ${hue.lightness}%)`;

// 乱数 r1〜r3（0以上1未満）から、ブロックが落とすアイテムを決める。20%で落とし、その中で heart 30% / wide 35% / multi 35%
export const pickItemType = (r1, r2, r3) => {
  if (r1 >= 0.2) return null;
  if (r2 < 0.3) return 'heart';
  return r3 < 0.5 ? 'wide' : 'multi';
};

// ステージの行数・列数に合わせて、ブロックを並べる
export const buildBricks = ({ stage, width, padding, offsetTop, offsetLeft, offsetRight, brickHeight, random = Math.random }) => {
  const availableWidth = width - offsetLeft - offsetRight;
  const brickWidth = (availableWidth - padding * (stage.cols - 1)) / stage.cols;
  const bricks = [];
  for (let c = 0; c < stage.cols; c++) {
    for (let r = 0; r < stage.rows; r++) {
      bricks.push({
        x: offsetLeft + c * (brickWidth + padding),
        y: offsetTop + r * (brickHeight + padding),
        width: brickWidth,
        height: brickHeight,
        status: 1, // 1 = まだ壊れていない
        color: brickColor({ col: c, hue: stage.theme.brickHue }),
        itemType: pickItemType(random(), random(), random()),
      });
    }
  }
  return bricks;
};
