// ひらがなのデータ
export const hiraganaGroups = [
  {
    name: 'あ行',
    characters: [
      { id: 1, char: 'あ', romaji: 'a', image: '🍎 りんご' },
      { id: 2, char: 'い', romaji: 'i', image: '🐗 いのしし' },
      { id: 3, char: 'う', romaji: 'u', image: '🐮 うし' },
      { id: 4, char: 'え', romaji: 'e', image: '🖼️ えいが' },
      { id: 5, char: 'お', romaji: 'o', image: '👻 おばけ' }
    ]
  },
  {
    name: 'か行',
    characters: [
      { id: 6, char: 'か', romaji: 'ka', image: '🦟 か' },
      { id: 7, char: 'き', romaji: 'ki', image: '🌳 き' },
      { id: 8, char: 'く', romaji: 'ku', image: '🍪 くっき' },
      { id: 9, char: 'け', romaji: 'ke', image: '🦊 きつね' },
      { id: 10, char: 'こ', romaji: 'ko', image: '👶 こども' }
    ]
  },
  {
    name: 'さ行',
    characters: [
      { id: 11, char: 'さ', romaji: 'sa', image: '🐠 さかな' },
      { id: 12, char: 'し', romaji: 'shi', image: '🦌 しか' },
      { id: 13, char: 'す', romaji: 'su', image: '🏄 すいえい' },
      { id: 14, char: 'せ', romaji: 'se', image: '🌍 せかい' },
      { id: 15, char: 'そ', romaji: 'so', image: '🧦 そっくす' }
    ]
  },
  {
    name: 'た行',
    characters: [
      { id: 16, char: 'た', romaji: 'ta', image: '🌾 たんぼ' },
      { id: 17, char: 'ち', romaji: 'chi', image: '🩸 ち' },
      { id: 18, char: 'つ', romaji: 'tsu', image: '🌙 つき' },
      { id: 19, char: 'て', romaji: 'te', image: '👋 て' },
      { id: 20, char: 'と', romaji: 'to', image: '🦅 とり' }
    ]
  },
  {
    name: 'な行',
    characters: [
      { id: 21, char: 'な', romaji: 'na', image: '🍆 なす' },
      { id: 22, char: 'に', romaji: 'ni', image: '🌈 にじ' },
      { id: 23, char: 'ぬ', romaji: 'nu', image: '🧵 ぬの' },
      { id: 24, char: 'ね', romaji: 'ne', image: '🐭 ねずみ' },
      { id: 25, char: 'の', romaji: 'no', image: '🧠 のう' }
    ]
  },
  {
    name: 'は行',
    characters: [
      { id: 26, char: 'は', romaji: 'ha', image: '🌸 はな' },
      { id: 27, char: 'ひ', romaji: 'hi', image: '🔥 ひ' },
      { id: 28, char: 'ふ', romaji: 'fu', image: '🎈 ふうせん' },
      { id: 29, char: 'へ', romaji: 'he', image: '🐍 へび' },
      { id: 30, char: 'ほ', romaji: 'ho', image: '⭐ ほし' }
    ]
  },
  {
    name: 'ま行',
    characters: [
      { id: 31, char: 'ま', romaji: 'ma', image: '👁️ まなこ' },
      { id: 32, char: 'み', romaji: 'mi', image: '👂 みみ' },
      { id: 33, char: 'む', romaji: 'mu', image: '🐜 むし' },
      { id: 34, char: 'め', romaji: 'me', image: '👁️ め' },
      { id: 35, char: 'も', romaji: 'mo', image: '☁️ もくもく' }
    ]
  },
  {
    name: 'や行',
    characters: [
      { id: 36, char: 'や', romaji: 'ya', image: '🏠 やね' },
      { id: 37, char: 'ゆ', romaji: 'yu', image: '🌅 ゆうやけ' },
      { id: 38, char: 'よ', romaji: 'yo', image: '🌃 よる' }
    ]
  },
  {
    name: 'ら行',
    characters: [
      { id: 39, char: 'ら', romaji: 'ra', image: '🎺 らっぱ' },
      { id: 40, char: 'り', romaji: 'ri', image: '🍐 りんご' },
      { id: 41, char: 'る', romaji: 'ru', image: '💎 るび' },
      { id: 42, char: 'れ', romaji: 're', image: '🍋 れもん' },
      { id: 43, char: 'ろ', romaji: 'ro', image: '🕯️ ろうそく' }
    ]
  },
  {
    name: 'わ行',
    characters: [
      { id: 44, char: 'わ', romaji: 'wa', image: '🐶 わんわん' },
      { id: 45, char: 'を', romaji: 'wo', image: '🌀 をまわり' },
      { id: 46, char: 'ん', romaji: 'n', image: '📝 んがくぶ' }
    ]
  },
  {
    name: '濁音',
    characters: [
      { char: 'が', romaji: 'ga', image: '🦋 がちょう' },
      { char: 'ぎ', romaji: 'gi', image: '🎸 ぎたー' },
      { char: 'ぐ', romaji: 'gu', image: '🍇 ぐれーぷ' },
      { char: 'げ', romaji: 'ge', image: '🌋 げいせる' },
      { char: 'ご', romaji: 'go', image: '🗑️ ごみばこ' },
      { char: 'ざ', romaji: 'za', image: '🪙 ざいほう' },
      { char: 'じ', romaji: 'ji', image: '⏰ じかん' },
      { char: 'ず', romaji: 'zu', image: '📊 ずひょう' },
      { char: 'ぜ', romaji: 'ze', image: '💰 ぜに' },
      { char: 'ぞ', romaji: 'zo', image: '🐘 ぞう' },
      { char: 'だ', romaji: 'da', image: '🥁 だいこ' },
      { char: 'ぢ', romaji: 'ji', image: '🌎 ちきゅう' },
      { char: 'づ', romaji: 'zu', image: '🛣️ つづく' },
      { char: 'で', romaji: 'de', image: '📤 でぐち' },
      { char: 'ど', romaji: 'do', image: '🚪 どあ' },
      { char: 'ば', romaji: 'ba', image: '🍌 ばなな' },
      { char: 'び', romaji: 'bi', image: '🍺 びーる' },
      { char: 'ぶ', romaji: 'bu', image: '🐗 いのぶた' },
      { char: 'べ', romaji: 'be', image: '🛌 べっど' },
      { char: 'ぼ', romaji: 'bo', image: '⚾ ぼーる' }
    ]
  },
  {
    name: '半濁音',
    characters: [
      { char: 'ぱ', romaji: 'pa', image: '🥞 ぱんけーき' },
      { char: 'ぴ', romaji: 'pi', image: '🐥 ぴよぴよ' },
      { char: 'ぷ', romaji: 'pu', image: '🏊 ぷーる' },
      { char: 'ぺ', romaji: 'pe', image: '🖊️ ぺん' },
      { char: 'ぽ', romaji: 'po', image: '📮 ぽすと' }
    ]
  },
  {
    name: '拗音（1）',
    characters: [
      { char: 'きゃ', romaji: 'kya', image: '🍬 きゃんでぃ' },
      { char: 'きゅ', romaji: 'kyu', image: '🥒 きゅうり' },
      { char: 'きょ', romaji: 'kyo', image: '📚 きょうかしょ' },
      { char: 'しゃ', romaji: 'sha', image: '👕 しゃつ' },
      { char: 'しゅ', romaji: 'shu', image: '👟 しゅーず' },
      { char: 'しょ', romaji: 'sho', image: '🧂 しお' },
      { char: 'ちゃ', romaji: 'cha', image: '🍵 ちゃ' },
      { char: 'ちゅ', romaji: 'chu', image: '💋 ちゅ' },
      { char: 'ちょ', romaji: 'cho', image: '🦋 ちょうちょ' },
      { char: 'にゃ', romaji: 'nya', image: '🐱 にゃんこ' },
      { char: 'にゅ', romaji: 'nyu', image: '🏥 にゅういん' },
      { char: 'にょ', romaji: 'nyo', image: '👧 おにょうこ' }
    ]
  },
  {
    name: '拗音（2）',
    characters: [
      { char: 'ぎゃ', romaji: 'gya', image: '🎭 ぎゃくてん' },
      { char: 'ぎゅ', romaji: 'gyu', image: '🥩 ぎゅうにく' },
      { char: 'ぎょ', romaji: 'gyo', image: '🐟 ぎょかい' },
      { char: 'じゃ', romaji: 'ja', image: '🥤 じゅーす' },
      { char: 'じゅ', romaji: 'ju', image: '🧃 じゅーす' },
      { char: 'じょ', romaji: 'jo', image: '👩 じょせい' },
      { char: 'びゃ', romaji: 'bya', image: '🏥 びょういん' },
      { char: 'びゅ', romaji: 'byu', image: '💉 びょうき' },
      { char: 'びょ', romaji: 'byo', image: '🤒 びょうき' },
      { char: 'ぴゃ', romaji: 'pya', image: '🎹 ぴあの' },
      { char: 'ぴゅ', romaji: 'pyu', image: '💨 ぴゅー' },
      { char: 'ぴょ', romaji: 'pyo', image: '🐇 ぴょんぴょん' }
    ]
  }
];

// キャラクターに関連する絵文字
export const characterEmojis = [
  '🌟', '✨', '🎉', '🎊', '🎈', '🎀', '🎁', '🎵', '🎶', '🌈',
  '🦄', '🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🦁', '🐯', '🐭'
];

// 褒め言葉
export const praises = [
  'すごい！', 'よくできました！', 'がんばったね！', 'えらい！', 'さすが！',
  'すばらしい！', 'じょうずだね！', 'かんぺき！', 'すてき！', 'いいね！'
]; 