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
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    position INTEGER NOT NULL,
    score INTEGER,
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (character_id) REFERENCES characters(id),
    UNIQUE KEY unique_position (character_id, position, user_id)
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

CREATE TABLE progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    practice_count INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    total_score INTEGER NOT NULL,
    highest_score INTEGER NOT NULL,
    last_practiced TIMESTAMP,
    mastery_level INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (character_id) REFERENCES characters(id)
);
