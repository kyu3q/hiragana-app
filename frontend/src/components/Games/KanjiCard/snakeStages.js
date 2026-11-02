// ヘビのステージ設定。画面や canvas に依存しない、データと純粋関数だけを置く。

export const SNAKE_COLS = 20; // 盤面の横のマス数（800 / 40）
export const SNAKE_ROWS = 15; // 盤面の縦のマス数（600 / 40）

// 障害物（いわ）。ヘビは中央（10,7）から右へ出発するので、その行の近くは空けてある
export const SNAKE_STAGES = [
  {
    id: 'meadow',
    name: 'はらっぱ',
    baseInterval: 250, // 動く間隔（ms）。小さいほど速い
    minInterval: 100,
    targetScore: 150, // このステージの開始時点からの増分
    badSpawnChance: 0.5, // 正解を食べたあと、ハズレが増える確率
    badRotateMax: 3, // 5秒ごとに入れ替わるハズレの最大数
    obstacles: [],
    theme: {
      bg: null, // null のときは config.bg（なければ今までの水色）
      textColor: '#5D4037',
      snakeBody: '#8BC34A',
      snakeHead: '#FF9F43',
      obstacleEmoji: '🌳',
      badEmoji: '🐛',
      heartEmoji: '❤',
    },
  },
  {
    id: 'cave',
    name: 'どうくつ',
    baseInterval: 210,
    minInterval: 90,
    targetScore: 150,
    badSpawnChance: 0.6,
    badRotateMax: 4,
    obstacles: [
      { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 14, y: 3 }, { x: 15, y: 3 },
      { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 14, y: 11 }, { x: 15, y: 11 },
    ],
    theme: {
      bg: '#3E3A4A',
      textColor: '#FFE9B8',
      snakeBody: '#A5D6A7',
      snakeHead: '#FFB74D',
      obstacleEmoji: '🪨',
      badEmoji: '🦇',
      heartEmoji: '💎',
    },
  },
  {
    id: 'volcano',
    name: 'ようがん',
    baseInterval: 170,
    minInterval: 70,
    targetScore: 200,
    badSpawnChance: 0.7,
    badRotateMax: 5,
    obstacles: [
      { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 14, y: 3 }, { x: 15, y: 3 },
      { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 14, y: 11 }, { x: 15, y: 11 },
      { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 12, y: 11 }, { x: 12, y: 12 },
      { x: 2, y: 6 }, { x: 17, y: 8 },
    ],
    theme: {
      bg: '#4A1F1A',
      textColor: '#FFE0B2',
      snakeBody: '#FFEE58',
      snakeHead: '#FF7043',
      obstacleEmoji: '🌋',
      badEmoji: '🔥',
      heartEmoji: '🧡',
    },
  },
];

// ステージ内で稼いだ点（gained）に応じた、動く間隔。ステージ1は今までと同じ式
export const getMoveInterval = (stage, gained) =>
  Math.max(stage.minInterval, stage.baseInterval - Math.floor(gained / 50) * 10);

// 開始時点からの増分が目標点に届いたか
export const isStageGoalReached = (stage, score, startScore) => score - startScore >= stage.targetScore;
