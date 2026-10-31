// 漢字ランナー（JumpGame）の判定ロジック。画面や canvas に依存しない純粋関数だけを置く。

const JUMP_KEYS = [' ', 'ArrowUp', 'w', 'W'];

// ジャンプ操作として扱うキーか
export const isJumpKey = (key) => JUMP_KEYS.includes(key);

// 敵が動き出す距離。画面の右端（カメラはプレイヤーの150px左）より少し先
export const WAKE_DISTANCE = 800;

// 敵が動いてよいか。プレイヤーに近づいた敵と、すでに追い越した敵は動かす
export const isEnemyAwake = ({ enemyX, playerX }) => enemyX - playerX <= WAKE_DISTANCE;

// 物理の更新は毎秒60回に固定する。画面の更新速度（60Hz、120Hzなど）で、ゲームの速さが変わらないようにする
export const STEP_MS = 1000 / 60;

// 1回の描画で進める更新回数の上限。タブを開き直したときなどに、まとめて何百回も進めない
export const MAX_STEPS = 5;

// 前回から経過した時間（deltaMs）を溜め、何回更新するかと、持ち越す時間を返す
export const computeSteps = ({ accumulatorMs, deltaMs }) => {
  const total = accumulatorMs + deltaMs;
  const steps = Math.floor(total / STEP_MS);
  if (steps > MAX_STEPS) {
    return { steps: MAX_STEPS, accumulatorMs: 0 };
  }
  return { steps, accumulatorMs: total - steps * STEP_MS };
};
