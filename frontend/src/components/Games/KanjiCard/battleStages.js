// 漢字バトルのステージ設定。画面に依存しない、データと純粋関数だけを置く。

export const BATTLE_STAGES = [
  {
    id: 'forest',
    name: 'もりのスライム',
    enemyHp: 100,
    optionCount: 4, // 正解1 + まちがい3（今までと同じ）
    timeLimit: null, // 秒。null は制限なし
    background: ['#87CEEB', '#E0F7FA'],
    enemyEmoji: '👾',
  },
  {
    id: 'darkness',
    name: 'やみのおおかみ',
    enemyHp: 150,
    optionCount: 6,
    timeLimit: 12,
    background: ['#37474F', '#78909C'],
    enemyEmoji: '🐺',
  },
  {
    id: 'castle',
    name: 'ドラゴンのしろ',
    enemyHp: 220,
    optionCount: 6,
    timeLimit: 8,
    background: ['#4A148C', '#C62828'],
    enemyEmoji: '🐉',
  },
];

// 似た漢字が足りないときに使う、ふつうの漢字（今までのデフォルトと同じ）
const DEFAULT_DISTRACTORS = '日月火水木金土';

// 0以上1未満の乱数 rng を使った並べかえ（元の配列は変えない）
const shuffle = (items, rng) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 選択肢を作る。正解1つ + まちがい(count-1)個。まちがいは似た漢字を先に使い、足りなければふつうの漢字でうめる
export const buildOptions = ({ targetChar, similarChars, count, rng = Math.random }) => {
  const similar = [...new Set((similarChars || '').split(''))].filter((c) => c !== targetChar);
  const filler = DEFAULT_DISTRACTORS.split('').filter((c) => c !== targetChar && !similar.includes(c));
  const wrongChars = [...shuffle(similar, rng), ...shuffle(filler, rng)].slice(0, count - 1);
  const options = [
    { char: targetChar, isCorrect: true },
    ...wrongChars.map((char) => ({ char, isCorrect: false })),
  ];
  return shuffle(options, rng);
};

// ダメージ。attack は勇者の攻撃（20〜29）、hit は敵から受けるダメージ（15〜24）
export const pickDamage = ({ kind, r }) => (kind === 'attack' ? 20 : 15) + Math.floor(r * 10);
