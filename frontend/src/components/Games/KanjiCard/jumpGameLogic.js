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

const rectIntersect = (a, b) => b.x < a.x + a.w && b.x + b.w > a.x && b.y < a.y + a.h && b.y + b.h > a.y;

// 足場として、上や下の面に当たったと見なす、めり込みの許容量（px）
const EDGE_TOLERANCE = 10;

// プレイヤーとブロックの衝突を判定する。位置は変更せず、結果だけを返す。
// player: { x, y, vy }（y と vy は今フレームの移動のあと）。intendedMove: 今フレームに横へ進む距離
// 戻り値の type:
//   'none'    当たっていない
//   'top'     上から落ちて乗った（y, vy を返す）
//   'ceiling' 下から跳ねて頭をぶつけた（y, vy を返す）
//   'side'    横からぶつかった（intendedMove: 0 を返す）
export const resolveBlockCollision = ({ player, size, intendedMove, block }) => {
  const body = { x: player.x + intendedMove, y: player.y, w: size, h: size };
  if (!rectIntersect(body, block)) return { type: 'none' };

  const prevBottom = player.y + size - player.vy;
  const prevTop = player.y - player.vy;
  const blockBottom = block.y + block.h;

  if (player.vy >= 0 && prevBottom <= block.y + EDGE_TOLERANCE) {
    return { type: 'top', y: block.y - size, vy: 0 };
  }
  if (player.vy < 0 && prevTop >= blockBottom - EDGE_TOLERANCE) {
    return { type: 'ceiling', y: blockBottom, vy: 0 };
  }
  if (player.x + size <= block.x + EDGE_TOLERANCE) {
    return { type: 'side', intendedMove: 0 };
  }
  return { type: 'none' };
};
