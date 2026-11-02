// 漢字カードゲーム共通の、ステージの流れ。画面や canvas に依存しない純粋関数だけを置く。
// `stages` は、各ゲームの xxxStages.js の配列（name を持つオブジェクトが並ぶ）。

export const isLastStage = (stages, index) => index === stages.length - 1;

// 番号と名前の間は、全角スペース
export const stageTitle = (stages, index) => `ステージ${index + 1}\u3000${stages[index].name}`;

export const stageProgress = (stages, index) => `${index + 1}/${stages.length}`;

// 「つぎへ」：次のステージへ。スコアは引き継ぎ、名前を出す
export const nextStageStart = ({ index, score }) => ({ index: index + 1, startScore: score, withIntro: true });

// リトライ：同じステージの最初から。スコアはそのステージの開始時点に戻し、名前は出さない
export const retryStageStart = ({ index, startScore }) => ({ index, startScore, withIntro: false });
