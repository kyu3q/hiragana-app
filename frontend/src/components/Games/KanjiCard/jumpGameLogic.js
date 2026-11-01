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

// --- チェックポイント ---

// チェックポイントを置く間隔（px）。コース全体は約10000px
export const CHECKPOINT_INTERVAL = 2500;

// ゴールの手前この距離（px）以内には置かない（すぐゴールなので意味がない）
const CHECKPOINT_GOAL_MARGIN = 500;

// 再開したときのライフと、再開直後の無敵時間（フレーム数。2秒ぶん）
export const RESPAWN_LIVES = 3;
export const RESPAWN_INVINCIBLE = 120;

// コースの長さから、チェックポイントを並べる
export const buildCheckpoints = ({ levelLength }) => {
  const checkpoints = [];
  for (let x = CHECKPOINT_INTERVAL; x < levelLength - CHECKPOINT_GOAL_MARGIN; x += CHECKPOINT_INTERVAL) {
    checkpoints.push({ x, reached: false });
  }
  return checkpoints;
};

// プレイヤーが旗の位置に着いたら通過済みにする。元の配列は書き換えず、新しく通過した旗も返す
export const updateCheckpoints = ({ checkpoints, playerX }) => {
  const newlyReached = checkpoints.filter((c) => !c.reached && playerX >= c.x);
  const updated = checkpoints.map((c) => (!c.reached && playerX >= c.x ? { ...c, reached: true } : c));
  return { checkpoints: updated, newlyReached };
};

// 通過済みのうち、いちばん先の旗（再開する場所）。なければ null
export const lastReachedCheckpoint = (checkpoints) => {
  const reached = checkpoints.filter((c) => c.reached);
  return reached.length > 0 ? reached[reached.length - 1] : null;
};

// 足場を離れてから、地上ジャンプができる猶予（フレーム数。6フレーム = 0.1秒）
export const COYOTE_FRAMES = 6;

// 着地の少し前に押したジャンプを、覚えておく長さ（フレーム数。6フレーム = 0.1秒）
export const JUMP_BUFFER_FRAMES = 6;

// 1フレームごとの空中の状態。猶予を過ぎても跳ばずに落ち続けたら、地上ジャンプの権利を使ったことにする
// （ブロックの端から歩いて落ちたときに、ジャンプを1回多く使えないようにする）
export const updateAirState = ({ grounded, airFrames, jumpCount }) => {
  if (grounded) return { airFrames: 0, jumpCount: 0 };
  const nextAirFrames = airFrames + 1;
  const expired = nextAirFrames > COYOTE_FRAMES && jumpCount === 0;
  return { airFrames: nextAirFrames, jumpCount: expired ? 1 : jumpCount };
};

// 着地した瞬間に、先行入力が残っていればジャンプする
export const shouldBufferedJump = ({ buffer, grounded }) => grounded && buffer > 0;
