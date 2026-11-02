// 飛行機のステージ設定。画面や canvas に依存しない、データと純粋関数だけを置く。
// ステージ名の文言や「1/3」の表示は、共通の stageFlow.js の関数に、この STAGES を渡して作る。

// アイテムの種類。この順番で、割合の累積を取る（あおぞらは今までの 0.5 / 0.75 / 0.9 の境目と同じ）
export const ITEM_ORDER = ['good', 'bad', 'obstacle', 'coin'];

export const STAGES = [
  {
    id: 'bluesky',
    name: 'あおぞら',
    scrollSpeed: 4, // 今までの SCROLL_SPEED
    spawnRate: 0.02, // 1フレームあたり、アイテムが出る確率
    levelLength: 3000,
    weights: { good: 0.5, bad: 0.25, obstacle: 0.15, coin: 0.1 },
    theme: {
      sky: ['#4FC3F7', '#E1F5FE'],
      cloud: 'rgba(255, 255, 255, 0.7)',
      stars: false,
    },
    obstacleSkin: null, // null のときは、今までの描き方
  },
  {
    id: 'aboveclouds',
    name: 'くものうえ',
    scrollSpeed: 4.6,
    spawnRate: 0.025,
    levelLength: 3300,
    weights: { good: 0.45, bad: 0.25, obstacle: 0.2, coin: 0.1 },
    theme: {
      sky: ['#FF8A65', '#FFE0B2'],
      cloud: 'rgba(255, 255, 255, 0.85)',
      stars: false,
    },
    obstacleSkin: { bird: '🦅', storm: '⚡' },
  },
  {
    id: 'nightsky',
    name: 'よぞら',
    scrollSpeed: 5.2,
    spawnRate: 0.03,
    levelLength: 3600,
    weights: { good: 0.4, bad: 0.25, obstacle: 0.25, coin: 0.1 },
    theme: {
      sky: ['#0D1B3E', '#3F51B5'],
      cloud: 'rgba(180, 190, 230, 0.35)',
      stars: true,
    },
    obstacleSkin: { bird: '🦇', storm: '☄️' },
  },
];

// 0以上1未満の乱数 r から、割合（weights）に従ってアイテムの種類を1つ選ぶ
export const pickItemType = ({ weights, r }) => {
  let total = 0;
  for (const key of ITEM_ORDER) {
    total += weights[key];
    if (r < total) return key;
  }
  return ITEM_ORDER[ITEM_ORDER.length - 1]; // 足し算の誤差で、合計が1にわずかに届かないとき
};
