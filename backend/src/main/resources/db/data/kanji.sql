-- 1年生の漢字
INSERT INTO characters (character, romaji, image, group_name, type, meaning, kunyomi, onyomi, grade) VALUES 
('一', 'ichi', '1️⃣ いち', '数字', 'KANJI', 'one', 'ひと', 'イチ', 1),
('二', 'ni', '2️⃣ に', '数字', 'KANJI', 'two', 'ふた', 'ニ', 1),
('三', 'san', '3️⃣ さん', '数字', 'KANJI', 'three', 'み', 'サン', 1),
('四', 'yon', '4️⃣ よん', '数字', 'KANJI', 'four', 'よ', 'シ', 1),
('五', 'go', '5️⃣ ご', '数字', 'KANJI', 'five', 'いつ', 'ゴ', 1);

-- 2年生の漢字
INSERT INTO characters (character, romaji, image, group_name, type, meaning, kunyomi, onyomi, grade) VALUES 
('春', 'haru', '🌸 はる', '季節', 'KANJI', 'spring', 'はる', 'シュン', 2),
('夏', 'natsu', '☀️ なつ', '季節', 'KANJI', 'summer', 'なつ', 'カ', 2),
('秋', 'aki', '🍁 あき', '季節', 'KANJI', 'autumn', 'あき', 'シュウ', 2),
('冬', 'fuyu', '❄️ ふゆ', '季節', 'KANJI', 'winter', 'ふゆ', 'トウ', 2);

-- 以下、同様に他の学年の漢字も追加 