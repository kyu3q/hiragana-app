// 道の SVG パスを、ステージの位置から組み立てる。
// x は 0〜100 の割合（左=20、右=80）、y は px。
// 各区間は縦向きの接線で結ぶので、S 字の滑らかな曲線になる。
const START_X = 50;
const LEFT_X = 20;
const RIGHT_X = 80;

export const buildPathD = ({ count, pathHeight, nodeHeight, paddingBottom, goalY }) => {
  let d = `M ${START_X} ${pathHeight}`;
  let prevX = START_X;
  let prevY = pathHeight;

  for (let i = 0; i < count; i++) {
    const x = i % 2 === 0 ? LEFT_X : RIGHT_X;
    const y = pathHeight - paddingBottom - nodeHeight / 2 - i * nodeHeight;
    const midY = (prevY + y) / 2;
    d += ` C ${prevX} ${midY} ${x} ${midY} ${x} ${y}`;
    prevX = x;
    prevY = y;
  }
  // ゴールが指定されたら、最後のステージから中央上のゴールまで道を延ばす
  if (goalY !== undefined) {
    const midY = (prevY + goalY) / 2;
    d += ` C ${prevX} ${midY} ${START_X} ${midY} ${START_X} ${goalY}`;
  }
  return d;
};
