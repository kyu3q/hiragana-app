package com.hiragana.model;

public enum CharacterType {
    HIRAGANA("ひらがな"),
    KATAKANA("カタカナ"),
    KANJI("漢字");

    private final String displayName;

    CharacterType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 