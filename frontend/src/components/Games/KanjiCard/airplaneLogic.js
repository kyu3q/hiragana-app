// 飛行機（AirplaneGame）の判定ロジック。画面や canvas に依存しない純粋関数だけを置く。
// 一時停止のキーと、更新を毎秒60回に固定する計算は、ランナーと共通（jumpGameLogic.js）のものを使う。

const THRUST_KEYS = [' ', 'ArrowUp', 'w', 'W'];

// 上昇（エンジンを吹かす）操作として扱うキーか
export const isThrustKey = (key) => THRUST_KEYS.includes(key);

// --- チェックポイント ---
// 位置は、画面上の x ではなく「飛んだ距離（distance）」で持つ。コース全体の長さは 3000〜3600

// チェックポイントを置く間隔
export const CHECKPOINT_INTERVAL = 1000;

// ゴールの手前この距離以内には置かない（すぐゴールなので意味がない）
const CHECKPOINT_GOAL_MARGIN = 300;

// 再開したときの燃料と、再開直後の無敵時間（フレーム数。2秒ぶん）
export const RESPAWN_FUEL = 60;
export const RESPAWN_INVINCIBLE = 120;

// コースの長さから、チェックポイントを並べる
export const buildCheckpoints = ({ levelLength }) => {
  const checkpoints = [];
  for (let d = CHECKPOINT_INTERVAL; d < levelLength - CHECKPOINT_GOAL_MARGIN; d += CHECKPOINT_INTERVAL) {
    checkpoints.push({ distance: d, reached: false });
  }
  return checkpoints;
};

// 飛んだ距離が旗に届いたら通過済みにする。元の配列は書き換えず、新しく通過した旗も返す
export const updateCheckpoints = ({ checkpoints, distance }) => {
  const newlyReached = checkpoints.filter((c) => !c.reached && distance >= c.distance);
  const updated = checkpoints.map((c) => (!c.reached && distance >= c.distance ? { ...c, reached: true } : c));
  return { checkpoints: updated, newlyReached };
};

// 通過済みのうち、いちばん先の旗（再開する場所）。なければ null
export const lastReachedCheckpoint = (checkpoints) => {
  const reached = checkpoints.filter((c) => c.reached);
  return reached.length > 0 ? reached[reached.length - 1] : null;
};

// 旗から再開するときの状態
export const respawnAt = ({ distance }) => ({
  distance,
  fuel: RESPAWN_FUEL,
  invincible: RESPAWN_INVINCIBLE,
});

// --- 点数 ---

// コンボが続く長さ（フレーム数。3秒ぶん）。次のコンボが取れないと切れる
export const COMBO_FRAMES = 180;

// ハズレや障害物にぶつかったときに引かれる点
const HIT_PENALTY = 50;

// コンボ5つごとに、倍率が0.5上がる（ランナーと同じ）
export const comboMultiplier = (combo) => 1 + Math.floor(combo / 5) * 0.5;

// 基本の点に、コンボの倍率をかけた点（小数は切り捨て）
export const comboScore = ({ base, combo }) => Math.floor(base * comboMultiplier(combo));

// ぶつかったときに実際に引かれる点。いまの点より多くは引かない
export const hitPenalty = ({ score }) => Math.min(HIT_PENALTY, score);
