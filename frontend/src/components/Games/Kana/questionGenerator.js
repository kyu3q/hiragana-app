import { getDifficulty, QUESTION_COUNT } from './adventureConfig';

// Fisher-Yates シャッフル（元の配列は変更しない）
const shuffle = (array, random) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 音声が使えないときは、音声出題を ローマ字→文字 に置き換える
// （選択肢はどちらも文字なので、問題の作り直しは不要）
export const resolveType = (type, speechAvailable) =>
  type === 'sound-to-char' && !speechAvailable ? 'romaji-to-char' : type;

// 正解と見分けがつくよう、ローマ字が重複しないダミー選択肢を選ぶ
const pickDistractors = (target, chars, count, random) => {
  const usedRomaji = new Set([target.romaji]);
  const distractors = [];
  for (const candidate of shuffle(chars, random)) {
    if (distractors.length === count) break;
    if (candidate.id === target.id || usedRomaji.has(candidate.romaji)) continue;
    usedRomaji.add(candidate.romaji);
    distractors.push(candidate);
  }
  if (distractors.length < count) {
    throw new Error(
      `ダミー選択肢が不足しています: 必要 ${count} 件、実際 ${distractors.length} 件（正解: ${target.char}）`
    );
  }
  return distractors;
};

export const buildQuestion = ({ target, chars, difficulty, isRetry = false, random = Math.random }) => {
  const { optionCount, types } = getDifficulty(difficulty);
  const type = types[Math.floor(random() * types.length)];
  const distractors = pickDistractors(target, chars, optionCount - 1, random);
  const options = shuffle([target, ...distractors], random);
  return { target, type, options, isRetry };
};

export const generateQuestions = ({
  chars,
  difficulty,
  weakIds = [],
  count = QUESTION_COUNT,
  random = Math.random,
}) => {
  const { optionCount } = getDifficulty(difficulty);
  if (chars.length < optionCount) {
    throw new Error(`文字データが不足しています: 必要 ${optionCount} 件、実際 ${chars.length} 件`);
  }

  // 苦手文字は半数まで優先し、残りはランダムに選ぶ
  const weakChars = shuffle(
    chars.filter((c) => weakIds.includes(c.id)),
    random
  ).slice(0, Math.floor(count / 2));
  const otherChars = shuffle(
    chars.filter((c) => !weakChars.includes(c)),
    random
  ).slice(0, count - weakChars.length);

  return shuffle([...weakChars, ...otherChars], random).map((target) =>
    buildQuestion({ target, chars, difficulty, random })
  );
};

// 間違えた文字を、現在位置の2〜3問後ろに再出題として差し込む
export const insertRetry = ({ questions, currentIndex, retryQuestion, random = Math.random }) => {
  const offset = 2 + Math.floor(random() * 2);
  const position = Math.min(currentIndex + offset, questions.length);
  return [...questions.slice(0, position), retryQuestion, ...questions.slice(position)];
};

// 再出題はスコアの母数に含めない
export const countScoredQuestions = (questions) => questions.filter((q) => !q.isRetry).length;
