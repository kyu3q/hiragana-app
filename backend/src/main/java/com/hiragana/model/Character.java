package com.hiragana.model;

import javax.persistence.*;

@Entity
@Table(name = "characters")
public class Character {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String character;

    @Column(nullable = false)
    private String romaji;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String groupName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CharacterType type;

    @Column(nullable = false)
    private Integer difficulty;

    // 漢字の場合の追加情報
    @Column
    private String meaning;

    @Column
    private String kunyomi;

    @Column
    private String onyomi;

    @Column
    private Integer grade; // 学年

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCharacter() {
        return character;
    }

    public void setCharacter(String character) {
        this.character = character;
    }

    public String getRomaji() {
        return romaji;
    }

    public void setRomaji(String romaji) {
        this.romaji = romaji;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public CharacterType getType() {
        return type;
    }

    public void setType(CharacterType type) {
        this.type = type;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }

    public String getKunyomi() {
        return kunyomi;
    }

    public void setKunyomi(String kunyomi) {
        this.kunyomi = kunyomi;
    }

    public String getOnyomi() {
        return onyomi;
    }

    public void setOnyomi(String onyomi) {
        this.onyomi = onyomi;
    }

    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }
} 