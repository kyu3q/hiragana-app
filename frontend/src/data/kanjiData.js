export const kanjiByGrade = [
  {
    grade: 1,
    themeColor: '#FF9F43',
    items: [
      { 
        char: '日', kunyomi: 'ひ', onyomi: 'ニチ', meaning: '太陽・日', strokes: 4, hint: 'まるいお日さまをイメージ', story: '毎朝のぼってみんなを照らす太陽。', example: '日よう日',
        gameType: 'tap',
        gameConfig: { title: 'お日さまをさがせ！', instruction: 'くもをタップして、お日さまをみつけよう', targetCount: 5, spawnInterval: 1000, bg: '#87CEEB', targetChar: '日', distractorChar: '☁️' }
      },
      { 
        char: '月', kunyomi: 'つき', onyomi: 'ゲツ', meaning: '月・夜', strokes: 4, hint: 'やさしい三日月を意識', story: '夜空でやさしく光る、おやすみ係。', example: '月よう日',
        gameType: 'trace',
        gameConfig: { title: 'お月さまなぞり', instruction: '線をなぞって、きれいな月を描こう', pathPoints: [[100, 100], [80, 200], [100, 300]], bg: '#1a1a2e' }
      },
      { 
        char: '木', kunyomi: 'き', onyomi: 'ボク', meaning: '木・森', strokes: 4, hint: 'たて1本とクロスのえだ', story: '木の幹に枝が伸びて、鳥がひと休み。', example: 'きのぼり',
        gameType: 'catch',
        gameConfig: { title: 'リンゴあつめ', instruction: '木から落ちてくるリンゴをカゴでキャッチ！', targetChar: '🍎', badChar: '🐛', bg: '#ffebd3' }
      },
      { 
        char: '山', kunyomi: 'やま', onyomi: 'サン', meaning: '高い山', strokes: 3, hint: 'とんがり3つの形', story: '三つの峰で「やっほー」とこだまする。', example: 'やまのぼり',
        gameType: 'catch',
        gameConfig: { title: '山びこキャッチ', instruction: '山からとんでくる「コダマ」をつかまえよう！', targetChar: '🌲', badChar: '🪨', bg: '#A8E6CF' }
      },
      { 
        char: '川', kunyomi: 'かわ', onyomi: 'セン', meaning: '流れる水', strokes: 3, hint: '3本のすいすいライン', story: 'さらさら流れる川を横から見た形。', example: 'かわあそび',
        gameType: 'trace',
        gameConfig: { title: '川下りチャレンジ', instruction: '川の流れにそって、ボートを動かそう', pathPoints: [[150, 50], [150, 350]], bg: '#4ECDC4' }
      },
      { char: '田', kunyomi: 'た', onyomi: 'デン', meaning: '田んぼ', strokes: 5, hint: '四角い区切り', story: 'お米を作る広い田んぼ。', example: '田んぼ', gameType: 'block', gameConfig: { title: '田んぼブロック', instruction: 'ブロックをくずして豊作をめざそう', targetChar: '🌾' } },
      { char: '人', kunyomi: 'ひと', onyomi: 'ジン', meaning: 'ひと', strokes: 2, hint: '支え合う姿', story: '人と人が支え合っている形。', example: '日本人', gameType: 'trace', gameConfig: { title: '人なぞり', instruction: '人を描いてみよう', pathPoints: [[100, 100], [150, 200]], bg: '#ffe4e1' } },
      { char: '口', kunyomi: 'くち', onyomi: 'コウ', meaning: 'くち', strokes: 3, hint: 'ぱっくり開いた形', story: '食べる、話す、歌う口。', example: '入口', gameType: 'tap', gameConfig: { title: 'パクパクゲーム', instruction: '食べ物をタップ！', targetChar: '🍙', distractorChar: '🪨', targetCount: 5, bg: '#ffccbc' } },
      { char: '車', kunyomi: 'くるま', onyomi: 'シャ', meaning: 'くるま', strokes: 7, hint: '上から見た車輪', story: 'タイヤが回って進む車。', example: '電車', gameType: 'trace', gameConfig: { title: 'ドライブ', instruction: '道をなぞって運転しよう', pathPoints: [[50, 200], [250, 200]], bg: '#eee' } },
      { char: '門', kunyomi: 'かど', onyomi: 'モン', meaning: 'もん', strokes: 8, hint: '両開きのとびら', story: 'パカッと開く大きな門。', example: '校門', gameType: 'block', gameConfig: { title: '門番ブロック', instruction: '門を開けるためにブロックを壊せ！', targetChar: '🚪' } },
      
      // Additional Grade 1 Kanji
      { char: '一', kunyomi: 'ひと', onyomi: 'イチ', meaning: 'ひとつ', strokes: 1, hint: '横に一本', story: '指一本で数える一。', example: '一つ', gameType: 'trace', gameConfig: { title: '一本道', instruction: 'まっすぐなぞろう', pathPoints: [[50, 200], [250, 200]], bg: '#f0f0f0' } },
      { char: '二', kunyomi: 'ふた', onyomi: 'ニ', meaning: 'ふたつ', strokes: 2, hint: '横に二本', story: '指二本でピースの二。', example: '二つ', gameType: 'block', gameConfig: { title: 'ダブルブロック', instruction: '二つの壁を突破せよ', targetChar: '✌️' } },
      { char: '三', kunyomi: 'み', onyomi: 'サン', meaning: 'みっつ', strokes: 3, hint: '横に三本', story: 'サンドイッチの三。', example: '三つ', gameType: 'catch', gameConfig: { title: '三角形キャッチ', instruction: '三角おにぎりを集めよう', targetChar: '🍙', badChar: '🥪', bg: '#fff9c4' } },
      { char: '四', kunyomi: 'よん', onyomi: 'シ', meaning: 'よっつ', strokes: 5, hint: '四角の中に足', story: '四角い窓にカーテン。', example: '四つ', gameType: 'tap', gameConfig: { title: '四つ葉探し', instruction: '四つ葉のクローバーを見つけよう', targetChar: '🍀', distractorChar: '☘️', targetCount: 4, bg: '#dcedc8' } },
      { char: '五', kunyomi: 'いつ', onyomi: 'ゴ', meaning: 'いつつ', strokes: 4, hint: '指五本', story: 'ゴーゴー進む五。', example: '五つ', gameType: 'block', gameConfig: { title: '五角形崩し', instruction: 'ブロックを崩して星を出そう', targetChar: '⭐' } },
      { char: '六', kunyomi: 'む', onyomi: 'ロク', meaning: 'むっつ', strokes: 4, hint: '屋根の下に足', story: 'ロボットの六。', example: '六つ', gameType: 'catch', gameConfig: { title: '六角形キャッチ', instruction: 'ハチの巣（六角形）を守れ', targetChar: '🐝', badChar: '🕷️', bg: '#fff59d' } },
      { char: '七', kunyomi: 'なな', onyomi: 'シチ', meaning: 'ななつ', strokes: 2, hint: '切る形', story: 'ラッキーセブン。', example: '七つ', gameType: 'trace', gameConfig: { title: '七曲がり', instruction: '曲がり角をなぞろう', pathPoints: [[50, 100], [200, 100], [200, 250]], bg: '#e1bee7' } },
      { char: '八', kunyomi: 'や', onyomi: 'ハチ', meaning: 'やっつ', strokes: 2, hint: '開く形', story: '末広がりの八。', example: '八つ', gameType: 'tap', gameConfig: { title: 'ハチ探し', instruction: '8匹のハチを見つけよう', targetChar: '🐝', distractorChar: '🦋', targetCount: 8, bg: '#ffe082' } },
      { char: '九', kunyomi: 'ここの', onyomi: 'キュウ', meaning: 'ここのつ', strokes: 2, hint: '曲がった形', story: 'キュウリが曲がって九。', example: '九つ', gameType: 'block', gameConfig: { title: '九回裏ブロック', instruction: '最後の逆転を狙え', targetChar: '⚾' } },
      { char: '十', kunyomi: 'とお', onyomi: 'ジュウ', meaning: 'とお', strokes: 2, hint: 'クロス', story: 'プラスのパワーで十。', example: '十', gameType: 'trace', gameConfig: { title: '十字なぞり', instruction: 'クロスを描こう', pathPoints: [[150, 50], [150, 250]], bg: '#b2dfdb' } },
      
      { char: '百', kunyomi: 'もも', onyomi: 'ヒャク', meaning: 'ひゃく', strokes: 6, hint: '一に白', story: '百点満点の百。', example: '百円', gameType: 'catch', gameConfig: { title: '百点キャッチ', instruction: '100点のテストを集めよう', targetChar: '💯', badChar: '❌', bg: '#ffcdd2' } },
      { char: '千', kunyomi: 'ち', onyomi: 'セン', meaning: 'せん', strokes: 3, hint: '十にノ', story: '千羽鶴の千。', example: '千円', gameType: 'tap', gameConfig: { title: '千羽鶴タップ', instruction: '鶴をたくさん見つけよう', targetChar: '🦢', distractorChar: '🦆', targetCount: 10, bg: '#b3e5fc' } },
      
      { char: '上', kunyomi: 'うえ', onyomi: 'ジョウ', meaning: 'うえ', strokes: 3, hint: '上に指す', story: '上を向いて歩こう。', example: '上がる', gameType: 'catch', gameConfig: { title: '上へ上へ', instruction: '風船で上へ登ろう', targetChar: '🎈', badChar: '📍', bg: '#e1f5fe' } },
      { char: '下', kunyomi: 'した', onyomi: 'カ', meaning: 'した', strokes: 3, hint: '下に指す', story: '地下へ潜る下。', example: '下がる', gameType: 'catch', gameConfig: { title: '地下探検', instruction: '下へ降りて宝石を取ろう', targetChar: '💎', badChar: '🦇', bg: '#424242' } },
      { char: '左', kunyomi: 'ひだり', onyomi: 'サ', meaning: 'ひだり', strokes: 5, hint: '工がある', story: '左手で工作。', example: '左手', gameType: 'trace', gameConfig: { title: '左折コース', instruction: '左へ曲がろう', pathPoints: [[200, 200], [50, 200]], bg: '#fff9c4' } },
      { char: '右', kunyomi: 'みぎ', onyomi: 'ウ', meaning: 'みぎ', strokes: 5, hint: '口がある', story: '右手でご飯を食べる口。', example: '右手', gameType: 'trace', gameConfig: { title: '右折コース', instruction: '右へ曲がろう', pathPoints: [[100, 200], [250, 200]], bg: '#c8e6c9' } },
      
      { char: '中', kunyomi: 'なか', onyomi: 'チュウ', meaning: 'なか', strokes: 4, hint: '真ん中', story: '的の真ん中に的中。', example: '中学生', gameType: 'tap', gameConfig: { title: 'ど真ん中', instruction: '的の中心を狙え', targetChar: '🎯', distractorChar: '⚪', targetCount: 5, bg: '#ffe0b2' } },
      { char: '大', kunyomi: 'おお', onyomi: 'ダイ', meaning: 'おおきい', strokes: 3, hint: '人が手足を広げる', story: '大の字で寝転ぶ。', example: '大きい', gameType: 'block', gameConfig: { title: '巨大ブロック', instruction: '大きな壁を壊せ', targetChar: '🐘' } },
      { char: '小', kunyomi: 'ちい', onyomi: 'ショウ', meaning: 'ちいさい', strokes: 3, hint: '小さくまとまる', story: '小石がコロコロ。', example: '小さい', gameType: 'catch', gameConfig: { title: '小粒キャッチ', instruction: '小さな星屑を集めよう', targetChar: '✨', badChar: '☄️', bg: '#1a237e' } },
      
      { char: '雨', kunyomi: 'あめ', onyomi: 'ウ', meaning: 'あめ', strokes: 8, hint: '雲から水滴', story: '窓の外は雨模様。', example: '雨降り', gameType: 'catch', gameConfig: { title: '雨宿り', instruction: '雨粒を避けて傘をさそう（傘を集める）', targetChar: '🌂', badChar: '💧', bg: '#90caf9' } },
      { char: '円', kunyomi: 'まる', onyomi: 'エン', meaning: 'まる・おかね', strokes: 4, hint: '丸い硬貨', story: '百円玉で買い物。', example: '円', gameType: 'block', gameConfig: { title: 'コイン落とし', instruction: 'ブロックを崩してコインGET', targetChar: '💰' } },
      { char: '王', kunyomi: '', onyomi: 'オウ', meaning: 'おうさま', strokes: 4, hint: '王冠の形', story: '国を治める王様。', example: '王様', gameType: 'tap', gameConfig: { title: '王冠探し', instruction: '隠された王冠を見つけよう', targetChar: '👑', distractorChar: '🎩', targetCount: 3, bg: '#ffecb3' } },
      { char: '火', kunyomi: 'ひ', onyomi: 'カ', meaning: 'ひ', strokes: 4, hint: '燃える炎', story: 'キャンプファイアーの火。', example: '火曜日', gameType: 'tap', gameConfig: { title: '火の用心', instruction: '火の粉を消そう（タップして消火）', targetChar: '🔥', distractorChar: '🌲', targetCount: 10, bg: '#ffab91' } },
      { char: '花', kunyomi: 'はな', onyomi: 'カ', meaning: 'はな', strokes: 7, hint: '草かんむり', story: 'きれいに咲いた花。', example: '花びん', gameType: 'catch', gameConfig: { title: 'お花畑', instruction: '花びらを集めよう', targetChar: '🌸', badChar: '🐛', bg: '#f8bbd0' } },
      { char: '貝', kunyomi: 'かい', onyomi: '', meaning: 'かい', strokes: 7, hint: '二枚貝', story: '砂浜で貝殻拾い。', example: '貝がら', gameType: 'tap', gameConfig: { title: '潮干狩り', instruction: '砂の中の貝を見つけよう', targetChar: '🐚', distractorChar: '🦀', targetCount: 5, bg: '#ffe082' } },
      { char: '学', kunyomi: 'まな', onyomi: 'ガク', meaning: 'まなぶ', strokes: 8, hint: '子が学ぶ', story: '学校で楽しく学ぶ。', example: '学校', gameType: 'trace', gameConfig: { title: '通学路', instruction: '学校へ行こう', pathPoints: [[50, 300], [150, 100], [250, 300]], bg: '#c5cae9' } },
      { char: '気', kunyomi: '', onyomi: 'キ', meaning: 'きもち・くうき', strokes: 6, hint: '〆る', story: '元気いっぱいの気。', example: '元気', gameType: 'catch', gameConfig: { title: 'パワーチャージ', instruction: '元気玉を集めよう', targetChar: '⚡', badChar: '💤', bg: '#ffff8d' } },
      { char: '休', kunyomi: 'やす', onyomi: 'キュウ', meaning: 'やすむ', strokes: 6, hint: '人が木で休む', story: '木陰でひと休み。', example: '休み', gameType: 'tap', gameConfig: { title: 'お昼寝タイム', instruction: '寝ている人を探そう', targetChar: '💤', distractorChar: '⏰', targetCount: 5, bg: '#dcedc8' } },
      { char: '玉', kunyomi: 'たま', onyomi: 'ギョク', meaning: 'たま', strokes: 5, hint: '点がある', story: '王様の宝石、玉。', example: 'お年玉', gameType: 'block', gameConfig: { title: '宝石ブロック', instruction: 'ブロックの中に宝石が！', targetChar: '💎' } },
      { char: '金', kunyomi: 'かね', onyomi: 'キン', meaning: 'おかね・きん', strokes: 8, hint: '屋根の下に王', story: 'ピカピカ輝く金メダル。', example: '金曜日', gameType: 'catch', gameConfig: { title: 'ゴールドラッシュ', instruction: '小判を集めよう', targetChar: '🪙', badChar: '💣', bg: '#ffecb3' } },
      { char: '空', kunyomi: 'そら', onyomi: 'クウ', meaning: 'そら', strokes: 8, hint: 'ウに穴', story: '青く広がる空。', example: '青空', gameType: 'tap', gameConfig: { title: 'バードウォッチング', instruction: '空を飛ぶ鳥を見つけよう', targetChar: '🐦', distractorChar: '✈️', targetCount: 5, bg: '#81d4fa' } },
      { char: '犬', kunyomi: 'いぬ', onyomi: 'ケン', meaning: 'いぬ', strokes: 4, hint: '大に点', story: 'ワンワン吠える犬。', example: '子犬', gameType: 'trace', gameConfig: { title: 'お散歩', instruction: '犬と散歩しよう', pathPoints: [[50, 200], [150, 100], [250, 200]], bg: '#d7ccc8' } },
      { char: '見', kunyomi: 'み', onyomi: 'ケン', meaning: 'みる', strokes: 7, hint: '目に足', story: '遠くを見る目。', example: '見学', gameType: 'tap', gameConfig: { title: 'かくれんぼ', instruction: '隠れているものを「見」つけよう', targetChar: '👀', distractorChar: '🙈', targetCount: 5, bg: '#e1bee7' } },
      { char: '校', kunyomi: '', onyomi: 'コウ', meaning: 'がっこう', strokes: 10, hint: '木と交わる', story: 'みんなが集まる学校。', example: '校長', gameType: 'block', gameConfig: { title: '校舎建設', instruction: 'レンガを積んで（壊して）学校を作ろう', targetChar: '🏫' } },
      { char: '糸', kunyomi: 'いと', onyomi: 'シ', meaning: 'いと', strokes: 6, hint: '細い糸', story: 'くるくる巻いた糸。', example: '毛糸', gameType: 'trace', gameConfig: { title: 'あやとり', instruction: '糸を絡ませないように', pathPoints: [[100, 100], [200, 200], [100, 300]], bg: '#f8bbd0' } },
      { char: '字', kunyomi: 'じ', onyomi: 'ジ', meaning: 'もじ', strokes: 6, hint: 'ウに子', story: 'ノートに書く字。', example: '文字', gameType: 'block', gameConfig: { title: '文字ブロック', instruction: 'ブロックを壊して字を読もう', targetChar: '🔤' } },
      { char: '耳', kunyomi: 'みみ', onyomi: 'ジ', meaning: 'みみ', strokes: 6, hint: '耳の形', story: '音を聞く耳。', example: '耳', gameType: 'catch', gameConfig: { title: '音符キャッチ', instruction: 'きれいな音を集めよう', targetChar: '🎵', badChar: '🔊', bg: '#ffe0b2' } },
      { char: '手', kunyomi: 'て', onyomi: 'シュ', meaning: 'て', strokes: 4, hint: '手の形', story: '拍手する手。', example: '拍手', gameType: 'tap', gameConfig: { title: 'ハイタッチ', instruction: '手をタッチしよう', targetChar: '✋', distractorChar: '🦶', targetCount: 10, bg: '#ffccbc' } },
      { char: '出', kunyomi: 'で', onyomi: 'シュツ', meaning: 'でる', strokes: 5, hint: '山が二つ', story: 'お出かけする出。', example: '出口', gameType: 'trace', gameConfig: { title: '迷路脱出', instruction: '出口へ向かおう', pathPoints: [[50, 50], [250, 350]], bg: '#b2dfdb' } },
      { char: '女', kunyomi: 'おんな', onyomi: 'ジョ', meaning: 'おんな', strokes: 3, hint: '座る姿', story: '優しい女の人。', example: '女子', gameType: 'tap', gameConfig: { title: 'リボン探し', instruction: 'リボンを見つけよう', targetChar: '🎀', distractorChar: '👔', targetCount: 5, bg: '#f8bbd0' } },
      { char: '小', kunyomi: 'ちい', onyomi: 'ショウ', meaning: 'ちいさい', strokes: 3, hint: '小さい', story: '小鳥がさえずる。', example: '小鳥', gameType: 'catch', gameConfig: { title: '小鳥キャッチ', instruction: '小鳥を集めよう', targetChar: '🐦', badChar: '🦅', bg: '#b3e5fc' } },
      { char: '森', kunyomi: 'もり', onyomi: 'シン', meaning: 'もり', strokes: 12, hint: '木が三本', story: '木がたくさんある森。', example: '森林', gameType: 'tap', gameConfig: { title: '森林浴', instruction: '森の動物を探そう', targetChar: '🐻', distractorChar: '🏢', targetCount: 3, bg: '#c8e6c9' } },
      { char: '水', kunyomi: 'みず', onyomi: 'スイ', meaning: 'みず', strokes: 4, hint: '跳ねる水', story: '冷たい水をごくごく。', example: '水曜日', gameType: 'catch', gameConfig: { title: '水滴キャッチ', instruction: '水を溜めよう', targetChar: '💧', badChar: '🔥', bg: '#e1f5fe' } },
      { char: '正', kunyomi: 'ただ', onyomi: 'セイ', meaning: 'ただしい', strokes: 5, hint: '一に止', story: '正義の味方。', example: 'お正月', gameType: 'block', gameConfig: { title: '正義ブロック', instruction: '悪いブロックを倒せ', targetChar: '🦸' } },
      { char: '生', kunyomi: 'い', onyomi: 'セイ', meaning: 'いきる', strokes: 5, hint: '草が生える', story: '生き物が生まれる。', example: '先生', gameType: 'catch', gameConfig: { title: '誕生', instruction: '卵をキャッチしよう', targetChar: '🥚', badChar: '💣', bg: '#fff9c4' } },
      { char: '青', kunyomi: 'あお', onyomi: 'セイ', meaning: 'あおい', strokes: 8, hint: '月がある', story: '青い空と海。', example: '青信号', gameType: 'tap', gameConfig: { title: '青色探し', instruction: '青いものを集めよう', targetChar: '🔵', distractorChar: '🔴', targetCount: 10, bg: '#e3f2fd' } },
      { char: '夕', kunyomi: 'ゆう', onyomi: 'セキ', meaning: 'ゆうがた', strokes: 3, hint: '月になりかけ', story: '夕焼け小焼け。', example: '夕方', gameType: 'trace', gameConfig: { title: '夕帰り', instruction: 'お家へ帰ろう', pathPoints: [[250, 100], [50, 300]], bg: '#ffccbc' } },
      { char: '石', kunyomi: 'いし', onyomi: 'セキ', meaning: 'いし', strokes: 5, hint: '口がある', story: '硬い石ころ。', example: '石', gameType: 'block', gameConfig: { title: '石砕き', instruction: '硬い岩を砕け！', targetChar: '🪨' } },
      { char: '赤', kunyomi: 'あか', onyomi: 'セキ', meaning: 'あかい', strokes: 7, hint: '火がある', story: '真っ赤なトマト。', example: '赤ちゃん', gameType: 'catch', gameConfig: { title: '赤色集め', instruction: '赤いものをキャッチ', targetChar: '🍎', badChar: '🍏', bg: '#ffcdd2' } },
      { char: '先', kunyomi: 'さき', onyomi: 'セン', meaning: 'さき', strokes: 6, hint: '足がある', story: '先生の先。', example: '先生', gameType: 'trace', gameConfig: { title: '先導', instruction: 'みんなの先頭を歩こう', pathPoints: [[50, 200], [250, 200]], bg: '#f5f5f5' } },
      { char: '早', kunyomi: 'はや', onyomi: 'ソウ', meaning: 'はやい', strokes: 6, hint: '日が十', story: '早起きは三文の徳。', example: '早送り', gameType: 'tap', gameConfig: { title: '早押し', instruction: '素早くタップ！', targetChar: '⏰', distractorChar: '🐢', targetCount: 5, bg: '#fff9c4' } },
      { char: '草', kunyomi: 'くさ', onyomi: 'ソウ', meaning: 'くさ', strokes: 9, hint: '草かんむり', story: '草が生い茂る。', example: '草花', gameType: 'catch', gameConfig: { title: '草むしり', instruction: '雑草を抜こう（キャッチ）', targetChar: '🌿', badChar: '🌸', bg: '#c8e6c9' } },
      { char: '足', kunyomi: 'あし', onyomi: 'ソク', meaning: 'あし', strokes: 7, hint: '口と止', story: '足で走る。', example: '遠足', gameType: 'trace', gameConfig: { title: 'ランニング', instruction: 'コースを走り抜けろ', pathPoints: [[50, 300], [250, 300]], bg: '#ffe0b2' } },
      { char: '村', kunyomi: 'むら', onyomi: 'ソン', meaning: 'むら', strokes: 7, hint: '木と寸', story: '静かな村。', example: '村長', gameType: 'tap', gameConfig: { title: '村人発見', instruction: '村の人を探そう', targetChar: '🏡', distractorChar: '🏢', targetCount: 3, bg: '#dcedc8' } },
      { char: '男', kunyomi: 'おとこ', onyomi: 'ダン', meaning: 'おとこ', strokes: 7, hint: '田と力', story: '力持ちの男の人。', example: '男子', gameType: 'block', gameConfig: { title: '力仕事', instruction: '岩を壊して道を作れ', targetChar: '💪' } },
      { char: '竹', kunyomi: 'たけ', onyomi: 'チク', meaning: 'たけ', strokes: 6, hint: '竹の節', story: '竹取物語の竹。', example: '竹馬', gameType: 'catch', gameConfig: { title: '竹林', instruction: 'かぐや姫を探そう', targetChar: '🌕', badChar: '🎋', bg: '#dcedc8' } },
      { char: '虫', kunyomi: 'むし', onyomi: 'チュウ', meaning: 'むし', strokes: 6, hint: '虫の形', story: '虫取りに行こう。', example: '虫歯', gameType: 'catch', gameConfig: { title: '昆虫採集', instruction: 'カブトムシを捕まえろ', targetChar: '🪲', badChar: '🐝', bg: '#c8e6c9' } },
      { char: '町', kunyomi: 'まち', onyomi: 'チョウ', meaning: 'まち', strokes: 7, hint: '田と丁', story: '賑やかな町。', example: '町長', gameType: 'tap', gameConfig: { title: '街歩き', instruction: 'お店を見つけよう', targetChar: '🏪', distractorChar: '🌲', targetCount: 5, bg: '#ffe0b2' } },
      { char: '天', kunyomi: 'あま', onyomi: 'テン', meaning: 'てん', strokes: 4, hint: '大に一', story: '天まで届け。', example: '天才', gameType: 'catch', gameConfig: { title: '天の川', instruction: '星を集めよう', targetChar: '⭐', badChar: '☁️', bg: '#303f9f' } },
      { char: '土', kunyomi: 'つち', onyomi: 'ド', meaning: 'つち', strokes: 3, hint: '十に一', story: '土いじり。', example: '土曜日', gameType: 'block', gameConfig: { title: '土掘り', instruction: '土を掘って化石を見つけよう', targetChar: '🦖' } },
      { char: '入', kunyomi: 'はい', onyomi: 'ニュウ', meaning: 'はいる', strokes: 2, hint: 'へ', story: '入り口から入る。', example: '入学', gameType: 'trace', gameConfig: { title: '入場', instruction: '中へ入ろう', pathPoints: [[50, 50], [150, 150]], bg: '#fff9c4' } },
      { char: '年', kunyomi: 'とし', onyomi: 'ネン', meaning: 'とし', strokes: 6, hint: '午', story: '一年生になったら。', example: '学年', gameType: 'tap', gameConfig: { title: 'カレンダー', instruction: '祝日を見つけよう', targetChar: '📅', distractorChar: '🗒️', targetCount: 3, bg: '#f5f5f5' } },
      { char: '白', kunyomi: 'しろ', onyomi: 'ハク', meaning: 'しろい', strokes: 5, hint: '日にノ', story: '真っ白な雪。', example: '白鳥', gameType: 'tap', gameConfig: { title: '白探し', instruction: '白いものを集めよう', targetChar: '⬜', distractorChar: '⬛', targetCount: 10, bg: '#eeeeee' } },
      { char: '文', kunyomi: 'ふみ', onyomi: 'ブン', meaning: 'ぶん', strokes: 4, hint: '模様', story: '文字を書く。', example: '作文', gameType: 'trace', gameConfig: { title: '書き取り', instruction: 'きれいに書こう', pathPoints: [[150, 50], [50, 250], [250, 250]], bg: '#e0f2fe' } },
      { char: '本', kunyomi: 'もと', onyomi: 'ホン', meaning: 'ほん', strokes: 5, hint: '木に一', story: '本を読む。', example: '本棚', gameType: 'block', gameConfig: { title: '本棚整理', instruction: 'ブロックを崩して本を並べよう', targetChar: '📚' } },
      { char: '名', kunyomi: 'な', onyomi: 'メイ', meaning: 'なまえ', strokes: 6, hint: '夕と口', story: '名前を呼ぶ。', example: '名札', gameType: 'tap', gameConfig: { title: '名刺交換', instruction: '自分の名前を探そう', targetChar: '📛', distractorChar: '🃏', targetCount: 3, bg: '#e1bee7' } },
      { char: '目', kunyomi: 'め', onyomi: 'モク', meaning: 'め', strokes: 5, hint: '目の形', story: '目玉焼き。', example: '目次', gameType: 'tap', gameConfig: { title: '視力検査', instruction: 'Cを探そう', targetChar: 'C', distractorChar: 'O', targetCount: 5, bg: '#ffffff' } },
      { char: '立', kunyomi: 'た', onyomi: 'リツ', meaning: 'たつ', strokes: 5, hint: '人が立つ', story: '起立、礼。', example: '立つ', gameType: 'trace', gameConfig: { title: '立ち上がれ', instruction: '上に向かってなぞろう', pathPoints: [[150, 300], [150, 100]], bg: '#ffe082' } },
      { char: '力', kunyomi: 'ちから', onyomi: 'リョク', meaning: 'ちから', strokes: 2, hint: '筋肉', story: '力持ち。', example: '力士', gameType: 'block', gameConfig: { title: 'パワーブレイク', instruction: '力強くブロックを壊せ', targetChar: '💪' } },
      { char: '林', kunyomi: 'はやし', onyomi: 'リン', meaning: 'はやし', strokes: 8, hint: '木が二本', story: '林の中を探検。', example: '林間', gameType: 'catch', gameConfig: { title: '林檎狩り', instruction: '林で果物を採ろう', targetChar: '🍎', badChar: '🐛', bg: '#dcedc8' } },
      
      // Some simple additions for coverage ( 音 貝 ... covered above or similar)
      { char: '音', kunyomi: 'おと', onyomi: 'オン', meaning: 'おと', strokes: 9, hint: '立と日', story: '音楽を聴く。', example: '音楽', gameType: 'catch', gameConfig: { title: 'リズムゲーム', instruction: '音符をキャッチ', targetChar: '🎵', badChar: '🔇', bg: '#fff9c4' } }
    ]
  },
  {
    grade: 2,
    themeColor: '#4ECDC4',
    items: [
      { char: '空', kunyomi: 'そら・から', onyomi: 'クウ', meaning: 'そら・からっぽ', strokes: 8, hint: '「穴」+「工」で広い空', story: '大きな青い屋根みたいな空。', example: '青い空' },
      // ... Leaving existing grade 2 data as is for now as requested task focused on Grade 1
    ]
  },
  {
    grade: 3,
    themeColor: '#5C7CFA',
    items: [
      { char: '海', kunyomi: 'うみ', onyomi: 'カイ', meaning: 'うみ', strokes: 9, hint: '「水」に「母」= やさしい海', story: '母のように大きく包む海。', example: 'うみべ' },
      // ...
    ]
  },
  {
    grade: 4,
    themeColor: '#FF6B6B',
    items: [
      { char: '森', kunyomi: 'もり', onyomi: 'シン', meaning: '森', strokes: 12, hint: '木が三本で深い森', story: '木がギュッと集まった森の音。', example: '森林' },
      // ...
    ]
  },
  {
    grade: 5,
    themeColor: '#FDA7DF',
    items: [
      { char: '環', kunyomi: 'わ', onyomi: 'カン', meaning: 'わ・めぐる', strokes: 17, hint: '王+還る=ぐるりと輪', story: '宝石みたいに光る輪', example: '環境' },
      // ...
    ]
  },
  {
    grade: 6,
    themeColor: '#48DBFB',
    items: [
      { char: '線', kunyomi: 'せん', onyomi: 'セン', meaning: '線', strokes: 15, hint: '糸がまっすぐ走る', story: '電車みたいに走るまっすぐ線。', example: '直線' },
      // ...
    ]
  }
];
