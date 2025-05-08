-- 文字テーブル
CREATE TABLE characters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    character VARCHAR(10) NOT NULL,
    romaji VARCHAR(50) NOT NULL,
    image VARCHAR(100) NOT NULL,
    group_name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    meaning VARCHAR(200),
    kunyomi VARCHAR(100),
    onyomi VARCHAR(100),
    grade INTEGER
);

-- ストロークテーブル
CREATE TABLE strokes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    character_id BIGINT NOT NULL,
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- ストロークポイントテーブル
CREATE TABLE stroke_points (
    stroke_id BIGINT NOT NULL,
    x DOUBLE NOT NULL,
    y DOUBLE NOT NULL,
    FOREIGN KEY (stroke_id) REFERENCES strokes(id)
); 