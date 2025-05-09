CREATE TABLE characters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    character VARCHAR(10) NOT NULL,
    romaji VARCHAR(50) NOT NULL,
    image VARCHAR(100) NOT NULL,
    group_name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    difficulty INTEGER NOT NULL,
    meaning VARCHAR(200),
    kunyomi VARCHAR(100),
    onyomi VARCHAR(100),
    grade INTEGER
);

CREATE TABLE stroke_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    character_id BIGINT NOT NULL,
    position INTEGER NOT NULL,
    score INTEGER,
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    UNIQUE KEY unique_position (character_id, position)
);

CREATE TABLE strokes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stroke_result_id BIGINT NOT NULL,
    score INTEGER,
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (stroke_result_id) REFERENCES stroke_results(id)
);

CREATE TABLE stroke_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stroke_id BIGINT NOT NULL,
    x DOUBLE NOT NULL,
    y DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stroke_id) REFERENCES strokes(id)
);
