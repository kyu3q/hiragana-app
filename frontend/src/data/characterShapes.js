// 文字の基本形状を定義
export const characterShapes = {
  // ひらがな
  'あ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.35 }, end: { x: 0.8, y: 0.35 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'い': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.6, y: 0.3 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'う': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'curve', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'え': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'お': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'か': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'き': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'く': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'け': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'こ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'さ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'し': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'す': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'せ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'そ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'た': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ち': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'つ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'て': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'と': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'な': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'に': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } }
    ]
  },
  'ぬ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'ね': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'の': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'は': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ひ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ふ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'へ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ほ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ま': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'み': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'む': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'め': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'も': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'や': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ゆ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.7, y: 0.3 } }
    ]
  },
  'よ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ら': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'り': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'る': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'れ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'ろ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'わ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'を': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ん': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  // カタカナ
  'ア': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'イ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.3 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } }
    ]
  },
  'ウ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'エ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'オ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'カ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'キ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ク': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ケ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'コ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'サ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'シ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ス': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'セ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ソ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.5 } }
    ]
  },
  'タ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'チ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ツ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'テ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ト': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ナ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ニ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ヌ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ネ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'ノ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ハ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ヒ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'フ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ヘ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ホ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'マ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ミ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ム': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'メ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'モ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ヤ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ユ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ヨ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ラ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'リ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ル': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'curve', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'レ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ロ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.2, y: 0.3 }, end: { x: 0.2, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'vertical', start: { x: 0.8, y: 0.3 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ワ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ヲ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ン': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  // カタカナの濁点・半濁点
  'ガ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ギ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'グ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ゲ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ゴ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ザ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ジ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ズ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ゼ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ゾ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.5 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ダ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ヂ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ヅ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'デ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ド': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'バ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ビ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ブ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ベ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ボ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'パ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ピ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'プ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ペ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ポ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  // 濁点ひらがな
  'が': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぎ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぐ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'げ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ご': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ざ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'じ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ず': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぜ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぞ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'だ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぢ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'づ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'で': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ど': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ば': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'び': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぶ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'べ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  'ぼ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.2 }, end: { x: 0.85, y: 0.25 } },
      { type: 'curve', start: { x: 0.9, y: 0.2 }, end: { x: 0.9, y: 0.25 } }
    ]
  },
  // 半濁点ひらがな
  'ぱ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ぴ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ぷ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ぺ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  'ぽ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.875, y: 0.2 }, end: { x: 0.875, y: 0.25 } }
    ]
  },
  // 小さい文字（拗音用）
  'ぁ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.45 }, end: { x: 0.7, y: 0.45 } },
      { type: 'curve', start: { x: 0.5, y: 0.6 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ぃ': {
    strokes: [
      { type: 'curve', start: { x: 0.4, y: 0.4 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.6, y: 0.4 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ぅ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'curve', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ぇ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'vertical', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ぉ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'vertical', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'っ': {
    strokes: [
      { type: 'curve', start: { x: 0.4, y: 0.4 }, end: { x: 0.6, y: 0.7 } }
    ]
  },
  'ゃ': {
    strokes: [
      { type: 'vertical', start: { x: 0.4, y: 0.3 }, end: { x: 0.4, y: 0.7 } },
      { type: 'curve', start: { x: 0.4, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ゅ': {
    strokes: [
      { type: 'vertical', start: { x: 0.4, y: 0.3 }, end: { x: 0.4, y: 0.7 } },
      { type: 'curve', start: { x: 0.4, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.7, y: 0.4 } }
    ]
  },
  'ょ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'vertical', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  // カタカナ小文字
  'ァ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'vertical', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ィ': {
    strokes: [
      { type: 'vertical', start: { x: 0.4, y: 0.4 }, end: { x: 0.4, y: 0.7 } },
      { type: 'curve', start: { x: 0.4, y: 0.4 }, end: { x: 0.7, y: 0.4 } }
    ]
  },
  'ゥ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'vertical', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ェ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.55 }, end: { x: 0.7, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ォ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'vertical', start: { x: 0.5, y: 0.4 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.5, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ッ': {
    strokes: [
      { type: 'vertical', start: { x: 0.4, y: 0.3 }, end: { x: 0.4, y: 0.6 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.6 }, end: { x: 0.7, y: 0.6 } }
    ]
  },
  'ャ': {
    strokes: [
      { type: 'vertical', start: { x: 0.4, y: 0.3 }, end: { x: 0.4, y: 0.7 } },
      { type: 'curve', start: { x: 0.4, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ュ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ョ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.3, y: 0.4 }, end: { x: 0.7, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.55 }, end: { x: 0.7, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },

  // 以下は主な拗音（きゃ、きゅ、きょなど）のデータも追加します
  'きゃ': {
    strokes: [
      // きの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'きゅ': {
    strokes: [
      // きの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'きょ': {
    strokes: [
      // きの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'しゃ': {
    strokes: [
      // しの部分
      { type: 'vertical', start: { x: 0.35, y: 0.2 }, end: { x: 0.35, y: 0.6 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'しゅ': {
    strokes: [
      // しの部分
      { type: 'vertical', start: { x: 0.35, y: 0.2 }, end: { x: 0.35, y: 0.6 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'しょ': {
    strokes: [
      // しの部分
      { type: 'vertical', start: { x: 0.35, y: 0.2 }, end: { x: 0.35, y: 0.6 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ちゃ': {
    strokes: [
      // ちの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'vertical', start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.35, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ちゅ': {
    strokes: [
      // ちの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'vertical', start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.35, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'ちょ': {
    strokes: [
      // ちの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'vertical', start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.35, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'にゃ': {
    strokes: [
      // にの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'にゅ': {
    strokes: [
      // にの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'にょ': {
    strokes: [
      // にの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ひゃ': {
    strokes: [
      // ひの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ひゅ': {
    strokes: [
      // ひの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'ひょ': {
    strokes: [
      // ひの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'みゃ': {
    strokes: [
      // みの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'curve', start: { x: 0.3, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'みゅ': {
    strokes: [
      // みの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'curve', start: { x: 0.3, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'みょ': {
    strokes: [
      // みの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'curve', start: { x: 0.3, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'りゃ': {
    strokes: [
      // りの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.6 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'りゅ': {
    strokes: [
      // りの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.6 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'curve', start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'りょ': {
    strokes: [
      // りの部分
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.6 } },
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.6 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  // 濁音の拗音
  'ぎゃ': {
    strokes: [
      // ぎの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ぎゅ': {
    strokes: [
      // ぎの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.7 }, end: { x: 0.85, y: 0.5 } }
    ]
  },
  'ぎょ': {
    strokes: [
      // ぎの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.5 }, end: { x: 0.85, y: 0.5 } },
      { type: 'vertical', start: { x: 0.75, y: 0.5 }, end: { x: 0.75, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'じゃ': {
    strokes: [
      // じの部分
      { type: 'vertical', start: { x: 0.35, y: 0.2 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'じゅ': {
    strokes: [
      // じの部分
      { type: 'vertical', start: { x: 0.35, y: 0.2 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.7 }, end: { x: 0.85, y: 0.5 } }
    ]
  },
  'じょ': {
    strokes: [
      // じの部分
      { type: 'vertical', start: { x: 0.35, y: 0.2 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.5 }, end: { x: 0.85, y: 0.5 } },
      { type: 'vertical', start: { x: 0.75, y: 0.5 }, end: { x: 0.75, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'びゃ': {
    strokes: [
      // びの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ゃの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'びゅ': {
    strokes: [
      // びの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ゅの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } },
      { type: 'curve', start: { x: 0.85, y: 0.7 }, end: { x: 0.85, y: 0.5 } }
    ]
  },
  'びょ': {
    strokes: [
      // びの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ょの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.5 }, end: { x: 0.85, y: 0.5 } },
      { type: 'vertical', start: { x: 0.75, y: 0.5 }, end: { x: 0.75, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  // カタカナ拗音
  'キャ': {
    strokes: [
      // キの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'キュ': {
    strokes: [
      // キの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'キョ': {
    strokes: [
      // キの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.4 }, end: { x: 0.8, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.55 }, end: { x: 0.8, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'シャ': {
    strokes: [
      // シの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.75, y: 0.45 }, end: { x: 0.75, y: 0.7 } },
      { type: 'curve', start: { x: 0.75, y: 0.7 }, end: { x: 0.9, y: 0.7 } }
    ]
  },
  'シュ': {
    strokes: [
      // シの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.7, y: 0.5 }, end: { x: 0.9, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.7, y: 0.7 }, end: { x: 0.9, y: 0.7 } }
    ]
  },
  'ショ': {
    strokes: [
      // シの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.7, y: 0.4 }, end: { x: 0.9, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.7, y: 0.55 }, end: { x: 0.9, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.7, y: 0.7 }, end: { x: 0.9, y: 0.7 } }
    ]
  },
  'チャ': {
    strokes: [
      // チの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'vertical', start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.35, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'チュ': {
    strokes: [
      // チの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'vertical', start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.35, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'チョ': {
    strokes: [
      // チの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'vertical', start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.35, y: 0.6 }, end: { x: 0.5, y: 0.6 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.4 }, end: { x: 0.8, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.55 }, end: { x: 0.8, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ニャ': {
    strokes: [
      // ニの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.65, y: 0.45 }, end: { x: 0.65, y: 0.7 } },
      { type: 'curve', start: { x: 0.65, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ニュ': {
    strokes: [
      // ニの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ニョ': {
    strokes: [
      // ニの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.6, y: 0.4 }, end: { x: 0.8, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.55 }, end: { x: 0.8, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.6, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  // 濁音カタカナ拗音
  'ギャ': {
    strokes: [
      // ギの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ギュ': {
    strokes: [
      // ギの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.5 }, end: { x: 0.85, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ギョ': {
    strokes: [
      // ギの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.25 }, end: { x: 0.5, y: 0.25 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.4 } },
      { type: 'vertical', start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.6 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.4 }, end: { x: 0.85, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.55 }, end: { x: 0.85, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ジャ': {
    strokes: [
      // ジの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.75, y: 0.45 }, end: { x: 0.75, y: 0.7 } },
      { type: 'curve', start: { x: 0.75, y: 0.7 }, end: { x: 0.9, y: 0.7 } }
    ]
  },
  'ジュ': {
    strokes: [
      // ジの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.7, y: 0.5 }, end: { x: 0.9, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.7, y: 0.7 }, end: { x: 0.9, y: 0.7 } }
    ]
  },
  'ジョ': {
    strokes: [
      // ジの部分
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.7, y: 0.4 }, end: { x: 0.9, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.7, y: 0.55 }, end: { x: 0.9, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.7, y: 0.7 }, end: { x: 0.9, y: 0.7 } }
    ]
  },
  'ビャ': {
    strokes: [
      // ビの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ビュ': {
    strokes: [
      // ビの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.5 }, end: { x: 0.85, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ビョ': {
    strokes: [
      // ビの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      { type: 'curve', start: { x: 0.6, y: 0.2 }, end: { x: 0.6, y: 0.25 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.4 }, end: { x: 0.85, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.55 }, end: { x: 0.85, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  // 半濁音カタカナ拗音
  'ピャ': {
    strokes: [
      // ピの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      // ャの部分
      { type: 'vertical', start: { x: 0.7, y: 0.45 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ピュ': {
    strokes: [
      // ピの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      // ュの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.5 }, end: { x: 0.85, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  },
  'ピョ': {
    strokes: [
      // ピの部分
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.5, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.55, y: 0.2 }, end: { x: 0.55, y: 0.25 } },
      // ョの部分
      { type: 'horizontal', start: { x: 0.65, y: 0.4 }, end: { x: 0.85, y: 0.4 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.55 }, end: { x: 0.85, y: 0.55 } },
      { type: 'horizontal', start: { x: 0.65, y: 0.7 }, end: { x: 0.85, y: 0.7 } }
    ]
  }
};

// ストロークタイプの定義
export const strokeTypes = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  CURVE: 'curve'
};

// 評価基準の設定
export const evaluationCriteria = {
  POSITION_WEIGHT: 0.7,
  LENGTH_WEIGHT: 0.3,
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 70,
  FAIR_THRESHOLD: 50,
  CELEBRATION_THRESHOLD: 60
}; 