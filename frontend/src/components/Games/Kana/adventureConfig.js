// かな冒険クイズの難易度設定
export const QUESTION_COUNT = 10;

export const DIFFICULTIES = {
  easy: {
    label: 'やさしい',
    emoji: '🌱',
    optionCount: 3,
    hearts: 5,
    types: ['sound-to-char'],
  },
  normal: {
    label: 'ふつう',
    emoji: '🌿',
    optionCount: 4,
    hearts: 3,
    types: ['sound-to-char', 'char-to-romaji'],
  },
  hard: {
    label: 'むずかしい',
    emoji: '🔥',
    optionCount: 4,
    hearts: 2,
    types: ['romaji-to-char', 'char-to-romaji', 'sound-to-char'],
  },
};

export const getDifficulty = (key) => {
  const difficulty = DIFFICULTIES[key];
  if (!difficulty) {
    throw new Error(`未知の難易度: ${key}`);
  }
  return difficulty;
};
