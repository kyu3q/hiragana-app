package com.hiragana.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "characters")
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CharacterType type; // HIRAGANA, KATAKANA, KANJI

    @Column(nullable = false)
    private String character; // 文字

    @Column
    private String romaji; // ローマ字表記

    @Column
    private String meaning; // 意味（漢字の場合）

    @Column
    private Integer difficulty; // 難易度（1-5）

    @Column
    private String strokeOrder; // 筆順データ（JSON形式）

    @Column
    private String exampleWords; // 例文（JSON形式）

    public enum CharacterType {
        HIRAGANA,
        KATAKANA,
        KANJI
    }
} 