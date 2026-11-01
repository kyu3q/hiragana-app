// 漢字ランナーのステージ設定。画面や canvas に依存しない、データと純粋関数だけを置く。

// コースのパターン。この順番で、割合の累積を取る（草原は今までの 0.2 / 0.4 / 0.55 / 0.7 / 0.8 / 0.9 の境目と同じ）
export const PATTERN_ORDER = ['upperPath', 'groundEnemy', 'bird', 'stairs', 'spike', 'powerup', 'gap'];

export const STAGES = [
  {
    id: 'meadow',
    name: 'そうげん',
    speed: 1.0,
    levelLength: 7000,
    weights: { upperPath: 0.2, groundEnemy: 0.2, bird: 0.15, stairs: 0.15, spike: 0.1, powerup: 0.1, gap: 0.1 },
    theme: {
      sky: ['#4FC3F7', '#E1F5FE'],
      mountain: { hue: 120, hueRange: 40, saturation: 30, lightness: 20, lightnessRange: 20 },
      cloud: 'rgba(255, 255, 255, 0.7)',
      ground: '#795548',
      groundTop: '#8BC34A',
      groundDecor: '#689F38',
      weather: 'none',
    },
    enemySkin: null, // null のときは、今までの描き方
  },
  {
    id: 'desert',
    name: 'さばく',
    speed: 1.1,
    levelLength: 8000,
    weights: { upperPath: 0.15, groundEnemy: 0.2, bird: 0.1, stairs: 0.15, spike: 0.2, powerup: 0.1, gap: 0.1 },
    theme: {
      sky: ['#FFB74D', '#FFF3E0'],
      mountain: { hue: 30, hueRange: 15, saturation: 55, lightness: 40, lightnessRange: 15 },
      cloud: 'rgba(255, 255, 255, 0.4)',
      ground: '#D7A86E',
      groundTop: '#F0C987',
      groundDecor: '#C8964F',
      weather: 'none',
    },
    enemySkin: { slime: '🦂', bird: '🦅', spike: '🌵' },
  },
  {
    id: 'snow',
    name: 'ゆきやま',
    speed: 1.2,
    levelLength: 9000,
    weights: { upperPath: 0.15, groundEnemy: 0.15, bird: 0.25, stairs: 0.15, spike: 0.1, powerup: 0.1, gap: 0.1 },
    theme: {
      sky: ['#90CAF9', '#FFFFFF'],
      mountain: { hue: 200, hueRange: 20, saturation: 30, lightness: 70, lightnessRange: 15 },
      cloud: 'rgba(255, 255, 255, 0.85)',
      ground: '#B0BEC5',
      groundTop: '#FFFFFF',
      groundDecor: '#CFD8DC',
      weather: 'snow',
    },
    enemySkin: { slime: '⛄', bird: '🐧', spike: '🧊' },
  },
  {
    id: 'volcano',
    name: 'かざん',
    speed: 1.3,
    levelLength: 10000,
    weights: { upperPath: 0.15, groundEnemy: 0.2, bird: 0.2, stairs: 0.1, spike: 0.2, powerup: 0.1, gap: 0.05 },
    theme: {
      sky: ['#3E1F1F', '#BF360C'],
      mountain: { hue: 5, hueRange: 20, saturation: 60, lightness: 15, lightnessRange: 10 },
      cloud: 'rgba(80, 60, 60, 0.6)',
      ground: '#3E2723',
      groundTop: '#FF5722',
      groundDecor: '#D84315',
      weather: 'embers',
    },
    enemySkin: { slime: '🔥', bird: '🦇', spike: '🌋' },
  },
];

// 0以上1未満の乱数 r から、割合（weights）に従ってコースのパターンを1つ選ぶ
export const pickPattern = ({ weights, r }) => {
  let total = 0;
  for (const key of PATTERN_ORDER) {
    total += weights[key];
    if (r < total) return key;
  }
  return PATTERN_ORDER[PATTERN_ORDER.length - 1]; // 足し算の誤差で、合計が1にわずかに届かないとき
};

export const isLastStage = (index) => index === STAGES.length - 1;

// 番号と名前の間は、全角スペース
export const stageTitle = (index) => `ステージ${index + 1}\u3000${STAGES[index].name}`;
